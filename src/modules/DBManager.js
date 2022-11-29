const mongoose = require('mongoose');

/**
 * Creates a new guild document in the database from the guilds collection
 * @param guildID A valid discord guild id
 * @returns {Object} Guild Return the newly created Guild object
 */
async function createGuild(guildID) {
	if(!guildID) return 'no guild id provided';
	if(typeof guildID !== 'string') return 'provided guild id isnt a string';
	const existingGuild = await mongoose.models.Guild.findOne({ id: guildID });
	if(existingGuild) return 'The guild already exists.';
	const Guild = new mongoose.models.Guild({
		id: guildID,
		configuration: {
			prefix: '*',
		},
	}).save();
	return Guild;
}

/**
 * Deletes a guild document in the database from the guilds collection
 * @param guildID A valid discord guild id
 * @returns Guild Return the deleted Guild object
 */
async function deleteGuild(guildID) {
	if(!guildID) return 'no guild id provided';
	if(typeof guildID !== 'string') return 'provided guild id isnt a string';
	const guildToDelete = await mongoose.models.Guild.findOne({ id: guildID });
	if(!guildToDelete) return 'The guild doesn\'t exists.';
	if(guildToDelete) await mongoose.models.Guild.findOneAndDelete({ id: guildID });

	return guildToDelete;
}

/**
 * Fetches a guild document in the database from the guilds collection
 * @param guildID A valid discord guild id
 * @returns Guild Return the fetched Guild object
 */
async function fetchGuild(guildID) {
	if(!guildID) return 'no guild id provided';
	if(typeof guildID !== 'string') return 'provided guild id isnt a string';
	const guildToFetch = await mongoose.models.Guild.findOne({ id: guildID });
	if(!guildToFetch) return await createGuild(guildID);

	return guildToFetch;
}

/**
 *
 * @param {String} guildID User to update
 * @param {String} query Query to update
 * @param {String/Boolean} change The actual change to the database
 * @param {Boolean} isEvents If the events are updated
 * @returns {Object} User
 */
async function updateGuild(guildID, query, change, isEvents = false) {
	if(!guildID) return 'no guild id provided';
	if(typeof guildID !== 'string') return 'provided user id isnt a string';

	if(!query) return 'no query provided';
	if(!change) return 'no change provided';
	if(change == '--reset') {
		const Guild = await mongoose.models.Guild.findOneAndUpdate({ id: guildID }, { $set: { [query]: null } });

		return Guild;
	}
	if(isEvents) {
		const eventQuery = `events.${query}`;
		return await mongoose.models.Guild.findOneAndUpdate({ id: guildID }, { $set: { [eventQuery]: change } });
	}

	const Guild = await mongoose.models.Guild.findOneAndUpdate({ id: guildID }, { $set: { [query]: change } });

	return Guild;
}

// USER

/**
 * Creates a new user document in the database, users collection
 * @param userID A valid discord user id
 * @returns User Return the newly created User object
 */
async function createUser(userID) {
	if(!userID) return 'no user id provided';
	if(typeof userID !== 'string') return 'provided user id isnt a string';
	const existingUser = await mongoose.models.User.findOne({ id: userID });
	console.log(existingUser);
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

	const userToDelete = await mongoose.models.Guild.findOneAndDelete({ id: userID });

	return userToDelete;
}

/**
 * Retrieves a user doument frpm the database or creates a new one if it doesn't exist.
 * @param {String} userID discord id from the user to fetch
 * @returns {Object} userToFetch User document
 */

async function fetchUser(userID, createIfNotExist = false) {
	if(!userID) return 'no user id provided';
	if(typeof userID !== 'string') return 'provided user id isnt a string';
	const UserSchema = require('../Schema/User');
	const userToFetch = await UserSchema.findOne({ id: userID });
	// const userToFetch = await mongoose.models.User.findOne({ id: userID });
	if(!userToFetch && createIfNotExist) return await createUser(userID);
	if(!userToFetch && !createIfNotExist) return false;

	return userToFetch;
}

module.exports = { createGuild, deleteGuild, fetchGuild, updateGuild, createUser, deleteUser, fetchUser };