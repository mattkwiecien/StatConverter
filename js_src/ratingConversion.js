const args = [...arguments];
const LB = args[1];
const _ratingBase = {
	CR_DEFENSE_SKILL: 1.5,
	CR_DODGE: 12.0,
	CR_PARRY: 15.0,
	CR_BLOCK: 5.0,
	CR_HIT_MELEE: 10,
	CR_HIT_RANGED: 10,
	CR_HIT_SPELL: 8,
	CR_CRIT_MELEE: 14,
	CR_CRIT_RANGED: 14,
	CR_CRIT_SPELL: 14,
	CR_HASTE_MELEE: 10,
	CR_HASTE_RANGED: 10,
	CR_HASTE_SPELL: 10,
	CR_EXPERTISE: 2.5
};
const _level34Ratings = { CR_DEFENSE_SKILL: true, CR_DODGE: true, CR_PARRY: true, CR_BLOCK: true };
LB.GetEffectFromRating = function (rating, id, level = -1) {
	
	if (typeof UnitLevel == undefined) level = UnitLevel('player'); 

	if (level < 34 && _level34Ratings[id]) level = 34;

	if (level >= 60) {
		return rating / _ratingBase[id] / (82 / (262 - 3 * level));
	} else if (level >= 10) {
		return rating / _ratingBase[id] / ((level - 8) / 52);
	} else {
		return rating / _ratingBase[id] / (2 / 52);
	}
};

module.exports = LB;
