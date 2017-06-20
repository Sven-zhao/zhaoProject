require(['jquery','wxapi'],function($,wx){	
    //zoom
    var win_w = document.documentElement.offsetWidth || document.body.offsetWidth;
    $('.container').css({'zoom':win_w/375});

	wx.config($.extend({
        debug: DEBUG,
        jsApiList: []
    },WXCONFIG));

    wx.ready(function(){
        wx.hideOptionMenu();
    });
});