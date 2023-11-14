local dkjson = require("./dkjson/dkjson")
 
CustomOptionTattoo = 0
CustomOptionTattooColor = 0
 
Enum = {
    PlayerCurrencyFlagsDbFlags = {
        InBackpack = 0,
        UnusedInUI = 0,
    },
}
 
Constants = {
    CharCustomizationConstants = {
        CHAR_CUSTOMIZE_CUSTOM_DISPLAY_OPTION_LAST = 0,
        CHAR_CUSTOMIZE_CUSTOM_DISPLAY_OPTION_FIRST = 0,
    },
}
 
local Tables = {}
APIDocumentation = {
    AddDocumentationTable = function(self, doc)
        Tables[#Tables+1] = doc
    end
}
 
local directory = ...
for file in io.popen('ls "' .. directory .. '"'):lines() do
    if file:match("^.+%.lua$") then
        require(directory .. "/" .. file:gsub("%.lua$", ""))
    end
end
 
print(dkjson.encode(Tables))