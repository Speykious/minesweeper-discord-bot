const Discord = require('discord.js');

/**
 * Sends anything to a text channel, but starts and stops typing.
 * @param {Discord.TextChannel} channel The channel to send anything to.
 * @param {object} anything The object to send to the channel.
 */
function typing(channel, anything) {
	channel.startTyping();
	return channel.send(anything)
	.then(() => channel.stopTyping(true));
}

module.exports = typing;