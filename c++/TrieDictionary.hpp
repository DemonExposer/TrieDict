#include <string>

#define ARR_SIZE 256

using namespace std;

template<typename T>
class TrieDictionary {
	private:
		TrieDictionary **children;
		int amountChildren = 0;
		T value;
		bool hasValue = false;
	
	public:
		TrieDictionary() {
			children = nullptr;
		}

		bool contains(string key) {
			short charCode = (short) key[0];
			if (charCode >= ARR_SIZE)
				return false;
			
			if (children[charCode] == nullptr)
				return false;
			
			TrieDictionary *t = children[charCode];

			if (key.length() > 1)
				return t->contains(key.substr(1));
			
			if (t->hasValue)
				return true;
			
			return false;
		}

		T get(string key) {
			short charCode = (short) key[0];
			if (charCode >= ARR_SIZE)
				throw new exception();

			if (children[charCode] == nullptr)
				throw new exception();
			
			TrieDictionary *t = children[charCode];

			if (key.length() > 1)
				return t->get(key.substr(1));

			if (t->hasValue)
				return t->value;
			
			throw new exception();
		}

		void insert(string key, T value) {
			short charCode = (short) key[0];
			if (charCode >= ARR_SIZE)
				throw new exception();
			
			if (children == nullptr) {
				children = new TrieDictionary*[ARR_SIZE];
				for (int i = 0; i < ARR_SIZE; i++)
					children[i] = nullptr;
			}

			TrieDictionary *t = new TrieDictionary();
			if (children[charCode] == nullptr) {
				children[charCode] = t;
				amountChildren++;
			} else {
				t = children[charCode];
			}

			if (key.length() > 1) {
				t->insert(key.substr(1), value);
			} else {
				t->value = value;
				t->hasValue = true;
			}
		}

		void remove(string key) {
			short charCode = (short) key[0];
			if (charCode >= ARR_SIZE)
				throw new exception();

			if (children[charCode] == nullptr)
				throw new exception();
			
			TrieDictionary *t = children[charCode];

			if (key.length() > 1) {
				t->remove(key.substr(1));
				if (t->amountChildren == 0 && !t->hasValue) {
					t->free();
					delete t;
					children[charCode] = nullptr;
					amountChildren--;
				}
			} else if (t->hasValue) {
				if (t->amountChildren == 0) {
					t->free();
					delete t;
					children[charCode] = nullptr;
					amountChildren--;
				} else {
					t->hasValue = false;
				}
			} else {
				throw new exception();
			}
		}
	
		void free() {
			if (children != nullptr) {
				for (int i = 0; i < ARR_SIZE; i++) {
					if (children[i] != nullptr) {
						children[i]->free();
						delete children[i];
					}
				}
			}
			
			delete [] children;
		}
};