const Discord = require('discord.js');
const mongoose = require('mongoose');

require('./../Schema/User');
require('dotenv').config();

// mongoose.connect(`mongodb://${config.database_ip}:${config.database_port}/${config.database_name}`, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
mongoose.connect(process.env.mongo_url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
mongoose.connection.on('error', console.error.bind(console, '[34m[DATABASE] Connection Error:'));
mongoose.connection.once('open', () => console.log('[DATABASE] Connected Successfully'));

class Base extends Discord.Client {
	constructor(options) {
		super(options.clientOptions || {});

		this.commands = new Discord.Collection();
		this.aliases = new Discord.Collection();
		this.cooldowns = new Discord.Collection();

		// To reduce client pollution we'll create a single container property that we can attach everything we need to.
		this.container = {
			slashCommands: new Discord.Collection(),
			contributors: options.contributors,
			languages: new Discord.Collection(),

			talkedRecently: new Set(),
		};
		this.mongoose = mongoose;
		this.devs = options.devs;
		this.logger = require('./../modules/Logger');
		this.CommandHandler = new (require('./CommandHandler'))(this);
	}

	run() {
		this.CommandHandler.load();

		const delay = ms => new Promise(res => setTimeout(res, ms));

		const registerSlashCommands = async () => {
			await delay(5000);

			this.CommandHandler.register();

			await new Promise(resolve => setTimeout(resolve, 1000));
		};

		registerSlashCommands();
	}
}

module.exports = Base;