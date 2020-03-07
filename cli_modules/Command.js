const Discord = require('discord.js');

/**
 * Object that runs a function depending on arguments.
 * @property {string} name The name of the command.
 * @property {object} arglist The list of arguments of the command, with their name as key and their type as value.
 * @property {{'required': string[], 'optional': string[]}} syntax The syntax of the command.
 * @function run The function which is run when executing the command, and returns either a string to indicate an error or null for success.
 */
class Command {
	/**
	 * Creates a Command object.
	 * @param {string} name The name of the command.
	 * @param {object} arglist The list of arguments of the command, with their name as key and their type as value.
	 * @param {{'required': string[], 'optional': string[]}} syntax The syntax of the command.
	 * @param {function({'BOT': Discord.Client, 'AUTHOR': string, 'CHANNEL': Discord.TextChannel}) => string} run The function which is run when executing the command, and returns either a string to indicate an error or null for success.
	 */
	constructor(name, arglist, syntax, run = function(args){}) {
		this.name = name;
		this.arglist = arglist;
		this.syntax = syntax;
		
		if (''+run == ''+function(){})
			this.run = function(args) {
				console.log(`Command '${this.name}' is not implemented.`);
			};
		else this.run = run;
	}

	/**
	 * Gets the arguments for the command's syntax.
	 * @param {Discord.Client} bot The bot that executes the commands.
	 * @param {StringTypeManager} stm The manager for the types of the arguments.
	 * @param {Discord.Message} msg The message to analyze arguments from.
	 */
	getArgs(bot, stm, msg, argstr) {
		let args = {};
		let error = false;

		if (this.syntax.required) {
			for (let argname of this.syntax.required) {
				if (error) args[argname] = null;
				else {
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
						args['ERROR'] = `\`${argname}\` argument didn't match.`;
						args[argname] = null;
						error = true;
					}
				}
			}
		}
		
		if (this.syntax.optional) {
			for (let argname of this.syntax.optional) {
				if (error) args[argname] = null;
				else {
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
		}
		
		if (argstr != '') {
			// nullify all the arguments
			for (let arg in args) args[arg] = null;
			args['ERROR'] = `Too much arguments: \`${argstr}\``;
		}

		args['BOT'] = bot;
		args['AUTHOR'] = msg.author.id;
		args['CHANNEL'] = msg.channel;
		return args;
	}
}

module.exports = Command;