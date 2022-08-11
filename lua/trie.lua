--[[
	DISCLAIMER: Of course, this is fully useless in Lua, as arrays do not exist and therefore,
				this implementation of a trie dictionary is based on a hashtable.
				This defeats the entire purpose of the trie dictionary, but it is still a nice
				example of how to use Lua.
]]

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

function Trie:getKeySet(key)
	key = key or ""
	local set = {}
	for i, v in pairs(self.children) do
		local nextSet = v:getKeySet(key .. string.char(i-1))
		for _, value in pairs(nextSet) do
			table.insert(set, value)
		end
	end

	if self.value ~= nil then
		table.insert(set, key)
	end

	return set
end