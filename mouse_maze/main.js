// 2016-10-15 13331371 ZhouJihao
// HW 6 Amazing Maze!
window.onload = function() {
	// 生成单例函数
	var CreateGame = singleton(function () {
		return {
			// 游戏变量
			start: document.querySelector('.start-area'),
			end: document.querySelector('.end-area'),
			maze: document.querySelector('.maze'),
			resultTip: document.querySelector('.result-tip'),
			state: 0, // -1:lose, 0:reset, 1:win, 2: cheat
			msg: '',
			outOfMaze: false,
			random: Math.random()
		}
	});

	// ！设G为全局变量
	G = CreateGame();
	
	addHandler(G.start, 'mouseover', resetGame);

	addHandler(G.start, 'mouseleave', startRecord);

}


// 通用事件监听
function addHandler(ele, event, handler) {
	if (ele.addEventListener) {
		ele.addEventListener(event, handler, false);
	} else if (ele.attachEvent) {
		ele.attachEvent('on' + event, handler);
	} else {
		ele['on' + event] = handler;
	}
}
// 通用移除事件监听
function removeHandler(ele, event, handler) {
	if (ele.removeEventListener) {
		ele.removeEventListener(event, handler, false);
	} else if (ele.detachEvent) {
		ele.detachEvent('on' + event, handler);
	} else {
		ele['on' + event] = null;
	}
}
// 自定义console.log
function log() {
	var args = Array.prototype.slice.call(arguments);
	args.unshift('(Game Log Info)');

	console.log.apply(this, args);
}
// 通过桥接模式实现 单例模式，因为游戏是单个实例
function singleton(fn) {
	var instance;

	return function() {
		if (instance) {
			return instance;
		} else {
			instance = fn.apply(this, arguments);
			return instance;
		}
	}
}
// 元素类名操作
function addClassName(ele, cls) {
	cls = cls.toString();
	if (ele.className.indexOf(cls) >= 0) {
		return;
	} else {
		ele.className += ' ' + cls;
	}
}
function removeClassName(ele, cls) {
	cls = cls.toString();
	if (ele.className.indexOf(cls) < 0) {
		return;
	} else {
		var classNames = ele.className.split(' ');
		var i, pos;
		for (i = 0; i < classNames.length; i++) {
			if (classNames[i] == cls) {
				pos = i;
				break;
			}
		}

		classNames.splice(pos, 1);
		ele.className = classNames.join(' ');
	}
}

// 重置游戏
function resetGame(e) {
	// log('Game Reset!');
	var G = window.G;
	G.state = 0;
	G.msg = '';
	G.outOfMaze = false;

	if (G.resultTip.classList) {
		if (G.resultTip.classList.contains('result-tip_show')) {
			G.resultTip.classList.remove('result-tip_show');
		}
	} else {
		// IE 不支持classList
		removeClassName(G.resultTip, 'result-tip_show');
	}

	var walls = document.querySelectorAll('.wall-block');
	walls = Array.prototype.slice.call(walls);
	walls.forEach(function(item, index) {
		if (item.classList) {
			if (item.classList.contains('wall-block_red')) {
				item.classList.remove('wall-block_red');
			}
		} else {
			removeClassName(item, 'wall-block_red');
		}
	});

}
// 游戏开始，同时开始记录光标位置
function startRecord(e) {
	addHandler(document, 'mousemove', handleMouseMove);

	function handleMouseMove(e) {
		var e = e || window.event;
		var target = e.target || e.srcElement;
		var G = window.G;

		// 碰到墙壁，游戏失败
		if (target.classList.contains('wall-block')) {
			target.classList.add('wall-block_red');
			G.state = -1;
			G.msg = 'You Lose!';
			G.resultTip.innerHTML = G.msg;
			if (!G.resultTip.classList.contains('result-tip_show')) {
				G.resultTip.classList.add('result-tip_show');	
			}
			
			removeHandler(document, 'mousemove', arguments.callee);
			return;
		}

		// 光标到达end处
		if (target == G.end || target.parentNode == G.end) {
			// 游戏成功
			if (G.state != 2 && G.state != -1) {
				G.state = 1;
				G.msg = 'You Win!';
				G.resultTip.innerHTML = G.msg;
				if (!G.resultTip.classList.contains('result-tip_show')) {
					G.resultTip.classList.add('result-tip_show');	
				}
				removeHandler(document, 'mousemove', arguments.callee);
				return;
			} else if (G.state == 2 && G.outOfMaze) {
				// 游戏作弊
				G.msg = "Don't cheat, you should start from the 'S' and move to the 'E' inside the maze!";
				G.resultTip.innerHTML = G.msg;
				if (!G.resultTip.classList.contains('result-tip_show')) {
					G.resultTip.classList.add('result-tip_show');	
				}
				removeHandler(document, 'mousemove', arguments.callee);
				return;
			}
		}

		// cheat
		if (!target.classList.contains('maze') && !target.classList.contains('area-txt')) {
			// 不在迷宫内
			G.state = 2;
			G.outOfMaze = true;
		}
		
		if (target.classList.contains('maze')) {
			G.state = 0;
			G.outOfMaze = false;
		}
	}
}