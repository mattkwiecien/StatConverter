const args = [...arguments];
const LB = args[1];
const _locale = LB.GetLocaleTable(GetLocale());
const _defaultConfig = {
	ConfigVersion: '1.14.0',
	DisplayToggles: {
		ITEM_MOD_DEFENSE_SKILL_RATING: true,
		ITEM_MOD_DODGE_RATING: true,
		ITEM_MOD_PARRY_RATING: true,
		ITEM_MOD_BLOCK_RATING: true,
		ITEM_MOD_HIT_SPELL_RATING: true,
		ITEM_MOD_CRIT_SPELL_RATING: true,
		ITEM_MOD_HASTE_SPELL_RATING: true,
		ITEM_MOD_HIT_RATING: true,
		ITEM_MOD_CRIT_RATING: true,
		ITEM_MOD_HASTE_RATING: true,
		ITEM_MOD_EXPERTISE_RATING: true,
		ITEM_MOD_HIT_MELEE_RATING: true,
		ITEM_MOD_HIT_RANGED_RATING: true,
		ITEM_MOD_CRIT_MELEE_RATING: true,
		ITEM_MOD_CRIT_RANGED_RATING: true,
		ITEM_MOD_AGILITY: true,
		'Agility-Crit': true,
		'Agility-AP': false,
		'Agility-RAP': false,
		'Agility-Armor': false,
		'Agility-Healing': false,
		ITEM_MOD_INTELLECT: true,
		'Intellect-Mana': true,
		'Intellect-SpellCrit': true,
		'Intellect-SpellDamage': false,
		'Intellect-Healing': false,
		'Intellect-ManaRegen': false,
		'Intellect-RangedAP': false,
		'Intellect-Armor': false,
		ITEM_MOD_SPIRIT: true,
		'Spirit-ManaRegenNotCasting': true,
		'Spirit-ManaRegenCasting': false,
		'Spirit-HealthRegen': true,
		'Spirit-SpellDamage': false,
		'Spirit-Healing': false,
		ITEM_MOD_STAMINA: true,
		'Stamina-Health': true,
		'Stamina-SpellDamage': false,
		ITEM_MOD_STRENGTH: true,
		'Strength-AttackPower': true,
		'Strength-BlockValue': false,
		ITEM_MOD_ATTACK_POWER: false
	}
};
let LB_Config = null;
const LB_CONF_STR = _locale.ConfigStrings;
const _currentTogglesState = {
	ITEM_MOD_DEFENSE_SKILL_RATING: true,
	ITEM_MOD_DODGE_RATING: true,
	ITEM_MOD_PARRY_RATING: true,
	ITEM_MOD_BLOCK_RATING: true,
	ITEM_MOD_HIT_SPELL_RATING: true,
	ITEM_MOD_CRIT_SPELL_RATING: true,
	ITEM_MOD_HASTE_SPELL_RATING: true,
	ITEM_MOD_HIT_RATING: true,
	ITEM_MOD_CRIT_RATING: true,
	ITEM_MOD_HASTE_RATING: true,
	ITEM_MOD_EXPERTISE_RATING: true,
	ITEM_MOD_HIT_MELEE_RATING: true,
	ITEM_MOD_HIT_RANGED_RATING: true,
	ITEM_MOD_CRIT_MELEE_RATING: true,
	ITEM_MOD_CRIT_RANGED_RATING: true,
	ITEM_MOD_AGILITY: true,
	'Agility-Dodge': false,
	'Agility-Crit': true,
	'Agility-AP': false,
	'Agility-RAP': false,
	'Agility-Armor': false,
	'Agility-Healing': false,
	ITEM_MOD_INTELLECT: true,
	'Intellect-Mana': true,
	'Intellect-SpellCrit': true,
	'Intellect-SpellDamage': false,
	'Intellect-Healing': false,
	'Intellect-ManaRegen': false,
	'Intellect-RangedAP': false,
	'Intellect-Armor': false,
	ITEM_MOD_SPIRIT: true,
	'Spirit-ManaRegenNotCasting': true,
	'Spirit-ManaRegenCasting': false,
	'Spirit-HealthRegen': true,
	'Spirit-SpellDamage': false,
	'Spirit-Healing': false,
	ITEM_MOD_STAMINA: true,
	'Stamina-Health': true,
	'Stamina-SpellDamage': false,
	ITEM_MOD_STRENGTH: true,
	'Strength-AttackPower': true,
	'Strength-BlockValue': false,
	ITEM_MOD_ATTACK_POWER: false
};
function drawCurrentState() {
	LB_DefenseRatingCheckbox.checked = _currentTogglesState['ITEM_MOD_DEFENSE_SKILL_RATING'];
	LB_DodgeRatingCheckbox.checked = _currentTogglesState['ITEM_MOD_DODGE_RATING'];
	LB_ParryRatingCheckbox.checked = _currentTogglesState['ITEM_MOD_PARRY_RATING'];
	LB_BlockRatingCheckbox.checked = _currentTogglesState['ITEM_MOD_BLOCK_RATING'];
	LB_SpellHitRatingCheckbox.checked = _currentTogglesState['ITEM_MOD_HIT_SPELL_RATING'];
	LB_SpellCritRatingCheckbox.checked = _currentTogglesState['ITEM_MOD_CRIT_SPELL_RATING'];
	LB_SpellHasteRatingCheckbox.checked = _currentTogglesState['ITEM_MOD_HASTE_SPELL_RATING'];
	LB_PhysicalHitRatingCheckbox.checked = _currentTogglesState['ITEM_MOD_HIT_RATING'];
	LB_PhysicalCritRatingCheckbox.checked = _currentTogglesState['ITEM_MOD_CRIT_RATING'];
	LB_PhysicalHasteRatingCheckbox.checked = _currentTogglesState['ITEM_MOD_HASTE_RATING'];
	LB_PhysicalExpertiseRatingCheckbox.checked = _currentTogglesState['ITEM_MOD_EXPERTISE_RATING'];
	LB_AgilityCheckbox.checked = _currentTogglesState['ITEM_MOD_AGILITY'];
	const agilityChecked = LB_AgilityCheckbox.checked;
	LB_AgilityDodgeCheckbox.checked = _currentTogglesState['Agility-Dodge'];
	LB_AgilityDodgeCheckbox.disabled = !agilityChecked;
	LB_AgilityCritCheckbox.checked = _currentTogglesState['Agility-Crit'];
	LB_AgilityCritCheckbox.disabled = !agilityChecked;
	LB_AgilityAPCheckbox.checked = _currentTogglesState['Agility-AP'];
	LB_AgilityAPCheckbox.disabled = !agilityChecked;
	LB_AgilityRAPCheckbox.checked = _currentTogglesState['Agility-RAP'];
	LB_AgilityRAPCheckbox.disabled = !agilityChecked;
	LB_AgilityArmorCheckbox.checked = _currentTogglesState['Agility-Armor'];
	LB_AgilityArmorCheckbox.disabled = !agilityChecked;
	LB_AgilityHealingCheckbox.checked = _currentTogglesState['Agility-Healing'];
	LB_AgilityHealingCheckbox.disabled = !agilityChecked;
	LB_IntellectCheckbox.checked = _currentTogglesState['ITEM_MOD_INTELLECT'];
	const intellectChecked = LB_IntellectCheckbox.checked;
	LB_IntellectManaCheckbox.checked = _currentTogglesState['Intellect-Mana'];
	LB_IntellectManaCheckbox.disabled = !intellectChecked;
	LB_IntellectSpellCritCheckbox.checked = _currentTogglesState['Intellect-SpellCrit'];
	LB_IntellectSpellCritCheckbox.disabled = !intellectChecked;
	LB_IntellectSpellDamageCheckbox.checked = _currentTogglesState['Intellect-SpellDamage'];
	LB_IntellectSpellDamageCheckbox.disabled = !intellectChecked;
	LB_IntellectHealingCheckbox.checked = _currentTogglesState['Intellect-Healing'];
	LB_IntellectHealingCheckbox.disabled = !intellectChecked;
	LB_IntellectManaRegenCheckbox.checked = _currentTogglesState['Intellect-ManaRegen'];
	LB_IntellectManaRegenCheckbox.disabled = !intellectChecked;
	LB_IntellectRangedAPCheckbox.checked = _currentTogglesState['Intellect-RangedAP'];
	LB_IntellectRangedAPCheckbox.disabled = !intellectChecked;
	LB_IntellectArmorCheckbox.checked = _currentTogglesState['Intellect-Armor'];
	LB_IntellectArmorCheckbox.disabled = !intellectChecked;
	LB_SpiritCheckbox.checked = _currentTogglesState['ITEM_MOD_SPIRIT'];
	const spiritChecked = LB_SpiritCheckbox.checked;
	LB_SpiritManaRegenNotCastingCheckbox.checked = _currentTogglesState['Spirit-ManaRegenNotCasting'];
	LB_SpiritManaRegenNotCastingCheckbox.disabled = !spiritChecked;
	LB_SpiritManaRegenCastingCheckbox.checked = _currentTogglesState['Spirit-ManaRegenCasting'];
	LB_SpiritManaRegenCastingCheckbox.disabled = !spiritChecked;
	LB_SpiritHealthRegenCheckbox.checked = _currentTogglesState['Spirit-HealthRegen'];
	LB_SpiritHealthRegenCheckbox.disabled = !spiritChecked;
	LB_SpiritSpellDamageCheckbox.checked = _currentTogglesState['Spirit-SpellDamage'];
	LB_SpiritSpellDamageCheckbox.disabled = !spiritChecked;
	LB_StaminaCheckbox.checked = _currentTogglesState['ITEM_MOD_STAMINA'];
	const staminaChecked = LB_StaminaCheckbox.checked;
	LB_StaminaHealthCheckbox.checked = _currentTogglesState['Stamina-Health'];
	LB_StaminaHealthCheckbox.disabled = !staminaChecked;
	LB_StaminaSpellDamageCheckbox.checked = _currentTogglesState['Stamina-SpellDamage'];
	LB_StaminaSpellDamageCheckbox.disabled = !staminaChecked;
	LB_StrengthCheckbox.checked = _currentTogglesState['ITEM_MOD_STRENGTH'];
	const strChecked = LB_StrengthCheckbox.checked;
	LB_StrengthAttackPowerCheckbox.checked = _currentTogglesState['Strength-AttackPower'];
	LB_StrengthAttackPowerCheckbox.disabled = !strChecked;
	LB_StrengthBlockValueCheckbox.checked = _currentTogglesState['Strength-BlockValue'];
	LB_StrengthBlockValueCheckbox.disabled = !strChecked;
}
function LB_Config_CheckButtonChanged(_, statKey, isChecked) {
	_currentTogglesState[statKey] = isChecked;
	drawCurrentState();
}
function configFrame_OnRefresh(_) {
	for (const [k, v] of Object.entries(LB.Config.DisplayToggles)) {
		_currentTogglesState[k] = v;
	}
	drawCurrentState();
}
function configFrame_OnOkay(_) {
	for (const [k, v] of Object.entries(_currentTogglesState)) {
		LB.Config.DisplayToggles[k] = v;
		LB_Config.DisplayToggles[k] = v;
	}
}
function configFrame_OnCancel(_) {
	for (const [k, v] of Object.entries(LB.Config.DisplayToggles)) {
		_currentTogglesState[k] = v;
	}
}
function configFrame_OnDefault(_) {
	for (const [k, v] of Object.entries(_defaultConfig.DisplayToggles)) {
		_currentTogglesState[k] = v;
		LB_Config.DisplayToggles[k] = v;
		LB.Config.DisplayToggles[k] = v;
	}
	drawCurrentState();
}
function loadCompleted(configFrame) {
	configFrame.name = 'Little Buster';
	configFrame.okay = configFrame_OnOkay;
	configFrame.cancel = configFrame_OnCancel;
	configFrame.refresh = configFrame_OnRefresh;
	configFrame.default = configFrame_OnDefault;
	if (!LB_Config) {
		LB_Config = _defaultConfig;
	}
	for (const [k, v] of Object.entries(_defaultConfig)) {
		if (LB_Config[k] === undefined) {
			LB_Config[k] = v;
		}
	}
	let settingsVersion = LB_Config.ConfigVersion;
	if (typeof settingsVersion === 'number') {
		settingsVersion = settingsVersion.toString();
		LB_Config.ConfigVersion = settingsVersion;
	}
	const storedVersion = settingsVersion.split('.');
	const currentVersion = _defaultConfig.ConfigVersion.split('.');
	if (storedVersion[0] < currentVersion[0]) {
	}
	if (storedVersion[1] < currentVersion[1]) {
	}
	for (const [k, v] of Object.entries(_defaultConfig.DisplayToggles)) {
		if (LB_Config.DisplayToggles[k] === undefined) {
			LB_Config.DisplayToggles[k] = v;
		}
	}
	LB.Config = LB_Config;
	InterfaceOptions_AddCategory(configFrame);
}
function LB_ConfigRootFrame_OnEvent(self, _, ...args) {
	const addonName = args[0];
	if (addonName === 'LittleBuster') {
		loadCompleted(self);
	}
}
function LB_ConfigRootFrame_OnLoad(self) {
	self: RegisterEvent('ADDON_LOADED');
}
