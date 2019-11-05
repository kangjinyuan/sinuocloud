var windowHeight;
$(function() {
	param.currentTime = "";
	param.accountName = accountInfo.name;
	loadVue(param);
	loadData();
	loadTime();
	resetSize();
})

window.onresize = function() {
	resetSize();
}

function resetSize() {
	windowHeight = $(document).height();
	$(".main-box").height(windowHeight - 80);
}

//加载菜单数据
function loadData() {
	var timestamp = new Date().getTime();
	getService(function(res) {
		setData.menuList = res;
		setPath("0");
		nextTick(function() {
			var width = 100 / $(".nav-box li").length + "%";
			$(".nav-box li").css("width", width);
		})
	});
}

//加载当前时间
function loadTime() {
	var loadTime = setInterval(function() {
		var checkI = judeToken();
		if(checkI == true) {
			var date = new Date();
			setData.currentTime = resetTime(date, 0);
		}
	}, 1000);
}