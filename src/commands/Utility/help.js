/* eslint-disable no-inline-comments */
const Command = require('../../structures/Command');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const { readdirSync } = require('fs');
// ANSI Color Code
const orange = '\u001b[33m'; // orange
const red = '\u001b[31m'; // red
const blue = '\u001b[34m'; // red
const reset = '\u001b[0m'; // escape


class Help extends Command {
	constructor(client) {
		super({
			name: 'help',
			description: 'Receive a list of all commands and help resources',
			category: 'Utility',
			cooldown: 3,
			enabled: true,
			ownerOnly: false,
			guildOnly: true,
			usage: '/help (commandToSearch)',

			type: ApplicationCommandType.ChatInput,
			defaultMemberPermissions: 'SendMessages',
			slashOptions: [{
				name: 'command',
				// type: 3
				type: ApplicationCommandOptionType.String,
				description: 'Command to search',
				required: false,
			}],

		});

		this.client = client;
	}

	async execute(client, interaction, language) {

		const commandToSearch = interaction.options.getString('command');
		const embed = new EmbedBuilder()
			.setThumbnail(this.client.user.displayAvatarURL())
			// .setColor('#4051b4')
			.setColor('#3A3A40');

		if (commandToSearch) {
			let command = commandToSearch;
			let cmd;
			if (this.client.container.slashCommands.has(command)) {
				cmd = this.client.container.slashCommands.get(command);
			}

			// invalid command or ownerOnly
			if(!cmd || cmd.ownerOnly) {
				const description = `\`\`\`ansi
${orange}UR-Role-Stat:${reset}
${language.botinfo.projectDescription}
\`\`\`\`\`\`ansi
${red}✘${reset}: ${language.help.invalidCommand.replace('{{commandToSearch}}', `${red}${commandToSearch}${reset}`)}
\`\`\``;

				embed.setDescription(description);
				return interaction.reply({ embeds: [embed] });
			}
			command = cmd;
			embed.setDescription(`\`\`\`ansi
> ${orange}Command :: ${red}${cmd.name.slice(0, 1).toUpperCase() + command.name.slice(1)}${reset}
${command.description || 'No Description provided.'}
- ${orange}Cooldown${reset} :: ${command.cooldown || '3'} second(s).
- ${red}Category${reset} :: ${command.category ? command.category : 'General' || 'Misc'}
- ${blue}Usage${reset} :: ${command.usage ? `${command.usage}` : `/${command.name}`}

\`\`\``);
			return interaction.reply({ embeds: [embed] });
		}

		const categories = readdirSync('./src/commands/');

		let descriptionString = `\`\`\`ansi
${orange}UR-Role-Stat:${reset}
${language.botinfo.projectDescription}
\`\`\``;

		categories.forEach(category => {
			const dirEnabled = this.client.container.slashCommands.filter(c => c.enabled);
			// console.log(dirEnabled);
			const testdir = dirEnabled.filter(c => !c.ownerOnly);

			// let dir;
			const dir = testdir.filter(c => c.category.toLowerCase() === category.toLowerCase());
			// const dir = this.client.commands.filter(c => c.category.toLowerCase() === category.toLowerCase());
			// if(message.author.id !== '263022860551847936') dir = filterdir.filter(c => c.category.toLowerCase() === category.toLowerCase());

			const capitalise = category.slice(0, 1).toUpperCase() + category.slice(1);

			try {
				if (dir.size === 0) return;

				descriptionString += `\n\`\`\`ansi
> ${orange}${capitalise}${reset}
${dir.map(c => `${blue}/${c.name}${reset} :: ${c.description}`).join('\n')}
\`\`\``;
			}
			catch (error) {
				// disable [12:04:51]  error  [RangeError: RichEmbed field values may not be empty.]: undefined for being annoying in console
				if(error == 'RangeError: RichEmbed field values may not be empty.') return;
				this.client.logger.error(__filename, error);
			}
		});
		embed.setDescription(descriptionString);

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

module.exports = Help;
// OLD CODE
// const { version } = require('../../../package.json');
// embed.setTitle(`Command : ${cmd.name.slice(0, 1).toUpperCase() + command.name.slice(1)}`);
/* embed.setDescription([
				`:white_small_square: **Description:** \`${command.description || 'No Description provided.'}\``,
				`:white_small_square: **Usage:** \`${command.usage ? `\`/${command.name} ${command.usage}\`` : `/}${command.name}`}\` `,
				`:white_small_square: **Cooldown:** \`${command.cooldown || '3'} second(s).\``,
				`:white_small_square: **Category:** \`${command.category ? command.category : 'General' || 'Misc'}\``,
			].join('\n')); */

/*	embed.setDescription(`\`\`\`asciidoc
> Command :: ${cmd.name.slice(0, 1).toUpperCase() + command.name.slice(1)}
	- Description :: ${command.description || 'No Description provided.'}
	- Cooldown :: ${command.cooldown || '3'} second(s).
	- Category :: ${command.category ? command.category : 'General' || 'Misc'}
	- Usage :: ${command.usage ? `${command.usage}` : `/${command.name}`}

\`\`\``); */
/* let descriptionString = `\`\`\`asciidoc
Projet :: UR-Role-Stat
Version :: ${version}
Developer :: Myst#4217\`\`\``; */
/* embed.setDescription([
			'This is a bot specificaly for L\'Union des Rôlistes. ',
			'Use `/help <command>` for more info about a specific command.',
		].join('\n')); */


/* descriptionString += `\`\`\`asciidoc
> ${capitalise} ::
- ${dir.map(c => `/${c.name} - ${c.description}`).join('\n- ')}
\`\`\``; */
/*
				/* embed.addFields(
					{ name: `:white_small_square: ${capitalise}`, value: dir.map(c => `\`${c.name}\``).join(', ') },
				);

				embed.addFields(
					{ name: `\`\`\`asciidoc
> ${capitalise} :: \`\`\``, value: dir.map(c => `\`${c.name}\``).join(', ') },
				);

				descriptionString += `\`\`\`asciidoc
Category:: **${capitalise}**
Commands:: ${dir.map(c => `/${c.name}`).join(', ')}
					> test

> ${capitalise} ::
${dir.map(c => `- /${c.name}`).join('\n- ')}
\`\`\``;*/