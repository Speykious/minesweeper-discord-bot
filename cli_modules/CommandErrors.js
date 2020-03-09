const Discord = require('discord.js');
const Command = require('./Command.js');
const { version } = require('../package.json');

/**
 * To manage errors more easily.
 * @property {string} type The type of the error.
 * @property {string} description The description of the error.
 * @property {Discord.Message} origin The message the error comes from.
 * @property {name: string, value: string} additionalFields The additional fields to add to the embed of the error.
 * @property {number} color The color of the embed of the error.
 * @property {Discord.RichEmbed} embed The embed of the error that is gonna be sent to the channel.
 */
class CommandError {
	/**
	 * Creates a CommandError object.
	 * @param {string} type The type of the error.
	 * @param {string} description The description of the error.
	 * @param {Discord.Message} origin The message the error comes from.
	 * @param {name: string, value: string} additionalFields The additional fields to add to the embed of the error.
	 * @param {number} color The color of the embed of the error.
	 */
	constructor(type, description, origin, additionalFields = null, color = 0xff3248) {
		this.type = type;
		this.description = description;
		this.origin = origin;
		this.additionalFields = additionalFields;
		this.color = color;

		this.embed = new Discord.RichEmbed()
			.setColor(this.color)
			.setTitle(`**${this.type} Error**`)
			.setDescription(this.description)
			.setFooter(`MinesweeperBot [v${version}]`);
		
		if (this.additionalFields)
			for (let field of this.additionalFields)
				this.embed.addField(field.name, field.value);
		
		this.embed.addField('Coming from this message', this.origin.content);
	}
}

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
	constructor(origin, command, argname) {
		super('Syntax', 'The syntax is invalid.', origin, [
			{name: 'First argument not matching', value: `\`${argname} (${command.arglist[argname]})\``},
			{name: 'Syntax of the command', value: `\`${command.syntaxString}\``}
		]);
	}
}

/**
 * A CommandError that notifies about a command that was passed too many arguments.
 */
class TooManyArgsError extends CommandError {
	/**
	 * Creates a TooManyArgsError object.
	 * @param {Discord.Message} origin The message the error comes from.
	 * @param {Command} command The command of which the syntax wasn't fulfilled.
	 * @param {string} remaining The remaining arguments that don't fit the syntax.
	 */
	constructor(origin, command, remaining) {
		super('Argument', 'Too many arguments.', origin, [
			{name: 'Arguments remaining', value: `\`${remaining}\``},
			{name: 'Syntax of the command', value: `\`${command.syntaxString}\``}
		]);
	}
}

module.exports = {
	ExistentialCrisisError,
	NameError,
	SyntaxError,
	TooManyArgsError
}