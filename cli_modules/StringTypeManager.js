/**
 * Manages StringTypes, which are types defined by a name and a regex.
 * Is used to put an input string into a specific category depending on the regex it matches with.
 * @property {object} types The types to store, with their name as key and their regex as value.
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
		if (this.types[name])
			return this.types[name].source;
		else return undefined;
	}
}

module.exports = StringTypeManager;