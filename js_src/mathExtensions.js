const args = [...arguments];
const LB = args[1];
const floor = Math.floor;
LB.BlizzRound = function (x) {
	return floor(x + 0.34);
};


module.exports = LB;
