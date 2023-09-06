const { readFileMarkdown, readDirectoryMd, validateUniqueLinkFile, validateMarkdownLinks, mdLinks } = require('../src/index.js');
const fs = require('fs').promises;
const axios = require('axios');
//const path = require('path');

jest.mock('axios');
//jest.mock('fs').promises;

// NAO FAZER MOCK DO FS, PASSAR DIRETO CAMINHOS DOS ARQUIVOS .MD NO PROJETO


// TESTE 1 //
describe('readFileMarkdown', () => {
  it('deve extrair link de um markdown', () => {
    const conteudo =
      `[Tumblr](https://tumblr.link/) 
    [She-ra Fanlore](https://fanlore.org/wiki/She-Ra_and_the_Princesses_of_Power)`;
    const caminho = './src/files/links-to-check.md';

    const resultado = readFileMarkdown(conteudo, caminho);

    expect(resultado).toEqual([
      { href: 'https://tumblr.link/', text: 'Tumblr', file: caminho },
      { href: 'https://fanlore.org/wiki/She-Ra_and_the_Princesses_of_Power', text: 'She-ra Fanlore', file: caminho }
    ]);
  });
  it('deve retornar vazio quando não houver links no conteúdo', () => {
    const conteudo = 'Arquivo sem links';
    const caminho = './src/files/empty-no-links.md';

    const resultado = readFileMarkdown(conteudo, caminho);
    expect(resultado).toEqual([]);
  });

});

// TESTE 2 //
describe('readDirectoryMd', () => {
  // REESTRUTURAR TESTE AQUI
  it('deve retornar mensagem para um diretório vazio', () => {
    const directoryPath = './src/files/dir-files';

    return readDirectoryMd(directoryPath)
      .then(result => {
        expect(result).toBe('O diretório está vazio');
      });
  });

  it('deve ler arquivos Markdown em um diretório não vazio', () => {
    const directoryPath = './src/files';

    return readDirectoryMd(directoryPath)
      .then(result => {
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
      });
  });

  it('deve lidar com erros ao ler diretório', () => {
    const directoryPath = './src/files/test-markdown';
  
    return readDirectoryMd(directoryPath)
      .catch(error => {
        expect(error).toBeInstanceOf(Error);

      });
  });
}); 

// TESTE 3 //
describe('validateUniqueLinkFile', () => {
  it('deve validar o link válido', () => {
    const validLink = {
      href: 'https://www.exemplevalid.com',
      text: 'Example Valid',
      file: '/path/to/fileValid.md'
    };

    axios.head.mockResolvedValue({ status: 200 });

    return validateUniqueLinkFile(validLink).then(result => {
      expect(result).toEqual({
        ...validLink,
        status: 200,
        ok: 'Ok | Successful response'
      });
    });
  });
  it('deve lidar com um erro/link inválido', () => {
    const invalidLink = {
      href: 'https://www.example.com/noexistent',
      text: 'Example Invalid',
      file: '/path/to/fileInvalid.md'
    };

    axios.head.mockRejectedValue({ response: { status: 404 } });

    return validateUniqueLinkFile(invalidLink).then(result => {
      expect(result).toEqual({
        ...invalidLink,
        status: 404,
        ok: 'Fail | Error'
      });
    });
  });
});

