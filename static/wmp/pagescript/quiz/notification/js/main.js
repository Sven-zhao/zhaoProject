require(['jquery','wxapi'],function($,wx){
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
			},
			cancel: function () { 
			}
		});
		wx.onMenuShareAppMessage({
			title: SHARE_CONFIG.title,
			link: SHARE_CONFIG.link, // 分享链接
			imgUrl: SHARE_CONFIG.imgUrl, // 分享图标
			desc: SHARE_CONFIG.desc, // 分享描述
			success: function () {
			},
			cancel: function () {
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