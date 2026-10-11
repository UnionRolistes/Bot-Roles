const Command = require('../../structures/Command');
const { ApplicationCommandType, MessageFlags } = require('discord.js');


class JDR extends Command {
	constructor(client) {
		super({
			name: 'jdr',
			description: 'Envoie un lien pour créer une partie.',
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
		await interaction.reply({ content: `Crée une partie [here](${process.env.jdr_url}).`, flags: MessageFlags.Ephemeral });
	}

}

module.exports = JDR;