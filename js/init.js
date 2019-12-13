var windowHeight;
$(function() {
	param.currentTime = "";
	loadVue(".v-dom", param);
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
	var privilegeList = accountInfo.privilegeList;
	var menuList = [];
	var param = {
		idList: [],
		parent: ""
	}
	getPrivilege(param, function(res) {
		var dataList = res;
		if(privilegeList.length == 0) {
			for(var i = 0; i < dataList.length; i++) {
				dataList[i].childList = [];
				if(dataList[i].parent == 2) {
					menuList.push(dataList[i]);
				}
			}
		} else {
			for(var i = 0; i < dataList.length; i++) {
				dataList[i].childList = [];
				for(var j = 0; j < privilegeList.length; j++) {
					if(dataList[i].id == privilegeList[j] && dataList[i].parent == 2) {
						menuList.push(dataList[i]);
					}
				}
			}
		}
		for(var i = 0; i < dataList.length; i++) {
			for(var j = 0; j < menuList.length; j++) {
				if(dataList[i].parent == menuList[j].id) {
					menuList[j].childList.push(dataList[i]);
				}
			}
		}
		setData.menuList = menuList;
		setPath(menuList[0].id);
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
			setData.currentTime = resetTime(new Date(), 0);
		}
	}, 1000);
}