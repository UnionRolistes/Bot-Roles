const Command = require('../../structures/Command');
const { ApplicationCommandType } = require('discord.js');


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
			guildOnly: true,
			args: false,
			type: ApplicationCommandType.ChatInput,
			defaultMemberPermissions: 'SendMessages',
			slashOptions: [],

		});

		this.client = client;
	}

	async execute(client, interaction) {
		await interaction.reply({ content: 'Crée une partie [here]( http://planning.unionrolistes.fr/?webhook=https://discord.com/api/webhooks/873043760307642408/IM1VX44JlYfElbBOlVrYhUKM47uzW7Bp5jm7tp3xVxKYnE3wuzbbMZ8nGfhTT_uLEfLw).', ephemeral: true });
	}

}

module.exports = JDR;