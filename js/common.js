//用户信息
var accountInfo = window.localStorage.getItem("accountInfo") ? JSON.parse(window.localStorage.getItem("accountInfo")) : getUrlParam("accountInfo");

//路由id
var routeId = getUrlParam("routeId", top.window.location.href);

//	数字正则表达式
var regular_num = /^[0-9.-]*$/;

//	手机正则表达式
var regular_telephone = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;

//	密码正则表达式
var regular_password = /^[A-Za-z0-9]{4,16}$/;

//	邮箱正则表达式
var regular_email = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;

//	身份证正则表达式
var regular_idNumber = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/;

//	code正则表达式
var regular_code = /^[A-Za-z0-9]*$/;

//vue对象变量,弹框数组变量
var setData, maskArray = [];

//初始化vue参数
var param = {
	window: {},
	menuList: [],
	selected: "",
	path: "",
	parentData: "",
	dataList: [],
	contentList: [],
	allIsActive: false,
	pageList: [],
	totalPage: 0,
	pageSize: 0,
	pageNo: 0,
	count: 0,
	dataLength: 0,
	accountInfo: accountInfo
}

//加载VUE
function loadVue(el, param) {
	setData = new Vue({
		el: el,
		data: param,
		filters: {
			resetTime: function(time, flag) {
				if(time == null) {
					return "";
				} else {
					return resetTime(time, flag);
				}
			}
		}
	})
}

//刷新页面
function reloadPage() {
	window.location.reload();
}

//页面渲染完毕之后回调
function nextTick(callback) {
	Vue.nextTick(function() {
		callback();
	});
}

//公共请求方法
//method 请求方式
//requestUrl 请求地址
//isPage 请求是否设置翻页
//param 参数
//showLoading 是否显示loading
//okCallback 成功回调
//noCallback 失败回调
function request(method, requestUrl, param, showLoading, okCallback, noCallback) {
	var timestamp = new Date().getTime();
	if(param.pageNo) {
		var isPage = true;
	} else {
		var isPage = false;
	}
	var groupId = getUrlParam("groupId");
	if(groupId) {
		param.groupId = groupId;
	} else {
		if(accountInfo) {
			param.accessToken = accountInfo.accessToken;
			param.groupId = accountInfo.groupId;
			param.projectId = accountInfo.projectId;
		}
	}
	if(method == "POST") {
		param = JSON.stringify(param);
	}
	if(showLoading) {
		top.layer.load(1, {
			shade: [0.2, '#333'],
			area: ['37px', '37px']
		});
	}
	requestUrl = editUrlParam("timestamp", timestamp, requestUrl);
	$.ajax({
		type: method,
		url: url + requestUrl,
		contentType: "application/json;charset=UTF-8",
		data: param,
		dataType: 'json',
		success: function(res) {
			if(res.code == "0000") {
				okCallback(res);
				if(isPage == true) {
					idList = [];
					var data = res.data;
					setData.dataLength = data.dataList.length;
					setData.totalPage = data.totalPage;
					setData.pageSize = data.pageSize;
					setData.pageNo = data.pageNo;
					setData.count = data.count;
					resetPage();
				}
			} else if(res.code == "0007" || res.code == "0006") {
				window.localStorage.setItem("accountInfo", "");
				top.location.href = host + "/sinuocloud/login.html?groupId=" + accountInfo.groupId;
			} else if(res.code == "5000") {
				top.layer.msg("服务器内部错误");
			} else {
				noCallback(res);
			}
			if(showLoading) {
				top.layer.closeAll('loading');
			}
		},
		error: function(res) {
			if(res.status == '401' || res.status == '402' || res.status == '403' || res.status == '404' || res.status == '405' || res.status == '407' || res.status == '413' || res.status == '414' || res.status == '415' || res.status == '500' || res.status == '502' || res.status == '503' || res.status == '504' || res.status == '505') {
				window.location.href = host + '/sinuocloud/parts/err.html';
			}
		}
	});
}

