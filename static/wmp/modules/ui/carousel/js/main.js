define(['jquery'],function($){
	function CircleList(arr) {
		this.arr = arr;
		this.indexMax = this.arr.length - 1;
	}

	CircleList.prototype = {
		constructor: CircleList,
		arr: null,
		indexMin: 0,
		indexMax: null,
		cursor: 0,
		getCur: function() {
			return this.arr[this.cursor];
		},
		next: function() {
			if(this.cursor < this.indexMax) {
				this.cursor++;
			} else {
				this.cursor = this.indexMin;
			}
		},
	    pre: function() {
			if(this.cusor > this.indexMin) {
				this.cursor--;
			} else {
				this.cursor = this.indexMax;
			}
		}
	}

	function Carousel(conf) {
		$.extend(this.conf,this.default,conf);		
		var self = this;
		this.$dom = this.conf['$dom'];
		this.slideCount = this.$dom.find('.item').length;
		$(this.$dom.find('.item').get(0)).show();
		if(this.slideCount == 1) {
			return;
		}
		this.$dom.append('<div class="slide-indicator"></div>');
		var arr = [];
		this.$dom.find('.item').each(function(index){
			var $indicator = $('<a href="javascript:;"></a>');
			self.$dom.find('.slide-indicator').append($indicator);
			arr.push({
				slide: $(this),
				indicator: $indicator 
			});
		});
		this.circleList = new CircleList(arr);
		this.stepWidth = this.$dom.find('.viewport').outerWidth();
		$(this.$dom.find('.slide-indicator a').get(0)).addClass('cur');
	}		

	Carousel.prototype = {
		constructor: Carousel,
		circleList: null,
		default: {
			/*
			 * 轮播间隔，秒
			 */
			interval: 1000,
			/*
			 * 动画时间
			 */
			duration: 1000
		},
		conf: {},	
		slideCount: null,
		stepWidth: null,
		intervalNum: null,
		$dom: null,
		show: function(obj) {
			obj['slide'].css({left:this.stepWidth}).show().animate({left:0},this.conf['duration']);
			obj['indicator'].addClass('cur');
		},
		hide: function(obj) {
			obj['slide'].animate({left:-this.stepWidth},this.conf['duration']);
			obj['indicator'].removeClass('cur');
	    },
		play: function() {
			if(this.slideCount == 1) {
				console.warn('只有一张幻灯片,所以停止轮播');
			} else {
				var list = this.circleList;
				var self = this;
				setTimeout(function(){
					work();
					self.intervalNum = setInterval(work,self.conf['interval']+self.conf['duration']);
				},this.conf['interval']);

				function work() {
					self.hide(list.getCur());
					list.next();
					self.show(list.getCur());
				}
			}
		}
	}

	return Carousel;
});
