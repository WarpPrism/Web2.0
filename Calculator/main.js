// 2016 10 ZhouJihao 13331371
// HW4 calculator
$(document).ready(function() {
    var btns = $('.cal-btn');
    btns.each(function(index, ele) {
        $(ele).click(function() {
            handleClick(this);
        });
    });
});

document.ondragstart = function(e) {
    e = e || window.event;
    e.preventDefault();
    return false;
}

// define calculator object
var T = (function() {
    var calText = $('.cal-txt span');
    var CAL_STATE = "normal";
    return {
        // getter
        getCalText: function() {
            return calText.html().toString();
        },
        // setter
        setCalText: function(value) {
            return calText.html('' + value);
        },
        // append
        appendCalText: function(value) {
            if (CAL_STATE == 'error') {
                this.setCalText(value.toString());
                this.setNormal();
                return;
            }
            var cArr = this.getCalText().split('');
            if (cArr.length == 1 && cArr[0] == '0') {
                if (value != '.') {
                    return this.setCalText(value.toString());
                }
            }
            cArr.push(value.toString());
            this.setCalText(cArr.join(''));
        },
        // delete
        delCalText: function() {
            if (CAL_STATE == 'error') {
                return this.reset();
            }
            var cArr = this.getCalText().split('');
            if (cArr.length <= 1) {
                return this.setCalText(0);
            } 
            cArr.pop();
            this.setCalText(cArr.join(''));
        },
        // set state error
        setError: function(err_txt) {
            if (!err_txt) {
                err_txt = 'Unknown Error!';
            }
            this.setCalText(err_txt);
            return CAL_STATE == 'error' ? null : (CAL_STATE = 'error');
        },
        // set state normal
        setNormal: function() {
            return CAL_STATE == 'normal' ? null : (CAL_STATE = 'normal');
        },
        reset: function() {
            this.setCalText('0');
            this.setNormal();
        }
    };
})();

function handleClick(btn) {
    var btnText = $(btn).find('.cal-btn__content').html().toString();

    switch(btnText) {
        case 'DEL':
            T.delCalText();
            break;
        case 'CE':
            $('.cal-txt span').removeClass('cal-txt_small');
            T.setCalText(0);
            break;
        case '=':
            var expression = T.getCalText();
            calculate(expression);
            break;
        default:
            if (T.getCalText().length > 15) {
                $('.cal-txt span').addClass('cal-txt_small');
            }
            if (T.getCalText().length >= 46) {
                alert('不建议太长的表达式');
                return;
            }
            T.appendCalText(btnText);
            break;  
    }
}

function calculate(exp) {
    // validate the expression to be calculated
    if (!validate(exp)) {
        T.setError('Invalid Expression!');
        return;
    }

    try {
        var result = eval(exp);
        if (result.length > 15) {
            $('.cal-txt span').addClass('cal-txt_small');
        }
        T.setCalText(result);
    } catch(e) {
        console.error("Calculator Error: ", e);
        T.setError('Invalid Expression!');
        return;
    }
}

function validate(btnText) {
    if (btnText.indexOf('/0') > -1) {
        return false;
    }
    return true;
}