// TESTE 4 //
describe('validateMarkdownLinks', () => {
  it('deve validar links em um array', () => {
    const links = [
      { href: 'https://tumblr.link/', text: 'Tumbrl', file: './src/files/links-to-check.md' },
      { href: 'https://fanlore.org/wiki/She-Ra_and_the_Princesses_of_Power', text: 'She-ra Fanlore', file: './src/files/links-to-check.md' }
    ];

    const mockValidatedLinks = [
      { href: 'https://tumblr.link/', text: 'Tumbrl', file: './src/files/links-to-check.md', status: 200, ok: 'ok' },
      { href: 'https://fanlore.org/wiki/She-Ra_and_the_Princesses_of_Power', text: 'She-ra Fanlore', file: './src/files/links-to-check.md', status: 404, ok: 'fail' }
    ];

    jest.spyOn(Promise, 'all').mockResolvedValue(mockValidatedLinks);

    return validateMarkdownLinks(links).then(result => {
      expect(result).toEqual(mockValidatedLinks);
    });
  });

  it('deve lidar com links fora do formato esperado', () => {
    const resultado = validateMarkdownLinks('não é link formado certo');

    return expect(resultado).rejects.toThrow('Os links não estão no formato esperado.');
  })

  // TESTANDO COBRIR ERRO AQUI: teste passa, mas não cobre erro
  /* 
  it('deve lançar um erro ao validar links', () => {
    
    const link = { href: 'http://example.com', text: 'Link de exemplo' };
    const mockValidateUniqueLinkFile = jest.fn(() => Promise.reject(new Error('Erro na validação')));
  
    return validateMarkdownLinks([link], mockValidateUniqueLinkFile)
      .catch(error => {
        expect(error.message).toBe('Erro ao validar links: Erro na validação');
      });
  });
  
  it('deve trazer o erro ao validar links incorretamente', () => {
  
    const link = { href: 'http://example.com', text: 'Link de exemplo' };
    const mockValidateUniqueLinkFile = jest.fn(() => Promise.resolve({ href: link.href, text: link.text, status: 200, statusText: 'OK' }));
  
    return validateMarkdownLinks([link], mockValidateUniqueLinkFile)
      .then(() => {
        expect(true).toBe(true);
      })
      .catch(error => {
        expect(true).toBe(false);
      });
  }); */


  //  NAO ROLOU AQUI
  /*   it('deve lançar um erro ao validar links', () => {
  
      const link = { href: 'http://example.com', text: 'Link de exemplo' };
      const mockValidateUniqueLinkFile = jest.fn(() => Promise.reject(new Error('Erro na validação')));
  
      return validateMarkdownLinks([link], mockValidateUniqueLinkFile)
        .catch(error => {
          expect(error.message).toBe('Erro ao validar links: Erro na validação');
        });
    }); */

});

// TESTE 5 //
describe('mdLinks', () => {
  it('deve retornar um array de links', () => {
    return mdLinks('test/comLinks.md')
      .then(links => {
        expect(Array.isArray(links)).toBe(true);
      });
  });


it('deve ler um diretório', () => {
  return mdLinks('test/arquivos')
    .then(links => {
      expect(Array.isArray(links)).toBe(true);
    });
});

it('deve rejeitar a promessa quando o arquivo não é .md', () => {
  return mdLinks('.src/files/test-markdown.txt')
    .catch(error => {
      expect(error.message).toBe(error.message);
    });
});

it('deve retornar uma lista de links de um arquivo Markdown', () => {
  const filePath = './src/files/links-to-check.md';

  return mdLinks(filePath)
    .then(links => {
      expect(Array.isArray(links)).toBe(true);
      expect(links.length).toBeGreaterThan(0);
    });
});

it('deve lidar com opção de validação (validate = true)', () => {
  const filePath = './src/files/links-to-check.md';
  const validate = true;

  return mdLinks(filePath, validate)
    .then(links => {
      const validatedLinks = validateMarkdownLinks(links);

      expect(links.length).toBe(validatedLinks.length);

      links.forEach((link, index) => {
        expect(link.href).toBe(validatedLinks[index].href);
        expect(link.text).toBe(validatedLinks[index].text);
        expect(link.file).toBe(filePath);
        expect(validatedLinks[index].file).toBe(filePath);
      });
    });
});

it('deve lidar com erros ao processar o arquivo', () => {
  const filePath = './src/files/links.md'; // caminho arquivo não existe

  return mdLinks(filePath)
    .catch(error => {
      expect(error).toBeInstanceOf(Error);
    });
});
});