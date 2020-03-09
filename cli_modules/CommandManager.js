const Discord = require('discord.js');
const StringTypeManager = require('./StringTypeManager.js');
const CError = require('./CommandErrors.js');

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
		/*///////////////////////////////////////////////
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
		/*///////////////////////////////////////////////
		console.log('message = '+message);
		console.log(`tester = /${tester.source}/${tester.flags}`);
		console.log('match = '+match);
		///////////////////////////////////////////////*/
		if (match) {
			message = message.substring(match[0].length);
			const cmd = this.getCommand(message);
			/*///////////////////////////////////////////////
			console.log(`\tmessage = ${message}`);
			console.log('\tcmd = '+cmd);
			///////////////////////////////////////////////*/
			switch (cmd) {
				case undefined:
					this.ERROR = new CError.ExistentialCrisisError(msg, message);
					return undefined;
				case null:
					this.ERROR = new CError.NameError(msg, message);
					return null;
			}
			message = message.substring(cmd.name.length);
			match = message.match(/^\s+/);
			/*///////////////////////////////////////////////
			console.log(`\tmessage = ${message} (substringed cmd.name)`);
			console.log(`\tmatch = ${match} (matched message)`);
			///////////////////////////////////////////////*/
			if (match) message = message.substring(match[0].length);
			const args = cmd.getArgs(this.bot, this.stm, msg, message);
			// console.log(args);
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

module.exports = CommandManager;