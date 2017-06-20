require(['vue',
		'jquery',
		'wajax',
		'zhsdk',
		'modules/ui/showMsg/js/main',
		'pagescript/opportunity/base/js/urlAdapter',
		'pagescript/opportunity/all/js/oppo-filter',
		'pagescript/opportunity/all/js/oppo-search-box',
		'common/wx.default.config',
		'common/jquery-plugins/iscroll'],function(Vue,$,ajax,zh,showMsg,adapter) {
	var app = new Vue({
		el: '#wrap',
		data: {
			browseType: browseType,
			scroller: null,
			curPage: 1,
			resultArr: [],
			isLoading: false,
			loaded: false,
			hasMore: true,
			selectState: {
				category: '',
				industry_lv1: '',
				industry_lv2: '',
				address: ''
			},
			keyword: '',
			resultTotal: 0,
		},
		created: function() {
			//this.doRequest();
		},
		watch: {
			'selectState.category': function() {
				this.handleStateChange();
			},
			'selectState.address': function() {
				this.handleStateChange();
			},
			'selectState.industry_lv2': function() {
				this.handleStateChange();
			}
	    },
		methods: {
			gotoUrl: adapter.goToUrl,
			handleFilterSourceLoaded: function() {
				var hasInitParams = false;
				var paraMix = $.extend(true,{},initParam,{keyword:keyword});
				for(var key in initParam) {
					console.log(key);
					if(paraMix[key].length > 0) {
						hasInitParams = true;
						break;
					}
				}
				if(keyword!='') {
					this.keyword = keyword;
					console.log(this.keyword);
				}
				if(hasInitParams) {
					$.extend(true,this.selectState,initParam);	
				} else {
					this.doRequest();
				}
			},
			genUserTypeClass: function(num) {
				var className = 'identify-level-' + num;
				var classObj = {};
				classObj[className] = true;
				return classObj;
			},
			genAvatarStyle: function(url) {
				return 'background-image:url('+ url + ')';
			},
			gotoDownloadUrl: function() {
//				 var url = 'http://m.zhisland.com/wz/app/download?uri='+ encodeURIComponent('zhisland://com.zhisland/'+wmpurl+'/wmp/user/'+appConfigId+'/resource/app/pub');
//				 this.gotoUrl({url:url});
				 this.gotoUrl({url:wmpurl+'/wmp/user/'+appConfigId+'/resource/app/pub',apponly:true,newLayer:true});
			},
			toOppoUrl: function(evt) {
				var result = wmpurl+'/wmp/user/' + window.appConfigId + '/resource/app/detail/'+$(evt.currentTarget).attr('data-id');
				if( browseType == 2) {
					zh.navigateTo({
						url: result
					});
				} else {
					window.location.href = result; 
				}
				//window.location.href = result;
				//todo: 待 redirectTo 没有问题后使用下面代码
				// zh.redirectTo({
				// 	url: result
				// });
		    },
			updateSelectState: function(obj) {
				$.extend(this.selectState,obj);
			},
			onSearch: function(data) {
				this.keyword = data.keywords;
				$.extend(true,this.selectState,{
					category: '',
					industry_lv1: '',
					industry_lv2: '',
					address: ''
				});
				this.handleStateChange();
			},
			handleStateChange: function() {
				this.resultArr = [];
				this.hasMore = true;
				this.curPage = 1;
				this.scroller && this.scroller.scrollTo(0,0);
				this.doRequest();
		    },
			onFilterSelected: function(evtData) {
				this.updateSelectState(evtData);
			},
			doRequest: function() {
				var self = this;
				if(self.isLoading) {
					return;
				}
				if(!self.hasMore) {
					return;
				}
				var params = self.selectState;
				self.isLoading = true;
				self.loaded = false;
				ajax({
					url: 'search',
					data: {
						categories: params.category,
						industries: params.industry_lv2,
						addresses: params.address,
						word: self.keyword,
						cp: self.curPage
					},
					success: function(obj) {
						console.log(obj);
						self.curPage = obj.data.cp + 1;
						self.hasMore = obj.data.haveMore;
						self.resultArr = self.resultArr.concat(obj.data.list);
						self.resultTotal = obj.data.total;
						Vue.nextTick(function() {
							if(self.scroller) {
								self.scroller.refresh();
							} else {
								self.scroller = new IScroll('.result-container',{
									disableMouse: true,
									disablePointer: true,
									preventDefaultException: {
										tagName: /^(A)$/
									}
								});
								self.scroller.on('scrollEnd',function() {
									if(self.hasMore && !self.isLoading && this.directionY > 0 && Math.abs(this.y) + $(self.$el).find('.result-container').height() > $(self.$el).find('.result-list').height() -10) {
										console.log('load');
										self.doRequest();
										self.scroller && self.scroller.scrollBy(0,-40);
									} else {
										console.log('noload');
									}
								});
							}
						})
					},
					complete: function() {
						self.isLoading = false;
						self.loaded = true;
					}
				});
			}
		}
	});
});
