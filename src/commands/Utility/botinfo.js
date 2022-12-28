/* eslint-disable no-useless-escape */
const Command = require('../../structures/Command');
const {ApplicationCommandType } = require('discord.js');
const { version } = require('../../../package.json');



class Botinfo extends Command {
	constructor(client) {
		super({
			name: 'botinfo',
			description: 'Pong!',
			category: 'Utility',
			cooldown: 3,
			enabled: true,
			ownerOnly: false,
			guildOnly: true,

			type: ApplicationCommandType.ChatInput,
			defaultMemberPermissions: 'ManageRoles',
			slashOptions: [],

		});

		this.client = client;
	}

	async execute(client, interaction) {

		interaction.reply({ content:
		`\`\`\`asciidoc
Hello, World!
==============================
Projet:: Bot_Roles
Version:: ${version}
Developer:: Myst#4217
Contributors:: 
* Dae#5125
* dryas#5722 
* Tonitch#2192\`\`\`` });
		/*
Hello, World!
============
Author Name, <author@domain.foo>

you can write text http://example.com[with links], optionally
using an explicit link:http://example.com[link prefix].

* single quotes around a phrase place 'emphasis'
** alternatively, you can put underlines around a phrase to add _emphasis_
* astericks around a phrase make the text *bold*
* pluses around a phrase make it +monospaced+
* `smart' quotes using a leading backtick and trailing single quote
** use two of each for double ``smart'' quotes

- escape characters are supported
- you can escape a quote inside emphasized text like 'here\'s johnny!'

term:: definition
 another term:: another definition

// this is just a comment

Let's make a break.

'''

////
we'll be right with you

after this brief interruption.
////

== We're back!

Want to see a image::images/tiger.png[Tiger]?

.Nested highlighting
++++
<this_is inline="xml"></this_is>
++++

____
asciidoc is so powerful.
____

another quote:

[quote, Sir Arthur Conan Doyle, The Adventures of Sherlock Holmes]
____
When you have eliminated all which is impossible, then whatever remains, however improbable, must be the truth.
____

Getting Literal
---------------

 want to get literal? prefix a line with a space.

....
I'll join that party, too.
....

. one thing (yeah!)
. two thing `i can write code`, and `more` wipee!

NOTE: AsciiDoc is quite cool, you should try it.
		*/
	}
}

module.exports = Botinfo;