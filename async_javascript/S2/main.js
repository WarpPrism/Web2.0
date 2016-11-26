status = 0;

window.onload = function() {
    var xhr = createXHR();
    var ctrlRing = document.getElementById('control-ring');
    var btns = ctrlRing.getElementsByClassName('button');
    
    var atPlusContainer = document.getElementById('at-plus-container');

    var mainBtn = document.getElementById('button');
    mainBtn.addEventListener('mouseleave', function(e) {
        reset();
    }, false);

    var apb = document.getElementsByClassName('apb')[0];
    apb.addEventListener('click', function(e) {
        if (status == 1) {
            return;
        }
        var $i = 0;
        status = 1;
        requestNum(xhr, btns[$i], btns, $i);
    }, false);
}

function createXHR() {
    if (typeof XMLHttpRequest != 'undefined') {
        return new XMLHttpRequest();
    } else if (typeof ActiveXObject != 'undefined') {
        if (typeof arguments.callee.activeXString != 'string') {
            var versions = ['MSXML2.XMLHttp.6.0', 'MSXML2.XMLHttp.3.0', 'MSXML2.XMLHttp'],
                i, len;
            for (i = 0, len = versions.length; i < len; i++) {
                try {
                    new ActiveXObject(versions[i]);
                    arguments.callee.activeXString = versions[i];
                } catch (e) {}
            }
        }
        return new ActiveXObject(arguments.callee.activeXString);
    } else {
        throw new Error('No XHR object available.');
    }
}

function requestNum(xhr, btn, btns, $index) {
    if (status == 0) {
        return;
    }
    console.log('Requesting...');
    if ($index != undefined) {
        btn = btns[$index];
    }
    var numEle;
    if (btn) {
        numEle = btn.getElementsByClassName('num')[0];
        numEle.classList.add('num_show');
        numEle.innerHTML = '...';
    }
    disableAllBtns(btns);
    xhr.open('get', 'http://localhost:3000/', true);
    xhr.send(null);
    xhr.onreadystatechange = function() {
        if (xhr.status == 200 && xhr.readyState == 4) {
            console.log(xhr.responseText);
            numEle.innerHTML = xhr.responseText;
            enableAllBtns(btns);
            if (checkSumBtn()) {
                var infoBar = document.getElementById('info-bar');
                if (infoBar.classList.contains('info-bar_disable')) {
                    return;
                }
                calResult();
                infoBar.classList.add('info-bar_disable');
                status = 0;
            }

            if ($index != undefined) {
                requestNum(xhr, btn, btns, ++$index);
            }
            
        }
    }
}

function disableAllBtns(all) {
    for (var i = 0, len = all.length; i < len; i++) {
        all[i].classList.add('button_disable');
    }
}
function enableAllBtns(all) {
    for (var i = 0, len = all.length; i < len; i++) {
        all[i].classList.remove('button_disable');
    }
}

function checkSumBtn() {
    var nums = document.getElementsByClassName('num');
    for (var i = 0, len = nums.length; i < len; i++) {
        if (nums[i].innerHTML == '' || nums[i].innerHTML == '...') {
            return false;
        }
    }
    var infoBar = document.getElementById('info-bar');
    infoBar.classList.remove('info-bar_disable');
    return true;
}
function calResult() {
    var nums = document.getElementsByClassName('num');
    var resultEle = document.getElementsByClassName('result')[0];
    var result = 0;
    for (var i = 0, len = nums.length; i < len; i++) {
        if (nums[i].innerHTML != '' && nums[i].innerHTML != '...') {
            var item = +nums[i].innerHTML;
            result += item;
        }
    }
    resultEle.innerHTML = result;
}

function reset() {
    status = 0;
    var btns = document.getElementsByClassName('button');    
    var nums = document.getElementsByClassName('num');
    var resultEle = document.getElementsByClassName('result')[0];
    var infoBar = document.getElementById('info-bar');
    
    for (var i = 0, len = btns.length; i < len; i++) {
        btns[i].classList.remove('button_disable');
        nums[i].classList.remove('num_show');
        nums[i].innerHTML = '';
    }
    resultEle.innerHTML = '';
    infoBar.classList.add('info-bar_disable');
}