const { Collection, EmbedBuilder } = require('discord.js');
const DB = require('../modules/DBManager');

class Event {
	constructor() {
		this.event = 'interactionCreate';
		this.enabled = true;
	}
	async run(interaction) {

		if (interaction.isModalSubmit()) {
			if(interaction.customId === 'feedbackModal') {
				await interaction.reply({ content: '**✓** Your submission was received successfully.' });

				const feedbackMessage = interaction.fields.getTextInputValue('feedbackMessage');

				return this.bot.channels.cache.get('1034223481388269568').send({ content: `Feedback from \`${interaction.user.username}#${interaction.user.discriminator}\`: \n${feedbackMessage}` });

			}
		}

		if (!interaction.isCommand()) return;


		const command = this.bot.container.slashCommands.get(interaction.commandName);

		if (!command) return;

		if (!this.bot.cooldowns.has(command.name)) {
			this.bot.cooldowns.set(command.name, new Collection());
		}

		const now = Date.now();
		const timestamps = this.bot.cooldowns.get(command.name);
		const cooldownAmount = (command.cooldown || 3) * 1000;

		if (!timestamps.has(interaction.user.id)) {
			timestamps.set(interaction.user.id, now);
			setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
		}
		else {
			const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

			// If the cooldown didn't expire and the message author is not the bot owner
			if (now < expirationTime && !this.bot.devs.includes(interaction.user.id)) {
				const timeLeft = (expirationTime - now) / 1000;
				return interaction.reply(`Please wait for ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
			}
		}

		try {
			const User = await DB.fetchUser(interaction.user.id);

			if(!User) {
				if(command.name == 'configuration') return interaction.reply('✘ You don\'t have an account yet. Use `/register` to create one and use this command.');
				const chance = Math.random() * 100;
				const embed = new EmbedBuilder()
					.setDescription('✘ You don\'t have an account yet. Use `/register` to create one and select your language.\n**Please read this [privacy policy](<https://gist.github.com/Myst82015/d5ec04643c4e3af3513e07310b74e64f>) before doing so**.')
					.setColor('d00218');
				if(chance > 70 && command.name !== 'register') interaction.channel.send({ embeds: [embed] });
			}

			await command.execute(this.bot, interaction);
			this.bot.logger.info(__filename, `${interaction.user.tag} in #${interaction.channel.name} triggered an interaction. Command: (${command.name})`);
		}
		catch (error) {
			console.error(error);
			return interaction.channel.send({ content: '✘ There was an error while executing this command!', ephemeral: true });
		}
	}
}

module.exports = Event;