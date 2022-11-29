const DB = require('../modules/DBManager');
const { ActivityType } = require('discord.js');
// const WhiteList = require('../assets/whitelist.json');


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


		// Check for uncached users and guilds without a document in the database
		setInterval(() => {
			this.bot.guilds.cache.forEach(async guild => {
				// await guild.members.fetch().catch(console.error);
				await DB.fetchGuild(guild.id);
			});
		}, 300000);

		setInterval(() => {
			this.bot.user.setActivity('Coding', { type: ActivityType.Competing });
			// .catch(console.error);
		}, 300000);


	}
}

module.exports = Event;