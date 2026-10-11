# UR-Role-Stat (Bot-Roles)

UR-Role-Stat is the open-source Discord bot of [L'Union des Rôlistes](http://unionrolistes.fr/). It tracks how many members each role has over time, draws charts of those numbers, and shows which roles the members of a channel have. It also has a few shortcut commands for the community's calendar and web tools.

Built with [discord.js v14](https://discord.js.org/), [MongoDB](https://www.mongodb.com/) (through Mongoose) and slash commands.

---

## Features

- **Role member tracking.** Every hour (at minute 0), the bot saves the member count of every role on every server it is in. It keeps one entry per role per day (UTC), and later runs on the same day overwrite that day's count.
- **Role history charts.** `/history` turns the saved counts into a line chart, with the current, minimum and maximum counts and the change over the chosen period.
- **Channel role breakdown.** `/channelroles` shows which roles the people who can see a channel have, as percentage bars.
- **Multiple languages.** Replies follow the user's Discord language. Supported: English (`en-GB`), French (`fr`) and German (`de`). Any other language falls back to English. Translations are in [src/locales/](src/locales/).
- **Terms of Service prompt.** The first time someone uses a command, the bot asks them to accept the [privacy policy](privacy.md) with a button. Nothing else runs for that user until they accept.
- **Cooldowns.** Each command has a per-user cooldown (3 seconds unless stated otherwise below). Bot developers are exempt.
- **Feedback form.** `/feedback` opens a form, and the bot posts what the user writes to a feedback channel.

---

## Commands

### Utility

| Command | Description | Where | Cooldown |
|---|---|---|---|
| `/help [command]` | Lists all commands by category, with links to Discord, the website and GitHub. Give a command name to see its description, cooldown, category and usage. | Anywhere | 3 s |
| `/info` | Shows the project description, version, developer and contributors. | Anywhere | 3 s |
| `/roles` | Lists every role on the server with its member count and sends the list as `rolelist.txt`. It also saves today's counts to the database right away. | Servers only | 3 s |
| `/history role <role> [period]` | Draws a chart of a role's member count over time. `period` can be 7 days, 30 days (default), 90 days, 1 year, or All. Shows the current, min/max and change (absolute and %). Days with no saved count are skipped. | Servers only | 3 s |
| `/channelroles [channel] [role1] [role2] [role3]` | Counts which roles the (non-bot) members who can see a channel have. Defaults to the current channel. With `role1`–`role3`, only members who have **all** of those roles are counted. Shows the top 25 roles; `@everyone` and bot-managed roles are ignored. | Servers only | 10 s |
| `/feedback` | Opens a form for sending feedback to the developers. | Anywhere | 30 s |

### Custom commands (Union des Rôlistes)

These commands are specific to the Union des Rôlistes server and reply in French.

| Command | Description |
|---|---|
| `/calendrier` | Sends a button linking to the community calendar ([planning.unionrolistes.fr](http://planning.unionrolistes.fr/Calendar)). |
| `/jdr` | Sends a private link for creating a new game session. |
| `/presentation` | Sends a private link to the form where new members introduce themselves. |

---

## Requirements

- **Node.js 20.19 or newer** (due to Mongoose 9 requiring it). Check with `node -v`.
- **A MongoDB database**, either local or hosted (for example MongoDB Atlas).
- **A Discord application with a bot user.** Create one in the [Discord Developer Portal](https://discord.com/developers/applications).

### Discord application setup

1. In the Developer Portal, open your application → **Bot** and copy the **token**.
2. On the same page, under **Privileged Gateway Intents**, turn on all three:
   - Presence Intent
   - Server Members Intent (needed for member counts and `/channelroles`)
   - Message Content Intent
3. Copy the **Application ID** from **General Information**.
4. Invite the bot with the `bot` and `applications.commands` scopes.

---

## Installation

```bash
git clone https://github.com/UnionRolistes/Bot-Roles.git
cd Bot-Roles
npm install
```

### Configuration

Run the setup script. It asks for your settings and writes them to a `.env` file:

```bash
node install.js
```

You can copy [.env.example](.env.example) to `.env` and fill it in yourself:

```env
# Discord Parameters
discord_bot_token=YOUR_APP_TOKEN

# Database
mongo_url=mongodb://localhost:27017
dbName=bot-roles

# Development Parameters
applicationId=YOUR_APPLICATION_ID
guildId=YOUR_TEST_SERVER_ID

# Custom Commands
jdr_url=http://planning.unionrolistes.fr/?webhook=YOUR_WEBHOOK_URL
presentation_url=http://presentation.unionrolistes.fr/?webhook=YOUR_WEBHOOK_URL
```

| Variable | Description |
|---|---|
| `discord_bot_token` | The bot token from the Developer Portal. **Keep it secret.** |
| `mongo_url` | MongoDB connection string. |
| `dbName` | Name of the database to use. |
| `applicationId` | The application (client) ID of the bot. |
| `guildId` | A test server. Commands are registered there too, so they show up immediately instead of waiting for global registration. |
| `jdr_url` | Link sent by `/jdr` for creating a game session (planning site with its Discord webhook). |
| `presentation_url` | Link sent by `/presentation` for the introduction form (presentation site with its Discord webhook). |


### Keeping it online with PM2

[PM2](https://pm2.keymetrics.io/) restarts the bot if it crashes and keeps it running in the background:

```bash
npm install -g pm2
pm2 start index.js --name bot-roles
pm2 save
```

Useful commands:

```bash
pm2 status              # list processes
pm2 logs bot-roles      # show logs
pm2 restart bot-roles   # restart after an update
pm2 stop bot-roles      # stop the bot
```

### Updating

```bash
cd Bot-Roles
git pull
npm install
pm2 restart bot-roles
```

---

## Project structure

```
Bot-Roles/
├── index.js                 # Entry point: creates the client, starts the role updater, logs in
├── install.js               # Interactive setup that writes the .env file
├── privacy.md               # Privacy policy / Terms of Service
├── Changelog.txt
├── src/
│   ├── commands/
│   │   ├── Utility/         # help, info, roles, history, channelroles, feedback
│   │   └── Custom Commands/ # calendrier, jdr, presentation
│   ├── events/              # ready, interactionCreate
│   ├── locales/             # en-GB.json, fr.json, de.json
│   ├── modules/             # RoleUpdater (hourly job), DBManager, Logger
│   ├── Schema/              # Mongoose models: Role, User
│   └── structures/          # Client, Command, CommandHandler, EventHandler
└── old_code/                # The previous version of the bot (no longer used)
```

### Adding a command

Create a file in a folder under `src/commands/`. The folder name becomes the command's category in `/help`. The class extends [Command](src/structures/Command.js):

```js
const Command = require('../../structures/Command');
const { ApplicationCommandType } = require('discord.js');

class Ping extends Command {
	constructor(client) {
		super({
			name: 'ping',
			description: 'Replies with pong.',
			category: 'Utility',
			cooldown: 3,
			enabled: true, // disabled commands are neither loaded nor registered
			ownerOnly: false,
			type: ApplicationCommandType.ChatInput,
			slashOptions: [],
		});
		this.client = client;
	}

	async execute(client, interaction, language) {
		await interaction.reply('Pong!');
	}
}

module.exports = Ping;
```

Restart the bot and the command is registered automatically. For translated text, add keys to every file in [src/locales/](src/locales/) and read them from the `language` argument.

### Data stored

- **Role** — role ID, server ID, and a `history` list of `{ date, count }` entries (one per day). Only counts are stored, never lists of members.
- **User** — Discord user ID and whether they accepted the Terms of Service.

See [privacy.md](privacy.md) for the full privacy policy.

---

## Links

- Website: [unionrolistes.fr](http://unionrolistes.fr/)
- Discord: [discord.gg/rxqqBS8](https://discord.gg/rxqqBS8)
- GitHub: [github.com/UnionRolistes](https://github.com/UnionRolistes)
- Issues: [Bot-Roles/issues](https://github.com/UnionRolistes/Bot-Roles/issues)

## License

ISC
