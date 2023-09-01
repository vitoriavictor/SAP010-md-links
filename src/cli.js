#!/usr/bin/env node

// PEGAR FUNÇÃO MDLINKS E STATUS //
//COMO CONFIGURAR O CLI??

const { mdLinks } = require('../index.js');

//const path = require('path');
const path = process.argv[2]; // o que é??

const chalk = require('chalk');

const options = {
	validate: process.argv.includes('--validate'),
	stats: process.argv.includes('--stats'),
  validateAndStats: process.argv.includes('--validate') && process.argv.includes('--stats')
};

mdLinks(path, options)
  .then((result) => {
    if (options.validateAndStats) {
      const totalLinks = result.length;
      const uniqueLinks = new Set(result.map((link) => link.href)).size;
      const brokenLinks = result.filter((link) => link.ok === 'fail').length;

      console.log(chalk.green.bold('Validate statistics:'));
      console.log(chalk.magenta(`Total links: ${totalLinks}`));
      console.log(chalk.cyan(`Unique links: ${uniqueLinks}`));
      console.log(chalk.bgRed(`Broken links: ${brokenLinks}`));
    }else if(options.validate){
      //fazer apenas --validate
    } else if(options.stats){
      //fazer apenas --stats
    }
  })
    .catch((error) => {
    console.error(error);
  });

  //completar ajustes para marco