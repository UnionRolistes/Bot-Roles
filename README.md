# L-Union-des-R-listes
private discord bot for L'Union des Rôlistes

# Installation
1. You need node installed on your system, detailled instructions for different operating systems can be found [here](https://nodejs.org/en/download/).

2. Check your node version with ```node -v``` . Node.js 12.0.0 or newer is required.
3. Go into the folder where you cloned the project. (cd....)
4. Install the packages with ```npm install```
5. Run ```npm run install``` to create a configuration file before the first startup of the bot.
- ownerID : Since it's a private bot, use 263022860551847936.
- prefix : This will be the prefix for which the bot will listen (Since it's private you choose $).
- token : Token for your [application](https://discord.com/developers/applications).
6. Run the bot ```node index.js```.

-----------------------------------------
## Keeping it online
-----------------------------------------
Dae wants to use systemd and systemctrl so here we go.

```js
sudo nano /lib/systemd/system/rolelist.service
```
and copy that inside this new file
```
[Unit]
Description=rolelist discord bot
Documentation=https://example.com
After=network.target

[Service]
Environment=NODE_PORT=3001
Type=simple
User=ubuntu
ExecStart=/usr/bin/node /home/ubuntu/hello_env.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
```
Next step: ```sudo systemctl daemon-reload```
Then: ```sudo systemctl start rolelist```

Done.

### Useful commands
sudo systemctl status hello_env

Now, if you want to stop your app, the command is simply

$ sudo systemctl stop hello_env

and unsurprisingly, the following will restart things for us

$ sudo systemctl restart hello_env

If you want to make the application start up when the machine boots, you accomplish that by enabling it

$ sudo systemtl enable hello_env

and finally, if you previously enabled the app, but you change your mind and want to stop it from coming up when the machine starts, you correspondingly disable it

$ sudo systemctl disable hello_env

Reference: https://nodesource.com/blog/running-your-node-js-app-with-systemd-part-1
