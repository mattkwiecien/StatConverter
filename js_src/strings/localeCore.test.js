const localCore = require('./localeCore');

describe('GetLocaleTable', () => {
	it('enUS', () => {
		expect(localCore.GetLocaleTable('enUS')).toBe();
	});
});