//闪向请求
function shanxiangRequest(method, requestUrl, param, showLoading, okCallback, noCallback) {
	var timestamp = new Date().getTime();
	if(param.pageNo) {
		var isPage = true;
	} else {
		var isPage = false;
	}
	if(method == "POST") {
		if(accountInfo) {
			param.accessToken = accountInfo.accessToken;
		}
		param = JSON.stringify(param);
	}
	if(showLoading) {
		top.layer.load(1, {
			shade: [0.2, '#333'],
			area: ['37px', '37px']
		});
	}
	requestUrl = editUrlParam("timestamp", timestamp, requestUrl);
	$.ajax({
		type: method,
		url: hikUrl + requestUrl,
		contentType: "application/json;charset=UTF-8",
		data: param,
		dataType: 'json',
		success: function(res) {
			if(res.code == "0000") {
				okCallback(res);
				if(isPage == true) {
					idList = [];
					var data = res.data;
					setData.dataLength = data.dataList.length;
					setData.totalPage = data.totalPage;
					setData.pageSize = data.pageSize;
					setData.pageNo = data.pageNo;
					setData.count = data.count;
					resetPage();
				}
			} else if(res.code == "0007" || res.code == "0006") {
				window.localStorage.setItem("accountInfo", "");
				top.location.href = host + "/sinuocloud/login.html?groupId=" + accountInfo.groupId;
			} else if(res.code == "5000") {
				top.layer.msg("服务器内部错误");
			} else {
				noCallback(res);
			}
			if(showLoading) {
				top.layer.closeAll('loading');
			}
		},
		error: function(res) {
			if(res.status == '401' || res.status == '402' || res.status == '403' || res.status == '404' || res.status == '405' || res.status == '407' || res.status == '413' || res.status == '414' || res.status == '415' || res.status == '500' || res.status == '502' || res.status == '503' || res.status == '504' || res.status == '505') {
				window.location.href = host + '/sinuocloud/parts/err.html';
			}
		}
	});
}

//思诺请求
function sinuoRequest(method, requestUrl, param, showLoading, okCallback, noCallback) {
	var timestamp = new Date().getTime();
	if(param.pageNo) {
		var isPage = true;
	} else {
		var isPage = false;
	}
	if(method == "POST") {
		if(accountInfo) {
			param.accessToken = accountInfo.accessToken;
		}
		param = JSON.stringify(param);
	}
	if(showLoading) {
		top.layer.load(1, {
			shade: [0.2, '#333'],
			area: ['37px', '37px']
		});
	}
	requestUrl = editUrlParam("timestamp", timestamp, requestUrl);
	$.ajax({
		type: method,
		url: sinuoUrl + requestUrl,
		headers: {
			"Content-Type": "application/json;charset=utf8",
			"Authorization": "bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hZG1pbi5pZmlyZXNlcnZpY2UuY29tXC9hcGlcL2F1dGhcL2xvZ2luIiwiaWF0IjoxNTc3NjkwNTczLCJleHAiOjE4OTMwNTA1NzMsIm5iZiI6MTU3NzY5MDU3MywianRpIjoid0xTTTNiMnU0UUpoc212OCIsInN1YiI6NDIsInBydiI6ImJiNjVkOWI4ZmJmMGRhOTgyN2M4ZWQyMzFkOWM1NGM4MTdmMGZiYjIifQ.1ohkOy4CLnXtpZAqiqtMaTjULT_OBDXA4p8djB1ylMQ"
		},
		data: param,
		dataType: 'json',
		success: function(res) {
			if(res.code == "0") {
				okCallback(res);
				if(isPage == true) {
					idList = [];
					var data = res.data;
					setData.dataLength = data.data.length;
					setData.totalPage = data.last_page;
					setData.pageSize = data.per_page;
					setData.pageNo = data.current_page;
					setData.count = data.total;
					resetPage();
				}
			} else {
				noCallback(res);
			}
			if(showLoading) {
				top.layer.closeAll('loading');
			}
		},
		error: function(res) {
			if(res.status == '401' || res.status == '402' || res.status == '403' || res.status == '404' || res.status == '405' || res.status == '407' || res.status == '413' || res.status == '414' || res.status == '415' || res.status == '500' || res.status == '502' || res.status == '503' || res.status == '504' || res.status == '505') {
				window.location.href = host + '/sinuocloud/parts/err.html';
			}
		}
	});
}

//海康请求函数
function hikRequest(param, showLoading, callback) {
	if(param.param.pageNo) {
		var isPage = true;
	} else {
		var isPage = false;
	}
	shanxiangRequest("POST", "/artemis/v1/post/string", param, showLoading, function(res) {
		callback(res);
		if(isPage == true) {
			idList = [];
			setData.dataLength = res.data.list.length;
			setData.totalPage = Math.ceil(res.data.total / res.data.pageSize);
			setData.pageSize = res.data.pageSize;
			setData.pageNo = res.data.pageNo;
			setData.count = res.data.total;
			resetPage();
		}
	}, function(res) {
		top.layer.msg("网络异常");
	});
}

