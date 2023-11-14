const args = [...arguments];
const LB = args[1];
let _config = null;
const _locale = LB.GetLocaleTable(GetLocale());
const LoadConfig = LB.Attributes.Core.LoadConfig;
const GetStatMod = LB.Attributes.Core.GetStatMod;
const floor = Math.floor;
const DecimalFormat = LB.Attributes.Core.DecimalFormat;

function getHealthFromStam(stamina, cls, race) {
	const healthFromStam = stamina * 10;
	const healthBonus = GetStatMod('MOD_HEALTH', cls, race);
	return healthFromStam * healthBonus;
}

function getSpellDamageFromStam(stamina, cls, race) {
	const petScaledStamina = stamina * 0.3;
	let spPerStam = GetStatMod('ADD_SPELL_DMG_MOD_STA', cls, race);
	spPerStam = spPerStam * GetStatMod('MOD_SPELL_DMG', cls, race);
	return petScaledStamina * spPerStam;
}

function getBonusesString(stamina) {
	const config = LoadConfig();
	if (!config) {
		return null;
	}
	if (!config['Stamina-Health'] && !config['Stamina-SpellDamage']) {
		return null;
	}
	const statStrings = [];
	const playerClass = UnitClass('player')[2];
	const playerRace = UnitRace('player')[2];
	let modifiedStam = stamina * GetStatMod('MOD_STA', playerClass, playerRace);
	modifiedStam = floor(modifiedStam + 0.5);
	if (config['Stamina-Health']) {
		const healthFromStam = getHealthFromStam(modifiedStam, playerClass, playerRace);
		if (healthFromStam > 0) {
			const valueString = DecimalFormat(healthFromStam);
			const hpString = valueString + ' ' + _locale.StatStrings.Health;
			statStrings.push(hpString);
		}
	}
	if (config['Stamina-SpellDamage']) {
		const spellDamageFromStam = getSpellDamageFromStam(modifiedStam, playerClass, playerRace);
		if (spellDamageFromStam > 0) {
			const valueString = DecimalFormat(spellDamageFromStam);
			const spellDamageString = valueString + ' ' + _locale.StatStrings.SpellDamage;
			statStrings.push(spellDamageString);
		}
	}
	return statStrings.join(', ');
}

LB.Attributes.Stamina.GetBonusesString = getBonusesString;
