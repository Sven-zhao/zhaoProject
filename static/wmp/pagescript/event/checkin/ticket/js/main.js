require(['jquery','wxapi','modules/net/wAjax','modules/ui/showMsg/js/main'],function($,wx,ajax,showMsg){
	wx.config($.extend({
        debug: DEBUG,
        jsApiList: ['hideOptionMenu']
    },WXCONFIG));
    wx.ready(function(){
        wx.hideOptionMenu();
    });
	function loadQrCode() {
		var $loading = $('.qr-code .loading');
		var $qrImg = $('.qr-code img');
		var imgSrc = $qrImg.attr('data-src');
		if(!imgSrc) {
			return;
		}
		var img = new Image();
		img.onload = function(){
			$qrImg.attr('src',imgSrc).fadeIn();
			$loading.fadeOut();
		}	
		img.src = imgSrc;
	}
	var FRESH_DELAY = 3000;
	function freshCheckinState() {
		ajax({
			url: '/wmp/user/'+ appConfigId +'/activity/' + aid + '/checkSign',
			data: {
				uid: uid
			},
			success: function(obj) {
				$('.checkin-status .text').text('已签到');
				$('.icon-time').removeClass('icon-time').addClass('icon-tick');
			},
			error: function(obj) {
				if( obj['code'] && [1,2].indexOf(obj['code']) >= 0 ) {
					setTimeout(freshCheckinState,FRESH_DELAY);
					console.info('check');
				} else {
					showMsg({
						msg:obj['msg']
					});
				}
		    }
		});
	}

	loadQrCode();
	freshCheckinState();
});
