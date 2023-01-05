class Command {
	constructor(options) {
		this.name = options.name;
		this.description = options.description || 'No Description provided.';
		this.category = options.category || 'General';
		this.ownerOnly = options.ownerOnly || false;
		this.type = options.type;
		this.usage = options.usage;
		this.cooldown = options.cooldown || 0;
		this.default_User_Perms = options.defaultMemberPermissions || [];
		this.required_Bot_Perms = options.requiredBotPerms || [];
		this.enabled = options.enabled || false;
		this.guildOnly = options.guildOnly || false;
		this.options = options.slashOptions || [];
		this.name_localizations = options.name_localizations || [];
		this.description_localizations = options.description_localizations || [];
	}
}

module.exports = Command;
