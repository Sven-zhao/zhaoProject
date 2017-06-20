require(['jquery','modules/ui/loadinglist/js/main','swig','common/jquery-plugins/iscroll','pagescript/trust/base/js/wxshare'],function($,LoadingList,swig){
	var $itemTemplate = $('#list-item-tpl'),
		$eliteListEle = $('#elite'),
		$memberListEle = $('#member'),
		$preMemberListEle = $('#pre-member'),
		$friendListEle = $('#friends');

	$('.tab').on('click',function(){
		var $this = $(this);
		if(!$this.hasClass('active')) {
			$('.tab.active').removeClass('active');
			$(this).addClass('active');
			$('.list-container.active').removeClass('active');
			$($(this).attr('data-target')).addClass('active');
		}
	});

	var $friendRankEmptyTip;
	if((eval(login) && eval(completeInfo)) == false) {
		$friendRankEmptyTip = $friendListEle.find('.login-tip');
		$('#tab-elite-btn').trigger('click');
	} else {
		$friendRankEmptyTip = $friendListEle.find('.empty-tip');
		$('#tab-friends-btn').trigger('click');
	}	

	if(tab != '') {
		$('[data-target="#'+ tab +'"]').trigger('click');
	} else {
		if((eval(login) && eval(completeInfo)) == false) {
			$('#tab-elite-btn').trigger('click');
		} else {
			$('#tab-friends-btn').trigger('click');
		}	
	}

	var commonLoadingListConf = {
		dataUrl: '/wmp/user/'+appConfigId+'/trust/loadRank',
		itemTemplate: $itemTemplate,
		useCustomScrollTrigger: true,
		hasMoreTest: function(obj) {
			return obj['data']['haveMore'];
		},
		getDataList: function(obj) {
			return obj['data']['list'];
		}
	}

	var friendList = new LoadingList($.extend({
		scrollBox: $friendListEle,
		scroller: $friendListEle.find('.list-content'),
		list: $friendListEle.find('.list-content'),
		loadingEle: $friendListEle.find('.load-sign'),
		emptyPrompt: $friendRankEmptyTip,
		param: {
			cp: 0,
			type: 0 
		},
		onLoaded: onLoadFuncFactory('#friends') 
	},commonLoadingListConf));	

	var eliteList = new LoadingList($.extend({
		scrollBox: $eliteListEle,
		scroller: $eliteListEle.find('.list-content'),
		list: $eliteListEle.find('.list-content'),
		loadingEle: $eliteListEle.find('.load-sign'),
		emptyPrompt: $eliteListEle.find('.empty-tip'),
		param: {
			cp: 0
		},
		onLoaded: onLoadFuncFactory('#elite') 
	},commonLoadingListConf));	


	var THRESHOLD = 100;
	function onLoadFuncFactory(scrollerId) {
		return function(obj) {
			showMyStatistics(this,obj);
			this.param.cp = obj['data']['cp']+1;	
			var self = this;
			try{
				if(this.isc == undefined) {
					this.isc = new IScroll(scrollerId,{
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
	}

	function showMyStatistics(self,obj) {
		var myInfo = obj['data']['myInfo'];
		if(myInfo) {
			if(!self.myStaAdded) {
				self.$list.prepend($(swig.render($itemTemplate.html(),{locals:obj['data']['myInfo']})).addClass('mine'));
				self.myStaAdded = true;
			} 
		}
	}

	var memberList = new LoadingList($.extend({
		scrollBox: $memberListEle,
		scroller: $memberListEle.find('.list-content'),
		list: $memberListEle.find('.list-content'),
		loadingEle: $memberListEle.find('.load-sign'),
		emptyPrompt: $memberListEle.find('.empty-tip'),
		param: {
			cp: 0,
			type: 400 
		},
		onLoaded: onLoadFuncFactory('#member')

	},commonLoadingListConf));	

	var preMemberList = new LoadingList($.extend({
		scrollBox: $preMemberListEle,
		scroller: $preMemberListEle.find('.list-content'),
		list: $preMemberListEle.find('.list-content'),
		loadingEle: $preMemberListEle.find('.load-sign'),
		emptyPrompt: $preMemberListEle.find('.empty-tip'),
		param: {
			cp: 0,
			type: 300 
		},
		onLoaded: onLoadFuncFactory('#pre-member') 

	},commonLoadingListConf));	
});
