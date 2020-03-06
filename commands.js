const Discord = require('discord.js');
const { Command } = require('./commandManager.js');

const commands = [
	new Command('help',
		{'command': 'word'},
		{'optional': ['command']},
		(args) => {
			args.CHANNEL.send('Command `help` not implemented yet.');
		}),

	new Command('incode',
		{'anything': 'any'},
		{'required': ['anything']},
		args => {
			args.CHANNEL.send(`Content: \`${args['anything']}\``);
		}),

	new Command('stop', {}, {},
		args => {
			args.CHANNEL.send(':boom:');
			args.BOT.destroy();
		}),

	new Command('ping', {}, {},
		args => {
			args.CHANNEL.send('pong');
		})
]

module.exports = commands;

/*////
if (msg.content.substring(0, 5) === 'embed') {
		
	if (msg.content.length > 5) minesweeper.newBoard(parseInt(msg.content.substring(6)));
	console.log(minesweeper.board);
	testembed.setDescription(minesweeper.textBoard);
	
	msg.channel.send(testembed)
	.then(() => msg.channel.send(`ID of the embed message: \`<${msg.channel.lastMessageID}>\``));
}


////*/