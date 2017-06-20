define(['jquery','pagescript/quiz/base/js/wAjax'],function($,wAjax) {

	function Loader(settings) {
		self = this;
		this.url = settings.url || window.location.href;
		this.extraData = settings.extraData || {};
		this.firstLoad = settings.firstLoad || false;
		this.nextPage = settings.nextPage || 1;
		this.hasMore = settings.hasMore || false;
		this.$listRoot = settings.listRoot || $('.list');
		this.listItemGroupSelector = settings.listItemGroupSelector || '.item-group';
		this.loadRate = settings.loadRate || 0.7;
		if(this.firstLoad) {
			this.nextPage = 1;
			this.hasMore = true;
			this.load();
		};
		//bind event
		this.$window.on('scroll touchmove',this.onWindowScroll);		
	}
	Loader.prototype = {
		constructor: Loader,
		isLoading: false,
		$window: $(window),
		$body: $('body'),
		//functions
		showProgress: function(isShow) {
			if(self.$body.find('.loading').length == 0) {
				self.$body.append('<div class="loading"><div class="animation"></div></div>');
			}
			var $loading = self.$body.find('.loading');
			if(isShow) {
				$loading.show();
			}
			else {
				$loading.hide();
			}
		},
		load: function() {
			self.isLoading = true;
			self.showProgress(true);
			wAjax({
				url: self.url,
				data: $.extend(self.extraData,{'page':self.nextPage}),
				success: function(rs) {
					self.$listRoot.append(rs);
					var $lastItemGroup = $(self.listItemGroupSelector).filter('[data-page-num='+self.nextPage+']');
					self.hasMore = $lastItemGroup.data('hasMore')=='true' || $lastItemGroup.data('hasMore')=='yes';
					self.nextPage++;
				},
				error: function(obj) {
			    },
			    complete: function() {
			    	self.isLoading = false;
			    	self.showProgress(false);
			    }
			});

		},
		onWindowScroll: function(){
			var winHeight = self.$window.height(),
				scrollTop = self.$window.scrollTop(),
				bodyHeight = self.$body.height();
			if((winHeight + scrollTop >= self.loadRate * bodyHeight) && !self.isLoading && self.hasMore){				
				self.load();
			} 
		},
		destroy: function() {
			self.$window.off('scroll touchmove');
		}

	}

	return Loader;
});