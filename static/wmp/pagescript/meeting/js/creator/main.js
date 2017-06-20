require(['jquery','modules/net/wAjaxV2','wxapi','jquery-hammer'],function($,wAjax,wx){
	wx.config($.extend({
		debug: DEBUG,
		jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage']
	},WXCONFIG));	

	wx.ready(function(){
		//wx.hideOptionMenu();
	});

    function hideMask() {
        $('.mask').hide();
    }

    wx.ready(function(){
        //朋友圈
        wx.onMenuShareTimeline({
            title: SHARE_CONFIG.title,
            link: SHARE_CONFIG.link, // 分享链接
            imgUrl: SHARE_CONFIG.imgUrl, // 分享图标
            success: function () {
                setTimeout(hideMask,100);
            },
            cancel: function () {
                setTimeout(hideMask,100);
            }
        });
        //朋友
        wx.onMenuShareAppMessage({
            title: SHARE_CONFIG.title,
            link: SHARE_CONFIG.link, // 分享链接
            imgUrl: SHARE_CONFIG.imgUrl, // 分享图标
            desc: SHARE_CONFIG.desc, // 分享描述
            success: function () {
               setTimeout(hideMask,100);
            },
            cancel: function () {
                setTimeout(hideMask,100);
            }
        });
        wx.showOptionMenu();
    });

});
