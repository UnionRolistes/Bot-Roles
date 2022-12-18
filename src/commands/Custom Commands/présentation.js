const Command = require('../../structures/Command');
const { ApplicationCommandType } = require('discord.js');


class Présentation extends Command {
	constructor(client) {
		super({
			name: 'presentation',
			description: 'Envoie un lien pour se présenter.',
			usage: '',
			category: 'Conception',
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

	async execute(client, interaction, language) {
		await interaction.reply({ content: '\nPrésentez-vous [ici](http://presentation.unionrolistes.fr/?webhook=https://discord.com/api/webhooks/875068900612665396/DJusy0eGs9Xyx2os-dodBVfWia2fbhfBzfmnDM9g-30ozoFYAuZBHVXaD9TKaC1wwBwg).', ephemeral: true });
	}

}

module.exports = Présentation;