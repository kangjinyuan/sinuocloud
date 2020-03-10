function waveProgress(options) {
	var id = options.id;
	var canvas = document.getElementById(id);
	var ctx = canvas.getContext('2d');
	var mW = canvas.width = canvas.offsetWidth;
	var mH = canvas.height = canvas.offsetHeight;
	var r = mH / 2;
	var xOffset = options.xOffset;
	var waveWidth = options.waveWidth;
	var waveHeight = options.waveHeight;
	var startValue = parseInt(options.startValue);
	var endValue = parseInt(options.endValue);
	var fillText = options.fillText;
	ctx.clearRect(0, 0, mW, mH);
	ctx.beginPath();
	ctx.arc(r, r, r, 0, 2 * Math.PI);
	ctx.clip();

	function drawSin(xOffset, color) {
		ctx.save();
		var sX = 0;
		var points = [];
		ctx.beginPath();
		for(var x = sX; x < sX + mW; x += 20 / mW) {
			var y = Math.sin((-sX - x) * waveWidth + xOffset) * 0.8 + 0.1;
			var dY = mH * (1 - startValue / 100);
			points.push([x, dY + y * waveHeight]);
			ctx.lineTo(x, dY + y * waveHeight);
		}
		ctx.lineTo(mW, mH);
		ctx.lineTo(sX, mH);
		ctx.lineTo(points[0][0], points[0][1]);
		var grd = ctx.createLinearGradient(0, mH, 0, 0);
		grd.addColorStop(0, color[0]);
		grd.addColorStop(1, color[1]);
		ctx.fillStyle = grd;
		ctx.fill();
		ctx.restore();
	};

	function drawText() {
		ctx.save();
		var size = 0.4 * r;
		ctx.font = options.fontSize + 'px Microsoft Yahei';
		ctx.textAlign = options.textAlign;
		ctx.fillStyle = options.fillStyle;
		ctx.fillText(fillText, r, r + size / 2);
		ctx.restore();
	};

	if(startValue <= endValue) {
		var tmp = 1;
		startValue += tmp;
	}
	if(startValue > endValue) {
		var tmp = 1;
		startValue -= tmp;
	}

	drawSin(xOffset + Math.PI * 0.7, options.afterColor);
	drawSin(xOffset, options.frontColor);
	drawText();
	xOffset += options.speed;
	options.startValue = startValue;
	options.xOffset = xOffset;
	if(startValue != endValue) {
		clearInterval(window['waveProgressTimer-' + id]);
		window['waveProgressTimer-' + id] = setInterval(function() {
			waveProgress(options);
		}, 5);
	}
}