const Command = require('../cli_modules/Command.js');
require('dotenv-flow').config();
const typing = require('../typing.js');
const ownerId = process.env.OWNER_ID;

module.exports = [
	new Command('incode', 'Shows you the underlying characters behind a discord message.',
		{'anything': 'any'}, {'required': ['anything']},
		args => {
			typing(args.CHANNEL, `Content: \`${args['anything']}\``);
		}),

	new Command('stop', 'Stops the bot. You can choose different messages depending on the magicWord you choose.\nOnly the Owner My Lord can stop me.',
		{'magicWord': 'word'}, {'optional': ['magicWord']},
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
				typing(args.CHANNEL, `<@!${args.AUTHOR}>, you're not My Lord. You can't stop me.`);
			}
			
		}),
	
	new Command('edit',
		'Shows a message showing the string *before*, that gets edited to then show the string *after*.',
		{'before': 'string', 'after': 'string'}, {'required': ['before', 'after']},
		args => {
			typing(args.CHANNEL, '```py\nbefore = '+args['before']+'```')
			.then(message => message.edit('```fix\nafter = '+args['after']+'```'));
		})
]