-- Contains both "ambient" WoW globals and things that get exported from other files,
-- because WoW aaddons don't use the standard Lua require(). So declaring any shared
-- functions or tables globally is the only way to make the Teal compiler happy.


-- WoW Globals

global enum ClassEnum
    "WARRIOR"
    "ROGUE"
    "PRIEST"
    "DRUID"
    "SHAMAN"
    "WARLOCK"
    "MAGE"
    "HUNTER"
    "PALADIN"
end

global enum RaceEnum
    "Human"
    "Dwarf"
    "NightElf"
    "Gnome"
    "Draenei"
    "Orc"
    "Scourge" -- aka Undead/Forsake
    "Tauren"
    "Troll"
    "BloodElf"
end

-- Shapeshift IDs
global CAT_FORM: number

global function getfenv(_: number): {string:any}
end

global function strsplit(_sep: string, _string: string, _pieces: number): string...
end

global function loadstring(_luaCode: string, _chunkName: string | nil): function
end

global record AuraUtil
    FindAuraByName: function(auraName: string, unit: string, filter: string | nil): any...
end

global function format(_: string, _: string | number): string
end

global function UnitLevel(_: string): number
end

global function GetDodgeChance(): number
end

global function UnitDefense(_unit: string): {number, number};
end

global function GetLocale(): string
end

-- Returns `name` (localized), `rank`, `icon` (file ID), `castTime`, `minRange`, `maxRange`, `spellId`
global function GetSpellInfo(_spellId: number) : {string, number, number, number, number, number, number}
end

global function GetShapeshiftForm(_flag: boolean | nil) : number
end

global function GetShapeshiftFormInfo(_index: number): (string, number, number, number)
end

global function GetShapeshiftFormID(): number
end

global function GetSpellSubtext(_spellId: number): string
end

global function GetTalentInfo(_tabIndex: number, _talentIndex: number): {string, number, number, number, number, number, number, number}
end

global function UnitClass(_unitId: string): {string, ClassEnum, number}
end

global function UnitRace(_unitId: string): {string, RaceEnum, number}
end

global function GetCombatRating(_ratingId: number): number
end

global function UnitStat(_unitId: string, _statId: number): number
end

global record FontString
    GetText: function(FontString): string
    SetText: function(FontString, string)
end

global record Tooltip
    -- Returns {itemName, itemLink}
    GetItem: function(Tooltip): {string, string}
    NumLines: function(Tooltip): number
    GetName: function(Tooltip): string
end

global record ConfigFrame
    name: string
    parent: string

    -- Functions required for usage in the Addons Interface panel
    okay: function(ConfigFrame)
    refresh: function(ConfigFrame)
    cancel: function(ConfigFrame)
    default: function(ConfigFrame)

    -- Frame-y functions
    RegisterEvent: function(ConfigFrame, string)
end

-- CheckButtons as used on the Config panel
global record ConfigCheckButton
    name: string
    stat: ItemModKey
    SetText: function(ConfigCheckButton, string)
    GetText: function(ConfigCheckButton): string
    GetChecked: function(ConfigCheckButton): boolean
    SetChecked: function(ConfigCheckButton, boolean)
    SetEnabled: function(ConfigCheckButton, boolean): boolean
    IsEnabled: function(ConfigCheckButton):  boolean
end

global function InterfaceOptions_AddCategory(_: ConfigFrame)
end

global record GameTooltip
    HookScript: function(Tooltip, string, function(Tooltip))
end
global record ItemRefTooltip
    HookScript: function(Tooltip, string, function(Tooltip))
end
global record ShoppingTooltip1
    HookScript: function(Tooltip, string, function(Tooltip))
end
global record ShoppingTooltip2
    HookScript: function(Tooltip, string, function(Tooltip))
end

-- Global stat IDs provided by the game
global CR_HIT_MELEE: number
global CR_HIT_RANGED: number
global CR_CRIT_MELEE: number
global CR_CRIT_RANGED: number
global CR_HASTE_MELEE: number
global CR_HASTE_RANGED: number
global CR_EXPERTISE: number
global CR_HIT_SPELL: number
global CR_CRIT_SPELL: number
global CR_HASTE_SPELL: number
global CR_DEFENSE_SKILL: number
global CR_BLOCK: number
global CR_DODGE: number
global CR_PARRY: number

