const { Schema, model } = require('mongoose');

const Role = new Schema({
	id: String,
	guildId: { type: String, required: true },
	history: [],

});

module.exports = model('Role', Role);