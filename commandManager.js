const Discord = require('discord.js');

/**
 * Manages StringTypes, which are types defined by a name and a regex.
 * Is used to put an input string into a specific category depending on the regex it matches with.
 */
class StringTypeManager {
	/**
	 * Creates a StringTypeManager object.
	 * @param {object} types The types to store, with their name as key and their regex as value.
	 */
	constructor(types = {}) {
		this.types = types;
	}

	/**
	 * Evaluates the type of a string from the types stored.
	 * @param {string} str The string to evaluate the type of.
	 */
	getType(str) {
		for (let typename in types) {
			if (this.types[typename].test(str)) return typename;
		}
		return null;
	}

	/**
	 * Sets or adds a type to the list of types.
	 * @param {string} name The name of the type.
	 * @param {RegExp} regex The regex of the type.
	 */
	setType(name, regex) {
		this.types[name] = regex;
		
	}

	/**
	 * Removes a type to the list of the types.
	 * @param {string} name The name of the type.
	 */
	removeType(name) {
		delete this.types[name];
	}

	regexString(name) {
		return this.types[name].source;
	}
}

/**
 * Returns a Syntax object.
 * @param {string[]} required List of the required argument names in order.
 * @param {string[]} optional List of the optional argument names in order.
 */
function Syntax(required, optional = []) {
	return {
		'required': required,
		'optional': optional
	}
}

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
	 * @param {function({'CHANNEL': Discord.TextChannel, 'BOT': Discord.Client}) => string} run The function which is run when executing the command, and returns either a string to indicate an error or null for success.
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
	 * @param {StringTypeManager} stm The manager for the types of the arguments.
	 * @param {Discord.Message} msg The message to analyze arguments from.
	 */
	getArgs(bot, stm, channel, argstr) {
		let args = {};
		let error = false;

		if (this.syntax.required) {
			for (let argname of this.syntax.required) {
				if (error) args[argname] = null;
				else {
					////////////////////////////////////////////////
					console.log('\t\t\targstr = '+argstr);
					console.log('\t\t\targs = '+args);
					console.log(`\t\t\targname = ${argname} -> ${this.arglist[argname]}`);
					///////////////////////////////////////////////*/
					const tester = new RegExp(`^${stm.regexString(this.arglist[argname])}`, 'g');
					console.log('tester = '+tester.source);
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
					////////////////////////////////////////////////
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
			args['ERROR'] = `Too much arguments. (\`${argstr}\`)`;
		}

		args['BOT'] = bot;
		args['CHANNEL'] = channel;
		return args;
	}
}

class CommandManager {
	/**
	 * Creates a CommandManager object.
	 * @param {Discord.Client} bot The bot using the command manager.
	 * @param {string} prefix The prefix of any command.
	 * @param {StringTypeManager} stm The StringTypeManager to manage the different types.
	 * @param {Command[]} commands The array of all commands.
	 */
	constructor(bot, prefix, stm, commands) {
		this.bot = bot;
		this.prefix = prefix;
		this.stm = stm;
		this.commands = commands;
		this.ERROR = '';
	}

	/**
	 * Gets the command to execute from the command line.
	 * Returns undefined if it doesn't find it, null if it's not a word.
	 * @param {string} cline The command line.
	 */
	getCommand(cline) {
		const tester = new RegExp(`^${this.stm.regexString('word')}`, 'g');
		const match = cline.match(tester);
		////////////////////////////////////////////////
		console.log(`\t\tcline = "${cline}"`);
		console.log(`\t\ttester = /${tester.source}/${tester.flags}`);
		console.log('\t\tmatch = '+match);
		///////////////////////////////////////////////*/
		if (match) return this.commands.find(command => command.name === match[0]);
		else return null;
	}

	/**
	 * Interprets the message and runs the corresponding command if it is valid.
	 * Returns whether the message was successfully interpreted.
	 * @param {Discord.Message} msg The message to interpret.
	 */
	interpret(msg) {
		let message = msg.content;
		const tester = new RegExp('^'+this.prefix, 'g');
		let match = message.match(tester);
		////////////////////////////////////////////////
		console.log('message = '+message);
		console.log(`tester = /${tester.source}/${tester.flags}`);
		console.log('match = '+match);
		///////////////////////////////////////////////*/
		if (match) {
			message = message.substring(match[0].length);
			const cmd = this.getCommand(message);
			////////////////////////////////////////////////
			console.log(`\tmessage = ${message}`);
			console.log('\tcmd = '+cmd);
			///////////////////////////////////////////////*/
			switch (cmd) {
				case undefined:
					this.ERROR = `Command is not defined. (command line: \`${message}\`)`;
					return undefined;
				case null:
					this.ERROR = `Command is not a word. (command line: \`${message}\`)`;
					return null;
			}
			message = message.substring(cmd.name.length);
			match = message.match(/^\s+/);
			////////////////////////////////////////////////
			console.log(`\tmessage = ${message} (substringed cmd.name)`);
			console.log(`\tmatch = ${match} (matched message)`);
			///////////////////////////////////////////////*/
			if (match) message = message.substring(match[0].length);
			const args = cmd.getArgs(this.bot, this.stm, msg.channel, message);
			if (args.ERROR) {
				this.ERROR = args.ERROR;
				return false;
			} else {
				let error = cmd.run(args);
				if(error) {
					this.ERROR = error;
					return false;
				} else return true;
			}
		} else return true;
	}
}

module.exports = {
	StringTypeManager,
	Command,
	CommandManager
}