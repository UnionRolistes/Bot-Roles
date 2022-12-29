const { Schema, model } = require('mongoose');

const User = new Schema({
	id: String,
	tosAccepted: { type: Boolean, default: false },
});

module.exports = model('User', User);