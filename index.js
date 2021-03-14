process.on('unhandledRejection', err => {
	console.log(err.code);
	console.error('ERROR', `Uncaught Promise Error: \n${err.stack}`);
});

const Discord = require('discord.js');
// const wait = require('util').promisify(setTimeout);
const { prefix, token, intents } = require('./config.json');
const { version } = require('./package.json');
const fs = require('fs');
const sourcebin = require('sourcebin');


const client = new Discord.Client({
	ws: {
		intents: intents,
	},
	disableMentions: 'everyone',
});

client.once('ready', () => {
	console.log(`Ready - Logged in as ${client.user.tag}`);
	// Set the client user's activity
	client.user.setActivity('$help', { type: 'WATCHING' }).then(presence => console.log(`Activity set to ${presence.activities[0].name}`)).catch(console.error);
});

client.on ('message', async message => {
	if (message.content === `${prefix}ping`) {
		message.channel.send('Ping?').then(m => m.edit(`Pong!\n:white_small_square: Latency is \`${m.createdTimestamp - message.createdTimestamp}\`ms. \n:white_small_square:API Latency is \`${Math.round(client.ws.ping)}\`ms`));
	}

	else if (message.content === `${prefix}credit`) {
		message.channel.send(`${client.user.tag} - Version ${version}\n==============================\n[Owner]\n Dae#5125 (Discord ID: 209065408857243648) \n==============================\n[Developer]\n ◢◤Myst◢◤#4217 (Discord ID: 263022860551847936) \n==============================\n[Other contributors]\n * dryas#5722 \n * Tonitch#2192\n -> Thanks for helping with the formulaire-jdr. `, { code: 'asciidoc' });
	}

	else if (message.content === `${prefix}version`) {
		message.channel.send(`${client.user.tag} - Version ${version}\n=================================`, { code: 'asciidoc' });
	}

	else if (message.content === `${prefix}help`) {
		message.channel.send(`Commands:\n:white_small_square: \`${prefix}roles (channel)\` - Displays all roles of the server. If a channel is given the bot returns a list of roles with access to the channel.\n:white_small_square: \`${prefix}credit\` - Informations about the bot developer(s).\n:white_small_square: \`${prefix}ping\` - Pong!\n:white_small_square: \`${prefix}version\` - Return the version of the bot`);

	}
	else if (message.content.startsWith(prefix + 'roles')) {

		// If the message is a direct message we ignore it
		if(!message.guild) return;

		// Template for the MessageEmbed
		const embed = new Discord.MessageEmbed()
			.setColor('GREEN')
			.setAuthor(`${client.user.username}`, client.user.displayAvatarURL())
			.setThumbnail(client.user.displayAvatarURL())
			.setFooter(`${client.user.tag}`, client.user.displayAvatarURL())
			.setTimestamp();

		// We need the arguments for the sub command
		const args = message.content.slice(prefix.length).trim().split(/ +/g);

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

		// Another format so I need to fetch all the roles again
		const roles = message.guild.roles.cache.sort((h, l) => h.position - l.position).map(role => role = { name: role.name, id: role.id, membercount: role.members.size }).reverse();

		fs.writeFileSync(`./logs/rolelist_${today}.txt`, JSON.stringify(roles, null, '\t'));
		// Attach it to the message
		const attachment = new Discord.MessageAttachment(`./logs/rolelist_${today}.txt`);
		// Send the attachment in the message channel with a content
		return message.channel.send(`${message.author} Here is the raw list.`, attachment);
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

client.login(token);