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
			usage: '/help (commandToSarch)',

			type: ApplicationCommandType.ChatInput,
			defaultMemberPermissions: 'SendMessages',
			slashOptions: [{
				name: 'command',
				// type: 3
				type: ApplicationCommandOptionType.String,
				description: 'A valid command argument.',
				required: false,
			}],

		});

		this.client = client;
	}

	async execute(client, interaction, language) {

		const commandToSearch = interaction.options.getString('command');
		const embed = new EmbedBuilder()
			.setTitle(`${this.client.user.username} - Commands`)
			.setColor('#4051b4')
			// .setFooter(`${this.client.user.tag}`, this.client.user.displayAvatarURL())
			.setTimestamp();

		if (commandToSearch) {
			let command = commandToSearch;
			let cmd;
			if (this.client.container.slashCommands.has(command)) {
				cmd = this.client.container.slashCommands.get(command);
			}

			// invalid command or ownerOnly
			if(!cmd || cmd.ownerOnly) {
				embed.setColor('Red')
					.setDescription(`✘ **I could not find the command: ${commandToSearch}**\n\nHelp Command Usage: \n\`/help\` -  lists all commands\n\`/help [command]\` - provides help for a command`);
				return interaction.reply({ embeds: [embed] });
			}
			command = cmd;

			// embed.setTitle(`Command : ${cmd.name.slice(0, 1).toUpperCase() + command.name.slice(1)}`);
			/* embed.setDescription([
				`:white_small_square: **Description:** \`${command.description || 'No Description provided.'}\``,
				`:white_small_square: **Usage:** \`${command.usage ? `\`/${command.name} ${command.usage}\`` : `/}${command.name}`}\` `,
				`:white_small_square: **Cooldown:** \`${command.cooldown || '3'} second(s).\``,
				`:white_small_square: **Category:** \`${command.category ? command.category : 'General' || 'Misc'}\``,
			].join('\n')); */

			embed.setDescription(`\`\`\`asciidoc
> Command :: ${cmd.name.slice(0, 1).toUpperCase() + command.name.slice(1)}
	- Description :: ${command.description || 'No Description provided.'}
	- Cooldown :: ${command.cooldown || '3'} second(s).
	- Category :: ${command.category ? command.category : 'General' || 'Misc'}
	- Usage :: ${command.usage ? `${command.usage}` : `/${command.name}`}

\`\`\``);

			return interaction.reply({ embeds: [embed] });
		}

		const categories = readdirSync('./src/commands/');
		let descriptionString = `\`\`\`asciidoc
Projet :: Bot_Roles
Version :: ${version}
Developer :: Myst#4217\`\`\``;
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
				/* embed.addFields(
					{ name: `:white_small_square: ${capitalise}`, value: dir.map(c => `\`${c.name}\``).join(', ') },
				);

				embed.addFields(
					{ name: `\`\`\`asciidoc
> ${capitalise} :: \`\`\``, value: dir.map(c => `\`${c.name}\``).join(', ') },
				);*/
				descriptionString += `\`\`\`asciidoc
> ${capitalise} ::
- ${dir.map(c => `/${c.name} - ${c.description}`).join('\n- ')}
\`\`\``;

			/*


				descriptionString += `\`\`\`asciidoc
Category:: **${capitalise}**
Commands:: ${dir.map(c => `/${c.name}`).join(', ')}
					> test

> ${capitalise} ::
${dir.map(c => `- /${c.name}`).join('\n- ')}
\`\`\``;*/
			}
			catch (error) {
				// disable [12:04:51]  error  [RangeError: RichEmbed field values may not be empty.]: undefined for being annoying in console
				if(error == 'RangeError: RichEmbed field values may not be empty.') return;
				this.client.logger.error('help.js', error);

			}
		});
		embed.setDescription(descriptionString);
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