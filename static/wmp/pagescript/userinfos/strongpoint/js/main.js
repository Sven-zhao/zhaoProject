require(['jquery','modules/net/wAjax','pagescript/userinfos/base/js/tagSelector','wxapi'],function($,wAjax,tagSelector,wx) {
	var $submitBtn = $('#submit-btn');
	wx.config($.extend({
		debug: DEBUG,
		jsApiList: []
	},WXCONFIG));	
	wx.ready(function(){
		wx.hideOptionMenu();
	});
	tagSelector.init(3);
	$submitBtn.on('click',function(){
		tagSelector.save('skilled');
	});
});
