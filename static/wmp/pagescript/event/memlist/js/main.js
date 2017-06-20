require(['jquery','modules/ui/loadinglist/js/main','wxapi'],function($,LoadingList,wx) {
	wx.config($.extend({
        debug: DEBUG,
        jsApiList: ['hideOptionMenu']
    },WXCONFIG));
    wx.ready(function(){
        wx.hideOptionMenu();
    });
	var eventId = window.location.href.match(/\d{3,}/)[0];
	var userList = new LoadingList({
		dataUrl: '/wmp/user/'+ appConfigId +'/activity/listMoreSignUser',
		itemTemplate: $('#user-item-tpl'),
		loadingEle: $('.loading'),
		emptyPrompt: $('.empty'),
		list: $('.item-list'),
		getDataList: function(obj) {
			return obj['data']['result']['data'];
		},
		hasMoreTest: function(obj) {
			return !obj['data']['result']['lastPage'];
		},
		param: {
			id:	eventId,
			nextId: null
	    },
		onLoaded: function(obj) {
			this.param['nextId'] = obj['data']['result']['nextId'];
		}
	});
});
