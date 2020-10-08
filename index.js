const Discord = require('discord.js');
const wait = require('util').promisify(setTimeout);
const { prefix, token , intents} = require('./config.json');
const { version } = require('./package.json')
const client = new Discord.Client({
  ws: {
    intents: intents
  },
  disableMentions: 'everyone'
});

client.once('ready', () => {
  console.log(`Ready - Logged in as ${client.user.tag}`);
  // Set the client user's activity
client.user.setActivity('$help', { type: 'WATCHING' }).then(presence => console.log(`Activity set to ${presence.activities[0].name}`)).catch(console.error);
});

client.on ('message', async message => {
	if (message.content === `${prefix}ping`) {

		message.channel.send('Ping?').then(m => m.edit(`Pong!\n:white_small_square: Latency is \`${m.createdTimestamp - message.createdTimestamp}\`ms. \n:white_small_square:API Latency is \`${Math.round(client.ws.ping)}\`ms`));
	} else if (message.content === `${prefix}credit`) {

    message.channel.send(`${client.user.tag} - Version \`${version}\`\nThis bot was created by \`◢◤Myst◢◤#4217\` (Discord ID: 263022860551847936) for \`Dae#5125\` (Discord ID: 209065408857243648)`);
  } else if (message.content === `${prefix}help`) {

		message.channel.send(`Commands:\n:white_small_square: \`${prefix}roles\` - Displays all roles of the server.\n:white_small_square: \`${prefix}credit\` - Informations about the bot developer.\n:white_small_square: \`${prefix}ping\` - Pong!`);
	} else if (message.content === `${prefix}roles`) {

		const roles = message.guild.roles.cache.filter(role =>
            // we don't wanna have @everyone role
            role.name !== '@everyone'
          )
          .sort((h,l) => h.position - l.position) // Sorting from low to high
          .map(role => role = {name: role.name, id: role.id}) // Map all the roles
          .reverse() // Reverse all Roles 
              const pageNum = Math.ceil(roles.length/24);
          
              let rolePages = []
              for (let page = 0; page < pageNum; page++) {
                rolePages.push(roles.splice(0,24));
              }
          
              for (let page = 0; page < pageNum; page++) {
                await wait(1000);
                const roleListEmbed = new Discord.MessageEmbed()
                .setColor('#2C2F33')
                .setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }))
                .setFooter(`${client.user.tag}`, client.user.displayAvatarURL())
                .setTimestamp()
                  .setTitle(`📋 **${message.guild.name} Role List**\nPage ${page + 1}/${pageNum}`)
                for (const role of rolePages[page]) {
                  const memberCount = message.guild.roles.cache.get(role.id).members.size;
                  roleListEmbed.addField(role.name, `Members: \`${memberCount}\``, true)
                  
                }
                await message.channel.send(roleListEmbed);
              }
	}
});

client.login(token);