global enum ItemModKey
    "ITEM_MOD_CRIT_SPELL_RATING"
    "ITEM_MOD_HIT_SPELL_RATING"
    "ITEM_MOD_HASTE_SPELL_RATING"
    "ITEM_MOD_CRIT_RANGED_RATING"
    "ITEM_MOD_HIT_RANGED_RATING"
    "ITEM_MOD_CRIT_MELEE_RATING"
    "ITEM_MOD_HIT_MELEE_RATING"
    "ITEM_MOD_EXPERTISE_RATING"
    "ITEM_MOD_HIT_RATING"
    "ITEM_MOD_CRIT_RATING"
    "ITEM_MOD_HASTE_RATING"
    "ITEM_MOD_DEFENSE_SKILL_RATING"
    "ITEM_MOD_BLOCK_RATING"
    "ITEM_MOD_DODGE_RATING"
    "ITEM_MOD_PARRY_RATING"
    "ITEM_MOD_AGILITY"
    "ITEM_MOD_INTELLECT"
    "ITEM_MOD_SPIRIT"
    "ITEM_MOD_STAMINA"
    "ITEM_MOD_STRENGTH"
    "ITEM_MOD_ATTACK_POWER"
end

global enum AuraModEnum
    "ADD_DODGE"
    "ADD_SPELL_DMG_MOD_INT"
    "ADD_HEALING_MOD_INT"
    "ADD_MANA_REG_MOD_INT"
    "ADD_RANGED_AP_MOD_INT"
    "ADD_ARMOR_MOD_INT"
    "ADD_SPELL_DMG_MOD_STA"
    "ADD_SPELL_DMG_MOD_SPI"
    "ADD_SPELL_DMG_MOD_AP"
    "ADD_HEALING_MOD_SPI"
    "ADD_HEALING_MOD_STR"
    "ADD_HEALING_MOD_AGI"
    "ADD_HEALING_MOD_AP"
    "ADD_MANA_REG_MOD_NORMAL_MANA_REG"
    "MOD_ARMOR"
    "MOD_HEALTH"
    "MOD_MANA"
    "MOD_STR"
    "MOD_AGI"
    "MOD_STA"
    "MOD_INT"
    "MOD_SPI"
    "MOD_BLOCK_VALUE"
    "MOD_AP"
    "MOD_RANGED_AP"
    "MOD_SPELL_DMG"
    "MOD_HEALING"
end

-- Little Buster globals

-- Locale stuff

global enum LocaleStatKey
    "Dodge"
    "Crit"
    "AttackPower"
    "RangedAttackPower"
    "Armor"

    "Mana"
    "SpellCrit"
    "SpellDamage"
    "Healing"
    "ManaRegen"

    "Health"
    "HealthRegen"

    "BlockValue"
end

global enum InjectLocation
    "AfterValue"
    "PatternEnd"
end

global record SearchPattern
    pattern: string
    location: InjectLocation
end

global record LocaleTable
    -- Stat-conversion related things
    AlternativePatterns: {string:{SearchPattern}}
    GetShortStatPatterns: function(string, string): {SearchPattern}
    StatStrings: {LocaleStatKey:string}
    getLocaleTable: function(): LocaleTable

    -- Config-related things
    ConfigStrings: {string:string}    
end

-- Mappings stuff
global enum StatType
    "Rating"
    "Attribute"
end

global record StatDetailInfo
    kind: ItemModKey
    type: StatType
end

-- Config stuff
global enum ConfigToggle
    "ITEM_MOD_CRIT_SPELL_RATING"
    "ITEM_MOD_HIT_SPELL_RATING"
    "ITEM_MOD_HASTE_SPELL_RATING"
    "ITEM_MOD_CRIT_RANGED_RATING"
    "ITEM_MOD_HIT_RANGED_RATING"
    "ITEM_MOD_CRIT_MELEE_RATING"
    "ITEM_MOD_HIT_MELEE_RATING"
    "ITEM_MOD_EXPERTISE_RATING"
    "ITEM_MOD_HIT_RATING"
    "ITEM_MOD_CRIT_RATING"
    "ITEM_MOD_HASTE_RATING"
    "ITEM_MOD_DEFENSE_SKILL_RATING"
    "ITEM_MOD_BLOCK_RATING"
    "ITEM_MOD_DODGE_RATING"
    "ITEM_MOD_PARRY_RATING"
    "ITEM_MOD_AGILITY"
    "Agility-Dodge"
    "Agility-Crit"
    "Agility-AP"
    "Agility-RAP"
    "Agility-Armor"
    "Agility-Healing" -- ah, feral druids
    "ITEM_MOD_INTELLECT"
    "Intellect-Mana"
    "Intellect-SpellCrit"
    "Intellect-SpellDamage" -- from talents
    "Intellect-Healing" -- from talents
    "Intellect-ManaRegen" -- from talents
    "Intellect-RangedAP" -- from talents (yes, really)
    "Intellect-Armor" -- from talents (mages, amirite?)
    "ITEM_MOD_SPIRIT"
    "Spirit-ManaRegenNotCasting"
    "Spirit-ManaRegenCasting"
    "Spirit-HealthRegen"
    "Spirit-SpellDamage"
    "Spirit-Healing"
    "ITEM_MOD_STAMINA"
    "Stamina-Health"
    "Stamina-SpellDamage"
    "ITEM_MOD_STRENGTH"
    "Strength-AttackPower"
    "Strength-BlockValue"
    "Ignores-AttackPower"
    "ITEM_MOD_ATTACK_POWER" -- Never exposed to the user. Workaround for Russian.
