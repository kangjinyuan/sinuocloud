function waveProgress(param) {
	var options = {
		waveWidth: 0.05, //波浪宽
		waveHeight: 8, //波浪高
		xOffset: 0,
		speed: 0.02, //波浪速度
		startValue: 0, //开始值
		endValue: 60, //结束值
		fillText: 60, //填充文案
		afterColor: ["rgba(51, 217, 251, 0.3)", "rgba(7, 166, 255, 0.3)"], //波浪后置色
		frontColor: ["rgba(51, 217, 251, 0.9)", "rgba(7, 166, 255, 0.9)"], //波浪前置色
		fontSize: 12, //字体大小
		textAlign: "center", //字体位置
		fillStyle: "#ffffff" //字体颜色
	}
	$.extend(options, param);
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
	param.xOffset = xOffset;
	if(startValue != endValue) {
		clearInterval(window['waveProgressTimer-' + id]);
		window['waveProgressTimer-' + id] = setInterval(function() {
			waveProgress(options);
		}, 5);
	}
}