var windowHeight;
$(function() {
	param.currentTime = resetTime(new Date(), 0);
	loadVue(".v-dom", param);
	loadData();
	loadTime();
	disPopstate();
})

//加载菜单数据
function loadData() {
	var privilegeList = accountInfo.privilegeList;
	var param = {}
	getPrivilege(param, function(res) {
		for(var i = 0; i < res.length; i++) {
			res[i].parentId = res[i].parent;
		}
		res = getTreeData(res, 2);
		var dataList = [];
		if(privilegeList.length == 0) {
			dataList = res;
		} else {
			for(var i = 0; i < res.length; i++) {
				for(var j = 0; j < privilegeList.length; j++) {
					if(res[i].id == privilegeList[j]) {
						dataList.push(res[i]);
					}
				}
			}
		}
		for(var i = 0; i < dataList.length; i++) {
			if(dataList[i].children) {
				dataList[i].children.sort(resetSort("sort", 1));
			}
		}
		setData.menuList = dataList;
		var id = routeId ? routeId.split("-")[0] : dataList[0].id;
		setPath(id);
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