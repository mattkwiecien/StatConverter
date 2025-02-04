local args = {...} as {string, SharedTable};
local LB = args[2];
local G = getfenv(0);
local _locale: LocaleTable = nil;
local _goldColor = "|cfffffe8b"; -- r = 1.0, g = 0.996,  b = 0.545,
local _colorEnd = "|r";

-- Localize globals for sanity's sake:
-- mappings
local StatDetails = LB.StatDetails;
local ShortStatKeys = LB.ShortStatKeys;
local StatKeyToRatingID = LB.StatKeyToRatingID;
local StatKeyIsPercentage = LB.StatKeyIsPercentage;

-- statConversion
local GetEffectFromRating = LB.GetEffectFromRating;

-- localeCore
local GetLocaleTable = LB.GetLocaleTable;

-- attributesCore
local GetAttributeTable = LB.Attributes.GetAttributeTable;

 -- Records and tables local to this file
local enum TooltipType
    "GameTooltip"
    "ItemRefTooltip"
    "ShoppingTooltip1"
    "ShoppingTooltip2"
end

local record TooltipState
    itemKey: string
    modifiedLines: {number:string}
    timesSeen: number
end

local record LineModInfo
    stat: ItemModKey
    statType: StatType
    startIndex: number
    endIndex: number
    formattedString: string
end

local record LineData
    originalText: string
    modifications: {LineModInfo} 
end

local record StatScanResult
    valueStart: number
    valueEnd: number
    patternStart: number
    patternEnd: number
    patternUsed: SearchPattern
    valueFound: number
end

local _tooltipState: {TooltipType:TooltipState} = {
    ["GameTooltip"] = { itemKey = nil, modifiedLines = {}, timesSeen = 0 },
    ["ItemRefTooltip"] = { itemKey = nil, modifiedLines = {}, timesSeen = 0 },
    ["ShoppingTooltip1"] = { itemKey = nil, modifiedLines = {}, timesSeen = 0 },
    ["ShoppingTooltip2"] = { itemKey = nil, modifiedLines = {}, timesSeen = 0 },
}

-- Debugging helpers

-- local function Dump(o: {any:any}): string
--     if type(o) == "table" then
--         local s = "{ "
--         for k, v in pairs(o) do
--             if type(k) ~= "number" then
--                 k = "\"" .. tostring(k) .. "\""
--             end
--             s = s .. "[" .. tostring(k) .. "] = " .. Dump(v as {any:any}) .. ","
--         end
--         return s .. "} "
--     else
--         return tostring(o)
--     end
-- end

local function getItemIDFromLink(itemLink: string): number
    -- |cff9d9d9d|Hitem:0000000: <-- the zeroes are the item ID.
    local firstColonIndex = string.find(itemLink, ":");
    local secondColonIndex = string.find(itemLink, ":", firstColonIndex + 1);
    local itemID = string.sub(itemLink, firstColonIndex + 1, secondColonIndex - 1);
    return tonumber(itemID);
end

-- Checks to see if the given string of text contains the given stat.
-- If it finds it, it returns the start and end index indices of the stat value
-- (where 'stat value' is defined by the patterns given in the localization files, and
-- may contain more than just a numeric value) as well as the stat value itself.
-- 
-- `text`: The text to search for the given stat.
--
-- `statKey`: The key of the stat to search for.
--
-- `statType`: The type of the stat, i.e. whether it's a rating or just a value.
--
-- Returns A `StatScanResult` containing the start and end indices of the numberic value
-- discovered, the start and end indices of the pattern used to find the stat,
-- the pattern used to find the stat, and the numeric value itself.
local function scanForStat(text: string, statKey: ItemModKey, _: StatType): StatScanResult
    local lowercaseText: string = text:lower();
    local discoveredCapture: string = nil; -- A capture will usually contain just a number, but not necessarily.
    local successfulPattern: SearchPattern = nil;
        
    -- First, try the alternatives we've noted to deal with weird cases where Blizzard-defined keys don't work
    for _, pattern in ipairs(_locale.AlternativePatterns[statKey]) do
        discoveredCapture = string.match(lowercaseText, pattern.pattern:lower());
        if (discoveredCapture ~= nil) then
            successfulPattern = pattern;
            break
        end
    end
    
    -- If that didn't work, try the short stat phrases that use the Blizzard _SHORT key as a building block.
    if (discoveredCapture == nil) then
        local shortStatKey = ShortStatKeys[statKey];
        if (shortStatKey == nil) then
            return nil;
        end

        local shortStatString = (G[shortStatKey] as string):lower();
        local shortStatPatterns = _locale.GetShortStatPatterns(shortStatString, statKey);
        for _, pattern in ipairs(shortStatPatterns) do
            discoveredCapture = string.match(lowercaseText, pattern.pattern);
            if (discoveredCapture ~= nil) then
                successfulPattern = pattern;
                break
            end
        end
    end

    if (discoveredCapture == nil) then
        return nil;
    end
    
    local patternStart, patternEnd = string.find(lowercaseText, successfulPattern.pattern);
    if (patternStart == nil or patternEnd == nil) then
        return nil;
    end

    -- In case the value we found contains more than just a number, isolate out the number,
    local value = tonumber(string.match(discoveredCapture, "(%d+)"));
    if (patternStart and patternEnd and value) then
        -- Search within substring of the tooltip we found our pattern in for the captured value
        local patternSubstring = lowercaseText:sub(patternStart, patternEnd);
        local captureStart, captureEnd = string.find(patternSubstring, discoveredCapture);
        -- And make sure to add in the diff between the length of the substring and original tooltip string
        -- for the valueStart/End
        return {
                valueStart = captureStart + patternStart, 
                valueEnd = captureEnd + patternStart,
                patternStart = patternStart,
                patternEnd = patternEnd,
                patternUsed = successfulPattern,
                valueFound = value
        };
    end

    return nil;
