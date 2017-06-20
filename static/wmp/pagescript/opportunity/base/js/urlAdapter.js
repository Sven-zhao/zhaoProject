(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.adapter = factory())
}(this, (function (require) {
	var zh = (typeof require === 'function') ? require('zhsdk') : window.zh

	var adapter = {};
	function processUrl(url) {
		var isNative = /^zhisland:.*/g.test(url) ;
		var result = '';

		if(isNative) {
			var postFix = url.match(/zhisland:\/\/com.zhisland\/(.*)/)[1];
			if(/^user\/\d+/g.test(postFix)) {
				var uid = url.match(/user\/(\d+)/)[1];
				console.log(uid);
				if(browseType == '1') {
					result = '/wmp/user/'+appConfigId+'/personal/other/home?uid='+uid;
				} else if (browseType == '2') {
					result = url;
				} else {
					var downloadUrl=downloadPageUrl+'?uri='+encodeURI(url);
					result = downloadUrl;
				}
			}else if(postFix=='event') {//所有活动
				if(browseType == '1') {
					result = '/wmp/user/'+appConfigId+'/activity/list';
				} else if (browseType == '2') {
					result = url;
				} else {
					var downloadUrl=downloadPageUrl+'?uri='+encodeURI(url);
					result = downloadUrl;
				}
			}else if(/^event\/\d+/g.test(postFix)) {//某个活动
				var eventId = url.match(/event\/(\d+)/)[1];
				if(browseType == '1') {
					result = '/wmp/user/'+appConfigId+'/activity/'+eventId+'/detail';
				} else if (browseType == '2') {
					result = url;
				} else {
					var downloadUrl=downloadPageUrl+'?uri='+encodeURI(url);
					result = downloadUrl;
				}
			}else if(/^chat\/single\/\d+/g.test(postFix)) {//im对话zhisland://com.zhisland/chat/single/6260668687699673093
				var userId = url.match(/chat\/single\/(\d+)/)[1];
				if (browseType == '2') {
					result = url;
				} else {
					var downloadUrl=downloadPageUrl+'?uri='+encodeURI('zhisland://com.zhisland/'+window.location.href);
					result = downloadUrl;
				}
			}else {
				result = downloadPageUrl;
			}
		}else if(/^tel:.*/g.test(url)) {
			if (browseType == '2') {
				result = url;
			} else {
				var downloadUrl=downloadPageUrl+'?uri='+encodeURI('zhisland://com.zhisland/'+window.location.href);
				result = downloadUrl;
			}
		}else {
			result = url;
		}
		return result;
	}

	function openUrl(url,newAppLayer) {
		var newLayer = newAppLayer?true:false;
		var isNative = /^zhisland:.*/g.test(url) ;
		if(browseType == 2 && newAppLayer && !isNative) {
			try {
				zh.navigateTo({
					url: url
				});
			}catch(e) {
				window.location.href = url;
			}
		} else {
			window.location.href = url;
		}
	}
	
	function needLogin(url,browseType) {
		if(/^\//.test(url)){//相对路径
			return uriNeedLogin(url);
		}else if(/^http.*mp.zhisland.com\/(.*)/.test(url)) {//微站域名
			uri=url.match(/^http.*mp.zhisland.com\/(.*)/)[1];
			return uriNeedLogin('/'+uri);
		}else if(/^http/.test(url)){//外网网址，不需要登录
			return false;
		}else {//app nagivate url或其他
			return true;
		}
	}
	
	function uriNeedLogin(uri) {
		var result=true;
		if(/^\/wmp\/user\/\d\/resource\/app\/index.*/g.test(uri)) {//机会首页
			result=false;
		}if(/^\/wmp\/user\/\d\/resource\/app\/detail\/.*/g.test(uri)) {//机会详情页
			result=false;
		}else if(/^\/wmp\/user\/\d\/resource\/app\/toSearch.*/g.test(uri)) {//所有机会页
			result=false;
		}else if(/^\/wmp\/user\/\d\/activity\/.*/g.test(uri)) {//活动相关页
			result=false;
		}else if(/^\/wmp\/user\/\d\/personal\/other\/home.*/g.test(uri)) {//个人主页
			result=false;
		}
		console.info('uriNeedLogin '+result+' uri='+uri)
		return result;
	}

	adapter.goToUrl = function (conf){
		var targetUrl = processUrl(conf.url);
		console.info("goto "+conf.url);
		console.info("targetUrl = "+targetUrl);
		if(browseType==2){//app访问，直接跳转
			if(conf.url != undefined) {
				openUrl(targetUrl,conf.newLayer);
			}
			if(conf.cb != undefined) {//参数中为回调函数
				conf.cb(conf.cbparam);
			}
		}else {//微信浏览器访问
			if(myUid==''){//微信未登录
				//不需要登录
				if(conf.url != undefined) {
					if(!needLogin(targetUrl,browseType)){
						openUrl(targetUrl,conf.newLayer);
						return;
					}
				}
				
				if(browseType==1){//微信访问
					var loginUrl= mobileRegistUrl+'&redir=' + encodeURI(window.location.href);
					//var loginUrl= '/wmp/user/'+appConfigId+'/app/loginGuide?url=' + encodeURI(window.location.href);
					openUrl(loginUrl);
				}else {//浏览器访问，使用m站的登录
					var loginUrl= mobileRegistUrl+'&redir=' + encodeURI(window.location.href);
					openUrl(loginUrl);
				}
			}else{//已经登录的，使用app打开url
				if(conf.apponly == true) {
					if(conf.httpUri == true) {
						var downloadUrl = downloadPageUrl+'?uri=zhisland://com.zhisland/'+encodeURI(window.location.href);
					} else {
						var downloadUrl = downloadPageUrl+'?uri='+encodeURI(window.location.href);
					}
					openUrl(downloadUrl);
				} else {
					if(conf.cb != undefined) {//参数中为回调函数
						conf.cb(conf.cbparam);
					}
					if(conf.url != undefined) {
						console.log(conf.url);
						console.log(targetUrl);
						openUrl(targetUrl,conf.newLayer);
					}
				}
			}
		}
	}
	return adapter;
})));
