const mongoose = require('mongoose');

/**
 * Creates a new user document in the database, users collection
 * @param userID A valid discord user id
 * @returns User Return the newly created User object
 */
async function createUser(userID) {
	if(!userID) return 'no user id provided';
	if(typeof userID !== 'string') return 'provided user id isnt a string';
	const existingUser = await mongoose.models.User.findOne({ id: userID });
	// console.log(existingUser);
	if(existingUser) return;
	const User = new mongoose.models.User({
		id: userID,
	}).save();
	return User;
}

/**
 * Deletes a  user document in the database, users collection
 * @param userID A valid discord user id
 * @returns User Return the deleted User object
 */
async function deleteUser(userID) {
	if(!userID) return 'no user id provided';
	if(typeof userID !== 'string') return 'provided user id isnt a string';

	const userToDelete = await mongoose.models.User.findOneAndDelete({ id: userID });

	return userToDelete;
}

/**
 * Retrieves a user doument from the database or creates a new one if it doesn't exist.
 * @param {String} userID discord id from the user to fetch
 * @returns {Object} userToFetch User document
 */

async function fetchUser(userID, createIfNotPresent = false) {
	if(!userID) return 'no user id provided';
	if(typeof userID !== 'string') return 'provided user id isnt a string';
	// const UserSchema = require('../Schema/User');
	// const userToFetch = await UserSchema.findOne({ id: userID });
	const userToFetch = await mongoose.models.User.findOne({ id: userID });
	if(!userToFetch && createIfNotPresent) return await createUser(userID);
	if(!userToFetch && !createIfNotPresent) return false;

	return userToFetch;
}

module.exports = { createUser, deleteUser, fetchUser };