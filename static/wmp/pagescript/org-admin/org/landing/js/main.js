require(['jquery','wxapi'],function($,wx) {
	wx.config($.extend({
		debug: false,
		jsApiList: []
	},WXCONFIG));	
	wx.ready(function(){
		wx.hideOptionMenu();
	});
});
