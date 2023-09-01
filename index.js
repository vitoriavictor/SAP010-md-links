const fs = require("fs").promises; // módulo arquivos
const path = require("path"); // módulo caminhos
const axios = require("axios"); //módulo para testar links HTTP

//IMPORTAR ARQUIVO MDLINK//
//mdLinks("./src/files/dir-files", true)
//mdLinks("./src/files/test-markdown.txt", true)
//mdLinks("./src/files", true)
//mdLinks("./src/files/empty-no-links.md")
mdLinks("./src/files/links-to-check.md", true)
  .then(links => {
    console.log(links);
  })
  .catch(console.error);

//CONSTRUIR FUNÇÃO PARA MARKDOWN - ler arquivo e extrair link //

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


//CONSTRUIR FUNÇÃO PARA DIRETÓRIO //

function readDirectoryMd(directoryPath) {
  return fs.readdir(directoryPath)
    .then(files => {
      if (files.length === 0) {
        return "O diretório está vazio"; 
      }

      const filePromises = files.map(async file => {
        const fullPath = path.join(directoryPath, file);
        const stats = await fs.stat(fullPath);

        if (stats.isDirectory()) {
          return readDirectoryMd(fullPath);
        } else if (['.md', '.mkd', '.mdwn', '.mdown', '.mdtxt', '.mdtext', '.markdown', '.text'].includes(path.extname(file))) {
          const content = await fs.readFile(fullPath, 'utf-8');
          return { fullPath, content };
        }

        return "O arquivo não é um diretório nem um arquivo Markdown"
      });

      return Promise.all(filePromises)
      .then(fileLinks => fileLinks.flat());
    });
}


// CONSTRUIR FUNÇÃO VALIDAR //FAZENDO O TEST, FALTA RODAR. 

function validateUniqueLinkFile(link) {
  return axios.head(link.href)
    .then(response => ({
      ...link,
      status: response.status,
      ok: response.status >= 200 && response.status < 400 ? 'ok' : 'fail',
    }))
    .catch(error => ({
      ...link,
      status: error.response ? error.response.status : 'N/A',
      ok: 'fail',
    }));
}

// FUNÇÃO PARA VALIDAR LINKS //
function validateMarkdownLinks(links) {
  if (!Array.isArray(links)) {
    return Promise.reject(new Error("Os links não estão no formato esperado."));
    //DANDO ERRO AQUI. QUANDO TENTA COLOCAR APENAS UM REPOSITORIO VAZIO
  }
  const linkPromises = links.map(link => validateUniqueLinkFile(link));
  return Promise.all(linkPromises)
    .then(validatedLinks => validatedLinks)
    .catch(error => {
      throw new Error(`Erro ao validar links: ${error.message}`);
    });
}

// CONSTRUIR FUNÇÃO MD LINKS //

function mdLinks(filePath, validate = false) {
  const absolutePath = path.resolve(filePath);

  return new Promise((resolve, reject) => {
    fs.stat(absolutePath)
      .then(stats => {
        if (stats.isDirectory()) {
          //console.log(stats);
          return readDirectoryMd(absolutePath)
            .then((links) => {
                        //console.log(links);
              if (validate) {
                resolve(validateMarkdownLinks(links));
              } else {
                resolve(links);
              }
            })
            .catch(reject);
        } else if (stats.isFile() && ['.md', '.mkd', '.mdwn', '.mdown', '.mdtxt', '.mdtext', '.markdown', '.text'].includes(path.extname(absolutePath))) {
          
          return fs.readFile(absolutePath, 'utf-8')
            .then((content) => {
              const links = readFileMarkdown(content, absolutePath);
              if (links.length === 0) {
                resolve("Ops!! Não há links a serem lidos aqui.");
              } else if (validate) {
                resolve(validateMarkdownLinks(links));
              } else {
                resolve(links);
              }
            })
            .catch(reject);
        } else {
          resolve("Ops!! O arquivo não é um diretório nem um arquivo markdown.");
          //reject(new Error('O arquivo não é um diretório nem um arquivo Markdown.'));
        }
      })
      .catch(error => {
        reject(new Error(`Erro: ${error.message}`));
      });
  });
}

module.exports = {
  mdLinks, readFileMarkdown, validateUniqueLinkFile, readDirectoryMd,
};
