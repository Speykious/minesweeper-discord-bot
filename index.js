const Discord = require('discord.js');
const bot = new Discord.Client();

require('dotenv-flow').config();
const { version } = require('./package.json');

bot.on('ready', () => {
	console.log(`Logged in as ${bot.user.tag}!`);
	const defchan = bot.channels.get(process.env.DEFAULT_CHANNEL_ID);
	defchan.startTyping();
	const testembed = new Discord.RichEmbed()
		.setTitle(`**MinesweeperBot** [v${version}]`)
		.setColor(0x55ccff)
		.addField('Owner my Lord:', `<@!${process.env.OWNER_ID}>`)
		.addField('Last update:', 'Deployed myself on Heroku')
		.setFooter(`I am now ON.`);

	defchan.send(testembed)
	.then(() => defchan.stopTyping(true))
	.then(() => bot.user.setActivity('Minesweeper 🚩', { type: 'PLAYING' }));
});

const StringTypeManager = require('./cli_modules/StringTypeManager.js');
const CommandManager = require('./cli_modules/CommandManager.js');

const simple = require('./commands/simple.js');

const commands = simple;
commands += new Command('help', {'command': 'word'},
	{'optional': ['command']},
	(args) => {
		args.CHANNEL.send('Command `help` not implemented yet.');
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

const CM = new CommandManager(bot, process.env.PREFIX, STM, commands);

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

bot.login(process.env.TOKEN);