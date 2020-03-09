const Discord = require('discord.js');
const CError = require('./CommandErrors.js');

/**
 * Object that runs a function depending on arguments.
 * @property {string} name The name of the command.
 * @property {string} description THe description of the command.
 * @property {object} arglist The list of arguments of the command, with their name as key and their type as value.
 * @property {{required: string[], optional: string[]}} syntax The syntax of the command.
 * @function run The function which is run when executing the command, and returns either a string to indicate an error or null for success.
 */
class Command {
	/**
	 * Creates a Command object.
	 * @param {string} name The name of the command.
	 * @param {string} description The description of the command.
	 * @param {object} arglist The list of arguments of the command, with their name as key and their type as value.
	 * @param {{required: string[], optional: string[]}} syntax The syntax of the command.
	 * @param {function({BOT: Discord.Client, AUTHOR: string, CHANNEL: Discord.TextChannel}) => string} run The function which is run when executing the command, and returns either a string to indicate an error or null for success.
	 */
	constructor(name, description, arglist, syntax, run = function(args){}) {
		this.name = name;
		this.description = description;
		this.arglist = arglist;
		this.syntax = syntax;
		
		if (''+run == ''+function(){})
			this.run = function(args) {
				console.log(`Command '${this.name}' is not implemented.`);
			};
		else this.run = run;
	}

	/**
	 * Returns a string that shows the syntax of the command in a readable form.
	 */
	get syntaxString() {
		let formatted = this.name;
		if (this.syntax.required)
			formatted += ' ' + this.syntax.required.map(name => `<${name}>(${this.arglist[name]})`).join(' ');
		if (this.syntax.optional)
			formatted += ' ' + this.syntax.optional.map(name => `[${name}](${this.arglist[name]})`).join(' ');
		
		return formatted;
	}

	/**
	 * Gets the arguments for the command's syntax.
	 * @param {Discord.Client} bot The bot that executes the commands.
	 * @param {StringTypeManager} stm The manager for the types of the arguments.
	 * @param {Discord.Message} msg The message to analyze arguments from.
	 * @param {string} argstr The string containing the arguments to get.
	 */
	getArgs(bot, stm, msg, argstr) {
		let args = {};
		let error = false;

		if (this.syntax.required) {
			for (let argname of this.syntax.required) {
				/*///////////////////////////////////////////////
				console.log('\t\t\targstr = '+argstr);
				console.log('\t\t\targs = '+args);
				console.log(`\t\t\targname = ${argname} -> ${this.arglist[argname]}`);
				///////////////////////////////////////////////*/
				const tester = new RegExp(`^${stm.regexString(this.arglist[argname])}`, 'g');
				let match = argstr.match(tester);
				if (match) {
					args[argname] = match[0];
					argstr = argstr.substring(match[0].length);
					match = argstr.match(/^\s+/);
					if (match) argstr = argstr.substring(match[0].length);
				} else {
					args['ERROR'] = new CError.SyntaxError(msg, this, argname).embed;
					args[argname] = null;
					error = true;
					break;
				}
			}
		}

		// we don't need to do anything to the arguments if there is an error
		if (this.syntax.optional && !error) {
			for (let argname of this.syntax.optional) {
				/*///////////////////////////////////////////////
				console.log(`\t\t\tthis.syntax.optional:`);
				console.log('\t\t\targstr = '+argstr);
				console.log('\t\t\targs = '+args);
				console.log(`\t\t\targname = ${argname} -> ${this.arglist[argname]}`);
				///////////////////////////////////////////////*/
				const tester = new RegExp(`^${stm.regexString(this.arglist[argname])}`, 'g');
				let match = argstr.match(tester);
				if (match) {
					args[argname] = match[0];
					argstr = argstr.substring(match[0].length);
					match = argstr.match(/^\s+/);
					if (match) argstr = argstr.substring(match[0].length);
				} else args[argname] = undefined;
			}
		}
		
		// that error should not come in priority of previous errors, hence '&& !error'
		if (argstr != '' && !error) {
			args['ERROR'] = new CError.TooManyArgsError(msg, this, argstr).embed;
			error = true;
		}

		// nullify all the arguments if there is any error
		if (error) for (let arg in args)
			if (arg != 'ERROR') args[arg] = null;

		args['BOT'] = bot;
		args['AUTHOR'] = msg.author.id;
		args['CHANNEL'] = msg.channel;
		return args;
	}
}

module.exports = Command;