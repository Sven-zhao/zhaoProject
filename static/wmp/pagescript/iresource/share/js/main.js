require(['jquery','wxapi'],function($,wx){
	// 分享到朋友圈
	var $mask = $('.mask');
	var share_flag = 0;
	wx.config($.extend({
		debug: DEBUG,
		jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage']
	}, WXCONFIG));
	wx.ready(function() {
		//朋友圈
		wx.onMenuShareTimeline({
			title: SHARE_CONFIG.title,
			link: SHARE_CONFIG.link, // 分享链接
			imgUrl: SHARE_CONFIG.imgUrl, // 分享图标
			success: function() {
				share_flag = 1;
				$mask.hide();
				$('.shareMsg').hide();
			},
			cancel: function() {
				share_flag = 1;		
				$mask.hide();
				$('.shareMsg').hide();		
			}
		});
		//朋友
		wx.onMenuShareAppMessage({
			title: SHARE_CONFIG.title,
			link: SHARE_CONFIG.link, // 分享链接
			imgUrl: SHARE_CONFIG.imgUrl, // 分享图标
			desc: SHARE_CONFIG.desc, // 分享描述
			success: function() {
				share_flag = 1;
				$mask.hide();
				$('.shareMsg').hide();
			},
			cancel: function() {
				share_flag = 1;
				$mask.hide();
				$('.shareMsg').hide();
			}
		});
		wx.showOptionMenu();
	});
	$('#btn-share-f').on('click',function() {
		$mask.show();
		$('.shareMsg').show();
	});
	$('#btn-share').on('click',function() {
		$mask.show();
		$('.shareMsg').show();
	});
	$('.mask').on('click',function() {
		$mask.hide();
		$('.shareMsg').hide();
	});
    
	

});