end

-- Take a tooltip's text and see if we can find the given stat. If we do,
-- we'll return its indices, and a formatted string the caller can insert wherever it likes.
local function tryGenerateModifiedLine(text: string, statInfo: StatDetailInfo, indicesProcessed: {number:boolean}): {number, number, string}
    local statValue: number = nil;
    -- Parse the stat value and its location out of the tooltip line.
    local found = scanForStat(text, statInfo.kind, statInfo.type);
    if (found and not (indicesProcessed[found.valueStart]) and found.valueFound) then
        if (statInfo.kind == "ITEM_MOD_ATTACK_POWER") then
            return {found.valueStart, found.valueEnd, ""}; -- We don't process AP at all.
        end
        -- Ratings and attributes get treated differently, as ratings only ever map to one thing
        if (statInfo.type == "Rating") then
            statValue = GetEffectFromRating(found.valueFound, StatKeyToRatingID[statInfo.kind]);
            if (found.valueStart and found.valueEnd and statValue) then
                local currentColorCode: string = (select(3, string.find(text, "(|c%x%x%x%x%x%x%x%x)")) or _colorEnd) as string;
                local endFragment = StatKeyIsPercentage[statInfo.kind] and "%" or "";
                local formattedValue = _goldColor .. " (" .. format("%.2F", statValue) .. endFragment .. ")" .. currentColorCode;
                if (found.patternUsed.location == "AfterValue") then
                    return {found.valueStart, found.valueEnd, formattedValue};
                elseif (found.patternUsed.location == "PatternEnd") then
                    return {found.patternStart, found.patternEnd, formattedValue};
                end
            end
        -- Whereas attributes can map to many things
        elseif (statInfo.type == "Attribute") then
            local attributeTable = GetAttributeTable(statInfo.kind);
            local bonuses = attributeTable.GetBonusesString(found.valueFound);
            if (not bonuses) then                
                return {nil, nil, nil}; 
            end
            local currentColorCode: string = (select(3, string.find(text, "(|c%x%x%x%x%x%x%x%x)")) or _colorEnd) as string;
            local formattedValue = _goldColor .. " (" .. bonuses .. ")" .. currentColorCode;
            if (found.patternUsed.location == "AfterValue") then
                -- The first value here *should* be found.valueStart, but we're returning found.patternStart instead to cover an
                -- edge case where some items have phrasing like "Increase Spirit and Intellect by 20".
                -- This way, callers will look at the beginning of the PATTERN (i.e. 'spirit.+by (%d+)' or 'intellect.+ by (%d+)')
                -- instead of the beginning of the VALUE when marking this line's indicesProcessed.
                -- This same edge case doesn't seem to appear for ratings, and this also doesn't seem to break
                -- attribute displays on items, so it's a Good Enough(tm) hack.
                return {found.patternStart, found.valueEnd, formattedValue};
            elseif (found.patternUsed.location == "PatternEnd") then
                return {found.patternStart, found.patternEnd + 1, formattedValue};
            end
        end        
    end

    return {nil, nil, nil};
end

-- Take all the conversion data we found in the tooltip, and use it generate
-- rewritten tooltip lines.
local function modifyLines(statsFound: {number:LineData}): {number:string}
    local modifiedLines = {};
    for lineNum, lineData in pairs(statsFound) do
        -- Because we're mutating the line, all the indices will be off once we start changing it.
        -- Track how much we've changed it with this offset.
        local indexOffset = 0;
        local currentLine = lineData.originalText;
        -- Sort lineData.modifications so that we mutate stats in the order they appear        
        table.sort(lineData.modifications, function(modA: LineModInfo, modB: LineModInfo): boolean
            return modA.startIndex < modB.startIndex;
        end)
        for _, statData in ipairs(lineData.modifications) do
            local prevLen = currentLine:len();
            currentLine = currentLine:sub(1, statData.endIndex - 1 + indexOffset) ..
                              statData.formattedString ..
                              currentLine:sub(statData.endIndex + indexOffset);
            local lenDiff = currentLine:len() - prevLen;
            indexOffset = indexOffset + lenDiff;
        end
        modifiedLines[lineNum] = currentLine;
    end

    return modifiedLines;
