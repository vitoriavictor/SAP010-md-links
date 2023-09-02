//COMO RODAR OS TESTS??

const {  validateUniqueLinkFile } = require('../src/index.js');
const fs = require('fs').promises;
const axios = require('axios');

jest.mock('axios');
jest.mock('fs').promises;

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