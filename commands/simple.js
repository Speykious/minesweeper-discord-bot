const Command = require('../cli_modules/Command.js');
require('dotenv-flow').config();
const typing = require('./typing.js');
const ownerId = process.env.OWNER_ID;

module.exports = [
	new Command('incode', {'anything': 'any'},
		{'required': ['anything']},
		args => {
			typing(args.CHANNEL, `Content: \`${args['anything']}\``);
		}),

	new Command('stop', {'magicWord': 'word'},
		{'optional': ['magicWord']},
		args => {
			if (args.AUTHOR === ownerId) {
				switch(args['magicWord']) {
					case 'plz':
						typing(args.CHANNEL, ':ok:');
						break;
					case 'yourself':
						typing(args.CHANNEL, 'Orders recieved, my Lord... :dagger: :eyes:');
						break;
					default:
						typing(args.CHANNEL, ':boom:');
						break;
				}
				
				args.BOT.destroy();
			} else {
				typing(args.CHANNEL, `<@!${args.AUTHOR}>, you're not my Lord. You can't stop me.`);
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