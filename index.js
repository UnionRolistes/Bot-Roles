String.prototype.toProperCase = function() {
	return this.toLowerCase().replace(/(^|[\s.])[^\s.]/gm, (s) => s.toUpperCase());
};

const Client = require('./src/structures/Client');
require('dotenv').config();

const client = module.exports = new Client({
	devs: ['263022860551847936'],
	config: './config',
	clientOptions: {
		intents: [
			'Guilds',
			'GuildMessages',
			'GuildPresences',
			'GuildMessageReactions',
			'DirectMessages',
			'MessageContent',
			'GuildVoiceStates',
		] },
});
client.run();

process.on('exit', (code) => {
	client.logger.error(__filename, `The process is exiting with code ${code}. Terminating....`);
});
const RoleUpdater = require('./src/modules/RoleUpdater');
RoleUpdater(client);

const { Events } = require('./src/structures/EventHandler');
const directory = `${__dirname}/src/events/`;
new Events(client, directory);

client.login(process.env.discord_bot_token);
