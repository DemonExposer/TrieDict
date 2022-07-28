class Trie {
	/**
	 * @type {Array<Trie>}
	 */
	#children = new Array(256).fill(null);
	#amountChildren = 0;
	value = null;

	/**
	 * Retrieves a value connected to a key
	 * @param {string} key the key to look up
	 * @returns {any} the value connected to the key
	 */
	get(key) {
		let charCode = key.charCodeAt(0);
		if (charCode >= this.#children.length)
			throw new Error("invalid key");
		
		if (this.#children[charCode] === null)
			throw new Error("key not found");
		
		let t = this.#children[charCode];
		
		if (key.length > 1)
			return t.get(key.substring(1));
		else if (t.value !== null)
			return t.value;
		else
			throw new Error("key not found");
	}

	/**
	 * Inserts a key into the trie and connects a value to it
	 * @param {string} key the utf-8 key to be inserted into the trie
	 * @param {any} value the value to be connected to key
	 */
	insert(key, value) {
		let charCode = key.charCodeAt(0);
		if (charCode >= this.#children.length)
			throw new Error("invalid key");

		let t;
		if (this.#children[charCode] === null) {
			t = new Trie();
			this.#children[charCode] = t;
			this.#amountChildren++;
		} else {
			t = this.#children[charCode];
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
		let charCode = key.charCodeAt(0);
		if (charCode >= this.#children.length)
			throw new Error("invalid key");
		
		if (this.#children[charCode] === null)
			throw new Error("key not found");
		
		let t = this.#children[charCode];
		
		if (key.length > 1) {
			t.remove(key.substring(1));
			if (t.#amountChildren === 0 && t.value === null) {
				this.#children[charCode] = null;
				this.#amountChildren--;
			}
		} else if (t.value !== null) {
			if (t.#amountChildren === 0) {
				this.#children[charCode] = null;
				this.#amountChildren--;
			} else {
				t.value = null;
			}
		} else {
			throw new Error("key not found");
		}
	}

	/**
	 * Gives a set with all the keys in the trie
	 * @returns {string[]} all the keys present in the trie
	 */
	getKeySet = () => this.#privGetKeySet("");

	/**
	 * Gives a set with all the keys in the trie
	 * @param {string} key the concatenation of all the chars of the current node's parents and the current node's char
	 * @returns {string[]} all the keys present in the trie
	 */
	#privGetKeySet(key) {
		let set = [];
		for (let i = 0; i < this.#children.length; i++)
			if (this.#children[i] !== null)
				set = set.concat(this.#children[i].#privGetKeySet(key + String.fromCharCode(i)));

		if (this.value !== null)
			set.push(key);

		return set;
	}
}

module.exports = Trie;
