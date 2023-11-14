const ratingConversion = require('./ratingConversion');

describe('GetEffectFromRating', () => {
	describe('for level < 10', () => {
		let level = 9;
		it('CR_DEFENSE_SKILL', () => {
			expect(ratingConversion.GetEffectFromRating(1, 'CR_DEFENSE_SKILL', level)).toBeCloseTo(1.33);
		});
		it('CR_DODGE', () => {
			expect(ratingConversion.GetEffectFromRating(1, 'CR_DODGE', level)).toBeCloseTo(0.1666);
		});
		it('CR_PARRY', () => {
			expect(ratingConversion.GetEffectFromRating(1, 'CR_PARRY', level)).toBeCloseTo(0.1333);
		});
		it('CR_BLOCK', () => {
			expect(ratingConversion.GetEffectFromRating(1, 'CR_BLOCK', level)).toBeCloseTo(0.4);
		});
		it('CR_HIT_MELEE', () => {
			expect(ratingConversion.GetEffectFromRating(1, 'CR_HIT_MELEE', level)).toBeCloseTo(2.6);
		});
		it('CR_HIT_RANGED', () => {
			expect(ratingConversion.GetEffectFromRating(1, 'CR_HIT_RANGED', level)).toBeCloseTo(2.6);
		});
		it('CR_HIT_SPELL', () => {
			expect(ratingConversion.GetEffectFromRating(1, 'CR_HIT_SPELL', level)).toBeCloseTo(3.25);
		});
		it('CR_CRIT_MELEE', () => {
			expect(ratingConversion.GetEffectFromRating(1, 'CR_CRIT_MELEE', level)).toBeCloseTo(1.857142);
		});
		it('CR_CRIT_RANGED', () => {
			expect(ratingConversion.GetEffectFromRating(1, 'CR_CRIT_RANGED', level)).toBeCloseTo(1.857142);
		});
		it('CR_CRIT_SPELL', () => {
			expect(ratingConversion.GetEffectFromRating(1, 'CR_CRIT_SPELL', level)).toBeCloseTo(1.857142);
		});
		it('CR_HASTE_MELEE', () => {
			expect(ratingConversion.GetEffectFromRating(1, 'CR_HASTE_MELEE', level)).toBeCloseTo(2.6);
		});
		it('CR_HASTE_RANGED', () => {
			expect(ratingConversion.GetEffectFromRating(1, 'CR_HASTE_RANGED', level)).toBeCloseTo(2.6);
		});
		it('CR_HASTE_SPELL', () => {
			expect(ratingConversion.GetEffectFromRating(1, 'CR_HASTE_SPELL', level)).toBeCloseTo(2.6);
		});
		it('CR_EXPERTISE', () => {
			expect(ratingConversion.GetEffectFromRating(1, 'CR_EXPERTISE', level)).toBeCloseTo(10.4);
		});
	});
	describe('for level >= 60', () => {
		let level = 60;
		it('CR_DEFENSE_SKILL', () => {
			expect(ratingConversion.GetEffectFromRating(1, 'CR_DEFENSE_SKILL', level)).toBeCloseTo(0.666666);
		});
		it('CR_DODGE', () => {
			expect(ratingConversion.GetEffectFromRating(1, 'CR_DODGE', level)).toBeCloseTo(0.083333);
		});
		it('CR_PARRY', () => {
			expect(ratingConversion.GetEffectFromRating(1, 'CR_PARRY', level)).toBeCloseTo(0.06666);
		});
		it('CR_BLOCK', () => {
			expect(ratingConversion.GetEffectFromRating(1, 'CR_BLOCK', level)).toBeCloseTo(0.2);
		});
		it('CR_HIT_MELEE', () => {
			expect(ratingConversion.GetEffectFromRating(1, 'CR_HIT_MELEE', level)).toBeCloseTo(0.1);
		});
		it('CR_HIT_RANGED', () => {
			expect(ratingConversion.GetEffectFromRating(1, 'CR_HIT_RANGED', level)).toBeCloseTo(0.1);
		});
		it('CR_HIT_SPELL', () => {
			expect(ratingConversion.GetEffectFromRating(1, 'CR_HIT_SPELL', level)).toBeCloseTo(0.125);
		});
		it('CR_CRIT_MELEE', () => {
			expect(ratingConversion.GetEffectFromRating(1, 'CR_CRIT_MELEE', level)).toBeCloseTo(0.07142);
		});
		it('CR_CRIT_RANGED', () => {
			expect(ratingConversion.GetEffectFromRating(1, 'CR_CRIT_RANGED', level)).toBeCloseTo(0.07142);
		});
		it('CR_CRIT_SPELL', () => {
			expect(ratingConversion.GetEffectFromRating(1, 'CR_CRIT_SPELL', level)).toBeCloseTo(0.07142);
		});
		it('CR_HASTE_MELEE', () => {
			expect(ratingConversion.GetEffectFromRating(1, 'CR_HASTE_MELEE', level)).toBeCloseTo(0.1);
		});
		it('CR_HASTE_RANGED', () => {
			expect(ratingConversion.GetEffectFromRating(1, 'CR_HASTE_RANGED', level)).toBeCloseTo(0.1);
		});
		it('CR_HASTE_SPELL', () => {
			expect(ratingConversion.GetEffectFromRating(1, 'CR_HASTE_SPELL', level)).toBeCloseTo(0.1);
		});
		it('CR_EXPERTISE', () => {
			expect(ratingConversion.GetEffectFromRating(1, 'CR_EXPERTISE', level)).toBeCloseTo(0.4);
		});
	});
	describe('for level >= 10 and < 34', () => {
		let level = 25;
		it('CR_DEFENSE_SKILL', () => {
			expect(ratingConversion.GetEffectFromRating(1, 'CR_DEFENSE_SKILL', level)).toBeCloseTo(1.3333);
		});
		it('CR_DODGE', () => {
			expect(ratingConversion.GetEffectFromRating(1, 'CR_DODGE', level)).toBeCloseTo(0.1666);
		});
		it('CR_PARRY', () => {
			expect(ratingConversion.GetEffectFromRating(1, 'CR_PARRY', level)).toBeCloseTo(0.13333);
		});
		it('CR_BLOCK', () => {
			expect(ratingConversion.GetEffectFromRating(1, 'CR_BLOCK', level)).toBeCloseTo(0.4);
		});
		it('CR_HIT_MELEE', () => {
			expect(ratingConversion.GetEffectFromRating(1, 'CR_HIT_MELEE', level)).toBeCloseTo(0.30588);
		});
		it('CR_HIT_RANGED', () => {
			expect(ratingConversion.GetEffectFromRating(1, 'CR_HIT_RANGED', level)).toBeCloseTo(0.30588);
		});
		it('CR_HIT_SPELL', () => {
			expect(ratingConversion.GetEffectFromRating(1, 'CR_HIT_SPELL', level)).toBeCloseTo(0.38235);
		});
		it('CR_CRIT_MELEE', () => {
			expect(ratingConversion.GetEffectFromRating(1, 'CR_CRIT_MELEE', level)).toBeCloseTo(0.21848);
		});
		it('CR_CRIT_RANGED', () => {
			expect(ratingConversion.GetEffectFromRating(1, 'CR_CRIT_RANGED', level)).toBeCloseTo(0.21848);
		});
		it('CR_CRIT_SPELL', () => {
			expect(ratingConversion.GetEffectFromRating(1, 'CR_CRIT_SPELL', level)).toBeCloseTo(0.21848);
		});
		it('CR_HASTE_MELEE', () => {
			expect(ratingConversion.GetEffectFromRating(1, 'CR_HASTE_MELEE', level)).toBeCloseTo(0.30588);
		});
		it('CR_HASTE_RANGED', () => {
			expect(ratingConversion.GetEffectFromRating(1, 'CR_HASTE_RANGED', level)).toBeCloseTo(0.30588);
		});
		it('CR_HASTE_SPELL', () => {
			expect(ratingConversion.GetEffectFromRating(1, 'CR_HASTE_SPELL', level)).toBeCloseTo(0.30588);
		});
		it('CR_EXPERTISE', () => {
			expect(ratingConversion.GetEffectFromRating(1, 'CR_EXPERTISE', level)).toBeCloseTo(1.2235);
		});
	});
	describe('for level > 34 and < 60', () => {
		let level = 45;
		it('CR_DEFENSE_SKILL', () => {
			expect(ratingConversion.GetEffectFromRating(1, 'CR_DEFENSE_SKILL', level)).toBeCloseTo(0.9369);
		});
		it('CR_DODGE', () => {
			expect(ratingConversion.GetEffectFromRating(1, 'CR_DODGE', level)).toBeCloseTo(0.1171);
		});
		it('CR_PARRY', () => {
			expect(ratingConversion.GetEffectFromRating(1, 'CR_PARRY', level)).toBeCloseTo(0.09369);
		});
		it('CR_BLOCK', () => {
			expect(ratingConversion.GetEffectFromRating(1, 'CR_BLOCK', level)).toBeCloseTo(0.281081);
		});
		it('CR_HIT_MELEE', () => {
			expect(ratingConversion.GetEffectFromRating(1, 'CR_HIT_MELEE', level)).toBeCloseTo(0.14054);
		});
		it('CR_HIT_RANGED', () => {
			expect(ratingConversion.GetEffectFromRating(1, 'CR_HIT_RANGED', level)).toBeCloseTo(0.14054);
		});
		it('CR_HIT_SPELL', () => {
			expect(ratingConversion.GetEffectFromRating(1, 'CR_HIT_SPELL', level)).toBeCloseTo(0.175675);
		});
		it('CR_CRIT_MELEE', () => {
			expect(ratingConversion.GetEffectFromRating(1, 'CR_CRIT_MELEE', level)).toBeCloseTo(0.10038);
		});
		it('CR_CRIT_RANGED', () => {
			expect(ratingConversion.GetEffectFromRating(1, 'CR_CRIT_RANGED', level)).toBeCloseTo(0.10038);
		});
		it('CR_CRIT_SPELL', () => {
			expect(ratingConversion.GetEffectFromRating(1, 'CR_CRIT_SPELL', level)).toBeCloseTo(0.10038);
		});
		it('CR_HASTE_MELEE', () => {
			expect(ratingConversion.GetEffectFromRating(1, 'CR_HASTE_MELEE', level)).toBeCloseTo(0.14054);
		});
		it('CR_HASTE_RANGED', () => {
			expect(ratingConversion.GetEffectFromRating(1, 'CR_HASTE_RANGED', level)).toBeCloseTo(0.14054);
		});
		it('CR_HASTE_SPELL', () => {
			expect(ratingConversion.GetEffectFromRating(1, 'CR_HASTE_SPELL', level)).toBeCloseTo(0.14054);
		});
		it('CR_EXPERTISE', () => {
			expect(ratingConversion.GetEffectFromRating(1, 'CR_EXPERTISE', level)).toBeCloseTo(0.56216);
		});
	});
});
