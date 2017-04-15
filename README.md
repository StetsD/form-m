#Form

Abstract class of form


## Install

```sh
$ npm install --save @adwatch/form
```


## Usage

```js
import Form from '@adwatch/form';
// or
var Form = require('@adwatch/form/build');
```


## API


####init()

Initialize form

```js
form.init();
```


**Form Module allows chaining**
```js
form.set({clsErrorInput: 'MyErrorInput'}).check().addEvent({
	submitDisable: function(){
		this.$blockForm.on('submit', function(e){
			form.disable.apply(form, [['input']])
		});
	}
}).controller().clear().clearErrors();
```


####set(options)

Set options to specimen of Form module and dependent modules

```js
form.set({
	clsErrorForm: 'MYerror',
	clsSuccessForm: 'MYsuccess'
});
```


####controller()

Reloads controller and binds new events with new handlers

```js
form.controller();
```


####check()

Check form

*It can be take disposable optional params*

```js
form.check({
	callBeforeValidation: function(){console.log('check')},
	callAfterValidation: function(){console.log('check')},
	callErrorValidation: function(){console.log('check')},
	callSuccessValidation: function(){console.log('check')},
	current: $('.target')
})
```


####clearErrors()

Clear Error containers and error\success classes

*It can be take disposable optional params*

```js
//Clear all Errors containers
form.clearErrors();

//Clear jquery elem
form.clearErrors($('input'));

//Clear array of selectors
form.clearErrors(['input[name="first_name"]', 'select']);
```


####clear()

Clear input value

*It can be take disposable optional params*

```js
//Clear all inputs value
form.clear();

//Clear value of jquery elem
form.clear($('input'));

//Clear value array of selectors
form.clear(['input[name="first_name"]', 'select']);
```


####send()

Send form

*It can be take disposable optional params*

```js
form.send({
	newAjaxBody: {
		type: 'method',
		url: 'action',
		data: 'serialize'
	},
	callbackAjaxComplete: function(){console.log('check')},
	callbackAjaxSuccess: function(){console.log('check')},
	callbackAjaxError: function(){console.log('check')},
});

//OR
form.send();
```


####addEvent()

Add event listener to form

*Don't forget reload controller method*

```js
form.addEvent({
	submitDisable: function(){
		this.$blockForm.on('submit', function(e){
			form.disable.apply(form)
		});
	},
	anotherEvent: function(){
		///...
	}
}).controller();
```


####disable()

Disable inputs

*It can be take disposable optional params*

```js
//Disable all inputs
form.disable();

//Disable of jquery elem
form.disable([$('input')])

//Disable array of selectors
form.disable(['input[name="first_name"]', 'select']);
```


####enable()

Enable inputs

*It can be take disposable optional params*

```js
//Enable all inputs
form.enable();

//Enable of jquery elem
form.enable([$('input')])

//Enable array of selectors
form.enable(['input[name="first_name"]', 'select']);
```


####detach()

Detach\Attach form

```js
//Detach form
form.detach();

//Attach form
setTimeout(function(){
	form.detach.apply(form)
}, 2000);
```


####autocomplete()

off/on autocomplete form

```js
//ON autocomplete
form.autocomplete(true);
//OFF autocomplete
form.autocomplete(false);
```


####passBuffer

Get pass from buffer

```js
// Action - enter a password

//Submit form
form.$blockForm.submit();

setTimeout(function(){
	console.log(form.passBuffer);
}, 2000);
```


####isBlocked()

Set block to form (disable api methods)

```js
form.isBlocked(true);
```


####isBlocked

Get state of block of form

```js
console.log(form.isBlocked);
```


####getStateValidation

Get state of inputs after validation

```js
console.log(form.getStateValidation);
```


####formCollection()

Get form collections

```js
let form = new Form(config);

console.log(Form.formCollection());
```


####runCollection()

Enumeration of the collection of forms and call common methods
It not only set props but call methods with params by each form in the collection

```js
let form = new Form(config);
let formAnother = new Form(config);

Form.runCollection('clsErrorInput', 'err');
Form.runCollection('disable', ['input[name="email"]']);
```


####create(config)

Creates new form and binds it with module Form

Takes required argument

**config**

Type `object`


```js
let newForm = Form.create({

	view: {
		target: '.website',
		template: `<form class="form form_user-reg" action="_data/server-validation.json" method="GET" id="myForm2">
						<div class="form__group"> <label class="form__label">Электронная почта</label>
							<div class="form__inputbox">
								<input class="form__input form__input_email" name="last_name" data-validation>
							</div>
							<div class="form__msg"></div>
						</div>
						<button type="submit">Start</button>
					</form>`
	},

	config:{
		$blockForm: '#myForm2',
		clsErrorInput: 'error',
		setErrors: {targetParent: '.form__group', targetError: '.form__msg'},
		ajaxBody: {
			type: 'method',
			url: 'action',
			data: 'serialize',
			dataType: 'json'
		}
	}

}).init();

console.log(newForm);
```


## OPTIONS

####$blockForm
Type `string`

**It is necessary option**

It defines your form selector and other required dependencies
```js
let form = new Form({
	$blockForm: '#myForm'
});
```


####clsErrorForm
Type `string`

Default: `'error'`

Set error class to your form
```js
form.set({
	clsErrorForm: 'myError'
});
```


####clsSuccessForm
Type `string`

Default: `'success'`

Set success class to your form
```js
form.set({
	clsSuccessForm: 'mySuccess'
});
```


