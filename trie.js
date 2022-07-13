class Trie {
	/**
	 * @type {Array<Trie>}
	 */
	#children = new Array(36).fill(null);
	#amountChildren = 0;
	value = null;

	/**
	 * Retrieves a value connected to a key
	 * @param {string} key the key to look up
	 * @returns {any} the value connected to the key
	 */
	get(key) {
		key = key.toLowerCase();
		let subtract;
		let charCode = key.charCodeAt(0);
		if (charCode >= 48 && charCode <= 57)
			subtract = 48 - 26;
		else if (charCode >= 97 && charCode <= 122)
			subtract = 97;
		else
			throw new Error("invalid key");
		
		if (this.#children[charCode - subtract] === null)
			throw new Error("key not found");
		
		let t = this.#children[charCode - subtract];
		
		if (key.length > 1)
			return t.get(key.substring(1));
		else if (t.value !== null)
			return t.value;
		else
			throw new Error("key not found");
	}

	/**
	 * Inserts a key into the trie and connects a value to it
	 * @param {string} key key to be inserted into the trie
	 * @param {any} value value to be connected to key
	 */
	insert(key, value) {
		key = key.toLowerCase();
		let subtract;
		let charCode = key.charCodeAt(0);
		if (charCode >= 48 && charCode <= 57)
			subtract = 48 - 26;
		else if (charCode >= 97 && charCode <= 122)
			subtract = 97;
		else
			throw new Error("invalid key");

		let t;
		if (this.#children[charCode - subtract] === null) {
			t = new Trie();
			this.#children[charCode - subtract] = t;
			this.#amountChildren++;
		} else {
			t = this.#children[charCode - subtract];
		}
		
		if (key.length > 1)
			t.insert(key.substring(1), value);
		else
			t.value = value;
	}

	/**
	 * Removes a key and the connected value from the trie
	 * @param {string} key the key to be removed
	 */
	remove(key) {
		key = key.toLowerCase();
		let subtract;
		let charCode = key.charCodeAt(0);
		if (charCode >= 48 && charCode <= 57)
			subtract = 48 - 26;
		else if (charCode >= 97 && charCode <= 122)
			subtract = 97;
		else
			throw new Error("invalid key");
		
		if (this.#children[charCode - subtract] === null)
			throw new Error("key not found");
		
		let t = this.#children[charCode - subtract];
		
		if (key.length > 1) {
			t.remove(key.substring(1));
			if (t.#amountChildren === 0 && t.value === null) {
				this.#children[charCode - subtract] = null;
				this.#amountChildren--;
			}
		} else if (t.value !== null) {
			if (t.#amountChildren === 0) {
				this.#children[charCode - subtract] = null;
				this.#amountChildren--;
			} else {
				t.value = null;
			}
		} else {
			throw new Error("key not found");
		}
	}
}

module.exports = Trie;