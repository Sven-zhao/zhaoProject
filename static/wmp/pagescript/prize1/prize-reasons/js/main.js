require(['jquery','modules/ui/loadinglist/js/main','pagescript/prize1/base/js/wxshare','common/jquery-plugins/iscroll'],function($,LoadingList) {

	var THRESHOLD = 100;
	var loadingList = new LoadingList({
		dataUrl: '/wmp/user/' + appConfigId + '/prize/ajax/getRemarkByPage',
		itemTemplate: $('#reason-tpl') ,
		list: $('.reason-list'),
		hasMoreTest: function(obj) {
			return obj['data']['nextPage'] != -1;
		},
		scrollBox: $('#wrapper'),
		scroller: $('.roller'),
		getDataList: function(obj) {
			return obj['data']['resultData'];
		},
		loadingEle: $('.loading'),
		emptyPrompt: $('.empty-prompt'),
		param: {
			choiceId: choiceId,
			page: 1
		},
		onLoaded: function(obj) {
			this.param.page = obj['data']['nextPage'];
			var self = this;
			try{
				if(this.isc == undefined) {
					this.isc = new IScroll('#wrapper',{
						preventDefault: true,
						preventDefaultException: {
							 tagName: /^(A)$/
						}
					});
					this.isc.on('scrollEnd',function(){
						if(self.$scroller.height() - self.$scrollBox.height() - THRESHOLD <= Math.abs(this.y)) {
							self.handleContentScroll();
						}
					});
				} else {
				console.log('refresh');
					this.isc.refresh();
				}
			}catch(e) {
			}
		}
	});
});
