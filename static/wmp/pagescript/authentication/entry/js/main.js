require(['jquery', 'wxapi'], function ($, wx) {
	wx.config($.extend({
		debug: DEBUG,
		jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage']
	},WXCONFIG));

	var $mask = $('.mask');
	var $noIcContainer = $('.no-ic');
	var $showTips = $('[name=showTips]');
	var $tip = $('.mask .tip');
	var $confirm = $('.mask .confirm');	

	if($showTips.val() == 'true') {
		$mask.children().hide();
		$confirm.show();
		$mask.show();
	}
	else {
		$noIcContainer.on('click',function(){
			$mask.children().hide();
			$tip.show();
			$mask.show();
		});
		$mask.on('click',function(){
			$mask.hide();
		});
	}

	wx.ready(function(){
		wx.onMenuShareTimeline({
			title: SHARE_CONFIG.title, 
			link: SHARE_CONFIG.link, // 分享链接
			imgUrl: SHARE_CONFIG.imgUrl, // 分享图标
			desc: SHARE_CONFIG.desc, // 分享描述
			success: function () { 
				$mask.hide();
			},
			cancel: function () { 
				$mask.hide();
			}
		});
		wx.onMenuShareAppMessage({
			title: SHARE_CONFIG.title,
			link: SHARE_CONFIG.link, // 分享链接
			imgUrl: SHARE_CONFIG.imgUrl, // 分享图标
			desc: SHARE_CONFIG.desc, // 分享描述
			success: function () {
				$mask.hide();
			},
			cancel: function () {
				$mask.hide();
			}
		});
		wx.showOptionMenu();
	});

});
