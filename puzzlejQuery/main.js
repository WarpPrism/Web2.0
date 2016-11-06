var G = {};
G.clickType = 'normal';

$(document).ready(function() {
    var puzzleArr = initPuzzles();
    var blank = initBlank();

    for (var i = 0; i < puzzleArr.length; i++) {
        (function(ii) {
            $(puzzleArr[ii].ele).click(function(e) {
                var cur_pos = puzzleArr[ii].current_pos;
                if (cur_pos - 1 == blank.current_pos && cur_pos % 4 == 1) {
                    return;
                }
				if (cur_pos + 1 == blank.current_pos && cur_pos % 4 == 0) {
					return;
				}
                if ((cur_pos - 1 != blank.current_pos) &&
                    (cur_pos + 1 != blank.current_pos) &&
                    (cur_pos - 4 != blank.current_pos) &&
                    (cur_pos + 4 != blank.current_pos)) {
                    // 上下左右均没有空白块
                    return;
                } else {
                    var p = new Promise(function(resolve, reject) {
                        var temp;
                        temp = puzzleArr[ii].current_pos;
                        puzzleArr[ii].current_pos = blank.current_pos;
                        blank.current_pos = temp;

                        temp = puzzleArr[ii].top;
                        puzzleArr[ii].top = blank.top;
                        blank.top = temp;

                        temp = puzzleArr[ii].left;
                        puzzleArr[ii].left = blank.left;
                        blank.left = temp;

                        if (G.clickType !== 'mess') {

                            blank.ele.style.left = blank.left + 'px';
                            blank.ele.style.top = blank.top + 'px';

                            puzzleArr[ii].ele.style.left = puzzleArr[ii].left + 'px';
                            puzzleArr[ii].ele.style.top = puzzleArr[ii].top + 'px';
                        }
                        resolve();
                    });

                    p.then(function() {
                        if (isComplete(blank, puzzleArr) && G.clickType !== 'mess') {
                            alert('恭喜成功还原拼图！');
                        }
                    })

                }
            });
        })(i);
    }

    document.querySelector('.ctrl-btn').addEventListener('click', function(e) {
        messThePuzzle(blank, puzzleArr);
    }, false);
});

function initPuzzles() {
    // 将所有拼图块封装为一个对象，并返回数组
    var pzArr = [];
    var puzzleItems = $('.puzzle-item');
    for (var i = 0; i < puzzleItems.length; i++) {
        var puzzleObj = {};
        puzzleObj.id = i + 1;
        puzzleObj.ele = puzzleItems[i];
        puzzleObj.original_pos = i + 1;
        puzzleObj.current_pos = i + 1;
        puzzleObj.top = puzzleItems[i].offsetTop;
        puzzleObj.left = puzzleItems[i].offsetLeft;
        pzArr.push(puzzleObj);
    }
    return pzArr;
}

function initBlank() {
    // 初始化空白块
    var blank = {};
    blank.ele = document.querySelector('.blank');
    if (!blank.ele) {
        return;
    }
    blank.original_pos = 16;
    blank.current_pos = 16;
    blank.top = blank.ele.offsetTop;
    blank.left = blank.ele.offsetLeft;

    return blank;
}

function messThePuzzle(blank, puzzleArr) {
    // 通过鼠标事件模拟来打乱整个拼图，可能会产生无法还原的情况
    var event = document.createEvent('MouseEvents');
    event.initMouseEvent('click', true, true, document.defaultView, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

    for (var i = 0; i < 300; i++) {
        var posArr = [];
        if (blank.current_pos - 1 >= 1) {
            posArr.push(blank.current_pos - 1);
        }
        if (blank.current_pos - 4 >= 1) {
            posArr.push(blank.current_pos - 4);
        }
        if (blank.current_pos + 1 <= 16) {
            posArr.push(blank.current_pos + 1);
        }
        if (blank.current_pos + 4 <= 16) {
            posArr.push(blank.current_pos + 4);
        }

        var pos = posArr[Math.floor(Math.random() * posArr.length)];
        var ele;
        puzzleArr.forEach(function(item, index) {
            if (item.current_pos == pos) {
                ele = item.ele;
                return;
            }
        });
        console.log('mess');
        if (!ele) {
            console.log('(messThePuzzle) No puzzle item');
        } else {
            G.clickType = 'mess';
            ele.dispatchEvent(event);
        }
    }
    G.clickType = 'normal';

    for (i = 0; i < puzzleArr.length; i++) {
        (function(ii) {
            puzzleArr[i].ele.style.left = puzzleArr[i].left + 'px';
            puzzleArr[i].ele.style.top = puzzleArr[i].top + 'px';
        })(i);
    }

    blank.ele.style.left = blank.left + 'px';
    blank.ele.style.top = blank.top + 'px';
}

function isComplete(blank, puzzleArr) {
    if (blank.current_pos != blank.original_pos) {
        return false;
    }

    for (var i = 0; i < puzzleArr.length; i++) {
        if (puzzleArr[i].current_pos != puzzleArr[i].original_pos) {
            return false;
        }
    }
    return true;
}