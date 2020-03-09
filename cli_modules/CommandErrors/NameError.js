const Discord = require('discord.js');
const CommandError = require('./CommandError.js');

/**
 * A CommandError that notifies about trying to invoke a command that is not a word.
 */
class NameError extends CommandError {
	/**
	 * Creates a NameError object.
	 * @param {Discord.Message} origin The message the error comes from.
	 * @param {string} commandLine The command line containing the command that doesn't exist.
	 */
	constructor(origin, commandLine) {
		super('Name', 'The command is not a word.', origin,
		[{name: 'Command line', value: `\`${commandLine}\``}]);
	}
}

module.exports = NameError;