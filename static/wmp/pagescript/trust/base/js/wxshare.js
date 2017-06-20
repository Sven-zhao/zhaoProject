define(['jquery','wxapi'],function($,wx) {
	wx.config($.extend({
        debug: DEBUG,
        jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage']
    },WXCONFIG));
    wx.ready(function(){
        //朋友圈
        wx.onMenuShareTimeline({
			title:SHARE_TIMELINE_CONFIG.title ? SHARE_TIMELINE_CONFIG.title : SHARE_CONFIG.title ,
            link: SHARE_TIMELINE_CONFIG.link ? SHARE_TIMELINE_CONFIG.link: SHARE_CONFIG.link, // 分享链接
            imgUrl: SHARE_TIMELINE_CONFIG.imgUrl? SHARE_TIMELINE_CONFIG.imgUrl: SHARE_CONFIG.imgUrl, // 分享图标
            success: function () { 
				$.get('http://s.zhisland.com/share.gif?r='+Math.random()+'&pj=wmp&oid='+oid+'&module=trust&s_url='+encodeURIComponent(window.location.href)+'&scope=shareTimeline');
            },
            cancel: function () { 
            }
        });
        //朋友
        wx.onMenuShareAppMessage({
            title: SHARE_CONFIG.title,
            link: SHARE_CONFIG.link, // 分享链接
            imgUrl: SHARE_CONFIG.imgUrl, // 分享图标
            desc: SHARE_CONFIG.desc, // 分享描述
            success: function () {
				$.get('http://s.zhisland.com/share.gif?r='+Math.random()+'&pj=wmp&oid='+oid+'&module=trust&s_url='+encodeURIComponent(window.location.href)+'&scope=shareAppMessage');
            },
            cancel: function () {
            }
        });
        wx.showOptionMenu();
    });
});
