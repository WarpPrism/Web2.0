var G = {};

window.onload = function() {
    // Get All DOM Elements
    G.usernameEle = document.getElementById('username');
    G.studentIdEle = document.getElementById('studentId');
    G.phoneNumberEle = document.getElementById('phoneNumber');
    G.emailEle = document.getElementById('email');

    G.resetBtn = document.getElementsByClassName('reset-btn')[0];
    G.submitBtn = document.getElementsByClassName('submit-btn')[0];

    // reset handler
    G.resetBtn.addEventListener('click', function(e) {
        G.usernameEle.value = G.studentIdEle.value = G.phoneNumberEle.value = G.emailEle.value = '';
    }, false);

    // submit handler
    G.submitBtn.addEventListener('click', function(e) {
        // Form must be valid
        var formData = {};
        formData.username = G.usernameEle.value;
        formData.studentId = G.studentIdEle.value;
        formData.phoneNumber = G.phoneNumberEle.value;
        formData.email = G.emailEle.value;

        var xhr = createXHR();
        xhr.open('POST', 'http://localhost:8000/', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(JSON.stringify(formData));

        xhr.onreadystatechange = function() {
            if (xhr.status == 200 && xhr.readyState == 4) {
                // console.log(xhr.responseText);
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