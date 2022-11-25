process.on('unhandledRejection', err => {
	console.error('ERROR', `Uncaught Promise Error: \n Error code: ${err.code}\nError Stack:\n${err.stack}`);
});

const Discord = require('discord.js');
// const wait = require('util').promisify(setTimeout);
const { prefix, token, intents } = require('./config.json');
const { version } = require('./package.json');
const fs = require('fs');
const sourcebin = require('sourcebin');
const cron = require('node-cron');


const client = new Discord.Client({
	ws: {
		intents: intents,
	},
	disableMentions: 'everyone',
});

client.once('ready', () => {
	// client.guilds.cache.forEach(guild => console.log(guild.name));
	console.log(`Ready - Logged in as ${client.user.tag}`);
	// Set the client user's activity
	client.user.setActivity('$help', { type: 'WATCHING' }).then(presence => console.log(`Activity set to ${presence.activities[0].name}`)).catch(console.error);
});

client.on ('message', async message => {
	// We need the arguments for the sub command
	const args = message.content.slice(prefix.length).trim().split(/ +/g);

	if (message.content === `${prefix}ping`) {
		message.channel.send('Ping?').then(m => m.edit(`Pong!\n:white_small_square: Latency is \`${m.createdTimestamp - message.createdTimestamp}\`ms. \n:white_small_square:API Latency is \`${Math.round(client.ws.ping)}\`ms`));
	}

	else if (message.content === `${prefix}credit`) {
		message.channel.send(`Bot_Roles - Version ${version}\n==============================\n[Owner]\n Dae#5125 (Discord ID: 209065408857243648) \n==============================\n[Developer]\n ◢◤Myst◢◤#4217 (Discord ID: 263022860551847936) \n==============================\n[Other contributors]\n * dryas#5722 \n * Tonitch#2192\n -> Thanks for helping with the formulaire-jdr. `, { code: 'asciidoc' });
	}

	else if (message.content === `${prefix}version`) {
		message.channel.send(`Bot_Roles - Version ${version}\n=================================`, { code: 'asciidoc' });
	}

	else if (message.content === `${prefix}help`) {
		message.channel.send(`Commands:\n:white_small_square: \`${prefix}roles (channel)\` - Displays all roles of the server. If a channel is given the bot returns a list of roles with access to the channel.\n:white_small_square: \`${prefix}credit\` - Informations about the bot developer(s).\n:white_small_square: \`${prefix}ping\` - Pong!\n:white_small_square: \`${prefix}version\` - Return the version of the bot\n:white_small_square: \`${prefix}compare [number]\` - Compares the membercount of all roles with a stored one`);

	}
	else if (message.content.startsWith(prefix + 'roles')) {

		// If the message is a direct message we ignore it
		if(!message.guild) return;

		// Template for the MessageEmbed
		const embed = new Discord.MessageEmbed()
			.setColor('GREEN')
			.setAuthor('Bot_Roles', client.user.displayAvatarURL())
			.setThumbnail(client.user.displayAvatarURL())
			.setFooter('Bot_Roles', client.user.displayAvatarURL())
			.setTimestamp();


		// Search the channel in the guild, accepts channel mention, ID or the name of the channel
		const channel = message.mentions.channels.first() || message.guild.channels.cache.find(ch => ch.name === args[1]) || message.guild.channels.cache.find(ch => ch.id === args[1]);

		// A channel was found
		if(channel) {
			const rolelist = await message.guild.roles.cache.filter(role => channel.permissionsFor(role).toArray().includes('VIEW_CHANNEL')).sort((h, l) => h.position - l.position).map(role => `▫️ ${role.name} - ${role.members.size} Member(s)`).reverse().join('\n');
			// We create the bin
			const bin = await sourcebin.create(
				[
					{
						content: rolelist,
						language: 'text',
					},
				],
				{
					title: 'L\'Union des Rolistes',
					description: 'List de roles',
				},
			);

			embed.setDescription(`✅ | Posted to Sourceb.in: \n[Click here](${bin.url})`);
			return message.channel.send(embed);

		}
		// If no channel was provided

		// Format new Date() to something readable
		let today = new Date();
		let dd = today.getDate();

		let mm = today.getMonth() + 1;
		const yyyy = today.getFullYear();
		if(dd < 10) {
			dd = '0' + dd;
		}

		if(mm < 10) {
			mm = '0' + mm;
		}
		today = mm + '-' + dd + '-' + yyyy;

		// We sort all roles from high to low
		const rolelist = await message.guild.roles.cache.sort((h, l) => h.position - l.position).map(role => `▫️ ${role.name} - ${role.members.size} Member(s)`).reverse().join('\n');

		// Final text which will then be posted (I added a description)
		const body = `Role list for ${message.guild.name}\n\n${message.guild.roles.cache.size} roles in total with ${message.guild.memberCount} members in total.\n\nFormat: Role name(Type: String) - Members with role(Type: Number)\n\n${rolelist}`;

		// We create the bin
		const bin = await sourcebin.create(
			[
				{
					content: body,
					language: 'text',
				},
			],
			{
				title: 'L\'Union des Rolistes',
				description: 'List de roles',
			},
		);


		embed.setDescription(`✅ | Posted to Sourceb.in: \n[Click here](${bin.url})\nThe raw list can be found below:`);
		message.channel.send(embed);

		// Raw list part
		const date = getDate();
		// Another format so I need to fetch all the roles again
		const roles = message.guild.roles.cache.sort((h, l) => h.position - l.position).map(role => role = { name: role.name, id: role.id, membercount: role.members.size }).reverse();

		await generateAttachment(date, message.guild, roles);
		// Attach it to the message
		// const attachment = new Discord.MessageAttachment(`./logs/Bot_RolesList_${date}_${message.guild.name}.txt`);
		const attachment = new Discord.MessageAttachment(`./logs/Bot_RolesList_${date}_${message.guild.id}.txt`);
		// Send the attachment in the message channel with a content
		return message.channel.send(`${message.author} Here is the raw list.`, attachment);
	}


	else if (message.content.startsWith(prefix + 'compare')) {
		console.log('Current directory: ' + process.cwd());
		console.log(new Date().getMonth());
		console.log(new Date().getMonth() + 1);

		if(args[1] && Number(args[1]) <= Number('12') && Number(args[1]) >= Number('1')) {


			console.log('Fancy new function: ' + getDateMonthsBefore(args[1]));

			// let current date;
			const requiredMonth = new Date(
				new Date().getFullYear(),
				(new Date().getMonth() + 1) - args[1],
				1,
			);

			console.log(`The Date is ${requiredMonth.getDay()}-${requiredMonth.getMonth()}-${requiredMonth.getFullYear()}`);
			console.log(formatDate(requiredMonth.getDay(), requiredMonth.getMonth(), requiredMonth.getFullYear()));


			const files = fs.readdirSync('./logs');

			let found = false;
			// The searchTerm (example: 01-11-2020)
			const substr = `${getDateMonthsBefore(args[1])}`;
			console.log('substr is: ' + substr);

			files.forEach(file => {

				const str = file;


				// true
				if (str.includes(substr)) {

					// File found
					console.log('[ File ] Found a file with the correct day, month and year: ' + file);
					found = true;

					// We get the current roles with their member counts
					const roles = message.guild.roles.cache.sort((h, l) => h.position - l.position).map(role => role = { name: role.name, id: role.id, membercount: role.members.size }).reverse();

					// console.log('Current directory: ' + process.cwd());

					const rawdata = fs.readFileSync(`./logs/${file}`);
					const list = JSON.parse(rawdata);

					let changedroles = `This Tool Compares The Current MemberCount Of All Roles With The Stored Logs.\n\nToday: ${getDate()}\nCompared to: ${substr}\n\nRole  ::  Current MemberCount (Difference to old Membercount)\n\n`;
					list.forEach((obj, index) => {
						const newRole = roles[index];

						changedroles += `${newRole.name}`;
						for (let i = newRole.name.length; i < 25; i++) {
							changedroles += ' ';
						}
						let count = newRole.membercount - obj.membercount;
						if(count > 0) count = `+${count}`;
						// changedroles += '::  ' + newRole.membercount + '(' + (newRole.membercount - obj.membercount) + ')' + '\n';
						changedroles += '::  ' + newRole.membercount + '(' + count + ')' + '\n';
					});

					// Since L'Union des Rôlistes has a lot of roles, we generate an Attachment just in case the Strings exceeds 1900 characters
					// Discord only allows 2000 characters per message
					console.log(changedroles.length);
					if(changedroles.length > 1900) {
						fs.writeFileSync(`./logs/Bot_RolesList_temp_${message.guild.id}.txt`, JSON.stringify(changedroles, null, '\t'));
						const attachment = new Discord.MessageAttachment(`./logs/Bot_RolesList_temp_${message.guild.id}.txt`);
						// Send the attachment in the message channel with a content
						message.channel.send(`${message.author} Here is the raw list.`, attachment);
						try {
							fs.unlinkSync(`./logs/Bot_RolesList_temp_${message.guild.id}.txt`);
							// file removed
						}
						catch(err) {
							console.error('File couldn\'t be removed: ' + err);
						}
						return;
					}
					return message.channel.send(changedroles, { code: 'asciidoc' });

					// End due to return
				}
				console.log('Not the correct file: ' + file);
			});

			if(!found) return message.channel.send('No logs found.\nThis system is new so the necessary logs are not generated yet.');

		}
		else {message.channel.send('You need to provide a valid number for the months (1-12):\n`$test 4 -> goes 4 months back`');}

	}
	// Old code for reference
	/*
     let rolesmsg = [];
        let index = 0;
        rolesmsg[index] = "";

        message.guild.roles.cache.sort(
          (h,l) => l.position - h.position
          ).forEach(role => {
            rolesmsg[index] += `${role.name}`;
            for (let i = role.name.length; i < 25; i++) {
            rolesmsg[index] += " ";
            }
            rolesmsg[index] += "::  " + role.members.size + "\n";

            if (rolesmsg[index].length > 1800) return;
            /*{

                index++;
                rolesmsg[index] = "";
            }
        });

        for (let i = 0; i < rolesmsg.length; i++) {
          await wait(3000); // Wait 3 seonds between each message due to specific ratelimits on the server
            message.channel.send(rolesmsg[i], { code: "asciidoc" });
        } */
});


