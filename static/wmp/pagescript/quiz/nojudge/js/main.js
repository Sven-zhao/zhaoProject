require(['jquery','wxapi','pagescript/base/js/wxStat'],function($,wx,wxStat){
	wx.config($.extend({
		debug: DEBUG,
		jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage']
	},WXCONFIG));
	wx.ready(function(){
		wx.onMenuShareTimeline({
			title: SHARE_CONFIG.title, 
			link: SHARE_CONFIG.link, // 分享链接
			imgUrl: SHARE_CONFIG.imgUrl, // 分享图标
			desc: SHARE_CONFIG.desc, // 分享描述
			success: function () { 
				 setTimeout(function(){
				 	$mask.hide();
				 	wxStat({
				 		appConfigId: appConfigId,
				 		data: STAT_CONFIG.custom
				 	});
				 },100);
				
			},
			cancel: function () { 
				$mask.hide();
			}
		});
		wx.onMenuShareAppMessage({
			title: SHARE_CONFIG.title,
			link: SHARE_CONFIG.link, // 分享链接
			imgUrl: SHARE_CONFIG.imgUrl, // 分享图标
			desc: SHARE_CONFIG.desc, // 分享描述
			success: function () {
				setTimeout(function(){
				 	$mask.hide();
				 	wxStat({
				 		appConfigId: appConfigId,
				 		data: STAT_CONFIG.custom
				 	});
				 },100);
			},
			cancel: function () {
				$mask.hide();
			}
		});
		wx.showOptionMenu();
	});

	var $mask = $('.mask');
	$('.btn-share').on('click',function(e){
		$mask.show();
		e.preventDefault();
	});
	$mask.on('click',function(){
		$mask.hide();
	});
});