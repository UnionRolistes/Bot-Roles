/* eslint-disable no-useless-escape */
const Command = require('../../structures/Command');
const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const { version } = require('../../../package.json');
const { readdirSync } = require('fs');


class Help extends Command {
	constructor(client) {
		super({
			name: 'help',
			description: 'Pong!',
			category: 'Utility',
			cooldown: 3,
			enabled: true,
			ownerOnly: false,
			guildOnly: true,

			type: ApplicationCommandType.ChatInput,
			defaultMemberPermissions: 'SendMessages',
			slashOptions: [{
				name: 'command',
				description: 'Command to look up.',
				type: 1,
				required: false,
				options:[
					{
						name: 'command',
						type: ApplicationCommandOptionType.String,
						description: 'A valid command argument.',
						required: true,

					},
				],
			}],

		});

		this.client = client;
	}

	async execute(client, interaction) {


		const embed = new EmbedBuilder()
			.setImage('https://forum.star-conflict.com/uploads/monthly_2021_01/500-250-logo.png.f24a71acb2fc8e2b85a18c485a1af565.png')
			.setTitle(`${this.client.user.username}`)

			.setColor('#4051b4')
			// .setFooter(`${this.client.user.tag}`, this.client.user.displayAvatarURL())
			.setTimestamp();

		/* if (args[0]) {
			let command = args[0];
			let cmd;
			if (this.client.commands.has(command)) {
				cmd = this.client.commands.get(command);
			}
			else if (this.client.aliases.has(command)) {
				cmd = this.client.commands.get(this.client.aliases.get(command));
			}

			// invalid command or ownerOnly
			if(!cmd || cmd.ownerOnly) {

				embed.setColor('RED')
				// .addField(`<:xmark:836696809773727745> I could not find the command: ${args[0]}`, `\n\nHelp Command Usage: \n\`${prefix}help\` -  lists all commands\n\`${prefix}help [command]\` - provides help for a command`)
					.setDescription(`<:xmark:836696809773727745> **I could not find the command: ${args[0]}**\n\nHelp Command Usage: \n\`${prefix}help\` -  lists all commands\n\`${prefix}help [command]\` - provides help for a command`);

				// .addField('Help Command Usage', `\`${prefix}help\` -  lists all commands\n\`${prefix}help [command]\` - provides help for a command or lists all commands`);
				return message.channel.send(embed);

				// return message.channel.send(`<:xmark:836696809773727745> I could not find the command: ${args[0]}\n\`${prefix}help\` -  lists all commands\n\`${prefix}help [command]\` - provides help for a command or lists all commands`);
			}
			command = cmd;

			embed.setTitle(`Command : ${cmd.name.slice(0, 1).toUpperCase() + command.name.slice(1)}`);
			embed.setDescription([
				`:white_small_square: **Description:** \`${command.description || 'No Description provided.'}\``,
				`:white_small_square: **Usage:** \`${command.usage ? `\`${prefix}${command.name} ${command.usage}\`` : `${prefix}${command.name}`}\` `,
				`:white_small_square: **Aliases:** \`${command.aliases.join(', ') || 'None'}\``,
				`:white_small_square: **Cooldown:** \`${command.cooldown || '3'} second(s).\``,
				`:white_small_square: **Category:** \`${command.category ? command.category : 'General' || 'Misc'}\``,
			].join('\n'));
			return message.channel.send(embed);
		}*/

		const categories = readdirSync('./src/commands/');

		embed.setDescription([
			'This is a bot specificaly for L\'Union des Rôlistes. ',
			'Use `/help <command>` for more info about a specific command.',
		].join('\n'));
		categories.forEach(category => {
			const dirEnabled = this.client.container.slashCommands.filter(c => c.enabled);
			console.log(dirEnabled);
			const testdir = dirEnabled.filter(c => !c.ownerOnly);

			// let dir;
			const dir = testdir.filter(c => c.category.toLowerCase() === category.toLowerCase());
			// const dir = this.client.commands.filter(c => c.category.toLowerCase() === category.toLowerCase());
			// if(message.author.id !== '263022860551847936') dir = filterdir.filter(c => c.category.toLowerCase() === category.toLowerCase());


			const capitalise = category.slice(0, 1).toUpperCase() + category.slice(1);

			console.log(capitalise);
			console.log(dir);
			try {
				if (dir.size === 0) return;
				embed.addFields(
					{ name: `:white_small_square: ${capitalise}`, value: dir.map(c => `\`${c.name}\``).join(', ') },
				);

			}
			catch (error) {
				// disable [12:04:51]  error  [RangeError: RichEmbed field values may not be empty.]: undefined for being annoying in console
				if(error == 'RangeError: RichEmbed field values may not be empty.') return;
				this.client.logger.error('help.js', error);

			}
		});
		interaction.reply({ embeds: [embed] });


		/* interaction.reply({ content:
		`\`\`\`asciidoc
Hello, World!
==============================
Projet:: Bot_Roles
Version:: ${version}
Developer:: Myst#4217
Contributors::
* Dae#5125
* dryas#5722
* Tonitch#2192\`\`\`` }); */

	}
}

module.exports = Help;