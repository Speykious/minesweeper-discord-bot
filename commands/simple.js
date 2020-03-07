const Command = require('./Command.js');
require('dotenv-flow').config();
const ownerId = process.env.OWNER_ID;

module.exports = [
	new Command('incode', {'anything': 'any'},
		{'required': ['anything']},
		args => {
			args.CHANNEL.send(`Content: \`${args['anything']}\``);
		}),

	new Command('stop', {'magicWord': 'word'},
		{'optional': ['magicWord']},
		args => {
			if (args.AUTHOR === ownerId) {
				switch(args['magicWord']) {
					case 'plz':
						args.CHANNEL.send(':ok:');
						break;
					case 'yourself':
						args.CHANNEL.send('Orders recieved, my Lord... :dagger: :eyes:');
						break;
					default:
						args.CHANNEL.send(':boom:');
						break;
				}
				args.CHANNEL.stopTyping();
				args.BOT.destroy();
			} else {
				args.CHANNEL.send(`<@!${args.AUTHOR}>, you're not my Lord. You can't stop me.`);
			}
			
		})
]

/*////
if (msg.content.substring(0, 5) === 'embed') {
		
	if (msg.content.length > 5) minesweeper.newBoard(parseInt(msg.content.substring(6)));
	console.log(minesweeper.board);
	testembed.setDescription(minesweeper.textBoard);
	
	msg.channel.send(testembed)
	.then(() => msg.channel.send(`ID of the embed message: \`<${msg.channel.lastMessageID}>\``));
}
////*/