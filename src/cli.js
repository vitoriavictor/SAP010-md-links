#!/usr/bin/env node

const chalk = require('chalk');
const { mdLinks } = require('./index.js');

//const args = process.argv[2];
const args = process.argv.slice(2);

const options = {
	validate: args.includes('--validate'),
	stats: args.includes('--stats'),
};

//redundancia aqui   validateAndStats: process.argv.includes('--validate') && process.argv.includes('--stats')
//console.log(args);

// Verifique se args contém um caminho de arquivo
const filePath = args.find(arg => !arg.startsWith('--'));

if (!filePath) {
  console.error(chalk.red.bold('Erro: Você precisa fornecer o caminho para um arquivo Markdown.'));
  process.exit(1); // Encerra o script com um código de erro
}

mdLinks(filePath, options)
  .then((result) => {
    if (options.validate && options.stats) {
      
      const totalLinks = result.length;
      const uniqueLinks = new Set(result.map((link) => link.href)).size;
      const brokenLinks = result.filter((link) => link.ok === 'Fail | Error').length;
      const workingLinks = result.filter((link) => link.ok === 'Ok | Successful response').length;

      console.log(chalk.green.bold.italic(`* Validate statistics: *\n`));
      console.log(chalk.bgMagenta(`Total links: ${totalLinks}`));
      console.log(chalk.bgCyan(`Unique links: ${uniqueLinks}`));
      console.log(chalk.bgGreen(`Working links: ${workingLinks}`));
      console.log(chalk.bgRed(`Broken links: ${brokenLinks}`));
    }else if(options.validate){
      //fazer apenas --validate

      console.log(chalk.green.bold(`* Validate links and content: *\n`));

      result.forEach((link) => {

        console.log(chalk.cyan(`File: ${link.file}`));
        console.log(chalk.yellow(`Text: ${link.text}`));
        console.log(chalk.magenta(`Link: ${link.href}`));
        console.log(chalk.blue(`HTTP Status Code: ${link.status}`));
        //aqui operador ternario para cor verde ou vermelha
        const statusColor = link.ok === 'Ok | Successful response' ? 'green' : 'red';
        console.log(chalk[statusColor](`Status: ${link.ok}`));
        
        console.log(chalk.gray(`\n -------------------------------------- \n`));
      });

    } else if(options.stats){
      //fazer apenas --stats

      const totalLinks = result.length;
      const uniqueLinks = new Set(result.map((link) => link.href)).size;

      console.log(chalk.green.bold.italic(`* Statistics: *\n`));
      console.log(chalk.bgMagenta(`Total links: ${totalLinks} \n`));
      console.log(chalk.bgCyan(`Unique links: ${uniqueLinks} \n`));
      
    } else {
    console.log(chalk.green.bold(`* Links in Markdown File: *\n`));

    result.forEach((link) => {
      console.log(chalk.cyan(`File: ${link.file}`));
      console.log(chalk.yellow(`Text: ${link.text}`));
      console.log(chalk.magenta(`Link: ${link.href}`));
      console.log(chalk.gray('----------------------------'));
    });
  }
  })
    .catch((error) => {
    console.error(error);
  });

  //completar ajustes para marco