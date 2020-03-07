const Discord = require('discord.js');
const Command = require('../cli_modules/Command.js');
const typing = require('../typing.js');
const minesweeper = require('./minesweeper.js');

function showTrigger(x, y) {
	if (x < minesweeper.board[0].length && y < minesweeper.board.length) {
		switch (minesweeper.hiddens[y][x]) {
			case 'h':
				minesweeper.hiddens[y] = minesweeper.hiddens[y].substring(0, x)
								+ 's' + minesweeper.hiddens[y].substring(x + 1);
				break;
			case 's':
				minesweeper.hiddens[y] = minesweeper.hiddens[y].substring(0, x)
								+ 'h' + minesweeper.hiddens[y].substring(x + 1);
		}
	} else typing(args.CHANNEL, `**Error**: position (${x}, ${y}) out of range`);
}


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
		}),
	
	new Command('t', {'coords': 'position'},
		{'required': ['coords']},
		args => {
			const hexstr = '0123456789abcdef';
			const x = hexstr.indexOf(args['coords'][2]);
			const y = hexstr.indexOf(args['coords'][3]);
			showTrigger(x, y);
		})
]