function importRequest(elem, method, requestUrl, param, okCallback, noCallback) {
	if(method == "POST") {
		param.accessToken = accountInfo.accessToken;
		param.groupId = accountInfo.groupId;
		param.projectId = accountInfo.id;
	}
	layui.use(['upload', 'element', 'layer'], function() {
		var upload = layui.upload,
			element = top.window.layui.element;
		upload.render({
			elem: elem,
			method: method,
			url: url + requestUrl,
			data: param,
			accept: 'file',
			acceptMime: "file/*",
			size: 10240,
			before: function(res) {
				top.$("body").append("<div class='progress-box'><div class='layui-progress-box'><div class='layui-progress' lay-showpercent='true' lay-filter='progress'><div class='layui-progress-bar' lay-percent='0%'><span class='layui-progress-text'></span></div></div></div></div>");
				var progress = 0;
				timer = setInterval(function() {
					progress = progress + Math.random() * 10 | 0;
					if(progress > 95) {
						progress = 95;
						clearInterval(timer);
					}
					element.progress('progress', progress + '%');
				}, 300 + Math.random() * 1000);
			},
			done: function(res) {
				if(res.code == "0000") {
					clearInterval(timer);
					element.progress('progress', '100%');
					okCallback(res);
				} else {
					noCallback(res);
				}
				top.$(".progress-box").remove();
			},
			error: function(res) {
				if(res.status == '401' || res.status == '402' || res.status == '403' || res.status == '404' || res.status == '405' || res.status == '407' || res.status == '413' || res.status == '414' || res.status == '415' || res.status == '500' || res.status == '502' || res.status == '503' || res.status == '504' || res.status == '505') {
					window.location.href = host + '/sinuocloud/parts/err.html';
				}
			}
		});
	});
}

//webSocket通讯
function connectSocket(param, connectCallback, subscribeCallback) {
	var clientId = param.clientId;
	var client = window[clientId] = Stomp.client(param.url);
	client.heartbeat.outgoing = param.outgoing;
	client.heartbeat.incoming = param.incoming;
	var headers = {
		login: param.login,
		passcode: param.passcode,
		'client-id': clientId
	};
	client.connect(headers, function(frame) {
		connectCallback(frame);
		client.subscribe(clientId, function(message) {
			subscribeCallback(message);
		});
	}, function(error) {
		client.disconnect(function() {
			console.log("连接中断");
		})
	});
}

//格式化字符串时间
function judeDate(date) {
	if(typeof(date) == "string") {
		date = date.substring(0, 19);
		date = date.replace(/-/g, '/');
	}
	date = new Date(date);
	return date;
}

//重置特殊时间格式
function resetSpecialTime(date, flag) {   
	var array = date.split("T"); 
	var dateArray = array[0].split('-');  
	var year = dateArray[0];
	var month = dateArray[1];
	var day = dateArray[2];
	var timeArray = array[1].split('.')[0].split(':');
	var hh = timeArray[0]; 
	var mm = timeArray[1];
	var ss = timeArray[2]; 
	if(flag == 0) {
		return year + "-" + month + "-" + day + " " + hh + ":" + mm + ":" + ss; 
	}
}

//格式化时间
Date.prototype.Format = function(fmt) {
	var o = {
		"M+": this.getMonth() + 1, //月份           
		"d+": this.getDate(), //日           
		"h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时           
		"H+": this.getHours(), //小时           
		"m+": this.getMinutes(), //分           
		"s+": this.getSeconds(), //秒           
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度           
		"S": this.getMilliseconds() //毫秒           
	};
	var week = {
		"0": "日",
		"1": "一",
		"2": "二",
		"3": "三",
		"4": "四",
		"5": "五",
		"6": "六"
	};
	if(/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	if(/(E+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "星期" : "周") : "") + week[this.getDay() + ""]);
	}
	for(var k in o) {
		if(new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		}
	}
	return fmt;
}

