'use strict';

const _store = {
	clearCase: (that, elem) => {
		if (elem) {
			let $parent = $(elem).closest(that.setErrors.targetParent),
				$errorMessage = $parent.find(that.setErrors.targetError);
			$errorMessage.text('');
			$parent.removeClass(`${that.clsErrorInput} ${that.clsSuccessInput}`);
		} else {
			that.$blockForm.find(that.setErrors.targetParent).removeClass(`${that.clsErrorInput} ${that.clsSuccessInput}`);
			that.$blockForm.find(that.setErrors.targetError).text('');
		}

	}
};

class SetResult {
	constructor(config) {
		if (config) {
			if (config.$blockForm) {
				//ui - elems
				this.$blockForm = $(config.$blockForm);
				//ui - cls
				this.clsErrorForm = (typeof config.clsErrorForm === 'string') ? config.clsErrorForm : 'error';
				this.clsSuccessForm = (typeof config.clsSuccessForm === 'string') ? config.clsSuccessForm : 'success';
				this.clsErrorInput = (typeof config.clsErrorInput === 'string') ? config.clsErrorInput : 'error';
				this.clsSuccessInput = (typeof config.clsSuccessInput === 'string') ? config.clsSuccessInput : '';
				//options
				this.setErrors = (typeof config.setErrors === 'object') ? config.setErrors : false;
				this.ERRORS_MSG = (config.ERRORS_MSG) ? config.ERRORS_MSG : {
					empty: ((config.ERRORS_MSG) ? config.ERRORS_MSG.empty : '') ? config.ERRORS_MSG.empty : 'Значение не должно быть пустым',
					invalid: ((config.ERRORS_MSG) ? config.ERRORS_MSG.invalid : '') ? config.ERRORS_MSG.invalid : 'Значение не корректно',
					keyError: {
						oC: ((config.ERRORS_MSG) ? config.ERRORS_MSG.keyError.oC : '') ? config.ERRORS_MSG.keyError.oC : 'Разрешены только кириллические символы',
						oL: ((config.ERRORS_MSG) ? config.ERRORS_MSG.keyError.oL : '') ? config.ERRORS_MSG.keyError.oL : 'Разрешены только латинские символы',
						oN: ((config.ERRORS_MSG) ? config.ERRORS_MSG.keyError.oN : '') ? config.ERRORS_MSG.keyError.oN : 'Разрешены только цифры',
						oE: ((config.ERRORS_MSG) ? config.ERRORS_MSG.keyError.oE : '') ? config.ERRORS_MSG.keyError.oE : 'Разрешены только цифры, спецсимволы и символы латинского алфавита'
					},
					required: {
						empty: ((config.ERRORS_MSG) ? config.ERRORS_MSG.required.empty : '') ? config.ERRORS_MSG.required.empty : 'Значение не должно быть пустым'
					},
					select: {
						empty: ((config.ERRORS_MSG) ? config.ERRORS_MSG.select.empty : '') ? config.ERRORS_MSG.select.empty : 'Значение не должно быть пустым'
					},
					email: {
						empty: ((config.ERRORS_MSG) ? config.ERRORS_MSG.email.empty : '') ? config.ERRORS_MSG.email.empty : 'Значение не должно быть пустым',
						invalid: ((config.ERRORS_MSG) ? config.ERRORS_MSG.email.invalid : '') ? config.ERRORS_MSG.email.invalid : 'Неправильный формат'
					},
					password: {
						empty: ((config.ERRORS_MSG) ? config.ERRORS_MSG.password.empty : '') ? config.ERRORS_MSG.password.empty : 'Значение не должно быть пустым',
						invalid: ((config.ERRORS_MSG) ? config.ERRORS_MSG.password.invalid : '') ? config.ERRORS_MSG.password.invalid : 'Пароль Слишком простой'
					},
					equal: {
						empty: ((config.ERRORS_MSG) ? config.ERRORS_MSG.equal.empty : '') ? config.ERRORS_MSG.equal.empty : 'Значение не должно быть пустым',
						invalid: ((config.ERRORS_MSG) ? config.ERRORS_MSG.equal.invalid : '') ? config.ERRORS_MSG.equal.invalid : 'Значения не совпадают'
					}
				};
			} else {
				throw new TypeError('Absent $blockForm in options');
			}
		} else {
			throw new TypeError('Config object is not defined!');
		}

	}

	//Set Error
	setErrorsTo(state) {
		if (state) {
			let that = this,
				parentItem = this.setErrors.targetParent || '',
				elemErrorMsg = this.setErrors.targetError || '';

			if (state.length) {
				state.forEach(function (item) {
					let $parrentItem = (parentItem) ? $($(item.elem).closest(parentItem)) : '',
						$elemErrorMsg = ($parrentItem) ? $parrentItem.find(elemErrorMsg) : '';

					if (item.validation === 'error') {
						if (parentItem) {
							$parrentItem.addClass(that.clsErrorInput);
							if (elemErrorMsg) {
								$elemErrorMsg.text(that.ERRORS_MSG[item.type][item.status]);
							}
						} else {
							$(item.elem).addClass(that.clsErrorInput);
						}
					} else if (item.validation === 'success') {
						if (parentItem) {
							$(item.elem).closest(parentItem).addClass(that.clsSuccessInput);
							$elemErrorMsg.text('');
						} else {
							$(item.elem).addClass(that.clsSuccessInput);
						}
					}
				});
			}
		}
	}

	//Clear error/success classes
	clearErrors(formGroup) {
		let that = this;

		that.$blockForm.removeClass(`${that.clsErrorForm} ${that.clsSuccessForm}`);
		if (that.setErrors) {
			if (that.setErrors.targetParent) {
				if (formGroup) {
					if (!formGroup.length) {
						_store.clearCase.call(this, this, formGroup);
					} else if (formGroup.length == 1) {
						_store.clearCase.call(this, this, formGroup[0]);
					} else if (formGroup.length > 1 && !formGroup.context && !formGroup.tagName) {
						formGroup.forEach((elem)=> {
							_store.clearCase.call(this, this, elem);
						});
					} else if (formGroup.length > 1 && formGroup.context) {
						formGroup.each(function () {
							_store.clearCase.call(that, that, $(this));
						});
					}
				} else {
					_store.clearCase.call(this, this);
				}

			}
			that.$blockForm.find('[data-validation]').removeClass(`${that.clsErrorInput} ${that.clsSuccessInput}`);
		}
	}
}

module.exports = SetResult;