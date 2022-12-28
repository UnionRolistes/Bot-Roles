const { Schema, model } = require('mongoose');

const User = new Schema({
	id: String,
	guest: { type: Boolean, default: false },
});

module.exports = model('User', User);