//重置时间
function resetTime(date, flag) {
	if(date) {
		date = judeDate(date);
		if(flag == 0) {
			return date.Format("yyyy-MM-dd HH:mm:ss");
		} else if(flag == 1) {
			return date.Format("yyyy-MM-dd HH:mm");
		} else if(flag == 2) {
			return date.Format("yyyy-MM-dd HH");
		} else if(flag == 3) {
			return date.Format("yyyy-MM-dd");
		} else if(flag == 4) {
			return date.Format("yyyy-MM");
		} else if(flag == 5) {
			return date.Format("yyyy");
		} else if(flag == 6) {
			return date.Format("yyyy年MM月dd日 HH时mm分ss");
		} else if(flag == 7) {
			return date.Format("yyyy年MM月dd日 HH时mm分");
		} else if(flag == 8) {
			return date.Format("yyyy年MM月dd日 HH时");
		} else if(flag == 9) {
			return date.Format("yyyy年MM月dd日");
		} else if(flag == 10) {
			return date.Format("yyyy年MM月");
		} else if(flag == 11) {
			return date.Format("yyyy年");
		} else if(flag == 12) {
			return date.Format("MM-dd");
		} else if(flag == 13) {
			return date.Format("HH:mm:ss");
		} else if(flag == 14) {
			return date.Format("yyyyMMddHHmmss");
		} else if(flag == 15) {
			return date.Format("yyyyMMdd");
		} else if(flag == 16) {
			return date.Format("HH:mm");
		} else if(flag == 17) {
			return date.Format("yyyy/MM/dd HH:mm:ss EEE");
		}
	} else {
		return "";
	}
}

//重置时间戳
function resetTimeStamp(date) {
	date = judeDate(date);
	date = new Date(date).getTime();
	return date;
}

//重置结束时间
function resetEndTime(newDate, type) {
	newDate = resetTimeStamp(newDate);
	var date;
	if(type == 0) {
		date = newDate + 24 * 60 * 60 * 1000;
	} else if(type == 1) {
		date = newDate + 24 * 60 * 60 * 1000 - 1;
	}
	return date;
}

//获取过去日期
function getAppointDate(number, type) {
	var dateArray = [],
		curreDate = new Date().getTime(),
		constant = 24 * 60 * 60 * 1000;
	for(var i = 0; i < number; i++) {
		if(type == 0) {
			var time = resetTime(curreDate - (constant * (i + 1)), 12);
			dateArray.unshift(time);
		} else if(type == 1) {
			var time = resetTime(curreDate + (constant * (i + 1)), 12);
			dateArray.push(time);
		}
	}
	return dateArray
}

//加载模板
function loadPart(url, dom, callback) {
	var timestamp = new Date().getTime();
	url = host + "/sinuocloud" + url + ".html?timestamp=" + timestamp;
	if($(dom).children().length == 0) {
		$.ajax({
			type: "GET",
			url: url,
			dataType: "html",
			contentType: "application/json",
			success: function(res) {
				$(dom).append(res);
				callback(res);
			}
		});
	}
}

//加载翻页
function loadPage() {
	loadPart("/parts/page", ".page-box", function(res) {
		loadVue(".v-page", param);
	})
}

//判断token过期跳转登录
function judeToken() {
	var accountInfo = window.localStorage.getItem("accountInfo");
	if(accountInfo == "" || accountInfo == null) {
		quit();
		return false;
	}
	return true;
}

//批量删除
var idList = [];

//全选
function selectAllData() {
	if(setData.allIsActive == true) {
		setData.allIsActive = false;
		for(var i = 0; i < setData.dataList.length; i++) {
			setData.dataList[i].isActive = false;
		}
		idList = [];
	} else {
		setData.allIsActive = true;
		for(var i = 0; i < setData.dataList.length; i++) {
			if(setData.dataList[i].isActive == false) {
				setData.dataList[i].isActive = true;
				idList.push(setData.dataList[i].id);
			}
		}
	}
}

//选择单条数据
function selectOneData(obj) {
	if(obj.isActive == true) {
		obj.isActive = false;
		idList.splice($.inArray(obj.id, idList), 1);
	} else {
		obj.isActive = true;
		idList.push(obj.id);
	}
	for(var i = 0; i < setData.dataList.length; i++) {
		if(setData.dataList[i].isActive == true) {
			setData.allIsActive = true;
		} else {
			setData.allIsActive = false;
			break;
		}
	}
}

//弹框单选
var dataInfo = "";

function tabData(obj) {
	var dataList = setData.dataList;
	dataInfo = obj;
	resetDataInfo(dataList);
}

//重置dataInfo
function resetDataInfo(dataList) {
	for(var i = 0; i < dataList.length; i++) {
		dataList[i].isActive = false;
		if(dataInfo.id == dataList[i].id) {
			dataList[i].isActive = true;
		}
	}
}

//切换触发状态
function switchActive(obj) {
	obj.isActive = !obj.isActive;
}

