const Discord = require('discord.js');
const CommandError = require('./CommandError.js');

/**
 * A CommandError that notifies about a command that was passed too many arguments.
 */
class TooManyArgsError extends CommandError {
	/**
	 * Creates a TooManyArgsError object.
	 * @param {Discord.Message} origin The message the error comes from.
	 * @param {string} syntax The syntax of the command of which the syntax wasn't fulfilled.
	 * @param {string} remaining The remaining arguments that don't fit the syntax.
	 */
	constructor(origin, syntax, remaining) {
		return super('Argument', 'Too many arguments.', origin, [
			{name: 'Arguments remaining', value: `\`${remaining}\``},
			{name: 'Syntax of the command', value: `\`${syntax}\``}
		]);
	}
}

module.exports = TooManyArgsError;