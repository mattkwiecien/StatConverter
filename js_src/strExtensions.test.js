import { strExt } from './strExtensions';

describe('the string abc', () => {
	test('starts with a', () => {
		expect(strExt.strStartsWith('abc', 'a')).toBeTruthy();
	});

	test('starts with b', () => {
		expect(strExt.strStartsWith('abc', 'b')).toBeFalsy();
	});
});
