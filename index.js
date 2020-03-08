const Discord = require('discord.js');
const bot = new Discord.Client();

require('dotenv-flow').config();
const { version } = require('./package.json');
const typing = require('./typing.js');

bot.on('ready', () => {
	console.log(`Logged in as ${bot.user.tag}!`);
	const defchan = bot.channels.get(process.env.DEFAULT_CHANNEL_ID);

	const testembed = new Discord.RichEmbed()
		.setTitle(`**MinesweeperBot** [v${version}]`)
		.setColor(0x55ccff)
		.addField('Owner my Lord:', `<@!${process.env.OWNER_ID}>`)
		.addField('Last update:', 'Reworked the way errors work and fixed tons of problems that came with it')
		.setFooter(`I am now ON.`);

	typing(defchan, testembed)
	.then(() => bot.user.setActivity('Minesweeper 🚩', {type: 'PLAYING'}));
});

const StringTypeManager = require('./cli_modules/StringTypeManager.js');
const CommandManager = require('./cli_modules/CommandManager.js');
const Command = require('./cli_modules/Command.js');

const simple = require('./commands/simple.js');
const minesweeping = require('./commands/minesweeping.js');

const commands = [...simple]
	.concat([...minesweeping])
	.concat(new Command('help', {'command': 'word'},
		{'optional': ['command']},
		(args) => {
			typing(args.CHANNEL, 'Command `help` not implemented yet.');
		}));

console.log('Commands:'+commands.map(command => ' '+command.name));

const STM = new StringTypeManager({
	'any': /.+/s,
	'string': /"((.*?)[^\\])?"/,
	'word': /\w+/,
	'uint': /\d+/,
	'int': /[-+]?\d+/,
	'position': /[xX][\da-f]{2}/,
	'list[position]': /([xX][\da-f]{2}\s+)?[xX][\da-f]{2}/
})

const CM = new CommandManager(bot, process.env.PREFIX, STM, commands);

bot.on('message', msg => {
	// Continue only if the msg begins with the prefix
	if (!CM.interpret(msg)) {
		typing(msg.channel, CM.ERROR);
	}
});

bot.login(process.env.TOKEN);