'use strict';

var passPower = require('@adwatch/passpower');

const _config = {
	passBuffer: '',
	inputTemplate: {
		email: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i
	}
};

class ValidationCase {
	constructor() {

	}

	//Check case
	check(length, elem, val, type) {
		let result = {}, valid, status;

		switch (type) {
			case 'required' || "" :
			{
				let data = (val) ? ('' + val).trim() : '';
				setDecision((!!data), true);
				break;
			}
			case 'select':
			{
				setDecision(!($(elem).find('option:selected').val() == $(elem).find('option:eq(0)').val()), true);
				break;
			}
			case 'email':
			{
				setDecision(val, _config.inputTemplate.email.test(val));
				break;
			}
			case 'password':
			{
				let minLength = length || 6,
					passScore = passPower.passScore(val, minLength);
				setDecision(val, (passScore.analysis.hasLowercase && passScore.analysis.hasDigits && passScore.length));
				_config.passBuffer = val;
				return {
					elem: elem,
					val: val,
					type: type,
					status: status,
					validation: valid,
					score: (passScore) ? passScore.power : 0
				};
			}
			case 'equal':
			{
				setDecision(val, (_config.passBuffer === val));
				break;
			}
			case 'keyError':
			{
				setDecision('keyError', $(elem).data('f'));
				break;
			}
		}

		function setDecision(val, condition) {
			if (val === 'keyError') {
				valid = 'error';
				status = condition;
				return false;
			}
			if (val) {
				if (condition) {
					valid = 'success';
					status = 'success';
				} else {
					valid = 'error';
					status = 'invalid';
				}
			} else {
				valid = 'error';
				status = 'empty';
			}
		}

		return {elem: elem, val: val, type: type, status: status, validation: valid};
	}

	//Get state buffer
	get passBuffer() {
		return _config.passBuffer;
	}

}

module.exports = ValidationCase;