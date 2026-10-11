/* eslint-disable no-inline-comments */
const Command = require('../../structures/Command');
const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType, AttachmentBuilder, InteractionContextType } = require('discord.js');
const Schema = require('../../Schema/Role');
const ChartJSImage = require('chart.js-image');

// Keeps the chart readable and the chart URL short
const MAX_CHART_POINTS = 120;
const DEFAULT_PERIOD = 30;

class History extends Command {
	constructor(client) {
		super({
			name: 'history',
			description: 'Look up the member changes of a role.',
			category: 'Utility',
			cooldown: 3,
			enabled: true,
			ownerOnly: false,
			contexts: [InteractionContextType.Guild],

			type: ApplicationCommandType.ChatInput,
			slashOptions: [
				{
					name: 'role',
					description: 'Look up a role for recent changes',
					type: ApplicationCommandOptionType.Subcommand,
					options: [
						{
							name: 'role',
							description: 'The role to look up.',
							type: ApplicationCommandOptionType.Role,
							required: true,
						},
						{
							name: 'period',
							description: 'Time frame to show (default: 30 days)',
							type: ApplicationCommandOptionType.Integer,
							required: false,
							choices: [
								{ name: '7 days', value: 7 },
								{ name: '30 days', value: 30 },
								{ name: '90 days', value: 90 },
								{ name: '1 year', value: 365 },
								{ name: 'All', value: 0 },
							],
						},
					],
				}],
		});

		this.client = client;
	}

	async execute(client, interaction, language) {
		// Generating the chart can take a moment
		await interaction.deferReply();

		// ANSI Color Code
		const orange = '\u001b[33m'; // orange
		const white = '\u001b[37m'; // white
		const green = '\u001b[32m'; // green
		const red = '\u001b[31m'; // red
		const reset = '\u001b[0m'; // escape

		const role = interaction.options.getRole('role');
		const periodOption = interaction.options.getInteger('period');
		const period = periodOption === null ? DEFAULT_PERIOD : periodOption; // 0 = all saved entries
		const roleName = role.name.startsWith('@') ? role.name : `@${role.name}`;

		// Only use the saved entries, missing days are not filled with 0
		const DBEntry = await Schema.findOne({ id: role.id });
		const cutoff = period ? Date.now() - period * 24 * 60 * 60 * 1000 : 0;
		const points = (DBEntry ? DBEntry.history : [])
			.map(entry => ({ date: parseStoredDate(entry.date), count: entry.count }))
			.filter(point => !isNaN(point.date) && point.date.getTime() >= cutoff)
			.sort((a, b) => a.date - b.date);

		if (points.length === 0) {
			return interaction.editReply({ content: language.history.noData.replace('{{role}}', roleName) });
		}

		const counts = points.map(point => point.count);
		const first = points[0];
		const last = points[points.length - 1];
		const change = last.count - first.count;
		const changePercent = first.count ? (change / first.count) * 100 : 0;
		const sign = change > 0 ? '+' : '';
		const changeColor = change > 0 ? green : change < 0 ? red : white;
		const periodText = period ? language.history.lastDays.replace('{{days}}', period) : language.history.all;

		const description = `\`\`\`ansi
${orange}UR-Role-Stat:${reset}
-------

${orange}${language.history.role}${reset}: ${white}${roleName}${reset}
${orange}${language.history.period}${reset}: ${white}${periodText}${reset}
${orange}${language.history.dataPoints}${reset}: ${white}${points.length} (${formatDate(first.date)} → ${formatDate(last.date)})${reset}
-------

${orange}${language.history.current}${reset}: ${white}${last.count}${reset}
${orange}${language.history.minMax}${reset}: ${white}${Math.min(...counts)} / ${Math.max(...counts)}${reset}
${orange}${language.history.change}${reset}: ${changeColor}${sign}${change} (${sign}${changePercent.toFixed(1)}%)${reset}
\`\`\``;

		const chartPoints = downsample(points, MAX_CHART_POINTS);
		const gridColor = 'rgba(255, 255, 255, 0.08)';
		const textColor = '#b5bac1';

		const lineChart = ChartJSImage().chart({
			'type': 'line',
			'data': {
				'labels': chartPoints.map(point => formatDate(point.date)),
				'datasets': [
					{
						'label': roleName,
						'borderColor': 'rgb(118, 120, 237)',
						'backgroundColor': 'rgba(118, 120, 237, 0.2)',
						'pointRadius': chartPoints.length > 31 ? 0 : 3,
						'lineTension': 0,
						'data': chartPoints.map(point => point.count),
					},
				],
			},
			'options': {
				'legend': { 'display': false },
				'title': {
					'display': true,
					'text': roleName,
					'fontColor': '#dbdee1',
					'fontSize': 16,
				},
				'scales': {
					'xAxes': [{
						'ticks': { 'fontColor': textColor, 'maxTicksLimit': 10, 'maxRotation': 0 },
						'gridLines': { 'color': gridColor },
					}],
					'yAxes': [{
						'ticks': { 'fontColor': textColor, 'precision': 0, 'beginAtZero': true }, // a change of 1 member should not look like a spike
						'gridLines': { 'color': gridColor },
					}],
				},
			},
		})
			.backgroundColor('#2b2d31') // Discord dark theme
			.width(800)
			.height(400);

		const chartImage = new AttachmentBuilder(await lineChart.toBuffer(), { name: 'history.png' });

		const embed = new EmbedBuilder()
			.setThumbnail(this.client.user.displayAvatarURL())
			.setDescription(description)
			.setImage('attachment://history.png')
			.setColor('#36393F');

		await interaction.editReply({ embeds: [embed], files: [chartImage] });
	}
}

// Stored dates use a 0-based month ("2026-9-11" is 11 October 2026), see getUTCDate() in RoleUpdater.js
function parseStoredDate(date) {
	const [year, month, day] = String(date).split('-').map(Number);
	return new Date(Date.UTC(year, month, day));
}

function formatDate(date) {
	return date.toISOString().slice(0, 10);
}

// Picks evenly spaced points, always keeping the first and the last one
function downsample(points, max) {
	if (points.length <= max) return points;
	const step = (points.length - 1) / (max - 1);
	return Array.from({ length: max }, (_, i) => points[Math.round(i * step)]);
}

module.exports = History;
