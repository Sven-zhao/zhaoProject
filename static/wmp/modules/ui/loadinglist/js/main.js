define(['modules/net/wAjax','swig'],function(wAjax,swig) {
	function LoadingList(conf) {
		this.$loadingEle = conf['loadingEle'];
		this.$emptyPromptEle = conf['emptyPrompt'];
		this.itemTemplateStr = conf['itemTemplate'].html();
		this.$list = conf['list'].empty();
		/*
		 * 函数
		 */
		this.getDataList = conf['getDataList'];
		/*
		 * 函数 有更多 返回 true
		 * 参数为服务器返回数据
		 */
		this.hasMoreTest = conf['hasMoreTest'];
		/*
		 * 参数为 服务器返回数据
		 */
		this.onLoaded = conf['onLoaded'];
		this.param = conf['param'];
		this.dataUrl = conf['dataUrl'];
		conf['scrollBox'] && (this.$scrollBox = conf['scrollBox']);
		conf['scroller'] && (this.$scroller = conf['scroller']);
		if(conf['useCustomScrollTrigger'] != true ) {
			this.$scrollBox.on('scroll',this,this.onWindowScroll);
		}
		this.load();
	}
	LoadingList.prototype = {
		constructor: LoadingList,
		firstLoad: true,
		firstPage: true,
		isLoading: false,
		hasMore: false,
		param: null,
		dataUrl: null,
		$scrollBox: $(window),
		$scroller: $('body'),
		$loadingEle: null,
		$emptyPromptEle: null,
		itemTemplateStr: null,
		$list: null,
		destroy: function() {
			this.$scrollBox.off('scroll');
			this.$emptyPromptEle && this.$emptyPromptEle.hide();
		},
		onWindowScroll: function(evt) {
			var loadinglist = evt.data;
			if(loadinglist.$scrollBox.scrollTop() + loadinglist.$scrollBox.height() > loadinglist.$scroller.height() * 0.9 ) {
				loadinglist.handleContentScroll();
			}
		},
		handleContentScroll: function() {
			 if(!this.isLoading && this.hasMore) {
				this.firstPage = false;
				this.load();
			 }
		},
		bigScreenTest: function() {
			if( this.$scroller.height() < this.$scrollBox.height()) {
				this.load();
			}
		},
		load: function() {
			var loadingList = this;
			loadingList.isLoading = true;
			loadingList.$loadingEle.show().addClass('show');
			wAjax({
				url: this.dataUrl,
				data: loadingList.param,
				success: function(obj) {
					loadingList.hasMore = loadingList.hasMoreTest(obj);
					var dataArr = loadingList.getDataList(obj);
					if(dataArr == undefined || dataArr == "") {
						if(loadingList.firstLoad) {
						loadingList.$emptyPromptEle && loadingList.$emptyPromptEle.show();
						}
					} else if (dataArr instanceof Array){
							loadingList.$emptyPromptEle && loadingList.$emptyPromptEle.hide();
							for (var index in dataArr) {
								var itemObj  = dataArr[index];
								var $itemEle = $(swig.render(loadingList.itemTemplateStr,{locals:itemObj}));
								loadingList.$list.append($itemEle);
							}
					}else{
						var $itemEle = $(swig.render(loadingList.itemTemplateStr,{locals:dataArr}));
						loadingList.$list.append($itemEle);
					};
					loadingList.$loadingEle.hide();
					loadingList.isLoading = false;
					loadingList['onLoaded'] && loadingList['onLoaded'](obj);
					if(loadingList.firstPage && loadingList.hasMore) {
						loadingList.bigScreenTest();
					}
					loadingList.firstLoad = false;
				},
				complete: function() {
					setTimeout(function(){
						loadingList.$loadingEle.removeClass('show');
						setTimeout(function(){
							loadingList.$loadingEle.hide();
						},500);
					},500);
			    }
			});
		}

	};
	return LoadingList;
});
