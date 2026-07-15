const dateFormat = require('dateformat').default;
const path = require('path');
const { blue, yellow, red, green, magenta } = require('colorette');

module.exports = {
	info(module, message) {
		if (message === undefined) {message = module; module = null; }
		if(!module) return console.log(getCurrentDate() + blue('   info	') + '  [' + red('No Module') + ']' + '  : ' + message);
		return console.log(getCurrentDate() + blue('  info	') + '  [' + blue(getPath(module)) + ']' + ': ' + message);
	},

	success(module, message) {
		if (message === undefined) {message = module; module = null; }
		if(!module) return console.log(getCurrentDate() + green('  success	') + '  [' + red('No Module') + ']' + '  : ' + message);
		return console.log(getCurrentDate() + green('  success	') + '  [' + green(getPath(module)) + ']' + ': ' + message);
	},

	warn(module, message) {
		if (message === undefined) {message = module; module = null; }
		if(!module) return console.log(getCurrentDate() + yellow('  warn	') + '  [' + red('No Module') + ']' + '  : ' + message);
		return console.log(getCurrentDate() + yellow('  warn	') + '  [' + yellow(getPath(module)) + ']' + ': ' + message);
	},

	error(module, message) {
		if (message === undefined) {message = module; module = null; }
		if(!module) return console.log(getCurrentDate() + red('  error ') + '  [' + red('No Module') + ']' + '  : ' + message);
		return console.log(getCurrentDate() + red('  error ') + '  [' + red(getPath(module)) + ']' + ': ' + message);
	},

	debug(module, message) {
		if (message === undefined) {message = module; module = null; }
		if(!module) return console.log(getCurrentDate() + magenta('  debug	') + '  [' + red('No Module') + ']' + '  : ' + message);
		return console.log(getCurrentDate() + magenta('  debug	') + '  [' + magenta(getPath(module)) + ']' + ': ' + message);
	},
	/* success(message) {
		return console.log(getCurrentDate() + green(' [+] ') + message);
	},
	warn2(message) {
		return console.log(getCurrentDate() + yellow('[!] ') + message);
	},*/

};
function getPath(module) {
	return `${module}`.replace(path.resolve('./'), '');
}
function getCurrentDate() {
	return dateFormat(new Date(), '[dd.mm.yyyy HH:MM:ss]');
}