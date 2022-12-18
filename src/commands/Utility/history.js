/* eslint-disable no-inline-comments */
/* eslint-disable no-useless-escape */
const Command = require('../../structures/Command');
const { EmbedBuilder, ApplicationCommandType, AttachmentBuilder } = require('discord.js');
const Schema = require('../../Schema/Role');
const ChartJSImage = require('chart.js-image');

class History extends Command {
	constructor(client) {
		super({
			name: 'history',
			description: 'Look up the member changes of a role.',
			category: 'Utility',
			cooldown: 3,
			enabled: true,
			ownerOnly: false,
			guildOnly: true,

			type: ApplicationCommandType.ChatInput,
			defaultMemberPermissions: 'SendMessages',
			slashOptions: [
				{
					name: 'role',
					description: 'Look up a role for recent changes',
					type: 1,
					options: [
						{
							name: 'role',
							description: 'The role you want to add to the user.',
							type: 8,
							required: true,
						},
					],
				}],
		});

		this.client = client;
	}

	async execute(client, interaction, language) {

		const option = interaction.options.get('role');
		console.log(option.value);
		interaction.guild.fetch();
		const embed = new EmbedBuilder()
			.setColor('#36393F')
			.setAuthor({ name: 'Bot_Roles', iconURL: client.user.displayAvatarURL(), url: 'https://github.com/Myst82015' })
			.setThumbnail(client.user.displayAvatarURL())
			.setDescription('**Task:** \`Generate graph.\`\n**Progress:**\n**✓** \`Fetching database...\`\n**✓** \`Sorting...\`\n**✓** \`Generating output...\`')
			.setFooter({ text: 'Bot_Roles', iconURL: client.user.displayAvatarURL() })
			.setTimestamp();

		// Days 0-9; 9 is today, 0 ist today -9
		const dt = new Date();
		const day9 = formatDate(dt);
		const day8 = formatDate(dt.setDate(dt.getDate() - 1));
		const day7 = formatDate(dt.setDate(dt.getDate() - 1));
		const day6 = formatDate(dt.setDate(dt.getDate() - 1));
		const day5 = formatDate(dt.setDate(dt.getDate() - 1));
		const day4 = formatDate(dt.setDate(dt.getDate() - 1));
		const day3 = formatDate(dt.setDate(dt.getDate() - 1));
		const day2 = formatDate(dt.setDate(dt.getDate() - 1));
		const day1 = formatDate(dt.setDate(dt.getDate() - 1));
		const day0 = formatDate(dt.setDate(dt.getDate() - 1));


		const DBEntry = await Schema.findOne({ id: option.value });


		// Check if the day exists
		let db9 = DBEntry.history.findIndex(object => object.date === day9);
		if(!DBEntry.history[db9]) {db9 = { date: day9, count: 'No data avaiable.' };}
		else {db9 = { date: day9, count: DBEntry.history[db9].count + ' Member(s)' };}

		let db8 = DBEntry.history.findIndex(object => object.date === day8);
		if(!DBEntry.history[db8]) {db8 = { date: day8, count: 'No data avaiable.' };}
		else {db8 = { date: day8, count: DBEntry.history[db8].count + ' Member(s)' };}

		let db7 = DBEntry.history.findIndex(object => object.date === day7);
		if(!DBEntry.history[db7]) {db7 = { date: day7, count: 'No data avaiable.' };}
		else {db7 = { date: day7, count: DBEntry.history[db7].count + ' Member(s)' };}

		let db6 = DBEntry.history.findIndex(object => object.date === day6);
		if(!DBEntry.history[db6]) {db6 = { date: day6, count: 'No data avaiable.' };}
		else {db6 = { date: day6, count: DBEntry.history[db6].count + ' Member(s)' };}

		let db5 = DBEntry.history.findIndex(object => object.date === day5);
		if(!DBEntry.history[db5]) {db5 = { date: day5, count: 'No data avaiable.' };}
		else {db5 = { date: day5, count: DBEntry.history[db5].count + ' Member(s)' };}

		let db4 = DBEntry.history.findIndex(object => object.date === day4);
		if(!DBEntry.history[db4]) {db4 = { date: day4, count: 'No data avaiable.' };}
		else {db4 = { date: day4, count: DBEntry.history[db4].count + ' Member(s)' };}

		let db3 = DBEntry.history.findIndex(object => object.date === day3);
		if(!DBEntry.history[db3]) {db3 = { date: day3, count: 'No data avaiable.' };}
		else {db3 = { date: day3, count: DBEntry.history[db3].count + ' Member(s)' };}

		let db2 = DBEntry.history.findIndex(object => object.date === day2);
		if(!DBEntry.history[db2]) {db2 = { date: day2, count: 'No data avaiable.' };}
		else {db2 = { date: day2, count: DBEntry.history[db2].count + ' Member(s)' };}

		let db1 = DBEntry.history.findIndex(object => object.date === day1);
		if(!DBEntry.history[db1]) {db1 = { date: day1, count: 'No data avaiable.' };}
		else {db1 = { date: day1, count: DBEntry.history[db1].count + ' Member(s)' };}

		let db0 = DBEntry.history.findIndex(object => object.date === day0);
		if(!DBEntry.history[db0]) {db0 = { date: day0, count: 'No data avaiable.' };}
		else {db0 = { date: day0, count: DBEntry.history[db0].count + ' Member(s)' };}

		embed.addFields(
			{ name: `Data for ${interaction.guild.roles.cache.get(option.value).name}`, value:`
            ▫️ \`${db9.date}\`: \`${db9.count}\`
            ▫️ \`${db8.date}\`: \`${db8.count}\`
            ▫️ \`${db7.date}\`: \`${db7.count}\`
            ▫️ \`${db6.date}\`: \`${db6.count}\`
            ▫️ \`${db5.date}\`: \`${db5.count}\`
            ▫️ \`${db4.date}\`: \`${db4.count}\`
            ▫️ \`${db3.date}\`: \`${db3.count}\`
            ▫️ \`${db2.date}\`: \`${db2.count}\`
            ▫️ \`${db1.date}\`: \`${db1.count}\`
            ▫️ \`${db0.date}\`: \`${db0.count}\`
            ` },
		);

		const dayNames = [
			db0.date,
			db1.date,
			db2.date,
			db3.date,
			db4.date,
			db5.date,
			db6.date,
			db7.date,
			db8.date,
			db9.date,
		];

		// Check if the day exists
		let count9;
		db9 = await DBEntry.history.findIndex(object => object.date === day9);
		if(!DBEntry.history[db9]) count9 = 0;
		else count9 = DBEntry.history[db9].count;
		console.log(count9);
		console.log(typeof count9);

		let count8;
		db8 = await DBEntry.history.findIndex(object => object.date === day8);
		if(!DBEntry.history[db8]) count8 = 0;
		else count8 = DBEntry.history[db8].count;

		let count7;
		db7 = await DBEntry.history.findIndex(object => object.date === day7);
		if(!DBEntry.history[db7]) count7 = 0;
		else count7 = DBEntry.history[db7].count;

		let count6;
		db6 = await DBEntry.history.findIndex(object => object.date === day6);
		if(!DBEntry.history[db6]) count6 = 0;
		else count6 = DBEntry.history[db6].count;

		let count5;
		db5 = await DBEntry.history.findIndex(object => object.date === day5);
		if(!DBEntry.history[db5]) count5 = 0;
		else count5 = DBEntry.history[db5].count;

		let count4;
		db4 = await DBEntry.history.findIndex(object => object.date === day4);
		if(!DBEntry.history[db4]) count4 = 0;
		else count4 = DBEntry.history[db4].count;

		let count3;
		db3 = await DBEntry.history.findIndex(object => object.date === day3);
		if(!DBEntry.history[db3]) count3 = 0;
		else count3 = DBEntry.history[db3].count;

		let count2;
		db2 = await DBEntry.history.findIndex(object => object.date === day2);
		if(!DBEntry.history[db2]) count2 = 0;
		else count2 = DBEntry.history[db2].count;

		let count1;
		db1 = await DBEntry.history.findIndex(object => object.date === day1);
		if(!DBEntry.history[db1]) count1 = 0;
		else count1 = DBEntry.history[db1].count;

		let count0;
		db0 = await DBEntry.history.findIndex(object => object.date === day0);
		if(!DBEntry.history[db0]) count0 = 0;
		else count0 = DBEntry.history[db0].count;


		const line_chart = ChartJSImage().chart({
			'type': 'line',
			'data': {
				'labels': dayNames,
				'datasets': [
					{
						'label': `${interaction.guild.roles.cache.get(option.value).name}`,
						'borderColor': 'rgb(255,+99,+132)',
						'backgroundColor': 'rgba(255,+99,+132,+.5)',
						'data': [
							`${count0}`,
							`${count1}`,
							`${count2}`,
							`${count3}`,
							`${count4}`,
							`${count5}`,
							`${count6}`,
							`${count7}`,
							`${count8}`,
							`${count9}`,
						],
					},

				],
			},
			'options': {
				'title': {
					'display': true,
					'text': 'Line Chart For ' + interaction.guild.name,
				},
				'scales': {
					'xAxes': [
						{
							'scaleLabel': {
								'display': true,
								'labelString': 'Date',
							},
						},
					],
					'yAxes': [
						{
							'stacked': true,
							'scaleLabel': {
								'display': true,
								'labelString': 'Members',
							},
						},
					],
				},
			},
		}) // Line chart
			.backgroundColor('white')
			.width(500) // 500px
			.height(300); // 300px

		const test = new AttachmentBuilder(Buffer.from(await line_chart.toBuffer(), 'utf-8'), { name: 'image.png' });
		interaction.reply({ embeds: [embed] }).then(() => {
			interaction.channel.send({
				files: [test],
			});
		});
	}
}

function formatDate(date) {
	const DateToFormat = new Date(date);
	return(`${DateToFormat.getUTCFullYear()}-${DateToFormat.getUTCMonth()}-${DateToFormat.getUTCDate()}`);
}


module.exports = History;