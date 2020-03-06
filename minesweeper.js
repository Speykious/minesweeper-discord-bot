let board = [...Array(8)].map((_, i) => ' '.repeat(8));

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
	emos,

	/**
	 * To get the string of the board
	 * @param {Array<string>} b The board
	 */
	get textBoard() {
		return this.board
		.map(row => [...row]
			.map(char => emos[char])
			.join('')
		).join('\n');
	},

	newBoard(size) {
		this.board = [...Array(size)].map((_, i) => ' '.repeat(size));
		console.log(board);
	}
}