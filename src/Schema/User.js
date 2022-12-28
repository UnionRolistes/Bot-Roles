const { Schema, model } = require('mongoose');

const User = new Schema({
	id: String,
	language: { type: String, default: 'en-US' },
	guest: { type: Boolean, default: false },
});

module.exports = model('User', User);