//COMO RODAR OS TESTS??

const { readFileMarkdown, readDirectoryMd, validateUniqueLinkFile, validateMarkdownLinks, } = require('../src/index.js');
const fs = require('fs').promises;
const axios = require('axios');

jest.mock('axios');
//jest.mock('fs').promises;

// NAO FAZER MOCK DO FS, PASSAR DIRETO CAMINHOS DOS ARQUIVOS .MD NO PROJETO

//const mdLinks = require('../src');

/* describe('mdLinks', () => {

  it('should...', () => {
    console.log('FIX ME!');
  });

});

describe('mdLinks', () => {
  it('deve resolver verificação de arquivo .md com 10 links', () => {
    return mdLinks('links-to-check.md').then((result) => {
      //expect...;
    });
  });
}); */

// TESTE 1 //
describe('readFileMarkdown', () => {
  it('deve extrair link de um markdown', () => {
    const conteudo = 
    `[Tumblr](https://tumblr.link/) 
    [She-ra Fanlore](https://fanlore.org/wiki/She-Ra_and_the_Princesses_of_Power)`;
    const caminho = './src/files/links-to-check.md';

    const resultado = readFileMarkdown(conteudo, caminho);

    expect(resultado).toEqual([
      {href: 'https://tumblr.link/', text: 'Tumblr', file: caminho },
      {href: 'https://fanlore.org/wiki/She-Ra_and_the_Princesses_of_Power', text: 'She-ra Fanlore', file: caminho }
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
/* describe('readDirectoryMd', () => {
  it('deve ler o diretorio', () => {
    const 
  });
}); */

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
});
