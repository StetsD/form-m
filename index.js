'use strict';

var ValidationCase = require('./modules/validationcase');
var SetResult = require('./modules/setresult');
var KeyLogger = require('./modules/keylogger');
var passPower = require('./modules/passpower');

let setResult;
let validate = new ValidationCase();
let keyLogger = new KeyLogger();


//Config
const _config = {
	inputTemplate: {
		oS: /<\/?[a-z0-9]+>.*/gi
	}
};

//Protect Store
const _store = {
	componentsCollection: {},
	generateId() {
		let id = 0;

		return function () {
			return ++id;
		}
	},
	generateHash() {
		return function () {
			return Math.random().toString(36).substr(2, 25);
		}
	},
	addCollection(form) {
		if (form) {
			this.componentsCollection[form.HASH] = form;
		}
	},
	runCollection(prop, params){
		let collection = this.componentsCollection;

		for (let item in collection) {
			const form = collection[item],
				method = form[prop];

			if (!method) {
				throw new TypeError('Not allowed prop');
			}

			if (typeof method === 'function') {
				method.call(form, params);
			} else {
				form[prop] = params;
			}

		}
	}
};

let _controller = {
	submit() {
		this.$blockForm.on('submit', (e)=> {
			if (this.ajaxBody) {
				e.preventDefault();

				this.clearErrors();
				this.check();

				if (this.formState === this.clsSuccessForm) {
					this.send();
				}
			}
		});
	},
	blur() {
		let that = this;
		if (this.filters) {
			this.$groupInputs.on('blur', (e)=> {

				var elem = e.target,
					val = elem.value,
					$elem = $(elem),
					validType = elem.getAttribute('data-f');

				if (val) {
					if (keyLogger.logXss(val, _config.inputTemplate.oS)) {
						that.clear($elem);
					}
					if (validType) {
						if (keyLogger.filterBlur(val, validType)) {
							that.check({current: $elem, keyError: 'keyError'});
							that.clear($elem);

							return false;
						}
					}
				} else {
					that.clearErrors(elem);
				}
			});
		}
	},
	focus() {
		let that = this;
		this.$groupInputs.on('focus', (e)=> {

			var elem = $(e.target);

			that.clearErrors(elem);
		});
	},
	keyup() {
		let that = this;
		if (this.checkPassScore) {
			this.$blockForm.find(this.checkPassScore.target).on('keyup', function () {
				that.checkPassScore.callback(passPower.passScore($(this).val(), that.minPassLength).power);
			});
		}
	},
	keypress() {
		let that = this;

		if (that.filters) {
			this.$groupInputs.on('keypress', function (e) {
				let validType = $(this).data('f');

				if (keyLogger.onFilter(e, validType)) {
					that.check({current: $(this), keyError: 'keyError'});
					return false;
				} else {
					that.clearErrors(e.target);
				}
			});
		}
	},
	keydown(){
		let that = this;

		that.$blockForm.on('keydown', 'input,select,textarea', (e)=> {
			if (e.keyCode == 13) {
				that.$blockForm.submit();
			}
		});
	}
};

const generateId = _store.generateId();
const generateHash = _store.generateHash();

class Form {
	constructor(config) {
		if (config) {
			//Unique keys
			this.ID = generateId();
			this.HASH = this.ID + generateHash();
			//ui - elems
			this.$body = $('body');
			this.$html = $('html');
			this.$window = $('window');
			this.$blockForm = $(config.$blockForm);
			this.$blockParentForm = $(config.$blockForm).parent();
			this.$groupInputs = $(config.$blockForm).find('[data-validation]');
			this.$groupInputsAll = $(config.$blockForm).find('input, select, textarea');
			this.$elemSubmit = $(config.$blockForm).find('[type="submit"]');
			//ui - cls
			this.clsErrorForm = (typeof config.clsErrorForm === 'string') ? config.clsErrorForm : 'error';
			this.clsSuccessForm = (typeof config.clsSuccessForm === 'string') ? config.clsSuccessForm : 'success';
			this.clsErrorInput = (typeof config.clsErrorInput === 'string') ? config.clsErrorInput : 'error';
			this.clsSuccessInput = (typeof config.clsSuccessInput === 'string') ? config.clsSuccessInput : '';
			//callbacks
			this.callBeforeValidation = (typeof config.callBeforeValidation === 'function') ? config.callBeforeValidation : '';
			this.callAfterValidation = (typeof config.callAfterValidation === 'function') ? config.callAfterValidation : '';
			this.callErrorValidation = (typeof config.callErrorValidation === 'function') ? config.callErrorValidation : '';
			this.callSuccessValidation = (typeof config.callSuccessValidation === 'function') ? config.callSuccessValidation : '';
			//options
			this.minPassLength = (isFinite(config.minPassLength)) ? config.minPassLength : 6;
			this.scrollToError = (typeof config.scrollToError === 'object') ? config.scrollToError : false;
			this.clearInputs = (typeof config.clearInputs === 'boolean') ? config.clearInputs : false;
			this.filters = (typeof config.filters === 'boolean') ? config.filters : false;
			this.setErrors = (typeof config.setErrors === 'object') ? config.setErrors : false;
			this.checkPassScore = (typeof config.checkPassScore === 'object') ? config.checkPassScore : false;
			this.blocked = (typeof config.blocked === 'boolean') ? config.blocked : false;
			this.setServerError = (typeof config.setServerError === 'function') ? config.setServerError : false;
			//AJAX
			this.ajaxBody = (typeof config.ajaxBody === 'object') ? config.ajaxBody : false;
			this.callbackAjaxSuccess = (typeof config.callbackAjaxSuccess === 'function') ? config.callbackAjaxSuccess : '';
			this.callbackAjaxComplete = (typeof config.callbackAjaxComplete === 'function') ? config.callbackAjaxComplete : '';
			this.callbackAjaxError = (typeof config.callbackAjaxError === 'function') ? config.callbackAjaxError : '';
			//Errors config
			this.ERRORS_MSG = (typeof config.ERRORS_MSG === 'object') ? config.ERRORS_MSG : false
		} else {
			throw new TypeError('Config object is not defined!');
		}

	}

