const Discord = require('discord.js');

/**
 * Sends anything to a text channel, but starts and stops typing.
 * @param {Discord.TextChannel} channel The channel to send anything to.
 * @param {object} anything The object to send to the channel.
 */
function typing(channel, anything) {
	channel.startTyping();
	let promise = channel.send(anything);
	promise.then(() => channel.stopTyping(true));
	return promise;
}

module.exports = typing;