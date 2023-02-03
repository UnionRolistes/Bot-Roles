/* eslint-disable no-useless-escape */
const Command = require('../../structures/Command');
const { ApplicationCommandType } = require('discord.js');
const { version } = require('../../../package.json');


class Botinfo extends Command {
	constructor(client) {
		super({
			name: 'botinfo',
			description: 'Pong!',
			name_localizations: {
				'de': 'botinfo',
				'fr': 'botinfo',
				'en-GB': 'botinfo',
			},
			description_localizations: {
				'de': 'Allgemeine Informationen zum Projekt.',
				'en-GB': 'General informations.',
				'fr': 'Informations générales sur le projet.',
			},
			category: 'Utility',
			cooldown: 3,
			enabled: true,
			ownerOnly: false,
			guildOnly: true,

			type: ApplicationCommandType.ChatInput,
			defaultMemberPermissions: 'ManageRoles',
			slashOptions: [],

		});

		this.client = client;
	}

	async execute(client, interaction, language) {

		interaction.reply({ content:
		`\`\`\`asciidoc
       = Soutenez le JDR =
= Soutenez L'Union des Rôlistes =

> ${language.botinfo.project} :: Bot_Roles
> ${language.botinfo.version} :: ${version}
> ${language.botinfo.developer} :: Myst#4217
> ${language.botinfo.contributors} :: 
	- Dae#5125
	- dryas#5722 
	- Tonitch#2192\`\`\`` });

	}
	/* interaction.reply({ content:
		`\`\`\`asciidoc
       = Soutenez le JDR =
= Soutenez L'Union des Rôlistes =

> Projet :: Bot_Roles
> Version :: ${version}
> Developer :: Myst#4217
> Contributors ::
	- Dae#5125
	- dryas#5722
	- Tonitch#2192\`\`\`` });

	}*/

	/*
			embed.setDescription(`\`\`\`asciidoc
> Command :: ${cmd.name.slice(0, 1).toUpperCase() + command.name.slice(1)}
	- Description :: ${command.description || 'No Description provided.'}
	- Cooldown :: ${command.cooldown || '3'} second(s).
	- Category :: ${command.category ? command.category : 'General' || 'Misc'}
	- Usage :: ${command.usage ? `${command.usage}` : `/${command.name}`}

\`\`\``);

	*/
}

module.exports = Botinfo;