const args = [...arguments];
const LB = args[1];
const G = window;
let _locale = null;
const _goldColor = '|cfffffe8b';
const _colorEnd = '|r';
const StatDetails = LB.StatDetails;
const ShortStatKeys = LB.ShortStatKeys;
const StatKeyToRatingID = LB.StatKeyToRatingID;
const StatKeyIsPercentage = LB.StatKeyIsPercentage;
const GetEffectFromRating = LB.GetEffectFromRating;
const GetLocaleTable = LB.GetLocaleTable;
const GetAttributeTable = LB.Attributes.GetAttributeTable;

const TooltipType = {};
const TooltipState = {};
const LineModInfo = {};
const LineData = {};
const StatScanResult = {};

const _tooltipState = {
	GameTooltip: { itemKey: null, modifiedLines: [], timesSeen: 0 },
	ItemRefTooltip: { itemKey: null, modifiedLines: [], timesSeen: 0 },
	ShoppingTooltip1: { itemKey: null, modifiedLines: [], timesSeen: 0 },
	ShoppingTooltip2: { itemKey: null, modifiedLines: [], timesSeen: 0 }
};

const getItemIDFromLink = (itemLink) => {
	const firstColonIndex = itemLink.indexOf(':');
	const secondColonIndex = itemLink.indexOf(':', firstColonIndex + 1);
	const itemID = itemLink.substring(firstColonIndex + 1, secondColonIndex - 1);
	return parseInt(itemID);
};

