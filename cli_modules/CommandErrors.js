const Discord = require('discord.js');

class CommandError {
	constructor(type, description, origin, additionalFields = null, color = 0xff3248) {
		this.type = type;
		this.description = description;
		this.origin = origin;
		this.additionalFields = additionalFields;
		this.color = color;


		this.embed = new Discord.RichEmbed()
			.setColor(this.color)
			.setTitle(`**${this.type} Error**`)
			.setDescription(this.description);
		
		if (this.additionalFields)
			for (let field of this.additionalFields)
				this.embed.addField(field.name, field.value);
		
		this.embed.addField('Coming from this message', this.origin.content);
	}
}

class ExistentialCrisisError extends CommandError {
	constructor(origin, commandLine) {
		super('Existential Crisis', 'The command doesn\'t exist.', origin,
		[{name: 'Command line', value: `\`${commandLine}\``}]);
	}
}

class NameError extends CommandError {
	constructor(origin, commandLine) {
		super('Name', 'The command is not a word.', origin,
		[{name: 'Command line', value: `\`${commandLine}\``}]);
	}
}

class SyntaxError extends CommandError {
	constructor(origin, command, argname) {
		let formatted = command.name;
		if (command.syntax.required)
			formatted += ' ' + command.syntax.required.map(name => `<${name}>`).join(' ');
		if (command.syntax.optional)
			formatted += ' ' + command.syntax.optional.map(name => `[${name}]`).join(' ');
		
		super('Syntax', 'The syntax is invalid.', origin, [
			{name: 'First argument not matching', value: `\`${argname} (${command.arglist[argname]})\``},
			{name: 'Syntax of the command', value: `\`${formatted}\``}
		]);
	}
}

class TooManyArgsError extends CommandError {
	constructor(origin, command, remaining) {
		let formatted = command.name;
		if (command.syntax.required)
			formatted += ' ' + command.syntax.required.map(name => `<${name}>`).join(' ');
		if (command.syntax.optional)
			formatted += ' ' + command.syntax.optional.map(name => `[${name}]`).join(' ');
		
		super('Argument', 'Too many arguments.', origin, [
			{name: 'Arguments remaining', value: `\`${remaining}\``},
			{name: 'Syntax of the command', value: `\`${formatted}\``}
		]);
	}
}

module.exports = {
	ExistentialCrisisError,
	NameError,
	SyntaxError,
	TooManyArgsError
}