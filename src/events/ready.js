const DB = require('../modules/DBManager');
const { ActivityType, Events } = require('discord.js');

class Event {
	constructor() {
		this.event = Events.ClientReady;
		this.enabled = true;
	}
	async run() {
		this.bot.logger.success(__filename, `A total of ${this.bot.container.slashCommands.size} (/) commands were loaded.`);

		this.bot.logger.info(__filename, `Logged in as ${this.bot.user.tag} (${this.bot.user.id})`);

		// Setting the status
		this.bot.user.setActivity('Jeu de Rôle', { type: ActivityType.Playing });

		setInterval(() => {
			this.bot.user.setActivity('Jeu de Rôle', { type: ActivityType.Playing });
		}, 300000);

		// OLD CODE
		// Check for uncached users and guilds without a document in the database
		/*setInterval(() => {
			this.bot.guilds.cache.forEach(async guild => {
				// await DB.fetchGuild(guild.id);
			});
		}, 300000); */

	}
}

module.exports = Event;