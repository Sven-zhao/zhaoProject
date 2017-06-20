define(['jquery','pagescript/wishing-tree/screen/js/circlequeue'],function($,CircleQueue) {
	function CardRunner(conf) {
		this.$el = $(conf['selector']);
		this.delay = conf['delay'] || 100;
		this.cQueue = new CircleQueue({
			length: 16,
			dataArr: this.$el.children('.card')
		});
	}
	CardRunner.prototype = {
		constructor: CardRunner,
		delay: 0,
		$el: null,
		cQueue: null,
		running: false,
		showAll: function() {
			this._showHide('show');
		},
		setData: function(dataArr) {
			if(dataArr.length == 0 ) {
				return;
			}
			function fillData($ele,data) {
				$ele.find('.content').html(data['userName']);
				$ele.find('.preview-content').html(data['content']);
			}
			var self = this;
			var que = this.cQueue;
			this.running = true;
			var count = 0;
			var sign = setInterval(function(){
				var data = dataArr[count++];
				var $card = $(que.getNext());	
				if($card.is('.show')) {
					self.hideByOne($card);
					setTimeout(function(){
						fillData($card,data);
						self.showByOne($card);	
					},800);
				} else {
					fillData($card,data);
					self.showByOne($card);	
				}
				if(count >= dataArr.length) {
					clearInterval(sign);
					self.running = false;
				}
			},800);
		},
		setDataBatch: function(dataArr) {
			if(dataArr.length == 0 ) {
				return;
			}
			function fillData($ele,data) {
				$ele.find('.content').html(data['userName']);
				$ele.find('.preview-content').html(data['content']);
			}
			function testEnd(cur,all) {
				setTimeout(function() {
					if(cur == all - 1) {
						self.running = false;
					}
				},2000);
			}
			var self = this;
			var que = this.cQueue;
			this.running = true;
			var count = 0;
			dataArr.forEach(function(data,index,arr){
				var data = dataArr[index];
				var $card = $(que.getNext());	
				if($card.is('.show')) {
					self.hideByOne($card);
					setTimeout(function(){
						fillData($card,data);
						self.showByOne($card);	
						testEnd(index,arr.length);
					},800);
				} else {
					fillData($card,data);
					self.showByOne($card);	
					testEnd(index,arr.length);
				}
			});
		},
		_showHide: function(opt) {
			var $el = this.$el;
			if(opt == 'show') {
				var classRemove = 'hide';
				var classAdd = 'show';
			} else if (opt == 'hide') {
				var classRemove = 'show';
				var classAdd = 'hide';
			}	
			var $cardsFilled = $el.children('.card.'+classRemove).filter('[filled]'),
				amount = $cardsFilled.length,
				delay = this.delay;
				counter = 0;
			var intervalId = setInterval(function(){
				$cardsFilled.eq(counter++).removeClass(classRemove).addClass(classAdd);
				if(counter >= amount) {
					clearInterval(intervalId);
				}
			},delay);
	    },
		hideAll: function() {
			this._showHide('hide');
		},
		_showHideByOne: function($card,opt) {
			if(opt == 'show') {
				var classRemove = 'hide';
				var classAdd = 'show';
			} else if (opt == 'hide') {
				var classRemove = 'show';
				var classAdd = 'hide';
			}	
			$card.removeClass(classRemove).addClass(classAdd);
		},
		showByOne: function($card) {
			this._showHideByOne($card,'show');
		},
		hideByOne: function($card) {
			this._showHideByOne($card,'hide');
		}
	}
	return CardRunner;
});
