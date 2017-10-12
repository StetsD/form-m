'use strict';

//Config
const _config = {
    inputTemplate: {
        oC: /[а-яё]|\s/gi,
        oL: /[a-z]|\s/gi,
        oN: /\d+$/g,
        oS: /<\/?[a-z0-9]+>.*/gi,
        oE: /[A-Z]|[а-яё]|[0-9]|[+|<|>|"|'|_|=||)|(|*|&|^|%|$|#|@|!|?|:|.|\\|/|;|,|-]/gi,
        oP: /[A-Z]|[0-9]|[+|<|>|"|'|_|=||)|(|*|&|^|%|$|#|@|!|?|:|.|\\|/|;|,|-]/gi,
        email: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i,
        hasUppercase: /[A-Z]/,
        hasLowercase: /[a-z]/,
        hasDigits: /[0-9]/,
        hasSpecials: /[_\W]/,
        hasDigitsOnly: /^[0-9]+$/,
        hasLettersOnly: /^[a-zA-Z]+$/
    }
};

let _parseReg = function(string, regs){
    let decision = false;
    regs.forEach(reg => {
        if(reg.test(string)){
            decision = true;
        }
    });
    return decision;
};

class KeyLogger {
    constructor(){
        this.config = _config;
        this.specials = {
            'Escape': true,
            'Tab': true,
            'Enter': true,
            'Backspace': true,
            'Spacebar': true,
            'Insert': true,
            'Home': true,
            'PageUp': true,
            'Delete': true,
            'End': true,
            'PageDown': true,
            'ArrowUp': true,
            'ArrowDown': true,
            'ArrowLeft': true,
            'ArrowRight': true,
            'Pause': true,
            'ContextMenu': true,
            'F1': true,
            'F2': true,
            'F3': true,
            'F4': true,
            'F5': true,
            'F6': true,
            'F7': true,
            'F8': true,
            'F9': true,
            'F10': true,
            'F11': true,
            'F12': true,
        };
        this.BlurTemp = {
            oC: /[а-яё]|\s+[а-яё]/gi,
            oL: /[a-z]|\s+[a-z]/gi,
            oN: /\d+$/g,
            oE: /[A-Z]|[а-яё]|[0-9]|[+|<|>|"|'|_|=||)|(|*|&|^|%|$|#|@|!|?|:|.|\\|/|;|,|-]/gi,
            oP: /[A-Z]|[0-9]|[+|<|>|"|'|_|=||)|(|*|&|^|%|$|#|@|!|?|:|.|\\|/|;|,|-]/gi
        }
    }

    //Apply entry filter
    onFilter(e, elem = 'default') {
        let keyCode = e.keyCode,
            symbol = e.key || String.fromCharCode(keyCode);

        if(symbol in this.specials) return;
        if(!symbol.match(this.config.inputTemplate[elem])) {
            return true;
        } else {
            return false;
        }
    }

    filterBlur(string, elem = 'default'){
        let regs = this.BlurTemp,
            filters = [];

        switch(elem){
            case 'oC':
                filters = filters.concat([regs.oL, regs.oN]);
                break;
            case 'oL':
                filters = filters.concat([regs.oC, regs.oN]);
                break;
            case 'oN':
                filters = filters.concat([regs.oC, regs.oL]);
                break;
            case 'oE':

                break;
            case 'oP':
                filters = filters.concat([regs.oC]);
                break;
            default:
                break;
        }

        return _parseReg(string, filters);
    }

    logXss(string, elem = 'default'){
        if(string.match(this.config.inputTemplate.oS)){
            return true;
        }else{
            return false;
        }
    }
}

module.exports = KeyLogger;
