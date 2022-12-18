/* eslint-disable no-useless-escape */
const Command = require('../../structures/Command');
const { EmbedBuilder, ApplicationCommandType } = require('discord.js');
const { version } = require('../../../package.json');

class Botinfo extends Command {
	constructor(client) {
		super({
			name: 'botinfo',
			description: 'Pong!',
			category: 'Utility',
			cooldown: 3,
			enabled: true,
			ownerOnly: false,
			guildOnly: true,

			type: ApplicationCommandType.ChatInput,
			defaultMemberPermissions: 'ManageRoles',
			slashOptions: [
				{
					name: 'add',
					description: 'Add role to a user.',
					type: 1,
					options: [
						{
							name: 'role',
							description: 'The role you want to add to the user.',
							type: 8,
							required: true,
						},
						{
							name: 'user',
							description: 'The user you want to add role to.',
							type: 6,
							required: true,
						},
					],
				},
			],

		});

		this.client = client;
	}

	async execute(client, interaction, language) {
		const date = new Date(client.uptime);
		let strDate = '';
		strDate += date.getUTCDate() - 1 + ` ${language.getKey('word_time_day_plural')}, `;
		strDate += date.getUTCHours() + ` ${language.getKey('word_time_hour_plural')}, `;
		strDate += date.getUTCMinutes() + ` ${language.getKey('word_time_minute_plural')}, `;
		strDate += date.getUTCSeconds() + ` ${language.getKey('word_time_second_plural')}`;
		const devUsernames = [];
		await client.devs.forEach(async id => {
			const user = await client.users.fetch(id);
			devUsernames.push(`${user.username}#${user.discriminator}`);
		});

		const embed = new EmbedBuilder()
			// .setTitle(`${language.getKey('words_offical_project_title')}`)
			.setTitle('O_o')
			.addFields([
				{ name: language.getKey('words_general_informations'), value: `
				${language.getKey('word_developer')}: \`${devUsernames.join('\`, \`')}\`
				${language.getKey('word_version')}: \`${version}\`
				${language.getKey('word_uptime')}: \`${strDate}\`

				` },
				{ name: language.getKey('word_links') + ':', value: '[Invite Bot](https://discordapp.com/oauth2/authorize?client_id=' + client.user.id + `&scope=bot&permissions=537250816) - [${language.getKey('words_support_server')}](https://discord.gg/Sn92FSj) ` },
			])

			.setImage('https://forum.star-conflict.com/uploads/monthly_2021_01/500-250-logo.png.f24a71acb2fc8e2b85a18c485a1af565.png')
			.setColor('#36393F')
			.setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 2048 }))
			.setFooter({ text: `${client.user.tag}`, iconURL: client.user.displayAvatarURL() })
			.setTimestamp();

		interaction.reply({ embeds: [embed] });
	}

}

module.exports = Botinfo;