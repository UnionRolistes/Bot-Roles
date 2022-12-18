const Command = require('../../structures/Command');
const { ApplicationCommandType, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

class Feedback extends Command {
	constructor(client) {
		super({
			name: 'feedback',
			description: 'Share your thoughts! ',
			usage: '',
			category: 'Utility',
			aliases: ['latency'],
			cooldown: 30,
			requiredPerms: 'READ_MESSAGES',
			enabled: true,
			ownerOnly: false,
			guildOnly: true,
			args: false,
			type: ApplicationCommandType.ChatInput,
			defaultMemberPermissions: '',
			slashOptions: [],

		});

		this.client = client;
	}

	async execute(client, interaction, language) {

		// Create the modal
		const modal = new ModalBuilder()
			.setCustomId('feedbackModal')
			.setTitle('Feedback');

		// Add components to modal
		// Create the text input components
		const feedbackInput = new TextInputBuilder()
			.setCustomId('feedbackMessage')
		// The label is the prompt the user sees for this input
			.setLabel('Your feedback for Trackit!')
		// Short means only a single line of text
			.setStyle(TextInputStyle.Paragraph);

		// An action row only holds one text input,
		const firstActionRow = new ActionRowBuilder().addComponents(feedbackInput);

		// Add inputs to the modal
		modal.addComponents(firstActionRow);

		// Show the modal to the user
		await interaction.showModal(modal);
	}

}

module.exports = Feedback;