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
                setTimeout(function(){
                    $mask.hide();
                 },100);
            },
            cancel: function () { 
                setTimeout(function(){
                    $mask.hide();
                 },100);
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
                 },100);
            },
            cancel: function () {
                setTimeout(function(){
                    $mask.hide();
                 },100);
            }
        });
        wx.showOptionMenu();
    });       

    var $mask = $('.mask');
    // show the share mask
    $('.btn').on('touchstart',function(){
        $mask.show();
    });
    $mask.on('touchstart',function(){
        $mask.hide();
    });    

  
});