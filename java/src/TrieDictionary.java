import java.util.HashSet;
import java.util.Set;

public class TrieDictionary<T> {
	@SuppressWarnings("unchecked")
	private final TrieDictionary<T>[] children = new TrieDictionary[256];
	private int amountChildren = 0;
	private T value;

	/// <summary>
	/// Checks if a key is present in the dictionary
	/// </summary>
	/// <param name="key">The key to look up</param>
	/// <returns>true if the key is present, false if not</returns>
	public boolean contains(String key) {
		short charCode = (short) key.charAt(0);
		if (charCode >= children.length)
			return false;

		if (children[charCode] == null)
			return false;

		TrieDictionary<T> t = children[charCode];

		if (key.length() > 1)
			return t.contains(key.substring(1));

		if (t.value != null)
			return true;

		return false;
	}

	/// <summary>
	/// Gets the value from the dictionary which is connected to the specified key
	/// </summary>
	/// <param name="key">The key to look up</param>
	/// <returns>The value connected to the key</returns>
	/// <exception cref="ArgumentException">Is thrown when the key is not utf-8</exception>
	/// <exception cref="KeyNotFoundException">Is thrown when the key is not present in the dictionary</exception>
	public T get(String key) {
		short charCode = (short) key.charAt(0);
		if (charCode >= children.length)
			throw new IllegalArgumentException("invalid key");

		if (children[charCode] == null)
			throw new NullPointerException();

		TrieDictionary<T> t = children[charCode];

		if (key.length() > 1)
			return t.get(key.substring(1));

		if (t.value != null)
			return t.value;

		throw new NullPointerException();
	}

	/// <summary>
	/// Inserts a key into the dictionary and connects a value to it
	/// </summary>
	/// <param name="key">The key to be inserted into the dictionary</param>
	/// <param name="value">The value to connect to the key</param>
	/// <exception cref="ArgumentException">Is thrown when the key is not utf-8</exception>
	public void insert(String key, T value) {
		short charCode = (short) key.charAt(0);
		if (charCode >= children.length)
			throw new IllegalArgumentException("invalid key");

		TrieDictionary<T> t;
		if (children[charCode] == null) {
			t = new TrieDictionary<T>();
			children[charCode] = t;
			amountChildren++;
		} else {
			t = children[charCode];
		}

		if (key.length() > 1)
			t.insert(key.substring(1), value);
		else
			t.value = value;
	}

	/// <summary>
	/// Removes a key and its connected value from the dictionary
	/// </summary>
	/// <param name="key">The key to be removed from the dictionary</param>
	/// <exception cref="ArgumentException">Is thrown when the key is not utf-8</exception>
	/// <exception cref="KeyNotFoundException">Is thrown when the key is not present in the dictionary</exception>
	public void remove(String key) {
		short charCode = (short) key.charAt(0);
		if (charCode >= children.length)
			throw new IllegalArgumentException("invalid key");

		if (children[charCode] == null)
			throw new NullPointerException();

		TrieDictionary<T> t = children[charCode];

		if (key.length() > 1) {
			t.remove(key.substring(1));
			if (t.amountChildren == 0 && t.value == null) {
				children[charCode] = null;
				amountChildren--;
			}
		} else if (t.value != null) {
			if (t.amountChildren == 0) {
				children[charCode] = null;
				amountChildren--;
			} else {
				t.value = null;
			}
		} else {
			throw new NullPointerException();
		}
	}

	/// <summary>
	/// Gives a set with all the keys in the dictionary
	/// </summary>
	/// <returns>All the keys present in the dictionary</returns>
	public Set<String> getKeySet() {
		return getKeySet("");
	}

	/// <summary>
	/// Gives a set with all the keys in the dictionary
	/// </summary>
	/// <param name="key">The concatenation of all the chars of the current node's parents and the current node's char</param>
	/// <returns>All the keys present in the dictionary</returns>
	private Set<String> getKeySet(String key) {
		Set<String> set = new HashSet<>();
		for (int i = 0; i < children.length; i++)
			if (children[i] != null)
				set.addAll(children[i].getKeySet(key + (char) i));

		if (value != null)
			set.add(key);

		return set;
	}
}
