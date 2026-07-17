/* eslint-disable no-useless-escape */
const Command = require('../../structures/Command');
const { EmbedBuilder, ApplicationCommandType, AttachmentBuilder } = require('discord.js');
const Schema = require('../../Schema/Role');

class Roles extends Command {
	constructor(client) {
		super({
			name: 'roles',
			description: 'List all roles',
			category: 'Utility',
			cooldown: 3,
			enabled: true,
			ownerOnly: false,
			guildOnly: true,
			type: ApplicationCommandType.ChatInput,
			defaultMemberPermissions: 'SendMessages',
			slashOptions: [],

		});

		this.client = client;
	}

	async execute(client, interaction) {
		interaction.guild.fetch();
		const rolelist = await interaction.guild.roles.cache.sort((h, l) => h.position - l.position).map(role => `▫️ ${role.name} - ${role.members.size} Member(s)`).reverse().join('\n');
		const embed = new EmbedBuilder()
			.setColor('#36393F')
			.setAuthor({ name: 'UR-Role-Stat', iconURL: client.user.displayAvatarURL(), url: 'https://github.com/UnionRolistes' })
			.setThumbnail('https://avatars.githubusercontent.com/u/62179928?s=200&v=4')
			.setDescription('**Task:** \`Generate role list.\`\n**Progress:**\n**✓** \`Fetching roles...\`\n**✓** \`Generating txt file...\`\n**✓** \`Sending txt file...\`')
			// .setFooter({ text: 'UR-Role-Stat', iconURL: client.user.displayAvatarURL() })
			.setTimestamp();

		// Send the txt file with all roles
		const roleListTxt = new AttachmentBuilder(Buffer.from(rolelist, 'utf-8'), { name: 'rolelist.txt' });
		interaction.reply({ embeds: [embed] }).then(() => { // necessary to send embed first, then the rolelist
			interaction.channel.send({
				files: [roleListTxt],
			});
		});


		await interaction.guild.roles.cache.reduce(async (a, role) => {
			// Wait for the previous item to finish processing
			await a;
			// Fetch the role if it's not in the cache
			await interaction.guild.roles.cache.get(role.id);

			// Sear for existing role
			const existingRoleEntry = await Schema.findOne({ id: role.id });
			if(!existingRoleEntry) {
				const newRoleENtry = new Schema({
					id: role.id,
					guildId: interaction.guild.id,
					lastUpdated: new Date(),
					history: [ { date: getUTCDate(), count: role.members.size }],

				}).save();
				return newRoleENtry;
			}

			const value2 = { date: getUTCDate(), count: role.members.size };

			// Check if the day exists
			const index = existingRoleEntry.history.findIndex(object => object.date === value2.date);
			if (index === -1) {
				existingRoleEntry.history.push(value2);
			}

			await Schema.findOneAndUpdate({ id: role.id }, { $set: { history: existingRoleEntry.history } });
			await updateRoleCount(role);

		}, Promise.resolve());
	}
}
function getUTCDate() {
	const date = new Date();
	return(`${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDate()}`);
}
async function updateRoleCount(role) {
	const today = getUTCDate();

	// Trying to update the count for today
	const result = await Schema.updateOne(
		{ id: role.id, 'history.date': today }, // search for id and date entry for today
		{ $set: { 'history.$.count': role.members.size, lastUpdated: new Date() } },
	);

	if (result.matchedCount === 0) {
		await Schema.updateOne(
			{ id: role.id },
			{
				$push: { history: { date: today, count: role.members.size } },
				$set: { lastUpdated: new Date() },
				$setOnInsert: { guildId: role.guild.id },
			},
			{ upsert: true },
		);
	}
}

module.exports = Roles;