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