const args = [...arguments];
const LB = args[1];
LB.LocaleTables = {};
LB.GetLocaleTable = function (locale) {
	let foundLocale = LB.LocaleTables[locale];
	if (!foundLocale) {
		const localeLang = locale.substring(0, 2);
		for (const k in LB.LocaleTables) {
			if (k.startsWith(localeLang)) {
				foundLocale = LB.LocaleTables[k];
			}
		}
		if (!foundLocale) {
			console.log('Little Buster is running in an unsupported locale (' + locale + '). Falling back to enUS.');
			foundLocale = LB.LocaleTables['enUS'];
		}
	}
	return foundLocale.getLocaleTable();
};

module.exports = LB;
