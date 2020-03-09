const Discord = require('discord.js');

let board = [...Array(16)].map((_, i) => '0'.repeat(12));
let hiddens = [...Array(16)].map((_, i) => 'h'.repeat(12));
let lastBoardMessage = undefined;
const boardEmos = {
	'm': '💥',
	'0': '🆓',
	'1': '1️⃣',
	'2': '2️⃣',
	'3': '3️⃣',
	'4': '4️⃣',
	'5': '5️⃣',
	'6': '6️⃣',
	'7': '7️⃣',
	'8': '8️⃣'
}
const hiddensEmos = {
	'h': '◻',
	'f': '🚩'
}

module.exports = {
	board, hiddens,
	lastBoardMessage,
	boardEmos, hiddensEmos,

	/**
	 * The board as an array of emojis.
	 */
	get textBoard() {
		return this.board
			.map((row, j) => [...row]
				.map((char, i) => {
					console.log(`${char} (${i}, ${j}) -> h=${this.hiddens[j][i]}, b=${this.boardEmos[char]}`);
					return (this.hiddens[j][i] === 'h' || this.hiddens[j][i] === 'f') ?
					this.hiddensEmos[this.hiddens[j][i]] : this.boardEmos[char];
				})
				.join('')
			).join('\n');
	},
	
	/**
	 * The RichEmbed object containing the board and various other informations.
	 */
	get embedBoard() {
		return new Discord.RichEmbed()
			.setColor(0xff6416)
			.setTitle('Minesweeper Board')
			.addField(`Size: ${this.board[0].length}x${this.board.length}`, this.textBoard)
			.setFooter('⚠WARNING⚠: you cannot play with it yet.');
			
	},

	newBoard(size) {
		this.board = [...Array(size)].map((_, i) => ' '.repeat(size));
		console.log(this.board);
	}
}