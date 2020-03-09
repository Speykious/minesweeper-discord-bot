const Discord = require('discord.js');
const { version } = require('../../package.json');

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

module.exports = CommandError;