//弹出框展示
function openMask(url, area, callback) {
	var timestamp = new Date().getTime();
	var maskArray = top.maskArray;
	var content = host + "/sinuocloud" + url + ".html?timestamp=" + timestamp;
	top.layer.open({
		type: 2,
		title: false,
		shadeClose: true,
		closeBtn: false,
		shade: [0.8, '#01121a'],
		shift: 1,
		area: ["100%", "100%"],
		content: [content, "no"],
		skin: "layui-layer-transparent",
		success: function(layero, index) {
			var layerDom = top.layer.getChildFrame('body', index);
			layerDom.find(".mask-box").width(area[0]).height(area[1]);
			var layerIframe = layero.find('iframe')[0].contentWindow;
			layerIframe.parent = window;
			var indexList = [];
			for(var i = 0; i < maskArray.length; i++) {
				indexList.push(maskArray[i].index);
			}
			if($.inArray(index, indexList) == -1) {
				var obj = {
					index: index,
					layerDom: layerDom,
					layerIframe: layerIframe
				}
				maskArray.push(obj);
			}
			if(callback) {
				callback(layerDom, layerIframe);
			}
		},
		end: function() {
			maskArray.pop();
		}
	});
}

//获取弹出框内容
function getMaskData(callback) {
	var maskArray = top.maskArray;
	var index = maskArray.length - 2;
	var layerDom = maskArray[index].layerDom;
	var layerIframe = maskArray[index].layerIframe;
	if(callback) {
		callback(layerDom, layerIframe);
	}
}

//关闭弹框
function closeMask(callback) {
	var maskArray = top.maskArray;
	var index = maskArray.length - 1;
	var parent = maskArray[index].layerIframe.parent;
	if(callback) {
		callback(parent);
	}
	top.layer.close(maskArray[index].index);
}

//打开信息框
function openConfirm(confirmText, callback) {
	top.layer.confirm(confirmText, {
		title: false,
		closeBtn: false,
		btn: ['确定', '取消'],
		skin: "layui-layer-dialog-confirm"
	}, function() {
		callback();
	}, function() {

	});
}

//退出
function quit() {
	window.localStorage.setItem("accountInfo", "");
	top.location.href = "login.html?groupId=" + accountInfo.groupId;
}

//添加或者修改 url中参数的值
function editUrlParam(key, value, url) {
	url = url || window.location.href;
	if(url.indexOf(key) > 0) {
		var urlValue = getUrlParam(key, url);
		if(urlValue) {
			url = url.replace(key + '=' + urlValue, key + '=' + value);
		} else {
			url = url.replace(key + '=', key + '=' + value);
		}
	} else {
		if(url.indexOf("?") > 0) {
			url = url + "&" + key + "=" + value;
		} else {
			url = url + "?" + key + "=" + value;
		}
	}
	return url;
};

//获取地址栏参数
function getUrlParam(key, url) {
	url = url || window.location.search;
	var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
	var result = url.substr(1).match(reg);
	return result ? decodeURIComponent(result[2]) : null;
}

//翻页
var pageNo = 1;

function resetPage() {
	var pageList = [];
	var totalPage = setData.totalPage;
	var pageNo = setData.pageNo;
	for(var i = 1; i <= totalPage; i++) {
		if(pageNo < 4) {
			if(i > pageNo + 1 && i < totalPage) {
				if($.inArray("", pageList) == -1) {
					pageList.push("");
				}
			} else {
				pageList.push(i);
			}
		} else if(pageNo > totalPage - 3) {
			if(i < pageNo - 1 && i > 1) {
				if($.inArray("", pageList) == -1) {
					pageList.push("");
				}
			} else {
				pageList.push(i);
			}
		} else {
			if(i == 1 || i == totalPage || (i >= pageNo - 1 && i <= pageNo + 1)) {
				pageList.push(i);
			} else {
				if(i < pageNo - 1) {
					if($.inArray("", pageList) == -1) {
						pageList.push("");
					}
				} else if(i > pageNo + 1) {
					if($.inArray("", pageList, 3) == -1) {
						pageList.push("");
					}
				}
			}
		}
	}
	setData.pageList = pageList;
}

//检索
function search() {
	pageNo = 1;
	loadData();
}

//首页
function firstPage() {
	pageNo = 1;
	if(setData.totalPage <= 1) {
		top.layer.msg("页数已到最小");
		return false;
	}
	loadData();
}

