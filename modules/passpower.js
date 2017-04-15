'use strict';

//Config
const _config = {
	inputTemplate: {
		hasUppercase: /[A-Z]/,
		hasLowercase: /[a-z]/,
		hasDigits: /[0-9]/,
		hasSpecials: /[_\W]/,
		hasDigitsOnly: /^[0-9]+$/,
		hasLettersOnly: /^[a-zA-Z]+$/
	}
};

function passScore(val, minPassLength) {
	let power = 0,
		result = {};

	result.length = (val.length < minPassLength) ? 0 : val.length;

	result.analysis = {
		hasUppercase: _config.inputTemplate.hasUppercase.test(val),
		hasLowercase: _config.inputTemplate.hasLowercase.test(val),
		hasDigits: _config.inputTemplate.hasDigits.test(val),
		hasSpecials: _config.inputTemplate.hasSpecials.test(val)
	};

	power = this.setScorePassword(val, result.analysis, result.length);
	result.power = power;

	return result;
};

function setScorePassword(password, analyse, length) {
	let score = 0,
		variationCount = 0,
		letters = {},
		i = 0;

	if (!password) {
		return score;
	}

	for (i; i < length; i++) {
		letters[password[i]] = (letters[password[i]] || 0) + 1;

		score += 5.0 / letters[password[i]];
	}

	for (var check in analyse) {
		variationCount += analyse[check] ? 1 : 0;
	}
	score += (variationCount - 1) * 10;

	return parseInt(score);
};

module.exports = {
	passScore: passScore,
	setScorePassword: setScorePassword
};