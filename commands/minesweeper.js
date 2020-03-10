const Discord = require('discord.js');

/**
 * An object that contains the main properties of a cell in a Minesweeper game.
 */
class MCell {
	/**
	 * Creates an MCell object.
	 * @param {boolean} mine If the cell is a mine.
	 * @param {boolean} hidden If the cell is hidden.
	 * @param {boolean} flagged If the cell is flagged.
	 */
	constructor(mine, hidden = true, flagged = false) {
		this.mine = mine;
		this.hidden = hidden;
		this.flagged = flagged;
	}
}

/**
 * An class that implements the main functions of the Minesweeper game.
 * @property {{mine: string, hidden: string, flagged: string, numbers: string[]}} emojis The emojis corresponding to the states of the cells.
 * @property {number} width The number of cells in a row.
 * @property {number} height The number of cells in a column.
 * @property {boolean} playing Whether the game is currently played.
 * @property {boolean} win Whether the game was won.
 * @property {MCell[][]} board The array of cells, the board of the game.
 * @property {Discord.Message} lastBoardMessage The last message containing a shown board.
 */
class Minesweeper {
	/**
	 * Creates a Minesweeper object.
	 * @param {{mine: string, hidden: string, flagged: string, numbers: string[]}} emojis The emojis corresponding to the states of the cells.
	 * @param {number} width The number of cells in a row.
	 * @param {number} height The number of cells in a column.
	 */
	constructor(emojis, width = 8, height = 8) {
		this.emojis = emojis;
		this.width = width;
		this.height = height;
		this.playing = true;
		this.win = false;
		this.board = [...Array(width)]
			.map(el => [...Array(height)]
			.map(el => new MCell(false)));
		this.lastBoardMessage = undefined;
	}

	/**
	 * Reveals the cell at [x][y], and more cells if it doesn't have any mines arround it.
	 * @param {number} x The x coordinate of the cell.
	 * @param {number} y The y coordinate of the cell.
	 * @param {boolean} revealMine Whether we want to reveal the cell if it is a mine.
	 */
	reveal(x, y, revealMine = true) {
		let cell = this.getCell(x, y);
		if (cell) {
			if (cell.mine && revealMine) {
				console.log('m');
				return 'mine';
			} 
			else if (cell.flagged) {
				console.log('f');
				return 'flagged';
			}
			else if (cell.hidden) {
				console.log('h');
				cell.hidden = false;
				if (this.neighbombs(x, y) == 0) {
					for (let i = x-1; i <= x+1; i++) {
						for (let j = y-1; j <= y+1; j++) {
							if (this.getCell(i, j) && !(i == x && j == y))
								this.reveal(i, j, false);
						}
					}
				}
				return 'revealed';
			} else {
				console.log('u');
				return 'unchanged';
			}
		} else return undefined;
	}

	/**
	 * Triggers the 'flagged' state of a cell.
	 * @param {number} x The x coordinate of the cell.
	 * @param {number} y The y coordinate of the cell.
	 */
	flagTrigger(x, y) {
		let cell = this.getCell(x, y);
		if (cell) cell.flagged = !cell.flagged;
	}

	/**
	 * Reveals all the mines of the board.
	 */
	revealMines() {
		this.board
			.forEach(col => col
				.forEach(cell => {
					if (cell.mine) cell.hidden = false;
				}));
	}

	/**
	 * Gets the cell at [x][y].
	 * @param {number} x The x coordinate of the cell.
	 * @param {number} y The y coordinate of the cell.
	 */
	getCell(x, y) {
		if (x >= 0 && x < this.width && y >= 0 && y < this.height)
			return this.board[x][y];
		else return undefined;
	}

	/**
	 * Gets the number of mines arround the cell at [x][y].
	 * @param {number} x The x coordinate of the cell.
	 * @param {number} y The y coordinate of the cell.
	 */
	neighbombs(x, y) {
		let n = 0;
		for (let i = x-1; i <= x+1; i++) {
			for (let j = y-1; j <= y+1; j++) {
				let cell = this.getCell(i, j);
				if (cell) if (cell.mine) n++;
			}
		}
		return n;
	}

	/**
	 * The board as an array of emojis.
	 */
	get emojiray() {
		let text = '';
		console.log(this.emojis);
		for (let y = 0; y<this.height; y++) {
			if (y != 0) text += '\n';
			for (let x = 0; x<this.width; x++) {
				const cell = this.getCell(x, y);
				if (cell) {
					if		(cell.flagged)	text += this.emojis.flagged;
					else if	(cell.hidden)	text += this.emojis.hidden;
					else if	(cell.mine)		text += this.emojis.mine;
					else					text += this.emojis.numbers[this.neighbombs(x, y)];
				} else text += '❓';
				
			}
			console.log(text);
			console.log('');
		}
		return text;
	}

	/**
	 * The RichEmbed showing the board as an array of emojis.
	 */
	get embedBoard() {
		const embed = new Discord.RichEmbed()
			.setColor(0xff6416)
			.setTitle('Minesweeper Board')
			.addField(`Size: ${this.width}x${this.height}`, this.emojiray)
			.setFooter('I wonder if everything is fine. 🤔');
		if (!this.playing) {
			if (this.win) embed.setDescription('You win!');
			else embed.setDescription('You lose!');
		}
		return embed;
	}
}

module.exports = Minesweeper;