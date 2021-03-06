const Discord = require('discord.js');
const bot = new Discord.Client();

require('dotenv-flow').config();
const { version } = require('./package.json');
const typing = require('./typing.js');

bot.on('ready', () => {
	console.log(`Logged in as ${bot.user.tag}!`);
	const defchan = bot.channels.get(process.env.DEFAULT_CHANNEL_ID);
	console.log(bot.guilds);
	const testembed = new Discord.RichEmbed()
		.setTitle(`**MinesweeperBot** [v${version}]`)
		.setColor(0x55ccff)
		.addField('Owner my Lord', `<@!${process.env.OWNER_ID}>`)
		.addField('Last update', 'Implemented minesweeper, with win and lose features and actually working commands'
								+ '\n... I think')
		.setFooter(`I am now ON.`);

	typing(defchan, testembed)
	.then(() => bot.user.setActivity('Minesweeper 🚩', {type: 'PLAYING'}));
});

const StringTypeManager = require('./cli_modules/StringTypeManager.js');
const CommandManager = require('./cli_modules/CommandManager.js');
const ExistentialCrisisError = require('./cli_modules/CommandErrors/ExistentialCrisisError.js');
const Command = require('./cli_modules/Command.js');

const simple = require('./commands/simple.js');
const minesweeping = require('./commands/minesweeping.js');

const commands = [...simple]
	.concat([...minesweeping])
	.concat(new Command('help', 'Helps you to type commands to interact with me.',
		{'command': 'word'}, {'optional': ['command']}));

commands[commands.length-1].run = (args) => {
	if (args['command']) {
		const command = commands.filter(command => command.name === args['command'])[0];
		if (command) {
			const helpcmd = new Discord.RichEmbed()
				.setColor(0x3280ff)
				.setTitle(`Command Help: \`${command.name}\``)
				.setDescription(command.description)
				.addField('Syntax', `\`${command.syntaxString}\``)
				.setFooter(`MinesweeperBot [v${version}]`);
			typing(args.CHANNEL, helpcmd);
		} else return new ExistentialCrisisError(args.CHANNEL.lastMessage, args['command']);
		
	} else {
		const helplist = new Discord.RichEmbed()
			.setColor(0x3264ff)
			.setTitle('Command List')
			.setDescription(
				commands.map(command => `\`${command.name}\`: ${command.description}`)
					.join('\n')
			)
			.setFooter(`MinesweeperBot [v${version}]`);
		typing(args.CHANNEL, helplist);
	}
}

const STM = new StringTypeManager({
	'any': /.+/s,
	'string': /"((.*?)[^\\])?"/,
	'word': /\w+/,
	'uint': /\d+/,
	'int': /[-+]?\d+/,
	'position': /[xX][\da-f]{2}/,
	'list[position]': /([xX][\da-f]{2}\s+)?[xX][\da-f]{2}/
})

const CM = new CommandManager(bot, STM, commands);

bot.on('message', msg => {
	// Continue only if the msg begins with the prefix
	if (!CM.interpret(msg, process.env.PREFIX)) {
		typing(msg.channel, CM.ERROR);
	}
});

bot.login(process.env.TOKEN);