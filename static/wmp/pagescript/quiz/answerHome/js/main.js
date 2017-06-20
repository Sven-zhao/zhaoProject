require(['jquery','wxapi'],function($,wx){
	wx.config($.extend({
		debug: DEBUG,
		jsApiList: []
	},WXCONFIG));	
	wx.ready(function(){
		wx.hideOptionMenu();
	});
	$('.app-fixed-footer').on('click',function(){
		var timestamp = Date.parse(new Date());
		window.location.href = "http://m.zhisland.com?timestamp=" + timestamp;
	});
});