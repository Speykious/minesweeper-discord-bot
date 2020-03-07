const { RichEmbed } = require('discord.js');

let board = [...Array(16)].map((_, i) => ' '.repeat(12));
let lastBoardMessage = undefined;

const emos = {
	'm': '💥',
	' ': '◻',
	'0': ':free:',
	'1': '1️⃣',
	'2': '2️⃣',
	'3': '3️⃣',
	'4': '4️⃣',
	'5': '5️⃣',
	'6': '6️⃣',
	'7': '7️⃣',
	'8': '8️⃣',
	'f': ':triangular_flag_on_post:'
}

module.exports = {
	board,
	lastBoardMessage,
	emos,

	/**
	 * The board as an array of emojis.
	 */
	get textBoard() {
		return this.board
		.map(row => [...row]
			.map(char => emos[char])
			.join('')
		).join('\n');
	},
	
	/**
	 * The RichEmbed object containing the board and various other informations.
	 */
	get embedBoard() {
		return new Discord.RichEmbed()
			.setTitle('Minesweeper Board')
			.setColor(0xff3264)
			.addField(`Size: ${this.board[0].length}x${this.board.length}`, this.textBoard)
			.setFooter('⚠WARNING⚠: you cannot play with it yet.');
	},

	newBoard(size) {
		this.board = [...Array(size)].map((_, i) => ' '.repeat(size));
		console.log(board);
	}
}