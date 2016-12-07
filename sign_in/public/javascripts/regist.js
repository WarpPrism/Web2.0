var G = {};

window.onload = function() {
    // Get All DOM Elements
    G.usernameEle = document.getElementById('username');
    G.passwordEle = document.getElementById('password');
    G.password2Ele = document.getElementById('password2');
    G.studentIdEle = document.getElementById('studentId');
    G.phoneNumberEle = document.getElementById('phoneNumber');
    G.emailEle = document.getElementById('email');

    G.resetBtn = document.getElementsByClassName('reset-btn')[0];
    G.submitBtn = document.getElementsByClassName('submit-btn')[0];

    G.modal = document.getElementsByClassName('modal')[0];
    G.modalContent = G.modal.getElementsByClassName('modal-body-text')[0];
    G.modalBtn = document.getElementsByClassName('modal-btn')[0];

    G.validState = {
        username: false,
        passord: false,
        passord2: false,
        studentId: false,
        phoneNumber: false,
        email: false
    };
    // 启用表单验证
    validate();

    // modal button handler
    G.modalBtn.addEventListener('click', function(e) {
        G.modal.classList.remove('modal-active');
    }, false);

    // reset handler
    G.resetBtn.addEventListener('click', function(e) {
        if (G.modal.classList.contains('modal-active')) {
            return;
        }
        G.validState = {
            username: false,
            passord: false,
            passord2: false,
            studentId: false,
            phoneNumber: false,
            email: false
        };
        G.usernameEle.value = G.studentIdEle.value = G.phoneNumberEle.value = G.emailEle.value = 
        G.passwordEle.value = G.password2Ele.value = '';

        var errors = document.getElementsByClassName('form-error');
        for (var i = 0, len = errors.length; i < len; i++) {
            errors[i].innerHTML = '';
        }
    }, false);

    // submit handler
    G.submitBtn.addEventListener('click', function(e) {
        // Form must be valid
        if (!isFormValid()) {
            modalShow('表单数据有错，请检查输入。');
            return;
        }
        if (G.modal.classList.contains('modal-active')) {
            return;
        }
        var formData = {};
        formData.username = G.usernameEle.value;
        formData.password = G.passwordEle.value;
        formData.studentId = G.studentIdEle.value;
        formData.phoneNumber = G.phoneNumberEle.value;
        formData.email = G.emailEle.value;

        var xhr = createXHR();
        xhr.open('POST', 'http://localhost:8000/user_regist', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(encodeFormData(formData));

        xhr.onreadystatechange = function() {
            if (xhr.status == 200 && xhr.readyState == 4) {
                var data = JSON.parse(xhr.responseText);
                if (data.success) {
                    // 注册成功，前端跳转到用户详情页
                    window.location = '/?username=' + formData.username;
                } else {
                    modalShow(data.message);
                }
            }
        }
    }, false);
}

function createXHR() {
    if (typeof XMLHttpRequest != 'undefined') {
        return new XMLHttpRequest();
    } else if (typeof ActiveXObject != 'undefined') {
        return new ActiveXObject(Microsoft.XMLHTTP);
    } else {
        throw new Error('No XHR Object Available');
    }
}

// 将object转为form data，方便post提交
// @param {Object} obj [数据对象]
// @return {String}
function encodeFormData(obj) {
    if (!obj) return;
    var pairs = [];
    for (var name in obj) {
        if (!obj.hasOwnProperty(name)) continue;
        if (typeof obj[name] == 'function') continue;
        var value = obj[name].toString();
        name = encodeURIComponent(name.replace('%20', '+'));
        value = encodeURIComponent(value.replace('%20', '+'));
        pairs.push(name + '=' + value);
    }
    return pairs.join('&');
}

function validate() {
    G.usernameEle.addEventListener('blur', function(e) {
        var value = this.value.toString();
        var errorEle = this.nextElementSibling;
        var pattern = /[a-zA-Z][a-zA-Z0-9_]{5,17}/g;
        var result = value.match(pattern);
        if (result != null && result[0] === value) {
            errorEle.innerHTML = '';
            G.validState.username = true;
        } else {
            errorEle.innerHTML = '*6~18位英文字母、数字或下划线，必须以英文字母开头';
            G.validState.username = false;
        }
    }, false);

    G.passwordEle.addEventListener('blur', function(e) {
        var value = this.value.toString();
        var errorEle = this.nextElementSibling;
        var pattern = /[0-9a-zA-Z_-]{6,12}/g;
        var result = value.match(pattern);     
        if (result != null && result[0] === value) {
            errorEle.innerHTML = '';
            G.validState.passord = true;
        } else {
            errorEle.innerHTML = '*6~12位数字、大小写字母、中划线、下划线';
            G.validState.passord = false;                     
        }
    }, false);

    G.password2Ele.addEventListener('blur', function(e) {
        var value = this.value.toString();
        var errorEle = this.nextElementSibling;
        if (value === G.passwordEle.value.toString()) {
            errorEle.innerHTML = '';
            G.validState.passord2 = true;
        } else {
            errorEle.innerHTML = '*两次密码输入不一致';
            G.validState.passord2 = false;            
        }
    }, false);

    G.studentIdEle.addEventListener('blur', function(e) {
        var value = this.value.toString();
        var errorEle = this.nextElementSibling;
        var pattern = /[1-9][0-9]{7}/g;
        var result = value.match(pattern);
        if (result != null && result[0] === value) {
            errorEle.innerHTML = '';
            G.validState.studentId = true;
        } else {
            errorEle.innerHTML = '*8位数字，不能以0开头';
            G.validState.studentId = false;
        }
    }, false);

    G.phoneNumberEle.addEventListener('blur', function(e) {
        var value = this.value.toString();
        var errorEle = this.nextElementSibling;
        var pattern = /[1-9][0-9]{10}/g;
        var result = value.match(pattern);
        if (result != null && result[0] === value) {
            errorEle.innerHTML = '';
            G.validState.phoneNumber = true;
        } else {
            errorEle.innerHTML = '*11位数字，不能以0开头';
            G.validState.phoneNumber = false;
        }
    }, false);

    G.emailEle.addEventListener('blur', function(e) {
        var value = this.value.toString();
        var errorEle = this.nextElementSibling;
        var pattern = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/g;
        var result = value.match(pattern);
        if (result != null && result[0] === value) {
            errorEle.innerHTML = '';
            G.validState.email = true;
        } else {
            errorEle.innerHTML = '*请输入正确的邮箱地址';
            G.validState.email = false;
        }
    }, false);
}

function isFormValid() {
    for (var item in G.validState) {
        if (G.validState[item] === false) {
            return false;
        } 
    }
    return true;
}

function modalShow(text) {
    G.modal.classList.add('modal-active');
    if (!text) text = '';
    G.modalContent.innerHTML = text;
    return true;
}