end

global record Config
    ConfigVersion: string
    DisplayToggles: {ConfigToggle:boolean}
end

-- Checkboxes in config.xml
global LB_DefenseRatingCheckbox: ConfigCheckButton
global LB_DodgeRatingCheckbox: ConfigCheckButton
global LB_ParryRatingCheckbox: ConfigCheckButton
global LB_BlockRatingCheckbox: ConfigCheckButton
global LB_SpellHitRatingCheckbox: ConfigCheckButton
global LB_SpellCritRatingCheckbox: ConfigCheckButton
global LB_SpellHasteRatingCheckbox: ConfigCheckButton
global LB_PhysicalHitRatingCheckbox: ConfigCheckButton
global LB_PhysicalCritRatingCheckbox: ConfigCheckButton
global LB_PhysicalHasteRatingCheckbox: ConfigCheckButton
global LB_PhysicalExpertiseRatingCheckbox: ConfigCheckButton
-- Agility
global LB_AgilityCheckbox: ConfigCheckButton
global LB_AgilityDodgeCheckbox: ConfigCheckButton
global LB_AgilityCritCheckbox: ConfigCheckButton
global LB_AgilityAPCheckbox: ConfigCheckButton
global LB_AgilityRAPCheckbox: ConfigCheckButton
global LB_AgilityArmorCheckbox: ConfigCheckButton
global LB_AgilityHealingCheckbox: ConfigCheckButton
-- Intellect
global LB_IntellectCheckbox: ConfigCheckButton
global LB_IntellectManaCheckbox: ConfigCheckButton
global LB_IntellectSpellCritCheckbox: ConfigCheckButton
global LB_IntellectSpellDamageCheckbox: ConfigCheckButton
global LB_IntellectHealingCheckbox: ConfigCheckButton
global LB_IntellectManaRegenCheckbox: ConfigCheckButton
global LB_IntellectRangedAPCheckbox: ConfigCheckButton
global LB_IntellectArmorCheckbox: ConfigCheckButton
-- Spirit
global LB_SpiritCheckbox: ConfigCheckButton
global LB_SpiritManaRegenNotCastingCheckbox: ConfigCheckButton
global LB_SpiritManaRegenCastingCheckbox: ConfigCheckButton
global LB_SpiritHealthRegenCheckbox: ConfigCheckButton
global LB_SpiritSpellDamageCheckbox: ConfigCheckButton
-- Stamina
global LB_StaminaCheckbox: ConfigCheckButton
global LB_StaminaHealthCheckbox: ConfigCheckButton
global LB_StaminaSpellDamageCheckbox: ConfigCheckButton
-- Strength
global LB_StrengthCheckbox: ConfigCheckButton
global LB_StrengthAttackPowerCheckbox: ConfigCheckButton
global LB_StrengthBlockValueCheckbox: ConfigCheckButton

-- Attributes stuff

-- Common attribute stuff
global record StatModAdjustment
    initialValue: number
    finalAdjust: number
end

global record StatModDetails
    tab: number
    num: number
    rank: {number:number}
    buff: {string, number, number, number, number, number, number}
    condition: string -- a bit of text that's actually runanble lua code
    stance: string -- a path to a stance icon (really...)
    race: RaceEnum
end

global record CoreAttributeTable
    LoadConfig: function(): {ConfigToggle : boolean}
    GetStatMod: function(stat: AuraModEnum, class: ClassEnum, race: RaceEnum): number
    GetBaseDodge: function(class: ClassEnum): number
    DecimalFormat: function(value: number): string
end

global record AttributeTable
    GetBonusesString: function(value: number): string
end

global record Attributes
    Core: CoreAttributeTable
    Agility: AttributeTable
    Intellect: AttributeTable
    Spirit: AttributeTable
    Stamina: AttributeTable
    Strength: AttributeTable
    GetAttributeTable: function(ItemModKey): AttributeTable
end

-- This is the type of the shared table WoW gives us as the second arg to each script file
global record SharedTable
    -- mathExtensions.table
    BlizzRound: function(x: number): number

    -- strExtensions.tl
    strStartsWith: function(string, string): boolean

    -- mappings.tl
    StatDetails: {StatDetailInfo}
    ShortStatKeys: {ItemModKey:string}
    RatingIDToStatKey: {number:ItemModKey}
    StatKeyToRatingID: {ItemModKey:number}
    StatKeyIsPercentage: {ItemModKey:boolean}
    ClassNameToId: {ClassEnum:number}

    -- ratingConversion.tl
    GetEffectFromRating: function(rating: number, statId: number): number

    -- localeCore.lua
    GetLocaleTable: function(string): LocaleTable
    LocaleTables: {string:LocaleTable}

    -- Attributes:
    Attributes: Attributes

    -- config/config.tl
    Config: Config
end