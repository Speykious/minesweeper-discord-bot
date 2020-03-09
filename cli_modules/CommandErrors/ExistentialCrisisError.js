const Discord = require('discord.js');
const CommandError = require('./CommandError.js');

/**
 * A CommandError that notifies about a command not existing.
 */
class ExistentialCrisisError extends CommandError {
	/**
	 * Creates an ExistentialCrisisError object.
	 * @param {Discord.Message} origin The message the error comes from.
	 * @param {string} commandLine The command line containing the command that doesn't exist.
	 */
	constructor(origin, commandLine) {
		super('Existential Crisis', 'The command doesn\'t exist.', origin,
		[{name: 'Command line', value: `\`${commandLine}\``}]);
	}
}

module.exports = ExistentialCrisisError;