//末页
function lastPage() {
	pageNo = setData.totalPage;
	if(pageNo == setData.pageNo) {
		top.layer.msg("页数已到最大");
		return false;
	}
	loadData();
}

//上一页
function beforePage() {
	pageNo = setData.pageNo;
	pageNo--;
	if(pageNo < 1) {
		pageNo = 1;
		top.layer.msg("页数已到最小");
		return false;
	}
	loadData();
}

//下一页
function nextPage() {
	pageNo = setData.pageNo;
	pageNo++;
	if(pageNo > setData.totalPage) {
		pageNo = setData.totalPage;
		top.layer.msg("页数已到最大");
		return false;
	}
	loadData();
}

//跳转页面
function jumpPage(jumpPageNo) {
	pageNo = jumpPageNo;
	loadData();
}

//时间控件
function setTime(dom, type, format) {
	layui.use('laydate', function() {
		var laydate = layui.laydate;
		lay(dom).each(function() {
			laydate.render({
				elem: this,
				type: type,
				trigger: 'click',
				format: format
			});
		});
	});
}

//导出
function exportExcel(dom, columns, fileName) {
	dom.table2excel({
		exclude: ".noExl",
		name: "Excel Document Name",
		columns: columns,
		filename: fileName,
		exclude_img: true,
		exclude_links: true,
		exclude_inputs: true
	});
}

//获取一个月多少天
function getCountDays() {
	var curDate = new Date();
	var curMonth = curDate.getMonth();
	curDate.setMonth(curMonth + 1);
	curDate.setDate(0);
	return curDate.getDate();
}

//获取当月天数数组,0=以天划分,1=以5天划分
function getCurrentDays(type) {
	var dayCount = getCountDays();
	var dayList = [];
	for(var i = 0; i < dayCount; i++) {
		if(type == 0) {
			dayList.push(i + 1);
		} else if(type == 1) {
			var number = i + 1;
			if(number % 5 == 0) {
				dayList.push(number);
			}
		}
	}
	return dayList;
}

//判断是否为空图
function judeImg(callback) {
	for(var i = 0; i < $("img").length; i++) {
		var imgDom = $("img").eq(i);
		if(imgDom.attr("src") == "../img/common/no-img.png") {
			imgDom.attr("src", "");
		}
	}
	callback();
}

//打印
function print(dom) {
	$.print("#" + dom);
}

//删除内容
function delContent(i) {
	setData.contentList.splice(i--, 1);
}

//排序
function resetSort(property, flag) {
	return function(a, b) {
		if(flag == 0) {
			// 越小越靠前
			return a[property] - b[property];
		} else if(flag == 1) {
			// 越大越靠前
			return b[property] - a[property];
		}
	}
}

//列表生成二维码
function makeScanCode(obj, text) {
	$(".scanCode" + obj.id + " a").empty();
	$(".scanCode" + obj.id + " a").qrcode({
		render: "canvas",
		text: text,
		width: "100", //二维码的宽度
		height: "100", //二维码的高度
		background: "#ffffff", //二维码的后景色
		foreground: "#000000", //二维码的前景色
	});
}

//下载二维码
function downloadScanCode(canvasDom, downloadDom) {
	var canvasDom = $('.' + canvasDom).find("canvas").get(0);
	var saveurl = canvasDom.toDataURL('image/png');
	$('.' + downloadDom).attr('href', saveurl);
	return false;
}

//无缝滚动
function seamlessRolling(id, milliseconds) {
	var dom = $("#" + id);
	var height = dom.outerHeight(true);
	var childHeight = dom.children().outerHeight(true);
	var H = Math.ceil(dom.children().children().outerHeight(true));
	if(height < childHeight) {
		clearInterval(window[id]);
		window[id] = setInterval(function() {
			var top = Math.ceil(dom.scrollTop());
			if(top >= (childHeight - height)) {
				top = 0;
				dom.scrollTop(top);
			}
			dom.stop().animate({
				scrollTop: top + H
			}, 500);
		}, milliseconds);
	}
}

//点击滚动
function clickRolling(id, type) {
	var dom = $("#" + id);
	var height = dom.outerHeight(true);
	var childHeight = dom.children().outerHeight(true);
	var H = Math.ceil(dom.children().children().outerHeight(true));
	var top = Math.ceil(dom.scrollTop());
	if(height < childHeight) {
		if(type == 0) {
			dom.stop().animate({
				scrollTop: top + H
			}, 500);
		} else if(type == 1) {
			dom.stop().animate({
				scrollTop: top - H
			}, 500);
		}
	}
}