	//Check data validation
	check({
		callBeforeValidation = this.callBeforeValidation,
		callAfterValidation = this.callAfterValidation,
		callErrorValidation = this.callErrorValidation,
		callSuccessValidation = this.callSuccessValidation,
		current,
		keyError,
		keyVal
	} = {}) {
		if (!this.blocked) {
			if (current) {
				let current = false
			}
			let that = this,
				groupInputs = current || that.$groupInputs,
				inputLength = groupInputs.length;

			if (callBeforeValidation) {
				callBeforeValidation()
			}

			if (inputLength) {
				let i = 0,
					validationPack = [];
				for (i; inputLength > i; i++) {
					let val = keyVal || ((groupInputs[i].type === 'checkbox') ? groupInputs[i].checked : (groupInputs[i].type === 'radio') ? radioParse(groupInputs[i].name) : groupInputs[i].value),
						type = keyError || ((groupInputs[i].getAttribute('data-validation')) ? groupInputs[i].getAttribute('data-validation') : 'required'),
						equalFlag = false;

					if (!validationPack.length) {
						validationPack.push(validate.check(that.minPassLength, groupInputs[i], val, type));
					} else {
						for (let j = 0; validationPack.length > j; j++) {
							if (validationPack[j].elem.name === groupInputs[i].name) {
								equalFlag = true;
							}
						}
						if (!equalFlag) {
							validationPack.push(validate.check(that.minPassLength, groupInputs[i], val, type));
						}
					}
				}

				for (let t = 0; validationPack.length > t; t++) {
					if (validationPack[t].validation === 'error') {
						if (that.scrollToError) {
							let offsetElem = $(validationPack[t].elem).offset().top,
								negativeOffset = that.scrollToError.offsetTop || 0,
								duration = that.scrollToError.duration || 300;

							if (offsetElem) {
								that.$body.animate({scrollTop: offsetElem - negativeOffset}, duration, 'linear');
								that.$html.animate({scrollTop: offsetElem - negativeOffset}, duration, 'linear');
							}
						}
						this.formState = that.clsErrorForm;
						if (that.clsErrorForm) {
							that.$blockForm.addClass(that.clsErrorForm);
						}
						if (callErrorValidation) {
							callErrorValidation()
						}
						break;
					}
					if (validationPack.length - 1 === t) {
						this.formState = that.clsSuccessForm;
						if (that.clsSuccessForm) {
							that.$blockForm.addClass(that.clsSuccessForm);
						}
						if (that.clearInputs) {
							this.clear()
						}
						if (callSuccessValidation) {
							callSuccessValidation()
						}
					}
				}

				this.stateBuffer = validationPack;
				if (callAfterValidation) {
					callAfterValidation()
				}
				if (that.setErrors) {
					setResult.setErrorsTo.apply(setResult, [this.stateBuffer])
				}
				return this;
			}

			function radioParse(name) {
				let i = 0;
				for (i; inputLength > i; i++) {
					if (groupInputs[i].name === name) {
						if (groupInputs[i].checked) {
							return true;
						}
					}
				}
				return false;
			}
		}
	}

	//Clear Errors msg
	clearErrors(formGroup) {
		setResult.clearErrors.apply(setResult, [formGroup]);
		return this;
	}

	//Clear inputs
	clear(inputs) {
		if (!inputs) {
			this.$blockForm[0].reset();
		} else {
			if (inputs.length > 1) {
				$(inputs).each(function () {
					let $elem = $(this),
						length = $(this).length;

					if (length === 1) {
						caseInput($elem);
					} else if (length > 1) {
						$elem.each(function () {
							caseInput($(this));
						});
					} else if (length === 0) {
						return true;
					}
				});
			} else {
				$(inputs).val('');
			}
		}

		//Apply case input
		function caseInput(elem) {
			let tag = elem[0].tagName,
				type = elem.attr('type');

			if (tag == 'INPUT' && type !== 'radio' && type !== 'checkbox') {
				elem.val('');
			} else if (type == 'radio' || type == 'checkbox') {
				elem.prop('checked', false);
			} else if (tag == 'SELECT') {
				elem.find('option:eq(0)').prop('selected', true);
			}
		}

		return this;
	}

