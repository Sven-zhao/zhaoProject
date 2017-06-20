require(['jquery','wxapi','modules/ui/carousel/js/main','modules/ui/loadinglist/js/main','common/jquery-plugins/jquery.cookie'],function($,wx,Carousel,LoadingList) {
	wx.config($.extend({
        debug: DEBUG,
        jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage']
    },WXCONFIG));
    wx.ready(function(){
        //朋友圈
        wx.onMenuShareTimeline({
            title: SHARE_CONFIG.title,
            link: SHARE_CONFIG.link, // 分享链接
            imgUrl: SHARE_CONFIG.imgUrl, // 分享图标
            success: function () { 
				$.get('/static/wmp/common/stat1.gif');
            },
            cancel: function () { 
            }
        });
        //朋友
        wx.onMenuShareAppMessage({
            title: SHARE_CONFIG.title,
            link: SHARE_CONFIG.link, // 分享链接
            imgUrl: SHARE_CONFIG.imgUrl, // 分享图标
            desc: SHARE_CONFIG.desc, // 分享描述
            success: function () {
				$.get('/static/wmp/common/stat2.gif');
            },
            cancel: function () {
            }
        });
        wx.showOptionMenu();
    });


	var currentEventList,
		historyEventList,
		hasCurrent;

	function Filter(conf) {
		this.$dom = conf['$dom'];
		var self = this;
		self.conf = conf;
		self.$dom.find('.panel a:first-child').addClass('checked');
		self.$dom.on('click','.panel a',function(){
			self.setCheck($(this));
			self.onModified && self.onModified();
		});
		this.$dom.on('click','.btn:not(.pushed)',function(){
			var $this = $(this);
			self.$dom.find('.btn.pushed').removeClass('pushed');
			self.$dom.find('.panel:visible').hide();
			$this.addClass('pushed');
			$($this.attr('data-target')).show();
		});	
		this.$dom.on('click','.btn.pushed',function(){
			var $this = $(this);
			$this.removeClass('pushed');
			self.$dom.find('.panel:visible').hide();
		});
	}

	Filter.prototype = {
		constructor: Filter,
		setCheck: function($ele) {
			var self = this;
			var $this = $ele;
			self.onModified = self.conf['onModified'];
			$this.siblings('.checked').removeClass('checked');
			$this.addClass('checked');
			var $btn = self.$dom.find($this.attr('data-btn'));
			if($this.is('.tags a')) {
				$btn.addClass('modified');
				$.cookie('tag-seri',$this.attr('data-seri'));
			} else {
				$.cookie('sort-type',$this.attr('data-sort'));
			}
			$btn.find('span').text($this.html());
			$btn.removeClass('pushed');
			$this.parent().hide();
		},
		getParam: function() {
			return {
				tag: this.$dom.find('.tags a.checked').attr('value'),
				order: this.$dom.find('.rank a.checked').attr('value')
			};
		}
	}


	var $historyBtn = $('.history-btn');

	var filter = new Filter({
		$dom: $('.filter'),
		onModified: function() {
			createCurrentList();
			$historyBtn.addClass('hide');
			$('.empty').hide();
			$('.history').hide();
			$('.no-current-has-history').hide();
		}
	});


	$historyBtn.on('click',function(){
		$(this).addClass('hide');
		createHistoryList();
	});
	/*
	 * 轮播图
	 */
	var clientWidth =  $(window).width();
	$('#swipterList .swiper-slide').css('height',clientWidth/16*9);
	if( $('.swiper-slide').length > 1 ) {
		var swiper = new Swiper('.swiper-container', {
			pagination: '.swiper-pagination',
			paginationClickable: true,
			spaceBetween: 30,
			centeredSlides: true,
			autoplay: 2500,
			loop : true,
			autoplayDisableOnInteraction: false
		});	
	} 
	
	if($('.carousel .viewport .item').length > 0) {
		var headerCarousel = new Carousel({
			$dom:$('.carousel'),
			interval: 5000,
			duration: 800 
		});
		headerCarousel.play();
	}

	/*
	 * 当前活动列表
	 */

	function createHistoryList() {
		if(historyEventList) {
			historyEventList.destroy();
		}
		firstLoad = true;
		historyEventList = new LoadingList({
			dataUrl: '/wmp/user/'+appConfigId+'/activity/listMorePast',
			itemTemplate: $('#event-item-tpl'),
			loadingEle: $('.loading'),
			emptyPrompt: null,
			list: $('#past-events'),
			getDataList: function(obj) {
				return obj['data']['past']['data'];
			},
			hasMoreTest: function(obj) {
				return !obj['data']['past']['lastPage'];
			},
			param: $.extend({
				nextId: null
			},{tag:filter.getParam()['tag']}),
			onLoaded: function(obj) {
				this.param['nextId'] = obj['data']['past']['nextId'];
				if(!hasCurrent) {
					if(firstLoad) {
						if(obj['data']['past']['data']) {
							$('.no-current-has-history').show();
							$('.history').show();
						} else {
							$('.empty').show();
						}
					} 
				} else {
					if(firstLoad && obj['data']['past']['data']) {
						$('.history').show();
					}
				}
				firstLoad = false;
			}					  
		});
	}

	function createCurrentList() {
		if(currentEventList) {
			currentEventList.destroy();
		}
		currentEventList = new LoadingList({
			dataUrl: '/wmp/user/'+appConfigId+'/activity/listMoreCurrent',
			itemTemplate: $('#event-item-tpl'),
			loadingEle: $('.loading'),
			emptyPrompt: null,
			list: $('#current-events'),
			getDataList: function(obj) {
				return obj['data']['current']['data'];
			},
			hasMoreTest: function(obj) {
				return !obj['data']['current']['lastPage'];
			},
			param: $.extend({
				nextId: null
			},filter.getParam()),
			onLoaded: function(obj) {
				this.param['nextId'] = obj['data']['current']['nextId'];
				if( obj['data']['current']['lastPage'] == true) {
					if(obj['data']['current']['data']) {
						hasCurrent = true;
						if(obj['data']['current']['pastStatus']) {
							$historyBtn.removeClass('hide');
						}
					} else {
						hasCurrent = false;
						$historyBtn.trigger('click');
					}
				}
			}
		});
	}


     $('.download-banner').on('click',function(){
        var timestamp = Date.parse(new Date());
        window.location.href = "http://m.zhisland.com?uri=zhisland%3A%2F%2Fcom.zhisland%2Fevent&source=act_list";
     });

	if($.cookie('tag-seri') || $.cookie('sort-type')) {
		var curTagSeri = $.cookie('tag-seri') ? $.cookie('tag-seri') : 'all';
		var curSort = $.cookie('sort-type') ? $.cookie('sort-type') : 0; 
		filter.setCheck($('.tags a[data-seri="'+curTagSeri+'"]'));
		filter.setCheck($('.rank a[data-sort="'+curSort+'"]'));
		filter.onModified();
	} else {
		createCurrentList();
	}
	
	// 轮播
	if( $('.swiper-pagination span').length == 1) {
		$('.swiper-pagination span').hide();
	}

});
