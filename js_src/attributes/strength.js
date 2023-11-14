const args = [...arguments];
const LB = args[1];
let _config = null;
const _locale = LB.GetLocaleTable(GetLocale());
const LoadConfig = LB.Attributes.Core.LoadConfig;
const GetStatMod = LB.Attributes.Core.GetStatMod;
const floor = Math.floor;
const BlizzRound = LB.BlizzRound;
const _apPerStr = {
	WARRIOR: 2,
	PALADIN: 2,
	HUNTER: 1,
	ROGUE: 1,
	PRIEST: 1,
	SHAMAN: 2,
	MAGE: 1,
	WARLOCK: 1,
	DRUID: 2
};
const _bvPerStr = {
	WARRIOR: 0.05,
	PALADIN: 0.05,
	HUNTER: 0,
	ROGUE: 0,
	PRIEST: 0,
	SHAMAN: 0.05,
	MAGE: 0,
	WARLOCK: 0,
	DRUID: 0
};
function getAPFromStr(strength, cls) {
	const apPerStr = _apPerStr[cls];
	return strength * apPerStr;
}
function getBlockValueFromStr(strength, cls) {
	const bvPerStr = _bvPerStr[cls];
	return strength * bvPerStr;
}
function getBonusesString(strength) {
	const config = LoadConfig();
	if (!config) {
		return null;
	}
	if (!config['Strength-AttackPower'] && !config['Strength-BlockValue']) {
		return null;
	}
	const statStrings = [];
	const playerClass = UnitClass('player')[1];
	const playerRace = UnitRace('player')[1];
	let modifiedStr = strength * GetStatMod('MOD_STR', playerClass, playerRace);
	modifiedStr = BlizzRound(modifiedStr);
	if (config['Strength-AttackPower']) {
		const apFromStr = getAPFromStr(strength, playerClass);
		if (apFromStr > 0) {
			const apString = `${apFromStr.toFixed(0)} ${_locale.StatStrings.AttackPower}`;
			statStrings.push(apString);
		}
	}
	if (config['Strength-BlockValue']) {
		const bvFromStr = getBlockValueFromStr(strength, playerClass);
		if (bvFromStr > 0) {
			const bvString = `${bvFromStr.toFixed(1)} ${_locale.StatStrings.BlockValue}`;
			statStrings.push(bvString);
		}
	}
	return statStrings.join(', ');
}
LB.Attributes.Strength.GetBonusesString = getBonusesString;
