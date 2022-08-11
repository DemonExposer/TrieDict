Trie = {}
Trie.__index = Trie
local ARR_SIZE = 256

function Trie:new()
	local t = {}
	setmetatable(t, Trie)
	t.children = {}
	t.amountChildren = 0
 
	return t
end

function Trie:get(key)
	local charCode = key:byte() + 1
	if charCode > ARR_SIZE then
		error("invalid key")
	end
	
	if self.children[charCode] == nil then
		error("key not found")
	end

	local t = self.children[charCode]

	if key:len() > 1 then
		return t:get(key:sub(2))
	elseif t.value ~= nil then
		return t.value
	else
		error("key not found")
	end
end

function Trie:insert(key, value)
	local charCode = key:byte() + 1
	if charCode > ARR_SIZE then
		error("invalid key")
	end

	local t
	if self.children[charCode] == nil then
		t = Trie:new()
		self.children[charCode] = t
		self.amountChildren = self.amountChildren + 1
	else
		t = self.children[charCode]
	end

	if key:len() > 1 then
		t:insert(key:sub(2), value)
	else
		t.value = value
	end
end

function Trie:remove(key)
	local charCode = key:byte() + 1
	if charCode > ARR_SIZE then
		error("invalid key")
	end

	if self.children[charCode] == nil then
		error("key not found")
	end

	local t = self.children[charCode]

	if key:len() > 1 then
		t:remove(key:sub(2))
		if t.amountChildren == 0 and t.value == nil then
			self.children[charCode] = nil
			self.amountChildren = self.amountChildren - 1
		end
	elseif t.value ~= nil then
		if t.amountChildren == 0 then
			self.children[charCode] = nil
			self.amountChildren = self.amountChildren - 1
		else
			t.value = nil
		end
	else
		error("key not found")
	end
end
