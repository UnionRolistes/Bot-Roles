const inquirer = require('inquirer');
const fs = require('fs');

const prompts = [
	{
		name: 'token',
		type: 'password',
		message: 'Enter your auth-token from discord.com/developer/applications 🔑:',
		validate: function(value) {
			if (value.length) {
				return true;
			}
			else {
				return 'Please enter your valid token!';
			}
		},
	},
	{
		name: 'intents',
		type: 'checkbox',

		message: 'Which intents would you like? \n',

		choices: [
			{ 'name': 'Guilds', 'value': 'GUILDS', 'checked': true },
			{ 'name': 'Guild Messages', 'value': 'GUILD_MESSAGES', 'checked': true },
			{ 'name': 'Direct Messages', 'value': 'DIRECT_MESSAGES' },
			{ 'name': 'Guild Members (privileged)', 'value': 'GUILD_MEMBERS', 'checked': true },
			{ 'name': 'Guild Bans', 'value': 'GUILD_BANS' },
			{ 'name': 'Guild Emojis', 'value': 'GUILD_EMOJIS' },
			{ 'name': 'Guild Integrations', 'value': 'GUILD_INTEGRATIONS' },
			{ 'name': 'Guild Webhooks', 'value': 'GUILD_WEBHOOKS' },
			{ 'name': 'Guild Invites', 'value': 'GUILD_INVITES' },
			{ 'name': 'Guild Voice States', 'value': 'GUILD_VOICE_STATES' },
			{ 'name': 'Guild Message Reactions', 'value': 'GUILD_MESSAGE_REACTIONS' },
			{ 'name': 'Guild Message Typing', 'value': 'GUILD_MESSAGE_TYPING' },
			{ 'name': 'Direct Message Reactions', 'value': 'DIRECT_MESSAGE_REACTIONS' },
			{ 'name': 'Direct Message Typing', 'value': 'DIRECT_MESSAGE_TYPING' },
			{ 'name': 'Guild Presences (privileged)', 'value': 'GUILD_PRESENCES', 'checked': true },
		],

	},

];

(async function() {
	console.log('-----------------------------------------');

	const answers = await inquirer.prompt(prompts);

	let baseConfig = '{{token}}';
	baseConfig = baseConfig
		.replace('{{token}}', `"${answers.token}"`)
		.replace('{{intents}}', JSON.stringify(answers.intents));

	fs.writeFileSync('./.envtest', baseConfig);

	console.log('-----------------------------------------');
	console.log('Configuration has been written.');
}());