const DB = require('../modules/DBManager');
const { ActivityType } = require('discord.js');

class Event {
	constructor() {
		this.event = 'ready';
		this.enabled = true;
	}
	async run() {
		this.bot.logger.success(`A total of ${this.bot.container.slashCommands.size} (/) commands were loaded.`);

		this.bot.logger.success(`Logged in as ${this.bot.user.tag} (${this.bot.user.id})`);

		// Setting the status
		this.bot.user.setActivity('Coding', { type: ActivityType.Competing });
		
		setInterval(() => {
			this.bot.user.setActivity('Coding', { type: ActivityType.Competing });
		}, 300000);

	}
}

module.exports = Event;