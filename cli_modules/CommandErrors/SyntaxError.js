const Discord = require('discord.js');
const Command = require('../Command.js');
const CommandError = require('./CommandError.js');

/**
 * A CommandError that notifies about a command syntax that wasn't fulfilled properly.
 */
class SyntaxError extends CommandError {
	/**
	 * Creates a SyntaxError object.
	 * @param {Discord.Message} origin The message the error comes from.
	 * @param {Command} command The command of which the syntax wasn't fulfilled.
	 * @param {string} argname The name of the first argument that didn't match.
	 */
	constructor(origin, arglist, syntax, argname) {
		super('Syntax', 'The syntax is invalid.', origin, [
			{name: 'First argument not matching', value: `\`${argname} (${arglist[argname]})\``},
			{name: 'Syntax of the command', value: `\`${syntax}\``}
		]);
	}
}

module.exports = SyntaxError;