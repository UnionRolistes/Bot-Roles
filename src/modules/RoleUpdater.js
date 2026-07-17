/* eslint-disable no-unused-vars */
const cron = require('node-cron');
const Schema = require('../Schema/Role');
const Logger = require('../modules/Logger');

module.exports = async (client) => {
	Logger.warn(__filename, 'RoleUpdater.js active. Time cycle limit: 1 hour');

	const roleSyncJob = cron.schedule('0 * * * *', async function() {
		Logger.debug(__filename, 'RoleUpdater.js Job executing...');

		await client.guilds.cache.reduce(async (a, guild) => {
			// Wait for the previous item to finish processing
			await a;

			// Fetch/Cache 0the guild
			await client.guilds.cache.get(guild.id);

			await guild.roles.cache.reduce(async (b, role) => {
				// Wait for the previous item to finish processing
				await b;
				// Fetch/Cache the role
				await guild.roles.cache.get(role.id);

				await updateRoleCount(role);

			}, Promise.resolve());

		}, Promise.resolve());

	});
};
function getUTCDate() {
	const date = new Date();
	return(`${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDate()}`);
}

async function updateRoleCount(role) {
	const today = getUTCDate();

	// Trying to update the count for today
	const result = await Schema.updateOne(
		{ id: role.id, 'history.date': today }, // search for id and date entry for today
		{ $set: { 'history.$.count': role.members.size, lastUpdated: new Date() } },
	);

	// No entry was found -> create a new one
	if (result.matchedCount === 0) {
		await Schema.updateOne(
			{ id: role.id },
			{
				$push: { history: { date: today, count: role.members.size } },
				$set: { lastUpdated: new Date() },
				$setOnInsert: { guildId: role.guild.id },
			},
			{ upsert: true },
		);
	}
}



/* OLD CODE
const cron = require('node-cron');
const Schema = require('../Schema/Role');
const Logger = require('../modules/Logger');
module.exports = async (client) => {
	Logger.warn(__filename, 'RoleUpdater.js active. Time cycle limit: 1 hour');

	const JOBRCOURRING2 = cron.schedule('0 * * * *', async function() {
		Logger.warn(__filename, 'RoleUpdater.js Task executing...');

		await client.guilds.cache.reduce(async (a, guild) => {
			// Wait for the previous item to finish processing
			await a;

			// Fetch the guild if it's not in the cache
			await client.guilds.cache.get(guild.id);

			// get all roles
			await guild.roles.cache.reduce(async (b, role) => {
				await b;
				// Fetch the role if it's not in the cache
				await guild.roles.cache.get(role.id);

				// Search for existing role
				const existingRoleEntry = await Schema.findOne({ id: role.id });
				if(!existingRoleEntry) {
					const newRoleENtry = new Schema({
						id: role.id,
						guildId: guild.id,
						lastUpdated: new Date(),
						history: [ { date: getUTCDate(), count: role.members.size }],

					}).save();
					return newRoleENtry;
				}
				const value2 = { date: getUTCDate(), count: role.members.size };

				// Check if the day exists
				const index = existingRoleEntry.history.findIndex(object => object.date === value2.date);

				if (index === -1) {
					existingRoleEntry.history.push(value2);
				}

				await Schema.findOneAndUpdate({ id: role.id }, { $set: { history: existingRoleEntry.history } });
				await updateRoleCount(role);

			}, Promise.resolve());

		}, Promise.resolve());
	});
};
function getUTCDate() {
	const date = new Date();
	return(`${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDate()}`);
}
async function updateRoleCount(roleToUpdate) {
	const existingRoleEntry = await Schema.findOne({ id: roleToUpdate.id });

	for (const obj of existingRoleEntry.history) {
		if (obj.date === getUTCDate()) {
			obj.count = roleToUpdate.members.size;
			break;
		}
	}
	await Schema.findOneAndUpdate({ id: roleToUpdate.id }, { $set: { history: existingRoleEntry.history } });
}
*/



/*
const schedule = require('node-schedule');
const Schema = require('../Schema/Role');
const Logger = require('../modules/Logger');


module.exports = async (client) => {
	Logger.warn(__filename, 'RoleUpdater.js active. Time cycle limit: 1 hour');
	const testRULE2 = new schedule.RecurrenceRule();
	testRULE2.minute = 0;

	const JOBRCOURRING2 = schedule.scheduleJob(testRULE2, async function(y) {
		Logger.warn(__filename, 'RoleUpdater.js Task executing...');

		await client.guilds.cache.reduce(async (a, guild) => {

			// Wait for the previous item to finish processing
			await a;
			// Process this item

			// Fetch the user if it's not in the cache
			await client.guilds.cache.get(guild.id);

			await guild.roles.cache.reduce(async (b, role) => {
				// Wait for the previous item to finish processing
				await b;
				// Process this item
				// Fetch the user if it's not in the cache
				await guild.roles.cache.get(role.id);

				// Sear for existing role
				const existingRoleEntry = await Schema.findOne({ id: role.id });
				if(!existingRoleEntry) {
					const newRoleENtry = new Schema({
						id: role.id,
						guildId: guild.id,
						lastUpdated: new Date(),
						history: [ { date: getUTCDate(), count: role.members.size }],

					}).save();
					return newRoleENtry;
				}

				const value2 = { date: getUTCDate(), count: role.members.size };

				// Check if the day exists
				const index = existingRoleEntry.history.findIndex(object => object.date === value2.date);

				if (index === -1) {
					existingRoleEntry.history.push(value2);
				}

				await Schema.findOneAndUpdate({ id: role.id }, { $set: { history: existingRoleEntry.history } });
				await updateRoleCount(role);

			}, Promise.resolve());

		}, Promise.resolve());

	});
};
function getUTCDate() {
	const date = new Date();
	return(`${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDate()}`);
}
async function updateRoleCount(roleToUpdate) {
	const existingRoleEntry = await Schema.findOne({ id: roleToUpdate.id });

	for (const obj of existingRoleEntry.history) {
		if (obj.date === getUTCDate()) {
			obj.count = roleToUpdate.members.size;
			break;
		}
	}
	await Schema.findOneAndUpdate({ id: roleToUpdate.id }, { $set: { history: existingRoleEntry.history } });

} */