const scanForStat = (text, statKey, _) => {
	const lowercaseText = text.toLowerCase();
	let discoveredCapture = null;
	let successfulPattern = null;

	for (const pattern of _locale.AlternativePatterns[statKey]) {
		discoveredCapture = lowercaseText.match(pattern.pattern.toLowerCase());
		if (discoveredCapture !== null) {
			successfulPattern = pattern;
			break;
		}
	}

	if (discoveredCapture === null) {
		const shortStatKey = ShortStatKeys[statKey];
		if (shortStatKey === null) {
			return null;
		}
		const shortStatString = G[shortStatKey].toLowerCase();
		const shortStatPatterns = _locale.GetShortStatPatterns(shortStatString, statKey);
		for (const pattern of shortStatPatterns) {
			discoveredCapture = lowercaseText.match(pattern.pattern);
			if (discoveredCapture !== null) {
				successfulPattern = pattern;
				break;
			}
		}
	}
	if (discoveredCapture === null) {
		return null;
	}
	const patternStart = lowercaseText.indexOf(successfulPattern.pattern);
	const patternEnd = patternStart + successfulPattern.pattern.length;
	const value = parseInt(discoveredCapture[1]);
	if (patternStart !== -1 && patternEnd !== -1 && !isNaN(value)) {
		const patternSubstring = lowercaseText.substring(patternStart, patternEnd);
		const captureStart = patternSubstring.indexOf(discoveredCapture[0]);
		const captureEnd = captureStart + discoveredCapture[0].length;
		return {
			valueStart: captureStart + patternStart,
			valueEnd: captureEnd + patternStart,
			patternStart: patternStart,
			patternEnd: patternEnd,
			patternUsed: successfulPattern,
			valueFound: value
		};
	}
	return null;
};
const tryGenerateModifiedLine = (text, statInfo, indicesProcessed) => {
	let statValue = null;
	const found = scanForStat(text, statInfo.kind, statInfo.type);
	if (found !== null && !indicesProcessed[found.valueStart] && found.valueFound) {
		if (statInfo.kind === 'ITEM_MOD_ATTACK_POWER') {
			return [found.valueStart, found.valueEnd, ''];
		}
		if (statInfo.type === 'Rating') {
			statValue = GetEffectFromRating(found.valueFound, StatKeyToRatingID[statInfo.kind]);
			if (found.valueStart !== -1 && found.valueEnd !== -1 && statValue) {
				const currentColorCode = text.match(/(|c[0-9a-fA-F]{8})/)[0] || _colorEnd;
				const endFragment = StatKeyIsPercentage[statInfo.kind] ? '%' : '';
				const formattedValue = _goldColor + ' (' + statValue.toFixed(2) + endFragment + ')' + currentColorCode;
				if (found.patternUsed.location === 'AfterValue') {
					return [found.valueStart, found.valueEnd, formattedValue];
				} else if (found.patternUsed.location === 'PatternEnd') {
					return [found.patternStart, found.patternEnd, formattedValue];
				}
			}
		} else if (statInfo.type === 'Attribute') {
			const attributeTable = GetAttributeTable(statInfo.kind);
			const bonuses = attributeTable.GetBonusesString(found.valueFound);
			if (!bonuses) {
				return [null, null, null];
			}
			const currentColorCode = text.match(/(|c[0-9a-fA-F]{8})/)[0] || _colorEnd;
			const formattedValue = _goldColor + ' (' + bonuses + ')' + currentColorCode;
			if (found.patternUsed.location === 'AfterValue') {
				return [found.patternStart, found.valueEnd, formattedValue];
			} else if (found.patternUsed.location === 'PatternEnd') {
				return [found.patternStart, found.patternEnd + 1, formattedValue];
			}
		}
	}
	return [null, null, null];
};
const modifyLines = (statsFound) => {
	const modifiedLines = {};
	for (const lineNum in statsFound) {
		const lineData = statsFound[lineNum];
		let indexOffset = 0;
		let currentLine = lineData.originalText;
		lineData.modifications.sort((modA, modB) => modA.startIndex - modB.startIndex);
		for (const statData of lineData.modifications) {
			const prevLen = currentLine.length;
			currentLine = currentLine.substring(0, statData.endIndex - 1 + indexOffset) + statData.formattedString + currentLine.substring(statData.endIndex + indexOffset);
			const lenDiff = currentLine.length - prevLen;
			indexOffset += lenDiff;
		}
		modifiedLines[lineNum] = currentLine;
	}
	return modifiedLines;
};
const generateModifiedTooltipLines = (tooltip) => {
	const statsFound = {};
	for (let i = 1; i < tooltip.childNodes.length; i++) {
		const lineRef = tooltip.childNodes[i].childNodes[0];
		const text = lineRef.textContent;
		const indicesProcessed = {};
		if (text) {
			for (const statKind of StatDetails) {
				const modifiedLineInfo = tryGenerateModifiedLine(text, statKind, indicesProcessed);
				const injectStart = modifiedLineInfo[0];
				const injectEnd = modifiedLineInfo[1];
				const formattedValue = modifiedLineInfo[2];
				if (injectStart !== null && injectEnd !== null && formattedValue !== null) {
					if (!LB.Config.DisplayToggles[statKind.kind]) {
						formattedValue = '';
					}
					let lineData = statsFound[i];
					if (lineData === undefined) {
						lineData = { originalText: text, modifications: [] };
						statsFound[i] = lineData;
					}
					lineData.modifications.push({
						stat: statKind.kind,
						statType: statKind.type,
						startIndex: injectStart,
						endIndex: injectEnd,
						formattedString: formattedValue
					});
					indicesProcessed[injectStart] = true;
				}
			}
		}
	}
	return modifyLines(statsFound);
};
const injectModifiedLines = (tooltip, modifiedLines) => {
	if (Object.keys(modifiedLines).length === 0) {
		return;
	}
	for (let i = 1; i < tooltip.childNodes.length; i++) {
		const modifiedText = modifiedLines[i];
		if (modifiedText) {
			const lineRef = tooltip.childNodes[i].childNodes[0];
			lineRef.textContent = modifiedText;
		}
	}
};
const injectStats = (tooltip, tooltipType) => {
	const item = tooltip.item;
	if (!item || !item[1]) {
		return;
	}
	const itemKey = getItemIDFromLink(item[1]) + '-' + item[0];
	const tooltipState = _tooltipState[tooltipType];
	if (tooltipState.itemKey === itemKey && tooltipState.timesSeen > 1) {
		tooltipState.timesSeen++;
		injectModifiedLines(tooltip, tooltipState.modifiedLines);
		return;
	}
	const linesModified = generateModifiedTooltipLines(tooltip);
	if (tooltipState.itemKey === itemKey) {
		tooltipState.timesSeen++;
	} else {
		tooltipState.timesSeen = 0;
	}
	tooltipState.itemKey = itemKey;
	tooltipState.modifiedLines = linesModified;
	injectModifiedLines(tooltip, linesModified);
};
_locale = GetLocaleTable(GetLocale());
GameTooltip.SetItem = (item) => {
	GameTooltip.item = item;
	injectStats(GameTooltip, 'GameTooltip');
};
ItemRefTooltip.SetItem = (item) => {
	ItemRefTooltip.item = item;
	injectStats(ItemRefTooltip, 'ItemRefTooltip');
};
ShoppingTooltip1.SetItem = (item) => {
	ShoppingTooltip1.item = item;
	injectStats(ShoppingTooltip1, 'ShoppingTooltip1');
};
ShoppingTooltip2.SetItem = (item) => {
	ShoppingTooltip2.item = item;
	injectStats(ShoppingTooltip2, 'ShoppingTooltip2');
};
