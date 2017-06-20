require(['jquery','wxapi','modules/net/wAjax','pagescript/org-admin/base/js/loadinglist'],function($,wx,wAjax,LoadingList){
	wx.config($.extend({
		debug: DEBUG,
		jsApiList: []
	},WXCONFIG));	
	wx.ready(function(){
		wx.hideOptionMenu();
	});
	var list = new LoadingList({
		loadingEle: $('#loading'),
		emptyPrompt: $('#empty-prompt'),
		itemTemplate: $('#institute-item-tpl'),
		list: $('#item-list'),
		dataUrl: "/wz/org/"+ appConfigId +"/institute/list"
	});
});