	//Send Form
	send({
		newAjaxBody = this.ajaxBody,
		callbackAjaxComplete = this.callbackAjaxComplete,
		callbackAjaxSuccess = this.callbackAjaxSuccess,
		callbackAjaxError = this.callbackAjaxError,
	} = {}) {
		let that = this;

		if (newAjaxBody) {
			let type = (newAjaxBody.type === 'method') ? that.$blockForm.attr('method') : newAjaxBody.type,
				url = (newAjaxBody.url === 'action') ? that.$blockForm.attr('action') : newAjaxBody.url,
				data = (newAjaxBody.data === 'serialize') ? that.$blockForm.serialize() : newAjaxBody.data,
				body = {type: type, url: url, data: data};

			that.$elemSubmit.prop('disabled', true);

			$.ajax(body).done((data) => {
				if (callbackAjaxSuccess) {
					callbackAjaxSuccess(data)
				}
				if (that.clearInputs) {
					this.clear()
				}
			}).fail((xhr, textStatus) => {
				if (callbackAjaxError) {
					callbackAjaxError(xhr)
				}
			}).complete((xhr, textStatus) => {
				that.xhr = xhr;
				that.textStatus = textStatus;
				if (textStatus == 'error' && this.setServerError) {
					this.setServerError(that.xhr, that)
				}
				if (callbackAjaxComplete) {
					callbackAjaxComplete(xhr)
				}
				that.$elemSubmit.prop('disabled', false);
			});

			return this;
		}

		that.$blockForm.submit();
	}

	//Adding event listener to form obj
	addEvent(events) {
		if (events) {
			for (var e in events) {
				if (_controller[e]) {
					throw new TypeError('This event name is already exist');
				} else {
					_controller[e] = events[e];
				}
			}
		} else {
			this.controller();
		}

		return this;
	}

	//Disable all input
	disable(selectors) {
		let that = this;

		if (selectors) {
			selectors.forEach(function (item) {
				$(item).attr('disabled', true);
			});
		} else {
			that.$groupInputsAll.attr('disabled', true);
		}

		return this;
	}

	//Enable all input
	enable(selectors) {
		let that = this;

		if (selectors) {
			selectors.forEach(function (item) {
				$(item).attr('disabled', false);
			});
		} else {
			that.$groupInputsAll.attr('disabled', false);
		}
		return this;
	}

	//Detach\Undetach form
	detach() {
		if (this.$blockForm.is(':visible')) {
			this.$blockForm.detach();
		} else {
			this.$blockForm.appendTo(this.$blockParentForm);
		}
		return this;
	}

	//Autocomplete off/on
	autocomplete(param) {
		if (typeof param !== 'boolean') {
			throw new TypeError('Not valid type. Type of param must be boolean type');
		}

		let val = param === true ? 'on' : 'off';

		this.$blockForm.attr('autocomplete', val);

		return this;
	}

	//Get pass buffer
	get passBuffer() {
		return validate.passBuffer;
	}

	//Get block result
	get isBlocked() {
		return this.blocked;
	}

	//Set block to form
	set isBlocked(val) {
		if (typeof val === 'boolean') {
			this.blocked = val
		}
	}

	//Get state validation
	get getStateValidation() {
		return this.stateBuffer;
	}

	//Forms collection
	static formCollection() {
		return _store.componentsCollection;
	}

	static runCollection(func, props) {
		_store.runCollection(func, props);
	}

	//Create new Form
	static create(options) {
		if (options.view.target && options.view.template) {
			$(options.view.target).append(options.view.template);
			return new Form(options.config);
		} else {
			throw new TypeError('Did not been to put required parameter view.target or view.template');
		}
	}

	//Set option
	set(options) {
		for (var i in options) {
			if (this.hasOwnProperty(i)) {
				this[i] = options[i];
				if (setResult.hasOwnProperty(i)) {
					setResult[i] = options[i];
				}
			} else {
				throw new TypeError(`Option ${i} does not exist`);
			}
		}

		return this;
	}

	//init Controller
	controller() {

		for (var event in _controller) {
			_controller[event].call(this);
		}

		return this;
	}

	//Init Component
	init() {
		setResult = new SetResult({
			setErrors: this.setErrors,
			clsErrorForm: this.clsErrorForm,
			clsSuccessForm: this.clsSuccessForm,
			clsErrorInput: this.clsErrorInput,
			clsSuccessInput: this.clsSuccessInput,
			$blockForm: this.$blockForm,
			ERRORS_MSG: this.ERRORS_MSG
		});
		this.autocomplete(false);
		this.controller();
		_store.addCollection(this);
		return this;
	}
}

module.exports = Form;
