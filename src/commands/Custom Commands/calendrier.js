const Command = require('../../structures/Command');
const { ApplicationCommandType } = require('discord.js');


class Calendrier extends Command {
	constructor(client) {
		super({
			name: 'calendrier',
			description: 'Envoie un lien pour accéder au calendrier.',
			usage: '',
			category: 'Conception',
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
		await interaction.reply({ content: 'The calender can be found [here](http://planning.unionrolistes.fr/Calendar).', ephemeral: true });
	}

}

module.exports = Calendrier;