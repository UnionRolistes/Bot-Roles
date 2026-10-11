const Command = require('../../structures/Command');
const { ApplicationCommandType, MessageFlags } = require('discord.js');


class Présentation extends Command {
	constructor(client) {
		super({
			name: 'presentation',
			description: 'Envoie un lien pour se présenter.',
			usage: '',
			category: 'Custom Commands',
			aliases: [],
			cooldown: 3,
			requiredPerms: 'READ_MESSAGES',
			enabled: true,
			ownerOnly: false,
			args: false,
			type: ApplicationCommandType.ChatInput,
			slashOptions: [],

		});

		this.client = client;
	}

	async execute(client, interaction) {
		await interaction.reply({ content: `\nPrésentez-vous [ici](${process.env.presentation_url}).`, flags: MessageFlags.Ephemeral });
	}

}

module.exports = Présentation;