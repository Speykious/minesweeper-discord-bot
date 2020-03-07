const Discord = require('discord.js');
const Command = require('../cli_modules/Command.js');
const typing = require('../typing.js');
const minesweeper = require('./minesweeper.js');

module.exports = [
	new Command('show', {'ui': 'word'},
		{'required': ['ui']},
		args => {
			switch(args['ui']) {
				case 'board':
					const board = new Discord.RichEmbed()
						.setTitle('Minesweeper Board')
						.addField(`Size: ${minesweeper.board[0].length}x${minesweeper.board.length}`, minesweeper.textBoard)
						.setFooter('⚠WARNING⚠: you cannot play with it yet.');
					
					typing(args.CHANNEL, board)
					.then(() => minesweeper.lastBoardMessage = args.CHANNEL.lastMessage);
					break;
				default:
					typing(args.CHANNEL, `Sorry, I don't know any kind of \`${args['ui']}\`.`);
					break;
			}
		})
]