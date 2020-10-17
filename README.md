# L-Union-des-R-listes
private discord bot for L'Union des Rôlistes

# Installation
1. You need node installed on your system, detailled instructions for different operating systems can be found [here](https://nodejs.org/en/download/).

2. Check your node version with ```node -v``` . Node.js 12.0.0 or newer is required.

-----------------------------------------
### Only For Dae#5125
-----------------------------------------
```
cd /usr/local/src/
sudo rm -rfv ./rolelistbot
sudo git clone https://github.com/Myst82015/L-Union-des-R-listes BotRolesList
cd ./BotRolesList
sudo npm install
```

Before setting up the "real" bot you must check some things:
 - You need a so called token for your bot. You need it later.
 -> How to obtain the token? Create an [application](https://discord.com/developers/applications) and follow the steps below:
 ![Bot](https://github.com/Myst82015/L-Union-des-R-listes/blob/main/assets/Screenshot_1.png)
 Now navigate to "Bot"
 ![Obtain the token](https://github.com/Myst82015/L-Union-des-R-listes/blob/main/assets/obtain_the_token%20-%20Kopie.jpg)
 And click "Copy"
- Since Discord restricted the access to specific user data, you need to enable the so called Privileged Gateway Intents. To so, scroll down and enable both of them

![Intents](https://github.com/Myst82015/L-Union-des-R-listes/blob/main/assets/PrivelegedGatewayIntents.png)
- A suitable prefix. There is no sense in choosing one which another bot already utilises. So choose a unique one.

5. Execute ```sudo npm run install``` to create a configuration file **before** the first startup of the bot.
- prefix : This will be the prefix for which the bot will listen(I suggest $).
- token : Token which you obtained earlier.
- intents : **Don't touch the next options!** If you're interested why check out this [discord post](https://blog.discord.com/the-future-of-bots-on-discord-4e6e050ab52e).
 
6. Run the bot ```node index.js```.



-----------------------------------------
## Keeping it online with PM2
-----------------------------------------
PM2 is an advanced, production process manager for Node.JS.

[The Documentation can be found here.](https://pm2.keymetrics.io/)

Install it globally: 
```js
sudo npm install pm2@latest -g
```
Now navigate to the folder with the bot. ( cd /.....)
```js
 pm2 start index.js
```
You can also specify more options:

```js
# Specify an app name
--name <app_name>

# Watch and Restart app when files change
--watch

# Set memory threshold for app reload
--max-memory-restart <200MB>

# Specify log file
--log <log_path>

# Pass extra arguments to the script
-- arg1 arg2 arg3

# Delay between automatic restarts
--restart-delay <delay in ms>

# Prefix logs with time
--time

# Do not auto restart app
--no-autorestart

# Specify cron for forced restart
--cron <cron_pattern>

# Attach to application log
--no-daemon

```
Now everything is done! Check the status of pm2 with
```js
$ pm2 status
```
-----------------------------------------
Managing processes

Managing application state is simple here are the commands:
```js
pm2 restart app_name
pm2 reload app_name
pm2 stop app_name
pm2 delete app_name

```

Instead of app_name you can pass:

- all to act on all processes
- id to act on a specific process id
-----------------------------------------


For more informations check the documentation -> https://pm2.keymetrics.io/ and the quickstart guide -> https://pm2.keymetrics.io/docs/usage/quick-start/

-----------------------------------------
# Updating the code
-----------------------------------------
First of all we have to stop the process manager pm2
Execute: ```pm2 status``` to get the id or the name of your app
(Since we only have one here, the id should 0 and the name should be index)

Now stop the process with ```pm2 stop (name/id)```
in this case -> ```pm2 stop index```

Now update the code in the respective folder via Git.
go into the folder: cd....
```git clone https://github.com/Myst82015/L-Union-des-R-listes.git```

Then ```npm run install```

-----------------------------------------
Update on 16.10.2020: IMPORTANT: To fix the problems with the incorrect membercounts go to setup guide above and check the intents (below point 4). Then regenerate the config ```npm run install```( in the folder where the code is in), don't change anything at the preselected intents!
-----------------------------------------

You're nearly done!

Navigate in the folder with the bot (cd ./....)
and daemonize it with pm2
```pm2 start index.js```

Finally check the status of the process with ```pm2 status```.


# BROKEN -> DON'T USE IT
-----------------------------------------
## Keeping it online with systemd and systemctrl
-----------------------------------------


```js
sudo nano /lib/systemd/system/rolelist.service
```
(rolelist will be the name of the service)

and copy that inside this new file

```[Unit]
Description=rolelist discord bot for unionrolistes.fr
Requires=network-online.target
After=network-online.target

[Service]
Type=simple
ExecStart=/usr/local/src/BotRoles/index.js start
ExecStop=/usr/local/src/BotRoles/index.stop stop
Restart=always
RestartSec=5s

[Install]
WantedBy=multi-user.target
```


Next step: ```sudo systemctl daemon-reload```

Then: ```sudo systemctl start rolelist```

Done.

### Useful commands
```sudo systemctl status rolelist```

Now, if you want to stop your app, the command is simply

```sudo systemctl stop rolelist```

and unsurprisingly, the following will restart things for us

```sudo systemctl restart rolelist```

If you want to make the application start up when the machine boots, you accomplish that by enabling it

```sudo systemtl enable rolelist```

and finally, if you previously enabled the app, but you change your mind and want to stop it from coming up when the machine starts, you correspondingly disable it

```sudo systemctl disable rolelist```

Reference: https://nodesource.com/blog/running-your-node-js-app-with-systemd-part-1



-----------------------------------------
## Keeping it online with PM2
-----------------------------------------
Advanced, production process manager for Node.JS
This is another daemon to keep the project running.
[Documentation](https://pm2.keymetrics.io/)

#OLD don't USE
```
[Unit]
Description=rolelist discord bot
Documentation=https://example.com
After=network.target

[Service]
Environment=NODE_PORT=3001
Type=simple
User=ubuntu
ExecStart=/usr/local/node /home/ubuntu/hello_env.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

