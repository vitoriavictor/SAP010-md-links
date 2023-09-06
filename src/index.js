const fs = require("fs").promises; // módulo arquivos
const path = require("path"); // módulo caminhos
const axios = require("axios"); //módulo para testar links HTTP

//IMPORTAR ARQUIVO MDLINK//
//mdLinks("./src/files/dir-files", true)
//mdLinks("./src/files/test-markdown.txt", true)
//mdLinks("./src/files", true)
//mdLinks("./src/files/empty-no-links.md")
/* mdLinks("./src/files/links-to-check.md", true)
  .then(links => {
    console.log(links);
  })
  .catch(console.error); */

//CONSTRUIR FUNÇÃO PARA MARKDOWN - ler arquivo e extrair link // TESTE 1: OK!
function readFileMarkdown(content, filePath) {
  const regex = /\[([^\]]+)\]\((http[s]?:\/\/[^\)]+)\)/g;
  const links = [];
  let match = regex.exec(content);

  while (match !== null) {
    const [, text, href] = match;
    links.push({ href, text, file: filePath });
    match = regex.exec(content);
  }

  return links
}


//CONSTRUIR FUNÇÃO PARA DIRETÓRIO // TESTE 2: ALTERAÇAO, NAO PASSA
function readDirectoryMd(directoryPath) {
  return fs.readdir(directoryPath)
    .then(files => {
      if (files.length === 0) {
        return Promise.reject(new Error("O diretório está vazio"));
      }

      const filePromises = files.map(file => {
        const fullPath = path.join(directoryPath, file);
        return fs.stat(fullPath)
          .then(stats => {
            if (stats.isDirectory()) {
              return readDirectoryMd(fullPath);
            } else if (['.md', '.mkd', '.mdwn', '.mdown', '.mdtxt', '.mdtext', '.markdown', '.text'].includes(path.extname(file))) {
              return fs.readFile(fullPath, 'utf-8')
                .then(content => {
                  const links = readFileMarkdown(content);
                  return {
                    type: "Este é um arquivo Markdown",
                    fullPath,
                    links,
                  };
                });
            } else {
              return Promise.reject(new Error("Arquivo não é um diretório nem um arquivo Markdown"));
              //return "Arquivo não é um diretório nem um arquivo Markdown";
            }
          });
      });
      return Promise.all(filePromises);
    });
}

/* function readDirectoryMd(directoryPath) {
  return fs.readdir(directoryPath)
    .then(files => {
      if (files.length === 0) {
        //console.log('entrei aqui')
        return Promise.reject(new Error("O diretório está vazio"));
      }

      const filePromises = files.map(file => {
        const fullPath = path.join(directoryPath, file);
        return fs.stat(fullPath)
          .then(stats => {
            if (stats.isDirectory()) {
              return readDirectoryMd(fullPath);
            } else if (['.md', '.mkd', '.mdwn', '.mdown', '.mdtxt', '.mdtext', '.markdown', '.text'].includes(path.extname(file))) {
              return fs.readFile(fullPath, 'utf-8')
                .then(content => ({ fullPath, content }));
            }

            return "O arquivo não é um diretório nem um arquivo Markdown";
          });
      });

      return Promise.all(filePromises)
        .then(fileLinks => fileLinks.flat());
    });
} */


// CONSTRUIR FUNÇÃO VALIDAR // TESTE 3: OK! 
function validateUniqueLinkFile(link) {
  return axios.head(link.href)
    .then(response => ({
      ...link,
      status: response.status,
      ok: response.status >= 200 && response.status < 400 ? 'Ok | Successful response' : 'Fail',
    }))
    .catch(error => ({
      ...link,
      status: error.response ? error.response.status : 'Error 404 | Not Found',
      ok: 'Fail | Error',
    }));
}

// FUNÇÃO PARA VALIDAR LINKS // TESTE 4: OK!
function validateMarkdownLinks(links) {
  if (!Array.isArray(links) || links.length === 0) {
    return Promise.reject(new Error("Os links não estão no formato esperado."));
    //return Promise.resolve([]);
  }
  const linkPromises = links.map(link => validateUniqueLinkFile(link));
  return Promise.all(linkPromises)
    .then(validateUniqueLinkFile => validateUniqueLinkFile)
    .catch(error => {
      //return Promise.reject(new Error(`Erro ao validar links: ${error.message}`));
      throw new Error(`Erro ao validar links: ${error.message}`); //TESTE NAO COBRIU
    });
}

// CONSTRUIR FUNÇÃO MD LINKS // TESTE 5: Em construção. Não cobre linhas do diretorio.
function mdLinks(filePath, validate = false) {
  const absolutePath = path.resolve(filePath);

  return fs.stat(absolutePath)
    .then(stats => {
      if (stats.isDirectory()) { //TESTE NAO COBRIU
        return readDirectoryMd(absolutePath)
          .then((links) => {
            if (validate) {
              return validateMarkdownLinks(links);
            } else {
              return links;
            }
          });
      } else if (stats.isFile() && ['.md', '.mkd', '.mdwn', '.mdown', '.mdtxt', '.mdtext', '.markdown', '.text'].includes(path.extname(absolutePath))) {
        return fs.readFile(absolutePath, 'utf-8')
          .then((content) => {
            const links = readFileMarkdown(content, absolutePath);
            if (links.length === 0) {
              throw new Error("Ops!! Não há links a serem lidos aqui."); //TESTE NAO COBRIU
            } else if (validate) {
              return validateMarkdownLinks(links); //TESTE NAO COBRIU  //saiu?
            } else {
              return links;
            }
          });
      } else {
        throw new Error('O arquivo não é um diretório nem um arquivo Markdown.'); //TESTE NAO COBRIU
      }
    })
    .then(links => {
      if (validate) {
        return validateMarkdownLinks(links); //TESTE NAO COBRIU   //saiu?
      } else {
        return links;
      }
    })
    .catch(error => {
      throw new Error(`Erro: ${error.message}`);
    });
}

module.exports = {
  mdLinks, readFileMarkdown, validateMarkdownLinks, validateUniqueLinkFile, readDirectoryMd,
};