end

local function generateModifiedTooltipLines(tooltip: Tooltip): {number:string}
    local statsFound: {number:LineData} = {};
    -- Skip the first line, as it's always an item name
    for i = 2, tooltip:NumLines() do
        local lineRef = G[tooltip:GetName().. "TextLeft" .. i] as FontString;
        local text = lineRef:GetText();
        local indicesProcessed: {number:boolean} = {}; -- contains a mapping of startIndex -> boolean, to track which values we've already looked at in this line
        if (text) then
            for _, statKind in ipairs(StatDetails) do                
                local modifiedLineInfo: {number, number, string} =
                        tryGenerateModifiedLine(text, statKind, indicesProcessed);                
                local injectStart = modifiedLineInfo[1];
                local injectEnd = modifiedLineInfo[2];
                local formattedValue = modifiedLineInfo[3];
                if (injectStart and injectEnd and formattedValue) then
                    -- We've found something for this stat. 
                    -- If that stat is disabled by the user, instead force formattedValue 
                    -- to be an empty string.
                    -- This way, the stat gets marked as processed, but nothing is added to the tooltip.                   
                    if (not LB.Config.DisplayToggles[statKind.kind]) then
                        formattedValue = "";                                                
                    end

                    local lineData: LineData = statsFound[i];
                    if (lineData == nil) then
                        lineData = { originalText = text, modifications = {} };
                        statsFound[i] = lineData;
                    end
                    table.insert(lineData.modifications, {
                        stat = statKind.kind,
                        statType = statKind.type,
                        startIndex = injectStart,
                        endIndex = injectEnd,
                        formattedString = formattedValue,
                    });
                    -- Mark this stat's index as processed
                    indicesProcessed[injectStart] = true;
                end                
            end
        end
    end

    return modifyLines(statsFound);
end

local function injectModifiedLines(tooltip: Tooltip, modifiedLines: {number:string})
    -- If the table is empty, we can bail immediately.
    if (next(modifiedLines) == nil) then
        return;
    end
    for i = 2, tooltip:NumLines() do
        local modifiedText: string = modifiedLines[i]
        if (modifiedText) then
            local lineRef = (G[tooltip:GetName() .. "TextLeft" .. i]) as FontString;
            lineRef:SetText(modifiedText);
        end
    end
end

local function injectStats(tooltip: Tooltip, tooltipType: TooltipType)
    local item: {string, string} = {tooltip:GetItem()} as {string, string};
    if (not item or not item[2]) then
        -- If we don't get an itemLink, don't even bother trying
        return;
    end

    local itemKey: string = tostring(getItemIDFromLink(item[2])) .. "-" .. item[1];
    local tooltipState = _tooltipState[tooltipType];

    -- If this particular tooltip already knows the lines for this item, just reuse what we have and return early
    -- Don't use the cached value unless we've seen the item at least TWICE though.
    -- Why? The first tooltip retrieval per GAME BOOT, (not /console reloadui session!)
    -- only seems to get base stats, not on-equip bonuses or other data.
    if (tooltipState.itemKey == itemKey and tooltipState.timesSeen > 1) then
        tooltipState.timesSeen = tooltipState.timesSeen + 1;
        injectModifiedLines(tooltip, tooltipState.modifiedLines);
        return;
    end

    local linesModified = generateModifiedTooltipLines(tooltip);

    if (tooltipState.itemKey == itemKey) then
        tooltipState.timesSeen = tooltipState.timesSeen + 1;
    else
        tooltipState.timesSeen = 0;
    end
    tooltipState.itemKey = itemKey;
    tooltipState.modifiedLines = linesModified;
    injectModifiedLines(tooltip, linesModified);
end

-- Entry point
_locale = GetLocaleTable(GetLocale());

GameTooltip:HookScript("OnTooltipSetItem", function(self: Tooltip)
    injectStats(self, "GameTooltip");
end);
ItemRefTooltip:HookScript("OnTooltipSetItem", function(self: Tooltip)
    injectStats(self, "ItemRefTooltip");
end);
ShoppingTooltip1:HookScript("OnTooltipSetItem", function(self: Tooltip)
    injectStats(self, "ShoppingTooltip1");
end);
ShoppingTooltip2:HookScript("OnTooltipSetItem", function(self: Tooltip)
    injectStats(self, "ShoppingTooltip2");
end);
