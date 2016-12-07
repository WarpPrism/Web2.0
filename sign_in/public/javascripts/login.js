var G = {};
window.onload = function() {
    G.usernameEle = document.getElementById('username');
    G.passwordEle = document.getElementById('password');

    G.resetBtn = document.getElementsByClassName('reset-btn')[0];
    G.submitBtn = document.getElementsByClassName('submit-btn')[0];

    G.modal = document.getElementsByClassName('modal')[0];
    G.modalContent = G.modal.getElementsByClassName('modal-body-text')[0];
    G.modalBtn = document.getElementsByClassName('modal-btn')[0];

    G.validState = {
        username: false,
        password: false
    };


    validate();

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
            password: false
        };
        G.usernameEle.value = G.passwordEle.value = '';
        var errors = document.getElementsByClassName('form-error');
        for (var i = 0, len = errors.length; i < len; i++) {
            errors[i].innerHTML = '';
        }
    }, false);

    G.submitBtn.addEventListener('click', function(e) {
        if (!isFormValid()) {
            modalShow('表单数据有错，请检查输入。');
            return;
        }
        if (G.modal.classList.contains('modal-active')) {
            return;
        }
        var xhr = fn.createXHR();
         
        var ajaxData = {};
        ajaxData.username = G.usernameEle.value;
        ajaxData.password = G.passwordEle.value;
        
        xhr.open('POST', '/user_login', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(fn.encodeFormData(ajaxData));
        xhr.onreadystatechange = function() {
            if (xhr.status == 200 && xhr.readyState == 4) {
                var data = JSON.parse(xhr.responseText);
                if (data.success) {
                    // 登录成功，前端跳转到用户详情页
                    window.location = '/?username=' + ajaxData.username;
                } else {
                    modalShow(data.message);
                }
            }
        }
    }, false);
}

function validate() {
    G.usernameEle.addEventListener('blur', function(e) {
        var value = this.value;
        var errorEle = this.nextElementSibling;
        if (value == '') {
            errorEle.innerHTML = '*请输入用户名';
            G.validState.username = false;
        } else {
            errorEle.innerHTML = '';
            G.validState.username = true;            
        }
    }, false);
    G.passwordEle.addEventListener('blur', function(e) {
        var value = this.value;
        var errorEle = this.nextElementSibling;
        if (value == '') {
            errorEle.innerHTML = '*请输入密码';
            G.validState.password = false;
        } else {
            errorEle.innerHTML = '';
            G.validState.password = true;            
        }
    }, false);
}

function isFormValid() {
    for (var key in G.validState) {
        if (G.validState[key] === false) {
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