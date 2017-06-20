require(['jquery','modules/net/wAjax','pagescript/userinfos/base/js/tagSelector','wxapi'],function($,wAjax,tagSelector,wx) {
	wx.config($.extend({
		debug: DEBUG,
		jsApiList: []
	},WXCONFIG));	
	wx.ready(function(){
		wx.hideOptionMenu();
	});
	var $submitBtn = $('#submit-btn');
	tagSelector.init(3);
	$submitBtn.on('click',function(){
		tagSelector.save('interest');
	});
});
