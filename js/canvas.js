/*
*
*	Simple example of chess board with one figure.
*	It requires deep optimizations and remaking in OOP style.
*
**/

(function(w) {
	var u = w.Utils;
	function chessBoard() {
		var color1 = '#B58863',
			color2 = '#F0D9B5',
			oldCellSize = 80,
			cellSize = 80,
			imgSrc = 'http://images.chesscomfiles.com/js/chess/images/chess/pieces/classic/53/bn.png',
			canvas = document.getElementById("chess"),
			prerender = document.createElement('canvas'),
			ctx_tmp,
			img = new Image(),
			startX,
			startY,
			imgX = 5 * cellSize + Math.floor(cellSize / 2),
			imgY = 5 * cellSize + Math.floor(cellSize / 2),
			ctx,
			audio = window.Audio && new Audio(),
			interval = null,
			dragOk = false;
		function Constructor() {
			_init();
			u.bind(canvas, 'mousedown', _btnDown);
			u.bind(w, 'mouseup', _btnUp);
			u.bind(w, 'resize', _resize);
		}
		function _init() {
			if (canvas && canvas.getContext) {
				if (audio != null && audio.canPlayType){
					audio.src = audio.canPlayType("audio/mpeg") ? 'static/notify.mp3' : 'static/notify.ogg';
					audio.load();
				}
				ctx = canvas.getContext('2d');
				ctx_tmp = prerender.getContext('2d');
				img.src = imgSrc;
				u.bind(img, 'load', function () {
					_resize();
				});
			}
		}
		function _draw() {
			// draw board
			var k = 0;
			for (var i = 0; i < 9; i++) {
				for (var j = 0; j < 9; j++) {
					if (k == 0) {
						ctx_tmp.fillStyle = color1;
						k = 1;
					} else {
						ctx_tmp.fillStyle = color2;
						k = 0;
					}
					ctx_tmp.fillRect(i * cellSize, j * cellSize, (i + 1) * cellSize, (j + 1) * cellSize);
				}
			}
			// draw image
			ctx_tmp.drawImage(img, imgX - Math.floor(cellSize / 2), imgY - Math.floor(cellSize / 2), cellSize, cellSize);
			ctx.drawImage(prerender, 0, 0);
		}

		function _movePiece(e) {
			if (dragOk) {
				imgX = e.pageX - canvas.offsetLeft;
				imgY = e.pageY - canvas.offsetTop;
				if (imgX > canvas.offsetLeft + canvas.width - cellSize) {
					imgX = cellSize * 8 - Math.floor(cellSize / 2);
				}
				if (imgY > canvas.offsetTop + canvas.height - cellSize) {
					imgY = cellSize * 8 - Math.floor(cellSize / 2);
				}
				if (imgX < canvas.offsetLeft) {
					imgX = Math.floor(cellSize / 2);
				}
				if (imgY < canvas.offsetTop) {
					imgY = Math.floor(cellSize / 2);
				}
			}
		}

		function _btnDown(e) {
			if (e.pageX < imgX + Math.floor(cellSize / 2) + canvas.offsetLeft && 
				e.pageX > imgX - Math.floor(cellSize / 2) + canvas.offsetLeft && 
				e.pageY < imgY + Math.floor(cellSize / 2) + canvas.offsetTop && 
				e.pageY > imgY - Math.floor(cellSize / 2) + canvas.offsetTop) {
					// mouse down on image
					startX = e.pageX - canvas.offsetLeft;
					startY = e.pageY - canvas.offsetTop;
					dragOk = true;
					u.bind(w, 'mousemove', _movePiece);
					if (!interval) {
						interval = setInterval(_draw, 30);
					}
			}
		}

		function _btnUp(e) {
			if (!dragOk) {
				return;
			}
			if (e.pageX > canvas.offsetLeft && e.pageX < canvas.offsetLeft + canvas.width &&
				e.pageY > canvas.offsetTop && e.pageY < canvas.offsetTop + canvas.height) {
				// on board
				imgX = (Math.ceil((e.pageX - canvas.offsetLeft) / cellSize)- 1) * cellSize + Math.floor(cellSize / 2);
				imgY = (Math.ceil((e.pageY - canvas.offsetTop) / cellSize) -1) * cellSize + Math.floor(cellSize / 2);
			}
			else {
				// out of bound
				imgX = Math.ceil((startX - canvas.offsetLeft) / cellSize) * cellSize + Math.floor(cellSize / 2);;
				imgY = Math.ceil((startY - canvas.offsetTop) / cellSize) * cellSize + Math.floor(cellSize / 2);
			}
			if (imgX > canvas.offsetLeft + canvas.width) {
				imgX = cellSize * 8 - Math.floor(cellSize / 2);
			}
			if (imgY > canvas.offsetTop + canvas.height) {
				imgY = cellSize * 8 - Math.floor(cellSize / 2);
			}
			if (imgX < 0) {
				imgX = Math.floor(cellSize / 2);
			}
			if (imgY < 0) {
				imgY = Math.floor(cellSize / 2);
			}
			if (audio != null) {
				audio.pause();
				audio.currentTime = 0;
				audio.play();
			}
			dragOk = false;
			_draw();
			interval = clearInterval(interval);
			u.unbind(w, 'mousemove');
		}
		function _resize() {
			oldCellSize = cellSize;
			var screen = u.getScreenSize();
			if (screen.width > screen.height) {
				cellSize = (screen.height - 120) / 8;
			}
			else {
				cellSize = (screen.width - 120) / 8;
			}
			imgX = Math.floor(imgX / oldCellSize) * cellSize + Math.floor(cellSize / 2);
			imgY = Math.floor(imgY / oldCellSize) * cellSize + Math.floor(cellSize / 2);
			with(canvas) {
				width = height = cellSize * 8;
				style.margin = '50px';
			}
			prerender.width = canvas.width;
			prerender.height = canvas.height;
			_draw();
		}
		return new Constructor();
	}
	return new chessBoard();
})(window);