//监听window改变
function bindWindowChange(callback) {
	top.$(window).resize(function() {
		callback();
	})
}

//根据索引获取数组
function getIndexArray(dataList, index, slotType) {
	var resArray = [];
	for(var i = 0; i < dataList.length; i++) {
		if(slotType == true) {
			//正序
			resArray.push(dataList[i][index]);
		} else {
			//倒序
			resArray.unshift(dataList[i][index]);
		}
	}
	return resArray;
}

//获取JSON
function getJson(part, callback) {
	var timestamp = new Date().getTime();
	var requestUrl = host + "/sinuocloud" + part + ".json?timestamp=" + timestamp;
	$.getJSON(requestUrl, function(res) {
		callback(res);
	})
}

//设置页面地址
function setPath(id) {
	var timestamp = new Date().getTime();
	var menuList = setData.menuList;
	for(var i = 0; i < menuList.length; i++) {
		if(id == menuList[i].id) {
			setData.selected = id;
			if(menuList[i].path == "") {
				top.layer.msg("该功能暂未开放");
				return false;
			}
			var path = host + "/sinuocloud" + menuList[i].path + ".html?timestamp=" + timestamp;
			var children = menuList[i].children;
			var parent = menuList[i].parent;
			$("iframe").get(0).onload = function() {
				var iframeWindow = $("iframe")[0].contentWindow;
				if(parent == 2) {
					var newRouteId = id;
				} else {
					var newRouteId = parent + "-" + id;
				}
				top.window.history.pushState(null, null, editUrlParam("routeId", newRouteId, top.window.location.href));
				routeId = routeId ? routeId : getUrlParam("routeId", top.window.location.href);
				var routeIdList = routeId.split("-");
				routeId = newRouteId.toString();
				if(iframeWindow.setData != undefined) {
					if(children) {
						iframeWindow.setData.menuList = children;
						iframeWindow.setPath(routeIdList[1] ? routeIdList[1] : children[0].id);
					}
				}
			}
			setData.path = path;
		}
	}
}

//获取权限
function getPrivilege(param, callback) {
	var param = {
		pageSize: "1000",
		idList: param.idList,
		parent: param.parent
	}
	request("POST", "/privilege/queryList.do", param, false, function(res) {
		var dataList = res.data.dataList;
		if(callback) {
			callback(dataList);
		}
	}, function(res) {
		top.layer.msg("权限获取失败");
	})
}

function getDeviceType(callback) {
	getJson("/json/deviceType", function(res) {
		callback(res);
	});
}

//置空dataList
function resetDataList(callback) {
	setData.dataList = [];
	nextTick(function() {
		callback();
	})
}

//设置圆形进度条
function setCircleProgress(dom, value, thickness, gradient) {
	dom.circleProgress({
		value: value,
		size: dom.width(),
		startAngle: Math.PI / 2,
		thickness: thickness,
		lineCap: 'round',
		fill: {
			gradient: gradient
		}
	});
}

//数字位数不够补零
function formatZero(num, len) {
	if(String(num).length > len) return num;
	return(Array(len).join(0) + num).slice(-len);
}

//播放视频
function playerVideo(id, src) {
	videojs.options.flash.swf = host + '/sinuocloud/video/video-js.swf';
	var videoPlayer = videojs(id);
	videoPlayer.src({
		src: src
	});
	videoPlayer.play();
}

//暂停视频
function disposeVideo(id) {
	var videoPlayer = videojs(id);
	videoPlayer.dispose();
}

//禁止浏览器后退
function disPopstate() {
	var window = top.window;
	window.onpopstate = function() {
		window.history.forward(1);
	}
	window.history.forward(1);
}

//定时任务
var timeTaskIndex = 0;

function timeTask(milliseconds, callback) {
	timeTaskIndex++;
	window["timeTask" + timeTaskIndex] = setInterval(function() {
		callback();
	}, milliseconds);
}

//树状数据结构
function getTreeData(dataList, parentId) {
	var result = [],
		temp;
	parentId = parentId || "0";
	for(var i = 0; i < dataList.length; i++) {
		if(dataList[i].parentId == parentId) {
			temp = getTreeData(dataList, dataList[i].id);
			if(temp.length > 0) {
				dataList[i].children = temp;
			}
			result.push(dataList[i]);
		}
	}
	return result;
}

