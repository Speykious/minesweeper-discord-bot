const Discord = require('discord.js');
const Command = require('../cli_modules/Command.js');
const CommandError = require('../cli_modules/CommandErrors/CommandError.js');
const typing = require('../typing.js');
const Minesweeper = require('./minesweeper.js');

class PositionError extends CommandError {
	/**
	 * Creates a PositionError object.
	 * @param {Discord.Message} origin The message the error comes from.
	 * @param {Minesweeper} game The game the error comes from.
	 */
	constructor(origin, game) {
		super('Position', 'The position given is out of range.', origin, [
			{name: 'Size of the board', value: `${game.width}x${game.height}`}
		])
	}
}

const minesweeper = new Minesweeper({
	mine: '💥', hidden: '◻', flagged: '🚩',
	numbers: '🆓1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣8️⃣'
})

module.exports = [
	new Command('show', 'Shows various minesweeper data, such as the board, or... the board.',
		{'ui': 'word'}, {'required': ['ui']},
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
	
	new Command('t', 'Reveals a minesweeper cell of the grid. If you touch a mine, you lose.',
		{'coords': 'position'}, {'required': ['coords']},
		args => {
			const hexstr = '0123456789abcdef';
			const x = hexstr.indexOf(args['coords'][1]);
			const y = hexstr.indexOf(args['coords'][2]);
			const message = args.CHANNEL.lastMessage;
			args.CHANNEL.lastMessage.delete();
			if (x < 0 || x >= minesweeper.width || y < 0 || y >= minesweeper.height)
				return new PositionError(message, minesweeper);
			
			const result = minesweeper.reveal(x, y);
			if (result === 'mine') minesweeper.playing = false;
			if (minesweeper.lastBoardMessage)
				minesweeper.lastBoardMessage.edit(minesweeper.embedBoard);
				
		}),
	
	new Command('f', 'Flags a minesweeper cell of the grid.',
		{'coords': 'position'}, {'required': ['coords']},
		args => {
			const hexstr = '0123456789abcdef';
			const x = hexstr.indexOf(args['coords'][1]);
			const y = hexstr.indexOf(args['coords'][2]);
			minesweeper.flagTrigger(x, y);
			args.CHANNEL.lastMessage.delete();
			if (minesweeper.lastBoardMessage)
				minesweeper.lastBoardMessage.edit(minesweeper.embedBoard);
		})
]