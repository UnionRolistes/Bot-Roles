process.on('unhandledRejection', err => {
  if (err.code === 50035) return; // DiscordAPIError: Invalid Form Body content: Must be 2000 or fewer in length.
  console.log(err.code)
  console.error('ERROR', `Uncaught Promise Error: \n${err.stack}`);
});

const Discord = require('discord.js');
const wait = require('util').promisify(setTimeout);
const { prefix, token , intents} = require('./config.json');
const { version } = require('./package.json')
const fs = require("fs");
const fetch = require('node-fetch');

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
    message.channel.send(`${client.user.tag} - Version ${version}\n==============================\n[Owner]\n Dae#5125 (Discord ID: 209065408857243648) \n==============================\n[Developer]\n ◢◤Myst◢◤#4217 (Discord ID: 263022860551847936) \n==============================\n[Other contributors]\n * dryas#5722 \n * Tonitch#2192\n -> Thanks for helping with the formulaire-jdr. `, { code: "asciidoc" });
    // message.channel.send(`${client.user.tag} - Version \`${version}\`\nThis bot was created by \`◢◤Myst◢◤#4217\` (Discord ID: 263022860551847936) for \`Dae#5125\` (Discord ID: 209065408857243648)\nThanks to \`dryas#5722\` and \`Tonitch#2192\` for helping with the formulaire-jdr.`);
  } else if (message.content === `${prefix}version`) {
    message.channel.send(`==============================\n${client.user.tag} - Version ${version}\n==============================`, { code: "asciidoc" });
  
  } else if (message.content === `${prefix}help`) {
    message.channel.send(`Commands:\n:white_small_square: \`${prefix}roles (channel)\` - Displays all roles of the server. If a channel is given the bot returns a list of roles with access to the channel.\n:white_small_square: \`${prefix}credit\` - Informations about the bot developer(s).\n:white_small_square: \`${prefix}ping\` - Pong!`);
  
  } else if (message.content.startsWith(prefix + 'roles')) {

    /**
     * Posts input to hastebin
     * @param {(Object|string)} input   Input as object or string
     * @param {string} extension        File type e.g. js, txt
     * @returns Hastebin Url
     */

    function hastebin(input, extension) {
      return new Promise(function(res, rej) {
        if (!input) rej('[Error] Missing Input');
        fetch('https://hastebin.com/documents', { method: 'POST', body: input })
          .then(res => res.json())
          .then(body => {
            res('https://hastebin.com/' + body.key + ((extension) ? '.' + extension : ''));
          }).catch(e => rej(e));
      });
    }
    
     if(!message.guild) return; // return it in case it comes from a direct message

     let embed = new Discord.MessageEmbed()
    
     // We need the arguments for the sub command
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    // Search the channel in the guild, accepts channel mention, ID or the name of the channel
    const channel = message.mentions.channels.first() || message.guild.channels.cache.find(ch => ch.name === args[1]) || message.guild.channels.cache.find(ch => ch.id === args[1]);
    if(channel){
      let rolesmsg = [];
      let index = 0;
      rolesmsg[index] = "";

      message.guild.roles.cache.sort(
        (h,l) => l.position - h.position
        ).forEach(role => {
          if(!channel.permissionsFor(role).toArray().includes('SEND_MESSAGES')) return;
          //rolesmsg[index] += `${role.name} (${role.id})`;
          rolesmsg[index] += `${role.name}`;
          for (let i = role.name.length; i < 25; i++) {
          rolesmsg[index] += " ";
          }
          rolesmsg[index] += "::  " + role.members.size + "\n";

          if (rolesmsg[index].length > 1800)  return;
          /*{
            
              index++;
              rolesmsg[index] = "";
          } */
      });
      let rolelist = await message.guild.roles.cache.filter(role => channel.permissionsFor(role).toArray().includes('VIEW_CHANNEL')).sort((h,l) => h.position - l.position).map(role => `▫️ ${role.name} - ${role.members.size} Member(s)`).reverse().join("\n")
      let url = await hastebin(`Role list for ${message.guild.name}\n\n${message.guild.roles.cache.size} roles in total with ${message.guild.memberCount} members in total.\n\nFormat: Role name(Type: String) - Members with role(Type: Number)\n\n${rolelist}`, 'txt').catch(err => console.log(err.stack));
      embed.setDescription(`✅Uploaded the list to hastebin.com\n[Click here](${url})`)
      message.channel.send(embed)

      // message.channel.send(`▫️ Roles which have access to ${channel}.\n\`Name :: Members with role\``)
      /*for (let i = 0; i < rolesmsg.length; i++) {
        await wait(3000); // Wait 3 seonds between each message due to specific ratelimits on the server
          message.channel.send(rolesmsg[i], { code: "asciidoc" });    
      }
      */
      return;
    }
   
    let rolelist = await message.guild.roles.cache.sort((h,l) => h.position - l.position).map(role => `▫️ ${role.name} - ${role.members.size} Member(s)`).reverse().join("\n")
    let url = await hastebin(`Role list for ${message.guild.name}\n\n${message.guild.roles.cache.size} roles in total with ${message.guild.memberCount} members in total.\n\nFormat: Role name(Type: String) - Members with role(Type: Number)\n\n${rolelist}`, 'txt').catch(err => console.log(err.stack));
    
    embed.setDescription(`✅Uploaded the list to hastebin.com\n[Click here](${url})`)
    message.channel.send(embed)
    
    // Format new Date() to something readable
    var today = new Date();
    var dd = today.getDate();
    
    var mm = today.getMonth()+1; 
    var yyyy = today.getFullYear();
    if(dd<10) 
    {
        dd='0'+dd;
    } 
    
    if(mm<10) 
    {
        mm='0'+mm;
    } 
    today = mm+'-'+dd+'-'+yyyy;
    const roles = message.guild.roles.cache.sort((h,l) => h.position - l.position).map(role => role = {name: role.name, id: role.id, membercount: role.members.size}).reverse()

    fs.writeFileSync(`./logs/rolelist_${today}.txt`, JSON.stringify(roles, null, '\t')); // Indented with tab);
    // Attach it to the message
    const attachment = new Discord.MessageAttachment(`./logs/rolelist_${today}.txt`);
    // Send the attachment in the message channel with a content
     message.channel.send(`${message.author} Here is the raw list.`, attachment);
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
  }
  
});

client.login(token);