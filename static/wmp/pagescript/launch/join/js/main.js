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
				 wxStat({
			 		appConfigId: appConfigId,
			 		data: STAT_CONFIG.custom
			 	});
			}
		});
		wx.onMenuShareAppMessage({
			title: SHARE_CONFIG.title,
			link: SHARE_CONFIG.link, // 分享链接
			imgUrl: SHARE_CONFIG.imgUrl, // 分享图标
			desc: SHARE_CONFIG.desc, // 分享描述
			success: function () {
				wxStat({
			 		appConfigId: appConfigId,
			 		data: STAT_CONFIG.custom
			 	});
			}
		});
		wx.showOptionMenu();
	});
});
