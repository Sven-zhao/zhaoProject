require(['jquery','wxapi'],function($,wx){	
	wx.config($.extend({
        debug: DEBUG,
        jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage']
    },WXCONFIG));

    //varibles defination
    var $mask = $('.mask');
    var $btnShare = $('#share-btn');

    //bind event
    $btnShare.on('click',function(){
        $mask.show();
    });
    $mask.on('click',function(){
        $mask.hide();
    });

    function hideMask() {
        $mask.hide();
    }

    wx.ready(function(){
        //朋友圈
        wx.onMenuShareTimeline({
            title: SHARE_CONFIG.title,
            link: SHARE_CONFIG.link, // 分享链接
            imgUrl: SHARE_CONFIG.imgUrl, // 分享图标
            success: function () { 
                setTimeout(hideMask,100);
				$.get('/static/wmp/common/stat1.gif');
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
				$.get('/static/wmp/common/stat2.gif');
            },
            cancel: function () {
                setTimeout(hideMask,100);
            }
        });
        wx.showOptionMenu();
    });
});
