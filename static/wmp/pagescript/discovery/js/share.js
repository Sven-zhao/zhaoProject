require(['jquery','common/jquery-plugins/fastclick','wxapi','pagescript/quiz/base/js/wAjax'],function($,fastclick,wx,wAjax){
	// init
    (function(){
        fastclick.attach(document.body);
    })();
	
	// 分享到朋友圈
	var $mask = $('.mask');
    
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
});
