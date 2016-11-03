$(document).ready(function() {
	// Game Instance
	G = singleton(function() {
		return {
			timeEle: $('.ctrl-time'),
			scoreEle: $('.ctrl-score'),
			infoEle: $('.ctrl-game-info'),
			score: 0,
			info: 'Game Ready',
			time: 30,
			start: false,
			timer: null
		}
	})();

	createRadioBox();

	resetGame();

	$('.ctrl-btn').click(function(e) {
		if (G.start) {
			// 游戏暂停
			window.clearInterval(G.timer);
			G.info = 'Game Stop';
			G.infoEle.html(G.info);
			G.start = false;
			return;
		}
		if (G.info == 'Game Ready') {
			resetGame();
			popMouse();
		}
		G.start = true;
		timeRecord();

		G.info = "Playing...";
		G.infoEle.html(G.info);


	});

	var all = $('.ctrl-radio');
	if (all.length <= 0) {
		alert('游戏尚未准备好，请刷新页面！');
		return;
	}
	all.each(function(index, item) {
		$(item).click(function(e) {
			e.preventDefault();
			if (!G.start) {
				return;
			}
			var p = new Promise(function(resolve, reject) {
				setTimeout(function() {
					if ($(item).hasClass('ctrl-radio_mouse')) {
						G.score = G.score + 1;
						G.scoreEle.html(G.score);
						$(item).removeClass('ctrl-radio_mouse');
						resolve();
					} else {
						G.score = G.score - 1;
						G.score = (G.score <= 0) ? 0 : G.score;
						G.scoreEle.html(G.score);
					}
				}, 0);
			});
			p.then(function() {
				popMouse();
			}, null);
		});
	});

});
// 单例模式
function singleton(fn) {
	var instance;
	return function() {
		return instance || fn.apply(this, arguments);
	}
}

function createRadioBox() {
	for (var i = 1; i < 7; i++) {
		for (var j = 1; j < 11; j++) {
			(function(ii, jj) {
				var radio = $('<span></span>');
				radio.addClass('ctrl-radio');
				radio.addClass('ctrl-radio_' + ii + '_' + jj);
				$('.game-body').append(radio);
			})(i, j);
		}
		var br = $('<br />');
		$('.game-body').append(br);
	}
}

function popMouse() {
	var row_random = Math.round( Math.random() * 5 + 1 );
	var col_random = Math.floor( Math.random() * 10 + 1 );

	// test data
	// let i = 0;
	// while (i < 20) {
	// 	row_random = Math.round( Math.random() * 5 + 1 );
	// 	col_random = Math.floor( Math.random() * 10 + 1 );
	// 	console.log(row_random, col_random);
	// 	i++;
	// }
	// return;
	var radio = $('.ctrl-radio_' + row_random + '_' + col_random);
	if (radio.length > 0) {
		radio.addClass('ctrl-radio_mouse');
	}
};

function resetGame() {
	G.score = 0;
	G.info = 'Game Ready';
	G.time = 30;
	G.start = false;
	if (G.timer) {
		window.clearInterval(G.timer);
	}

	G.timeEle.html(G.time);
	G.scoreEle.html(G.score);
	G.infoEle.html(G.info);
	$('.ctrl-radio_mouse').removeClass('ctrl-radio_mouse');
}

function timeRecord() {
	G.timer = setInterval(function() {
		G.time--;
		G.timeEle.html(G.time);
		if (G.time <= 0) {
			window.clearInterval(G.timer);
			alert('恭喜，你一共得到' + G.score + '分！');
			resetGame();
		}
	}, 1000);
}