cron.schedule('0 0 1 * *', () => {
	const date = getDate();
	client.guilds.cache.forEach(guild => {
		const rolelist = guild.roles.cache.sort((h, l) => h.position - l.position).map(role => role = { name: role.name, id: role.id, membercount: role.members.size }).reverse();
		generateAttachment(date, guild, rolelist);
	});
	console.log('Node-Cron: Generated role lists for every server.');
});
/**
 * Returns the date with removed `months`.
 *
 * @param {Number} months - the removed months.
 *
 * @returns {Date}
 */
function getDateMonthsBefore(months) {

	let date = new Date();
	date.setDate(1);
	date.setMonth(date.getMonth() + 1 - months);
	console.log(`getDateMonthsBefore. Args: ${months}\nmonth: ${date.getMonth()}`);
	date = formatDate(date.getDate(), date.getMonth() + 1, date.getFullYear());
	return date;
}
/**
 * Returns a formatted and readable date e.g 01-11-2020`.
 *
 * @param {Number} d - the day.
 *
 * @param {Number} m - the month.
 *
 * @param {Number} y - the year
 * .
 * @returns {String} formattedDate - the formatted Date
 */
function formatDate(d, m, y) {
	// Format new Date() to something readable
	if(d < 10) {
		d = '0' + d;
	}

	if(m < 10) {
		m = '0' + m;
	}
	const formattedDate = d + '-' + m + '-' + y;
	return formattedDate;
}

function getDate() {
	// Format new Date() to something readable
	let today = new Date();
	let dd = today.getDate();

	let mm = today.getMonth() + 1;
	const yyyy = today.getFullYear();
	if(dd < 10) {
		dd = '0' + dd;
	}

	if(mm < 10) {
		mm = '0' + mm;
	}
	today = dd + '-' + mm + '-' + yyyy;
	return today;
}
function generateAttachment(date, guild, roles) {
	// fs.writeFileSync(`./logs/Bot_RolesList_${date}_${guild.name}.txt`, JSON.stringify(roles, null, '\t'));
	fs.writeFileSync(`./logs/Bot_RolesList_${date}_${guild.id}.txt`, JSON.stringify(roles, null, '\t'));
	// fs.writeFileSync(`./logs/Bot_RolesList_${date}_${message.guild.name}.txt`, JSON.stringify(roles, null, '\t'));
	// fs.writeFileSync(`./logs/Bot_RolesList_${date}_${message.guild.name}.json`, JSON.stringify(roles));
}
client.login(token);