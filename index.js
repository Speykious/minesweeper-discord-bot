const Discord = require('discord.js');
const bot = new Discord.Client();

const { StringTypeManager, Command, CommandManager } = require('./commandManager.js');
const minesweeper = require('./minesweeper.js');
const settings = require('./settings.json');

const testembed = new Discord.RichEmbed()
	.setAuthor('Speykious')
	.setColor(0x55ccff)
	.setDescription(minesweeper.textBoard)
	.setFooter('Sorry, this is just a test.');

bot.on('ready', () => {
	console.log(`Logged in as ${bot.user.tag}!`);
	const defchid = '682003578839498863';
	const defchan = bot.channels.get(defchid);
	defchan.send('◻')
	.then(() => defchan.send(testembed));
});

const STM = new StringTypeManager({
	'any': /.+/s,
	'string': /"(.+)?"/,
	'word': /\w+/,
	'uint': /\d+/,
	'int': /[-+]?\d+/,
	//'list': /\[.\]/, // that one seems pretty useless, but maybe it will be useful in the future.
	'position': /0[xX][\da-fA-F]{2}/
})

const { commands } = require('./commands.js');
const CM = new CommandManager(bot, settings.commandPrefix, STM, commands);

bot.on('message', msg => {
	// Continue only if the msg begins with the prefix
	if (!CM.interpret(msg)) {
		let E = '';
		const errorEmbed = new Discord.RichEmbed()
			.setColor(0xff3248)
			.setTitle('**Error**')
			.setDescription(CM.ERROR);
		msg.channel.send(errorEmbed);
	}
});

bot.login(settings.token);