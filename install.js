const { input, password } = require("@inquirer/prompts");

const fs = require('fs');

async function main() {
    console.log('-----------------------------------------');
    const token = await input({
        message: "Enter your auth-token from discord.com/developer/applications 🔑:",
        mask: false, 
        validate(value) {
            return value.length > 0 || "Please enter your valid token!";
        }
    });
        const mongoUrl = await input({
        message: "Enter the mongo DB url:"
    });
        const dbName = await input({
        message: "Enter the database name:"
    });
    const clientId = await input({
        message: "Enter the Client ID of the bot application:"
    });
    const guildId = await input({
        message: "Enter a  Guild ID for quick deployment of new slash commands:"
    });

    const envContent = `
# Discord Parameters
    discord_bot_token=${token}
    
# Database
    mongo_url=${mongoUrl}
    dbName=${dbName}

# Development Parameters
    clientId=${clientId}
    guildId=${guildId}
    `;

    fs.writeFileSync(".env", envContent, "utf8");
    console.log('-----------------------------------------');
    console.log('Configuration has been written.');
}

    
main();