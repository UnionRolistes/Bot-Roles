'use strict';

const { resolve } = require('path');
const { REST, Routes, PermissionsBitField } = require('discord.js');
const fs = require('fs');
const slashCommandsToPush = [];

class CommandHandler {
	constructor(client) {
		this.client = client;
	}

	async load() {

		fs.readdirSync('./src/commands').forEach(dir => {

			const commandFiles = fs.readdirSync(`./src/commands/${dir}/`).filter(file => file.endsWith('.js'));

			for (const file of commandFiles) {
				const Command = require(`../commands/${dir}/${file}`);
				const command = new Command(this.client);
				this.client.container.slashCommands.set(command.name, command);

				slashCommandsToPush.push({
					name: command.name,
					description: command.description,
					type: command.type,
					options: command.options ? command.options : null,
					default_permission: command.default_permission ? command.default_permission : null,
					default_member_permissions: command.default_member_permissions ? PermissionsBitField.resolve(command.default_member_permissions).toString() : null,
					description_localizations: command.description_localizations ? command.description_localizations : null,
					name_localizations: command.name_localizations ? command.name_localizations : null,
				});
			}
		});
	}
	async register() {
		const rest = new REST({ version: '10' }).setToken(process.env.discord_bot_token);

		(async () => {
			try {
				this.client.logger.warn(__filename, `Started refreshing ${slashCommandsToPush.length} application (/) commands.`);

				const data = await rest.put(
					Routes.applicationCommands(process.env.applicationId),
					{ body: slashCommandsToPush },
				);

				this.client.logger.success(__filename, `Successfully refreshed ${data.length} application (/) commands.`);
			}
			catch (error) {
				console.error(error);
			}
		})();
		// Update test guild commands
		(async () => {
			try {

				const data = await rest.put(
					Routes.applicationGuildCommands(process.env.applicationId, process.env.guildId),
					{ body: slashCommandsToPush },
				);
				// console.log(slashCommandsToPush);
				// this.client.logger.success(__filename, `Successfully refreshed ${data.length} application (/) commands for developer guild.`);
			}
			catch (error) {
				console.error(error);
				this.client.logger.error(__filename, error);
			}
		})();

	}

}

module.exports = CommandHandler;