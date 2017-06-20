define(['modules/net/wAjax','swig'],function(wAjax,swig) {
	function LoadingList(conf) {
		this.$loadingEle = conf['loadingEle'];
		this.$emptyPromptEle = conf['emptyPrompt'];
		this.itemTemplateStr = conf['itemTemplate'].html();
		this.$list = conf['list'].empty();
		this.extraParam = conf['extraParam'];
		this.dataUrl = conf['dataUrl'];
		conf['scrollBox'] && (this.$scrollBox = conf['scrollBox']);
		conf['scroller'] && (this.$scroller = conf['scroller']);
		this.$scrollBox.on('scroll',this,this.onWindowScroll);
		this.load();
	}
	LoadingList.prototype = {
		constructor: LoadingList,
		firstLoad: true,
		isLoading: false,
		hasMore: false,
		nextPage: 1,
		extraParam: null,
		dataUrl: null,
		$scrollBox: $(window),
		$scroller: $('body'),
		$loadingEle: null,					
		$emptyPromptEle: null,
		itemTemplateStr: null,
		$list: null,
		destroy: function() {
			this.$scrollBox.off('scroll');
			this.$emptyPromptEle.hide();
		},
		onWindowScroll: function(evt) {
			var loadinglist = evt.data;
			if(loadinglist.$scrollBox.scrollTop() + loadinglist.$scrollBox.height() > loadinglist.$scroller.height() * 0.9 && !loadinglist.isLoading && loadinglist.hasMore) {
				loadinglist.load();
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
				data: $.extend({page: this.nextPage},loadingList.extraParam),
				success: function(obj) {
					loadingList.hasMore = obj['hasMore'];
					var dataArr = obj['data'];
					if(dataArr == undefined || dataArr == "") {
						if(loadingList.firstLoad) {
							loadingList.$emptyPromptEle.show();
						} 
					} else {
						loadingList.$emptyPromptEle.hide();
						for (var index in dataArr) {
							var itemObj  = dataArr[index];		
							var $itemEle = $(swig.render(loadingList.itemTemplateStr,{locals:itemObj}));
							loadingList.$list.append($itemEle);
						}
					}
					loadingList.$loadingEle.hide();
					loadingList.isLoading = false;
					loadingList.nextPage++;
					if(loadingList.firstLoad && loadingList.hasMore) {
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
