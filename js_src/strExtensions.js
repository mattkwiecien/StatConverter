const args = [...arguments];
const LB = args[1];
LB.strStartsWith = function (str, start) {
	return str.substring(0, start.length) === start;
};

module.exports = LB;