####clsErrorInput
Type `string`

Default: `'error'`

Set error class to your inputs of form
```js
form.set({
	clsErrorInput: 'myError'
});
```


####clsSuccessInput
Type `string`

Default: `''`

Set success class to your inputs of form
```js
form.set({
	clsSuccessInput: 'mySuccess'
});
```


####callBeforeValidation
Type `function`

Default: `''`

To callback by before form validation
```js
form.set({
	callBeforeValidation: function(){
		console.log('check');
	}
});
```


####callErrorValidation
Type `function`

Default: `''`

To callback if been bad validation
```js
form.set({
	callErrorValidation: function(){
		console.log('check');
	}
});
```


####callSuccessValidation
Type `function`

Default: `''`

To callback if been success validation
```js
form.set({
	callSuccessValidation: function(){
		console.log('check');
	}
});
```


####callAfterValidation
Type `function`

Default: `''`

To callback after form validation
```js
form.set({
	callAfterValidation: function(){
		console.log('check');
	}
});
```


####minPassLength
Type `number`

Default: `6`

Minimum quantity symbols for password input
```js
form.set({
	minPassLength: 10
});
```


####scrollToError
Type `object`

Default: `false`

Scroll window to error input
```js
form.set({
	scrollToError: {offsetTop: 10, duration: 1000}
});
```


####clearInputs
Type `boolean`

Default: `false`

Clear inputs after success validation
```js
form.set({
	clearInputs: true
});
```


####filters
Type `boolean`

Default: `false`

Enable filters and activate keyLogger (catch XSS)

*Don't forget reload controller method*

| data-f | Description |
|:------:|:-----------:|
|oC|Only Cyrillic Symbols and spaces|
|oL|Only Latin Symbols and spaces|
|oN|Only Numbers Symbols|
|oE|Only Symbols resolved in email address |
```js
form.set({
	filters: true
}).controller();
```


####setErrors
Type `object`

Default: `false`

Bind target parent node and target error node
```js
form.set({
	setErrors: {targetParent: '.form__group', targetError: '.form__msg'}
});
```


####checkPassScore
Type `object`

Default: `false`

Bind callback to password input and listen password power

*required for progress line*
```js
form.set({
	checkPassScore: {target: 'input[name="password"]',
	callback: function(score){console.log(score)}}
});
```


####blocked
Type `boolean`

Default: `false`

Block functions form
```js
form.set({
	blocked: true
});
```


####setServerError
Type `function`

Default: `false`

Set handler by server validation result
```js
form.set({
	setServerError: function(xhr, form){

	    var errors = JSON.parse(xhr.error().responseText).fields;
	    var message = JSON.parse(xhr.error().responseText).message;

	    if(errors.length){
	        errors.forEach(function(item, i){

	            let formGroup = form.$blockForm.find('[name="' + item.name + '"]').closest(form.setErrors.targetParent);
	            formGroup.addClass(form.clsErrorInput);
	            formGroup.find(form.setErrors.targetError).text(item.message);

	        });
	    }
	}
});
```


####ajaxBody
Type `object`

Default: `false`

Set AJAX body

*On Default pick values of keys from attributes form*

*Or set yours with type:string*
```js
form.set({
	ajaxBody: {
	        type: 'method',
	        url: 'action',
	        data: 'serialize'
        }
});
```


####callbackAjaxSuccess
Type `function`

Default: `''`

To callback if been success AJAX request
```js
form.set({
	callbackAjaxSuccess: function(){
		console.log('check');
	}
});
```


####callbackAjaxError
Type `function`

Default: `''`

To callback if been error AJAX request
```js
form.set({
	callbackAjaxError: function(){
		console.log('check');
	}
});
```


####callbackAjaxComplete
Type `function`

Default: `''`

Callback before complete AJAX request
```js
form.set({
	callbackAjaxComplete: function(){
		console.log('check');
	}
});
```


####ERRORS_MSG
Type `object`

Default: `false`

Set errors messages to specific types
```js
form.set({
	ERRORS_MSG: {
		empty: 'Wasted...',
		invalid: 'You shall not pass!!!',
		keyError:{
			oC: 'You shall not pass!!!',
			oL: 'You shall not pass!!!',
			oN: 'You shall not pass!!!',
			oE: 'You shall not pass!!!'
		},
		required: {
			empty: 'Wasted...'
		},
		select: {
			empty: 'Wasted...'
		},
		email: {
			empty: 'Wasted...',
			invalid: 'You shall not pass!!!'
		},
		password: {
			empty: 'Wasted...',
			invalid: 'You shall not pass!!!'
		},
		equal: {
			empty: 'Wasted...',
			invalid: 'You shall not pass!!!'
		}
	}
});
```

**Table of values by default**

| data-validation | Description |
|:------:|:-----------:|
|required.empty|Значение не должно быть пустым|
|select.empty|Значение не должно быть пустым|
|email.empty|Значение не должно быть пустым|
|email.invalid|Неправильный формат|
|password.empty|Значение не должно быть пустым|
|password.invalid|Пароль Слишком простой|
|equal.empty|Значение не должно быть пустым|
|equal.invalid|Значения не совпадают|
|keyError.oC|Разрешены только кириллические символы|
|keyError.oL|Разрешены только латинские символы|
|keyError.oN|Разрешены только цифры|
|keyError.oE|Разрешены только цифры, спецсимволы и символы латинского алфавита|

 ## License

 MIT ©
