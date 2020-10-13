const inquirer = require("inquirer");
const fs = require("fs");

let baseConfig = fs.readFileSync("./config_base.txt", "utf8");

let prompts = [
  {
    type: "input",
    name: "prefix",
    message: "Please enter the desired prefix."
  },
  {
    type: "input",
    name: "token",
    message: "Please enter the bot token from the application page."
  },
  {
    type: "checkbox",
    name: "intents",
    message: "Which intents would you like? \n" +
      "By default this bot needs Guilds, Guild Messages and Guild Members (privileged) to work. \n" ,
    choices: [
      { "name": "Guilds", "value": "GUILDS", "checked": true },
      { "name": "Guild Messages", "value": "GUILD_MESSAGES", "checked": true },
      { "name": "Direct Messages", "value": "DIRECT_MESSAGES", "checked": true },
      { "name": "Guild Members (privileged)", "value": "GUILD_MEMBERS" },
      { "name": "Guild Bans", "value": "GUILD_BANS" },
      { "name": "Guild Emojis", "value": "GUILD_EMOJIS" },
      { "name": "Guild Integrations", "value": "GUILD_INTEGRATIONS" },
      { "name": "Guild Webhooks", "value": "GUILD_WEBHOOKS" },
      { "name": "Guild Invites", "value": "GUILD_INVITES" },
      { "name": "Guild Voice States", "value": "GUILD_VOICE_STATES" },
      { "name": "Guild Message Reactions", "value": "GUILD_MESSAGE_REACTIONS" },
      { "name": "Guild Message Typing", "value": "GUILD_MESSAGE_TYPING" },
      { "name": "Direct Message Reactions", "value": "DIRECT_MESSAGE_REACTIONS" },
      { "name": "Direct Message Typing", "value": "DIRECT_MESSAGE_TYPING" },
      { "name": "Guild Presences (privileged)", "value": "GUILD_PRESENCES" },
    ]
  },
];

(async function () {
  console.log("-----------------------------------------");
  
  const answers = await inquirer.prompt(prompts);

  baseConfig = baseConfig
    .replace("{{token}}", `"${answers.token}"`)
    .replace("{{prefix}}", `"${answers.prefix}"`)
    .replace("{{intents}}", JSON.stringify(answers.intents));

  fs.writeFileSync("./config.json", baseConfig);
  console.log("-----------------------------------------");
  console.log("Configuration has been written.");

}());