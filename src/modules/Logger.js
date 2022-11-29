const df = require('dateformat');
const path = require('path');
const { blue, yellow, red, green, magenta } = require('colorette');

module.exports = {
	info(module, message) {
		if(!module) return console.log(getCurrentDate() + blue('   info   ') + '  [' + red('No Module') + ']' + '  : ' + message);
		return console.log(getCurrentDate() + blue('  info  ') + '  [' + blue(getPath(module)) + ']' + ': ' + message);
	},

	status(module, message) {
		if(!module) return console.log(getCurrentDate() + green('  status') + '  [' + red('No Module') + ']' + '  : ' + message);
		return console.log(getCurrentDate() + green('  status') + '  [' + green(getPath(module)) + ']' + ': ' + message);
	},

	warn(module, message) {
		if(!module) return console.log(getCurrentDate() + yellow('  warn  ') + '  [' + red('No Module') + ']' + '  : ' + message);
		return console.log(getCurrentDate() + yellow('  warn  ') + '  [' + yellow(getPath(module)) + ']' + ': ' + message);
	},

	error(module, message) {
		if(!module) return console.log(getCurrentDate() + red('  error ') + '  [' + red('No Module') + ']' + '  : ' + message);
		return console.log(getCurrentDate() + red('  error ') + '  [' + red(getPath(module)) + ']' + ': ' + message);
	},

	debug(module, message) {
		if(!module) return console.log(getCurrentDate() + magenta('  debug ') + '  [' + red('No Module') + ']' + '  : ' + message);
		return console.log(getCurrentDate() + magenta('  debug ') + '  [' + magenta(getPath(module)) + ']' + ': ' + message);
	},
	success(message) {
		return console.log(green('[+] ') + message);
	},
	warn2(message) {
		return console.log(yellow('[!] ') + message);
	},

};
function getPath(module) {
	return `${module}`.replace(path.resolve('./'), '');
}
function getCurrentDate() {
	return df(new Date(), 'dd.mm.yyyy HH:MM:ss');
}


/* Old Logger with chalk
const chalk = require('chalk');
const df = require('dateformat');
const path = require('path');
const { blue } = require('colorette');


module.exports = {
	info(module, message) {
		// if(!module) throw new TypeError('A module needs to be specified.')
		if(!module) return console.log(chalk.blue('[' + df(new Date(), 'dd.mm.yyyy HH:MM:ss') + ']  info  ') + ': ' + message);

		// console.log(df(new Date(), 'dd.mm.yyyy HH:MM:ss') + chalk.blue('  info  ') + '  [' + chalk.blue(`${module}`.replace(path.resolve('./'), '')) + ']' + ': ' + message);
		return console.log(df(new Date(), 'dd.mm.yyyy HH:MM:ss') + blue('  info  ') + '  [' + blue(`${module}`.replace(path.resolve('./'), '')) + ']' + ': ' + message);
	},
	warn(module, message) {
		if(!module) {
			return console.log('[' + df(new Date(), 'dd.mm.yyyy HH:MM:ss') + ']' + chalk.yellow('  warning  ') + ': ' + message);
		}
		return console.log(df(new Date(), 'dd.mm.yyyy HH:MM:ss') + chalk.yellow('  WARN  ') + '[' + chalk.yellow(`${module}`.replace(path.resolve('./'), '')) + ']' + ': ' + message);
	},
	error(module, message) {
		if(!module) {
			return console.log('[' + df(new Date(), 'dd.mm.yyyy HH:MM:ss') + ']' + chalk.red('  error  ') + ': ' + message);
		}
		return console.log(df(new Date(), 'dd.mm.yyyy HH:MM:ss') + chalk.bgRed('  ERROR  ') + '[' + chalk.red(`${module}`.replace(path.resolve('./'), '')) + ']' + ': ' + chalk.red(message));
	},
	debug(module, message) {
		if(!module) {
			return console.log('[' + df(new Date(), 'dd.mm.yyyy HH:MM:ss') + ']' + chalk.green('  debug  ') + ': ' + message);
		}
		return console.log('[' + df(new Date(), 'dd.mm.yyyy HH:MM:ss') + ']' + chalk.inverse('  DEBUG  ') + '[' + chalk.white(`${module}`.replace(path.resolve('./'), '')) + ']' + ': ' + message);
	},
	status(module, message) {
		if(!module) return console.log(df(new Date(), 'dd.mm.yyyy HH:MM:ss') + chalk.green('  Status  ') + ': ' + message);

		return console.log(df(new Date(), 'dd.mm.yyyy HH:MM:ss') + chalk.green('  status  ') + '[' + chalk.green(`${module}`.replace(path.resolve('./'), '')) + ']' + ': ' + message);
	},
};
*/