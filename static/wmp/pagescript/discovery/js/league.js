require(['jquery','common/jquery-plugins/fastclick','wxapi','pagescript/quiz/base/js/wAjax','common/zh-sdk/zh-sdk.min'],function($,fastclick,wx,wAjax,zh){
	// init
    (function(){
        fastclick.attach(document.body);
    })();
	
	wx.config($.extend({
		debug: DEBUG,
		jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage']
	},WXCONFIG));
	
	wx.ready(function(){
		//朋友圈
		wx.onMenuShareTimeline({
			title: SHARE_CONFIG.title,
			link: SHARE_CONFIG.link, // 分享链接
			imgUrl: SHARE_CONFIG.imgUrl, // 分享图标
			success: function () { 
				setTimeout(function(){
				 	$mask.hide();
				 },100);
			},
			cancel: function () { 
				$mask.hide();
			}
		});
		//朋友
		wx.onMenuShareAppMessage({
			title: SHARE_CONFIG.title,
			link: SHARE_CONFIG.link, // 分享链接
			imgUrl: SHARE_CONFIG.imgUrl, // 分享图标
			desc: SHARE_CONFIG.desc, // 分享描述
			success: function () {
				setTimeout(function(){
				 	$mask.hide();
				 },100);
			},
			cancel: function () {
				$mask.hide();
			}
		});
		wx.showOptionMenu();
	});
	
	var title = SHARE_CONFIG.title,
		desc = SHARE_CONFIG.desc,
		imgUrl = SHARE_CONFIG.imgUrl,
		link = SHARE_CONFIG.link; 
	
	zh.ready(function () {
		zh.onMenuShareWxTimeLine ({
			title: title,
			desc: desc,
			imgUrl: imgUrl,
			link: link,
		})
		zh.onMenuShareWxMessage ({
			title: title,
			desc: desc,
			imgUrl: imgUrl,
			link: link,
		})
		zh.showGraphicalButton('navShare', function (){
			zh.showShareMenu();
		});
	})
	
	// 只有在微信中才有下载条
	window.isWeiXin = navigator.userAgent.toLowerCase().indexOf("micromessenger") != -1;
	if(isWeiXin) {
		$('.league').css('paddingTop','66px');
		$('.download-bar-top').show();
		
		// 顶部下载关闭
		$('.btn-top-close').on('click',function() {
			$('.download-bar-top').css({
				'top':'-65px',
				'opacity':'0'
			});
			$('.league').css('paddingTop','0');
			event.stopPropagation();
		});

		// 顶部下载
		$('.download-bar-top a').on('click',function() {
			//$(this).attr('href');
			getLink(this);	
			$('.download-bar-top').css({
				'top':'-65px',
				'opacity':'0'
			});
			$('.league').css('paddingTop','0')
				
		});
	}
	
	
	
	function getLink(links) {	
		// getLink()在点击事件中调用 getLink(this); 即可
			
		var link1 = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.zhisland.android.blog&g_f=991653',
			link2 = 'http://www.zhisland.com/data/client/android/zhisland.apk',
			link3 = 'https://itunes.apple.com/us/app/zheng-he-dao/id525751375?mt=8';
		window.isWeiXin = navigator.userAgent.toLowerCase().indexOf("micromessenger") != -1;
		window.isIOS = (/iphone|ipad/gi).test(navigator.userAgent);
		window.isAndroid = navigator.userAgent.toLowerCase().indexOf("android") != -1;
		if(isWeiXin) {
			links.href = link1;
		}else if (isIOS){
			links.href = link3;
		}else {
			links.href = link2;
		}
	}
	
	// 联盟
	var numLength = 0;
	if( $('#jhz').length ) {
		if( $('.league i').length > 10 ) {
			numLength = 10;
		}else {
			numLength = $('.league i').length;
		}
		for( var i=0; i<numLength; i++) {
			$('.league i').eq(i).addClass('active').text(i+1);
		}
	}	

	// 滚动加载
	var hasmore = $("input[name='hasmore']").val();
	var isloading = false;
	var box = $('.league ul');
	var nowPageNum = getUrlParam().pageNo;
	function loadCon(ops){
		isloading = true;
		box.append('<div class="loading"></div>');
		wAjax({
			url:ops.url,
			data:ops.sendData,
			success:function(rs){
				nowPageNum++;
				box.append(rs);
			},
			complete:function(){
				if(box.find('.loading').size() == 1){
					box.find('.loading').remove();
				}
				isloading = false;
			}
		});
	}
	
	$(window).on('scroll touchmove',function(){
		var win_h = $(window).height(),
			body_h = $('body').height(),
			scroll_h = document.body.scrollTop,
			fix_h = $('.fix').height();		
		if((win_h+scroll_h >= 0.5*body_h) && (body_h >= win_h) && !isloading){	
			if( hasmore == 'yes') {
				hasmore = $("input[name='hasmore']:last").val();
				if( $('#jhz').length ) {
					var data = {
						'pageNo': parseInt(nowPageNum) +1,
						'pageSize': 20
					};
					loadCon({
						url:'/wmp/user/' + appConfigId + '/channel/show/gfuList',
						sendData:data
					});
				}else {
					var data = {
						'pageNo': parseInt(nowPageNum) +1,
						'pageSize': 20,
						'magnetId': getUrlParam('magnetId')
					};
					loadCon({
						url:'/wmp/user/' + appConfigId + '/channel/magnet/detList',
						sendData:data
					});
				}				
			}			
		}		
	});
	
	// 截取URL参数方法
	function getUrlParam(name,str) {
		var url = str||window.location.search.substr(1);
		if (!url) {
			return null;
		}
		url = decodeURI(url);
		if (name) {
			var value = new RegExp('(?:^|&)' + name + '=([^&]*)(&|$)', 'g').exec(url);
			return value && window.decodeURIComponent(value[1]) || '';
		}
		var result = {};
		var reg = /(?:^|&)([^&=]+)=([^&]*)(?=(&|$))/g;
		var item;
		while (item = reg.exec(url)) {
			result[item[1]] = window.decodeURIComponent(item[2]);
		}
		return result;
	}
});
