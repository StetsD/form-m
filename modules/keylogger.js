'use strict';

//Config
const _config = {
	inputTemplate: {
		oC: /[а-яё]|\s/gi,
		oL: /[a-z]|\s/gi,
		oN: /\d+$/g,
		oS: /<\/?[a-z0-9]+>.*/gi,
		oE: /[A-Z]|[а-яё]|[0-9]|[+|<|>|"|'|_|=||)|(|*|&|^|%|$|#|@|!|?|:|.|\\|/|;|,|-]/gi,
		email: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i,
		hasUppercase: /[A-Z]/,
		hasLowercase: /[a-z]/,
		hasDigits: /[0-9]/,
		hasSpecials: /[_\W]/,
		hasDigitsOnly: /^[0-9]+$/,
		hasLettersOnly: /^[a-zA-Z]+$/
	}
};

class KeyLogger {
	constructor() {
		this.config = _config;
		this.BlurTemp = {
			oC: /[а-яё]|\s+[а-яё]/gi,
			oL: /[a-z]|\s+[a-z]/gi,
			oN: /\d+$/g,
			oE: /[A-Z]|[0-9]|[+|<|>|"|'|_|=||)|(|*|&|^|%|$|#|@|!|?|:|.|\\|/|;|,|-]/gi,
		}
	}

	//Apply entry filter
	onFilter(e, elem = 'default') {
		let symbol = String.fromCharCode(e.keyCode);

		if (!symbol.match(_config.inputTemplate[elem])) {
			return true;
		} else {
			return false;
		}
	}

	filterBlur(string, elem = 'default') {
		if (!this.BlurTemp[elem].test(string)) {
			return true;
		} else {
			return false;
		}
	}

	logXss(string, elem = 'default') {
		if (string.match(/<\/?[a-z0-9]+>.*/gi)) {
			return true;
		} else {
			return false;
		}
	}
}

module.exports = KeyLogger;
