require(['jquery','wxapi'],function($,wx){
	wx.config($.extend({
        debug: DEBUG,
        jsApiList: ['hideOptionMenu']
    },WXCONFIG));
    wx.ready(function(){
        wx.hideOptionMenu();
    });
});
