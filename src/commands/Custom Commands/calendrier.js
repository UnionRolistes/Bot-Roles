/* eslint-disable no-inline-comments */
const Command = require('../../structures/Command');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ApplicationCommandType } = require('discord.js');
// ANSI Color Code
const orange = '\u001b[33m'; // orange
const white = '\u001b[37m'; // white
const reset = '\u001b[0m'; // escape

class Calendrier extends Command {
	constructor(client) {
		super({
			name: 'calendrier',
			description: 'Envoie un lien pour accéder au calendrier.',
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
		const description = `\`\`\`ansi
${orange}Calendrier de L'Union des Rolistes ${reset}

-------
Le calendrier se trouve ci-dessous.
\`\`\``;
		const embed = new EmbedBuilder()
			.setThumbnail(this.client.user.displayAvatarURL())
			.setDescription(description)
			.setColor('#36393F');

		const row = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setLabel('Calendrier')
				.setStyle(ButtonStyle.Link)
				.setURL('http://planning.unionrolistes.fr/Calendar'));

		await interaction.reply({ embeds: [embed], components: [row] });
		// await interaction.reply({ content: 'The calender can be found [here](http://planning.unionrolistes.fr/Calendar).' });
	}

}

module.exports = Calendrier;