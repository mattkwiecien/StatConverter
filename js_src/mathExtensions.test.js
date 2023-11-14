import { mathExt } from './mathExtensions';

describe('BlizzRound', () => {
	test('rounds down', () => {
		expect(mathExt.BlizzRound(1.1)).toBe(1);
		expect(mathExt.BlizzRound(1.65)).toBe(1);
	});
	test('rounds up', () => {
		expect(mathExt.BlizzRound(1.9)).toBe(2);
		expect(mathExt.BlizzRound(1.66)).toBe(2);
	});
});
