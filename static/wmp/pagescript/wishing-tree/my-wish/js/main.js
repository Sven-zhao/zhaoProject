require(['jquery','modules/ui/loadinglist/js/main','common/jquery-plugins/iscroll','pagescript/wishing-tree/base/js/adjustRem','pagescript/wishing-tree/base/js/wxshare'],function($,LoadingList){
	var $body = $('body');
	var $closeListBtn = $('.btn-close');
	$('.btn-show-visitor').on('click',function() {
		$body.addClass('open-visitor-list');
	});	

	$closeListBtn.on('click',function() {
		$body.removeClass('open-visitor-list');
	});

	$('.visitor-list').on('touchstart','.contact-btn',function(){
		window.location.href = '/wmp/user/' + appConfigId + '/dream/userDream/'+$(this).attr('data-uid');
	});

	var THRESHOLD = 10;
	new LoadingList({
		dataUrl: '/wmp/user/'+ appConfigId +'/dream/loadVisit',
		itemTemplate: $('#visitor-tpl'),
		scrollBox: $('.list-box'),
		scroller: $('.list-box').find('.list'),
		useCustomScrollTrigger: true,
		list: $('.list-box').find('.list'),
		loadingEle: $('.loading'),
		emptyPrompt: $(''),
		param: {
		},
		hasMoreTest: function(obj) {
			return obj['data']['haveMore'];
		},
		getDataList: function(obj) {
			return obj['data']['list'];
		},
		onLoaded: function(obj) {
			this.param.lastId= obj['data']['lastId'];	
			var self = this;
			try{
				if(this.isc == undefined) {
					this.isc = new IScroll($('.list-box').get(0),{
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
					this.isc.refresh();
				}
			}catch(e) {
			}
		}
	});	
});
