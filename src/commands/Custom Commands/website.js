const Command = require('../../structures/Command');
const { ApplicationCommandType } = require('discord.js');


class Website extends Command {
	constructor(client) {
		super({
			name: 'website',
			description: 'Envoie un lien pour accéder le site web.',
			usage: '',
			category: 'Custom Commands',
			aliases: [],
			cooldown: 3,
			requiredPerms: 'READ_MESSAGES',
			enabled: true,
			ownerOnly: false,
			guildOnly: true,
			args: false,
			type: ApplicationCommandType.ChatInput,
			defaultMemberPermissions: 'SendMessages',
			slashOptions: [],

		});

		this.client = client;
	}

	async execute(client, interaction) {
		await interaction.reply({ content: '`The essence of a role playing game is that it is a group, cooperative experience. (Gary Gygax)`\n[Take a look at our website.](http://site.unionrolistes.fr/)', ephemeral: true });
	}

}

module.exports = Website;