/* eslint-disable no-useless-escape */
const Command = require('../../structures/Command');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ApplicationCommandType, MessageFlags } = require('discord.js');
const { version } = require('../../../package.json');


class Botinfo extends Command {
	constructor(client) {
		super({
			name: 'info',
			description: 'Receive general informations of the project',
			name_localizations: {
				'de': 'info',
				'fr': 'info',
				'en-GB': 'info',
			},
			description_localizations: {
				'de': 'Zeigt Informationen über den Bot an',
				'fr': 'Affiche des informations sur le bot.',
				'en-GB': 'General informations.',
			},
			category: 'Utility',
			cooldown: 3,
			enabled: true,
			ownerOnly: false,
			guildOnly: true,
			type: ApplicationCommandType.ChatInput,
			defaultMemberPermissions: '',
			slashOptions: [],

		});

		this.client = client;
	}

	async execute(client, interaction, language) {

// ANSI Color Code
const orange = '\u001b[33m'; // orange
const white  = '\u001b[37m'; // white
const reset  = '\u001b[0m'; //escape

const description = `\`\`\`ansi
${orange}UR-Role-Stat:${reset}
${language.botinfo.projectDescription}
-------

${orange}${language.botinfo.version}${reset}: ${version}
-------

${orange}${language.botinfo.developer}${reset}: ${white}@terimor${reset}
${orange}${language.botinfo.contributors}${reset}: ${white}@fr_dae, dryas#5722, Tonitch#2192${reset}
\`\`\``;

const embed = new EmbedBuilder()
	.setThumbnail(this.client.user.displayAvatarURL())
	.setDescription(description)
	.setColor('#36393F');

const row = new ActionRowBuilder().addComponents(
  new ButtonBuilder()
    .setLabel('Discord')
    .setStyle(ButtonStyle.Link)
    .setURL('https://discord.gg/rxqqBS8'),
  new ButtonBuilder()
    .setLabel(language.botinfo.website)
    .setStyle(ButtonStyle.Link)
    .setURL('http://unionrolistes.fr/'),
  new ButtonBuilder()
    .setLabel('Github')
    .setStyle(ButtonStyle.Link)
    .setURL('https://github.com/UnionRolistes'),
);

await interaction.reply({ embeds: [embed], components: [row] });

	}
}

module.exports = Botinfo;