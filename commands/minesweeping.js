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

class DifficultyError extends CommandError {
	/**
	 * Creates a DifficultyError object.
	 * @param {Discord.Message} origin The message the error comes from.
	 * @param {string} difficulty The difficulty that doesn't exist.
	 */
	constructor(origin, difficulty) {
		super('Difficult Existential Crisis', 'The difficulty given doesn\'t exist.', origin, [
			{name: 'Difficulty given', value: `\`${difficulty}\``},
			{name: 'Difficulties available', value: '`beginner`, `intermediate`, or `expert`'}
		])
	}
}

let emojis = {
	mine: '💥', hidden: '◻', flagged: '🚩',
	numbers: ['🆓', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣']
}

let minesweeper = new Minesweeper(emojis);
	minesweeper.placeMines(10);

module.exports = [
	new Command('newboard', 'Creates a new board. Limit in width is 14, limit in height is 30.',
		{'difficulty': 'word'}, {'required': ['difficulty']},
		args => {
			switch (args['difficulty']) {
				case 'beginner':
					minesweeper = new Minesweeper(emojis, 8, 8).placeMines(10);
					break;
				case 'intermediate':
					minesweeper = new Minesweeper(emojis, 10, 12).placeMines(16);
					break;
				case 'expert':
					minesweeper = new Minesweeper(emojis, 12, 16).placeMines(25);
					break;
				default:
					return new DifficultyError(args.CHANNEL.lastMessage, args['difficulty']);
			}

			
		}),

	new Command('showboard', 'Shows various minesweeper data, such as the board, or... the board.',
		{}, {}, args => {
			minesweeper.addCommand(args.CHANNEL.lastMessage.content);
			typing(args.CHANNEL, minesweeper.embedBoard)
			.then(message => minesweeper.lastBoardMessage = message);
		}),
	
	new Command('t', 'Reveals a minesweeper cell of the grid. If you touch a mine, you lose.',
		{'coords': 'position'}, {'required': ['coords']},
		args => {
			const hexstr = '0123456789abcdef';
			const x = hexstr.indexOf(args['coords'][1]);
			const y = hexstr.indexOf(args['coords'][2]);
			const message = args.CHANNEL.lastMessage;
			minesweeper.addCommand(message.content);
			args.CHANNEL.lastMessage.delete();
			if (x < 0 || x >= minesweeper.width || y < 0 || y >= minesweeper.height)
				return new PositionError(message, minesweeper);
			
			const result = minesweeper.reveal(x, y);
			if (result === 'mine') {
				minesweeper.revealMines();
				minesweeper.playing = false;
			} else if (!minesweeper.remainsMinesUnflagged || !minesweeper.remainsHiddenCells) {
				minesweeper.revealMines();
				minesweeper.win = true;
				minesweeper.playing = false;
			}
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
			minesweeper.addCommand(args.CHANNEL.lastMessage.content);
			args.CHANNEL.lastMessage.delete();
			if (minesweeper.lastBoardMessage)
				minesweeper.lastBoardMessage.edit(minesweeper.embedBoard);
		})
]