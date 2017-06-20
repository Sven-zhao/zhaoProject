require(['jquery','modules/net/wAjax','modules/ui/showMsg/js/main','common/wx.default.config','pagescript/wishing-tree/base/js/adjustRem'],function($,ajax,showMsg){
	history.replaceState({},$('title').html(),document.referrer);
	function StarBox($ele) {
		var self = this;
		this.$ele = $ele;
		var $expBox = this.$ele.find('.star-exp'); 
		var $stars = $ele.find('.star');
		this.$ele.one('click',function() {
			$('.btn-next').removeClass('disabled');
		});
		this.$ele.on('touchstart','.star',function(){
			var $this = $(this);
			var starCount = $this.index()+1;
			$stars.filter('.active').removeClass('active');
			$stars.filter(':lt('+ starCount +')').addClass('active');
			self.starCount = starCount;
			$expBox.find('div.show').removeClass('show');
			$expBox.find('div:eq('+starCount+')').addClass('show');
			console.log(starCount);
		});		
	}	
	StarBox.prototype.getStarCount = function() {
		return this.starCount;	
	}

	var star = new StarBox($('.star-box'));

	$('.btn-wrap').on('click','.btn-next',function(){
		var $btn = $(this);
		if($btn.is('.disabled')) {
				showMsg({msg:"先点亮星星,给自己的2016打个分吧"});	
		} else {
			ajax({
				url: '/wmp/user/'+ appConfigId +'/dream/postInvestigate',
				type: 'post',
				data: {
					score: star.getStarCount()
				},
				success: function(obj) {
					window.location.href = '/wmp/user/' + appConfigId + '/dream/startDream';
				}
			});
		}
	});	
});
