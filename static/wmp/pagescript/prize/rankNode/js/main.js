require(['jquery', 'modules/ui/loadinglist/js/main', 'swig', 'common/jquery-plugins/iscroll','common/wx.default.config'], function ($, LoadingList, swig) {
	var $itemTemplate = $('#item-tpl'),
		$ownerTemplate = $('#owner-item-tpl'),
		$rewardTemplate = $('#reward-item-tpl'),
		$universEle = $('#univers'),
		$rewardEle = $('#all-rewards'),
		$inLandListEle = $('#in-land');
	var prizeType = $("input[name='prizeType']").val();
	$('.list-container').on('click','.item',function() {
		window.location.href = $(this).attr('data-url');
	});

	var commonLoadingListConf = {
		dataUrl: 'user/list',
		itemTemplate: $itemTemplate,
		useCustomScrollTrigger: true,
		hasMoreTest: function(obj) {
			return obj['data']['nextPage'] != -1;
		},
		getDataList: function(obj) {
			return obj['data']['dataList'];
		}
	};

	var THRESHOLD = 100;
	function onLoadFuncFactory(scrollerId) {
		return function(obj) {
			showMyStatistics(this,obj);
			this.param.page = obj['data']['nextPage'];	
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

	var listCreationMap = {
		"inLandList": function() {
			listMap['inLandList'] = new LoadingList($.extend({},commonLoadingListConf,{
				dataUrl: '/wmp/user/'+appConfigId+'/prize/ajax/getZhislandRankByPageNode',
				scrollBox: $inLandListEle,
				scroller: $inLandListEle.find('.list'),
				list: $inLandListEle.find('.list'),
				loadingEle: $inLandListEle.find('.loading'),
				emptyPrompt: $(''),
				param: {
					page: 1,
					prizeType: prizeType
				},
				onLoaded: onLoadFuncFactory('#in-land') 
			}));	
		},
		"rewardList": function() {
			listMap['rewardList'] = new LoadingList($.extend({},commonLoadingListConf,{
				dataUrl: '/wmp/user/'+appConfigId+'/prize/ajax/getAllPrizeRankByPage',
				itemTemplate: $rewardTemplate ,
				scrollBox: $rewardEle,
				scroller: $rewardEle.find('.list'),
				list: $rewardEle.find('.list'),
				loadingEle: $rewardEle.find('.loading'),
				emptyPrompt: $rewardEle.find('.empty-tip'),
				param: {
					page: 1,
					prizeType: prizeType
				},
				onLoaded: onLoadFuncFactory('#all-rewards') 
			}));	
		},
		"universList": function() {
			listMap['universList'] = new LoadingList($.extend({},commonLoadingListConf,{
				dataUrl: '/wmp/user/'+appConfigId+'/prize/ajax/getUserAllRankByPageNode',
				scrollBox: $universEle,
				scroller: $universEle.find('.list'),
				list: $universEle.find('.list'),
				loadingEle: $universEle.find('.loading'),
				emptyPrompt: $(''),
				param: {
					page: 1,
					prizeType: prizeType
				},
				onLoaded: onLoadFuncFactory('#univers') 
			}));	
		}
	};

	var listMap = {
		"inLandList": null,
		"rewardList": null,
		"universList": null
	};

	$('.tab').on('touchstart',function(){
		var $this = $(this);
		if(!$this.hasClass('active')) {
			$('.tab.active').removeClass('active');
			$(this).addClass('active');
			$('.list-container.active').removeClass('active');
			$($(this).attr('data-target')).addClass('active');
			var listName = $this.attr('data-list-name');
			if(listMap[listName] == null) {
				listCreationMap[listName]();
			}
		}
	});

	$('#tab-reward').trigger('touchstart');

	function showMyStatistics(self,obj) {
		var myInfo = obj['data']['myUserPraiseSum'];
		if(myInfo) {
			if(!self.myStaAdded) {
				self.$list.prepend($(swig.render($ownerTemplate.html(),{locals:$.extend({},myInfo,{myRank:obj['data']['myRank']})})));
				self.myStaAdded = true;
			} 
		}
	}

});