//正则验证
function checkInput() {
	//	必填
	for(var i = 0; i < $(".required").length; i++) {
		if($(".required").eq(i).val() == "") {
			var required = $(".required").eq(i).parent().siblings(".mask-list-name").text();
			top.layer.msg(required + " 为必填项 请核对");
			return false;
		}
	}

	//	图片必填
	for(var i = 0; i < $(".required-img").length; i++) {
		if($(".required-img").eq(i).attr("src") == "" || $(".required-img").eq(i).attr("src") == "../img/common/no-img.png") {
			var required = $(".required-img").eq(i).parent().parent().siblings(".mask-list-name").text();
			top.layer.msg(required + " 为必填项 请核对");
			return false;
		}
	}

	//	长度不超过15
	for(var i = 0; i < $(".len15").length; i++) {
		if($(".len15").eq(i).val().length > 15) {
			var required = $(".len15").eq(i).parent().siblings(".mask-list-name").text();
			top.layer.msg(required + "长度不能超过15");
			return false;
		}
	}

	//	长度不超过6
	for(var i = 0; i < $(".len6").length; i++) {
		if($(".len6").eq(i).val().length > 6) {
			var required = $(".len6").eq(i).parent().siblings(".mask-list-name").text();
			top.layer.msg(required + "长度不能超过6");
			return false;
		}
	}

	//	长度不超过30
	for(var i = 0; i < $(".len30").length; i++) {
		if($(".len30").eq(i).val().length > 30) {
			var required = $(".len30").eq(i).parent().siblings(".mask-list-name").text();
			top.layer.msg(required + "长度不能超过30");
			return false;
		}
	}

	//	长度不超过200
	for(var i = 0; i < $(".len200").length; i++) {
		if($(".len200").eq(i).val().length > 200) {
			var required = $(".len200").eq(i).parent().siblings(".mask-list-name").text();
			top.layer.msg(required + "长度不能超过200");
			return false;
		}
	}

	//	密码号为6位
	for(var i = 0; i < $(".pwd6").length; i++) {
		if($(".pwd6").eq(i).val().length != 6) {
			var required = $(".pwd6").eq(i).parent().siblings(".mask-list-name").text();
			top.layer.msg(required + " 长度为6位 请核对");
			return false;
		}
	}

	for(var i = 0; i < $(".regular-num").length; i++) {
		if(!regular_num.test($(".regular-num").eq(i).val())) {
			var required = $(".regular-num").eq(i).parent().siblings(".mask-list-name").text();
			top.layer.msg(required + " 格式错误 请核对");
			return false;
		}
	}

	if($(".regular-telephone").val() != "" && $(".regular-telephone").val() != undefined) {
		if(!regular_telephone.test($(".regular-telephone").val())) {
			var required = $(".regular-telephone").parent().siblings(".mask-list-name").text();
			top.layer.msg(required + " 格式错误 请核对");
			return false;
		}
	}

	for(var i = 0; i < $(".regular-password").length; i++) {
		if(!regular_password.test($(".regular-password").eq(i).val())) {
			var required = $(".regular-password").eq(i).parent().siblings(".mask-list-name").text();
			top.layer.msg(required + " 格式为4-16位数字或字母，区分大小写");
			return false;
		}
	}

	if($(".regular-email").val() != "" && $(".regular-email").val() != undefined) {
		if(!regular_email.test($(".regular-email").val())) {
			var required = $(".regular-email").parent().siblings(".mask-list-name").text();
			top.layer.msg(required + " 格式错误 请核对");
			return false;
		}
	}

	if($(".regular-id-number").val() != "" && $(".regular-id-number").val() != undefined) {
		if(!regular_idNumber.test($(".regular-id-number").val())) {
			var required = $(".regular-id-number").parent().siblings(".mask-list-name").text();
			top.layer.msg(required + " 格式错误 请核对");
			return false;
		}
	}

	if($(".regular-room-address").val() != "" && $(".regular-room-address").val() != undefined) {
		if(!regular_roomAddress.test($(".regular-room-address").val())) {
			var required = $(".regular-room-address").parent().siblings(".mask-list-name").text();
			top.layer.msg(required + " 格式错误 请核对");
			return false;
		}
	}

	for(var i = 0; i < $(".regular-code").length; i++) {
		if(!regular_code.test($(".regular-code").eq(i).val())) {
			var required = $(".regular-code").eq(i).parent().siblings(".mask-list-name").text();
			top.layer.msg(required + " 格式错误 请核对");
			return false;
		}
	}
	return true;
}