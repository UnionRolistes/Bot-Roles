/* eslint-disable no-inline-comments */
const Command = require('../../structures/Command');
const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType, ChannelType, PermissionFlagsBits, InteractionContextType } = require('discord.js');

const MAX_ROLES_SHOWN = 25;
const BAR_WIDTH = 10;

class ChannelRoles extends Command {
	constructor(client) {
		super({
			name: 'channelroles',
			description: 'Show which roles the members of a channel have',
			name_localizations: {
				'de': 'channelroles',
				'fr': 'channelroles',
				'en-GB': 'channelroles',
			},
			description_localizations: {
				'de': 'Zeigt, welche Rollen die Mitglieder eines Kanals haben.',
				'fr': 'Affiche les rôles des membres ayant accès à un salon.',
				'en-GB': 'Show which roles the members of a channel have.',
			},
			category: 'Utility',
			cooldown: 10,
			enabled: true,
			ownerOnly: false,
			contexts: [InteractionContextType.Guild],
			type: ApplicationCommandType.ChatInput,
			slashOptions: [
				{
					name: 'channel',
					description: 'Channel to analyse (default: this channel)',
					type: ApplicationCommandOptionType.Channel,
					channel_types: [ChannelType.GuildText, ChannelType.GuildVoice, ChannelType.GuildAnnouncement, ChannelType.GuildForum],
					required: false,
				},
				{
					name: 'role1',
					description: 'Only count members who also have this role',
					type: ApplicationCommandOptionType.Role,
					required: false,
				},
				{
					name: 'role2',
					description: 'Only count members who also have this role',
					type: ApplicationCommandOptionType.Role,
					required: false,
				},
				{
					name: 'role3',
					description: 'Only count members who also have this role',
					type: ApplicationCommandOptionType.Role,
					required: false,
				},
			],

		});

		this.client = client;
	}

	async execute(client, interaction, language) {
		// Fetching every member can take a moment on big servers
		await interaction.deferReply();

		// ANSI Color Code
		const orange = '\u001b[33m'; // orange
		const white = '\u001b[37m'; // white
		const red = '\u001b[31m'; // red
		const reset = '\u001b[0m'; // escape


		const channel = interaction.options.getChannel('channel') || interaction.channel;
		const filterRoles = ['role1', 'role2', 'role3']
			.map(option => interaction.options.getRole(option))
			.filter(role => role);

		// Requires the privileged GuildMembers intent
		const members = await interaction.guild.members.fetch();

		// Members who can see the channel and have every filter role
		const channelMembers = members.filter(member =>
			!member.user.bot
			&& channel.permissionsFor(member).has(PermissionFlagsBits.ViewChannel)
			&& filterRoles.every(role => member.roles.cache.has(role.id)),
		);

		if (channelMembers.size === 0) {
			return interaction.editReply({ content: language.channelroles.noMembers });
		}

		// Count how often each role appears among those members
		const roleCounts = new Map();
		channelMembers.forEach(member => {
			member.roles.cache.forEach(role => {
				if (role.id === interaction.guild.id || role.managed) return; // skip @everyone and bot roles
				if (filterRoles.some(filter => filter.id === role.id)) return; // every member has them anyway
				const entry = roleCounts.get(role.id) || { name: role.name, count: 0 };
				entry.count++;
				roleCounts.set(role.id, entry);
			});
		});

		const sorted = [...roleCounts.values()].sort((a, b) => b.count - a.count);
		const total = channelMembers.size;

		const lines = sorted.slice(0, MAX_ROLES_SHOWN).map(({ name, count }) => {
			const percent = (count / total) * 100;
			const filled = Math.round((percent / 100) * BAR_WIDTH);
			const bar = '█'.repeat(filled) + '░'.repeat(BAR_WIDTH - filled);
			return `${red}${bar}${reset} ${white}${percent.toFixed(1).padStart(5)}%${reset} ${String(count).padStart(4)}  ${name.slice(0, 30)}`;
		});

		if (sorted.length > MAX_ROLES_SHOWN) {
			lines.push(`... ${language.channelroles.more.replace('{{count}}', sorted.length - MAX_ROLES_SHOWN)}`);
		}

		const filterText = filterRoles.length ? filterRoles.map(role => `@${role.name}`).join(', ') : language.channelroles.none;

		const description = `\`\`\`ansi
${orange}UR-Role-Stat:${reset}
-------

${orange}${language.channelroles.channel}${reset}: ${white}#${channel.name}${reset}
${orange}${language.channelroles.filters}${reset}: ${white}${filterText}${reset}
${orange}${language.channelroles.members}${reset}: ${white}${total}${reset}
-------

${lines.join('\n') || language.channelroles.none}
\`\`\``;

		const embed = new EmbedBuilder()
			.setThumbnail(this.client.user.displayAvatarURL())
			.setDescription(description)
			.setColor('#36393F');


		await interaction.editReply({ embeds: [embed] });

	}
}

module.exports = ChannelRoles;
