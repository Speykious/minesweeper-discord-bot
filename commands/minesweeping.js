const Discord = require('discord.js');
const Command = require('../cli_modules/Command.js');
const typing = require('../typing.js');
const minesweeper = require('./minesweeper.js');

function showCell(x, y) {
	if (x < minesweeper.board[0].length && y < minesweeper.board.length) {
		switch(minesweeper.hiddens[y][x]) {
			case 'h':
				minesweeper.hiddens[y] = minesweeper.hiddens[y].substring(0, x)
								+ 's' + minesweeper.hiddens[y].substring(x + 1);
				break;
			case 'f':
				typing(args.CHANNEL, `**Error**: cell (${x}, ${y}) flagged`);
				break;
		}
	} else typing(args.CHANNEL, `**Error**: position (${x}, ${y}) out of range`);
}

function flagTrigger(x, y) {
	if (x < minesweeper.board[0].length && y < minesweeper.board.length) {
		switch(minesweeper.hiddens[y][x]) {
			case 'h':
				minesweeper.hiddens[y] = minesweeper.hiddens[y].substring(0, x)
								+ 'f' + minesweeper.hiddens[y].substring(x + 1);
				break;
			case 'f':
				minesweeper.hiddens[y] = minesweeper.hiddens[y].substring(0, x)
								+ 'h' + minesweeper.hiddens[y].substring(x + 1);
				break;
		}
	} else typing(args.CHANNEL, `**Error**: position (${x}, ${y}) out of range`);
}


module.exports = [
	new Command('show', {'ui': 'word'},
		{'required': ['ui']},
		args => {
			switch(args['ui']) {
				case 'board':
					typing(args.CHANNEL, minesweeper.embedBoard)
					.then(message => minesweeper.lastBoardMessage = message);
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
			showCell(x, y);
			args.CHANNEL.lastMessage.delete();
			minesweeper.lastBoardMessage.edit(minesweeper.embedBoard);
		}),
	
	new Command('f', {'coords': 'position'},
		{'required': ['coords']},
		args => {
			const hexstr = '0123456789abcdef';
			const x = hexstr.indexOf(args['coords'][2]);
			const y = hexstr.indexOf(args['coords'][3]);
			flagTrigger(x, y);
			args.CHANNEL.lastMessage.delete();
			minesweeper.lastBoardMessage.edit(minesweeper.embedBoard);
		})
]