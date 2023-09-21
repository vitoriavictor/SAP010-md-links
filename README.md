# MD-Links - Readme
### 
**Acesse o projeto:**

[<img alt="WEBSITE" height="50" src="./src/img/readme/icon_link.svg">](https://github.com/vitoriavictor/SAP010-md-links.git)

**Tecnologias utilizadas**

<img alt="Figma" height="45" src="https://cdn4.iconfinder.com/data/icons/logos-brands-in-colors/3000/figma-logo-256.png" /><img alt="git" height="40"  src="https://cdn3.iconfinder.com/data/icons/social-media-2169/24/social_media_social_media_logo_git-256.png" /><img alt="github" height="45"  src="https://cdn1.iconfinder.com/data/icons/unicons-line-vol-3/24/github-256.png" /><img alt="HTML" height="50"  src="https://cdn2.iconfinder.com/data/icons/designer-skills/128/code-programming-html-markup-develop-layout-language-512.png"> <img alt="CSS" height="50" src="https://cdn2.iconfinder.com/data/icons/designer-skills/128/code-programming-css-style-develop-layout-language-512.png"> <img alt="JS" height="50" src="https://cdn2.iconfinder.com/data/icons/designer-skills/128/code-programming-javascript-software-develop-command-language-256.png">   

## Índice

* [Resumo do projeto](#resumo-do-projeto)
* [1. Fluxograma](#1-fluxograma)
* [2. Guia de instalação e uso](#2-Guia-de-instalação-e-uso)
* [3. Funcionalidades da Biblioteca](#3-Funcionalidades-da-Biblioteca)
* [4. Objetivos de aprendizagem alcançados](#4-objetivos-de-aprendizagem-alcançados)
* [5. Testes Unitários](#5-testes-unitários)
* [6. Desenvolvedora](#6-desenvolvedora)

***

## Resumo do projeto

[Markdown](https://pt.wikipedia.org/wiki/Markdown) é uma linguagem de marcação
muito popular entre os programadores. É usada em muitas plataformas que
manipulam texto (GitHub, fórum, blogs e etc) e é muito comum encontrar arquivos
com este formato em qualquer repositório (começando pelo tradicional
`README.md`). Os arquivos `Markdown` normalmente contém _links_ que podem estar
quebrados, ou que já não são válidos, prejudicando muito o valor da
informação que está ali.

Para este projeto, tomando esses parâmetros como base, foi criada uma biblioteca para verificar se existem links, e se eles estão válidos ou não, dentro dos arquivos Markdown, além de suas estatísticas.

## 1. Fluxograma 

**Linha de fluxo do programa**

<img src="./src/img/readme/fluxograma md-links (1).png" width="700px">

## 2. Guia de instalação e uso

## 2.1 Instalação

Para começar a usar o ```md-links-vic```, você precisa tê-lo instalado no seu projeto. Para instalar a biblioteca, utilize o gerenciador de pacotes npm. No terminal, execute o seguinte comando:

```sh
$ npm install https://github.com/vitoriavictor/SAP010-md-links.git
```

## 2.2 Uso

Após a instalação, você poderá utilizar o Markdown Links através da CLI, basta executar o seguinte comando:
```sh
  mdlinks <caminho-do-arquivo> [options]
```

Onde:

- < caminho-do-arquivo > : O caminho para o arquivo markdown (.md) que deseja analisar.
 - [ options ] podem ser: 
  - --validate: (Opcional) Realiza a validação dos links, exibindo o status de cada link (ativo ou quebrado).
  - --stats: (Opcional) Exibe estatísticas dos links, como o total de links e links únicos.
  - --validate --stats: (Opcional) Validação e estatísticas dos links.

Por exemplo:

```sh
$ md-links ./diretorio-exemplo/exemplo.md --validate
```
+ *Exemplo de retorno no terminal para **validate***

<img src="./src/img/readme/mdlinks_validate.png" width="500px">


```sh
$ md-links ./diretorio-exemplo/exemplo.md --stats
```
+ *Exemplo de retorno no terminal para **stats***

<img src="./src/img/readme/mdlinks_stats.png" width="500px">


```sh
$ md-links ./diretorio-exemplo/exemplo.md --validate --stats
```
+ *Exemplo de retorno no terminal para **validate e stats***

<img src="./src/img/readme/mdlinks_validate_stats.png" width="500px">


## 3. Funcionalidades da Biblioteca

A biblioteca Markdown Links oferece as seguintes funcionalidades:

## 3.1 Extração de Links

+ *A biblioteca é consegue ler um arquivo markdown e extrair os links presentes nele. Os links são identificados pelo formato ```{File} [texto] (url)```*


## 3.2 Estatísticas de Links

+ *Utilizando ```--stats``` na linha de comando, a biblioteca exibirá as estatísticas sobre os links encontrados no arquivo markdown. Serão exibidas as informações sobre o total de links e a quantidade de links únicos.*


## 3.3 Validação de Links

+ *Utilizando  ```--validate``` na linha de comando, a biblioteca realizará uma requisição HTTP para cada link encontrado no arquivo markdown para verificar se estão ativos ou quebrados. Os links ativos terão o status "Ok | Successful response" e os quebrados terão o status "Fail | Error".*

## 3.4 Validação e Estatísticas de Links

+ *Utilizando ```--validate --stats``` na linha de comando, a biblioteca exibirá as estatísticas e a validação dos links encontrados.*

## 4. Objetivos de aprendizagem alcançados


## 5. Testes Unitários

**Cobertura dos Testes Unitários**


<img src="./src/img/readme/testes_mdlinks.png" width="500px">



## 6. Desenvolvedora

Projeto desenvolvido por [Vitória Victor](https://github.com/vitoriavictor)

###
###