require(['jquery','modules/net/wAjax','wxapi','modules/ui/wx-plugin/autoMoveUp'],function($,wAjax,wx){
	var $submitBtn = $('#submit-btn');
	wx.config($.extend({
		debug: DEBUG,
		jsApiList: []
	},WXCONFIG));	

	wx.ready(function(){
		wx.hideOptionMenu();
	});
});
