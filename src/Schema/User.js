const { Schema, model } = require('mongoose');

const User = new Schema({
	id: String,
	messageCount: { type: Number, default: 0 },
	language: { type: String, default: 'en-US' },
	guest: { type: Boolean, default: false },

});

module.exports = model('User', User);