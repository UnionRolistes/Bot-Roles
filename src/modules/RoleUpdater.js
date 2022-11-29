/* eslint-disable no-unused-vars */
const schedule = require('node-schedule');
const Schema = require('../Schema/Role');
const Logger = require('../modules/Logger');


module.exports = async (client) => {
	Logger.success('RoleUpdater.js active. Time cycle limit: 1 hour');
	const testRULE2 = new schedule.RecurrenceRule();
	testRULE2.minute = 0;

	const JOBRCOURRING2 = schedule.scheduleJob(testRULE2, async function(y) {
		Logger.warn2('RoleUpdater.js Task executing...');

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

}