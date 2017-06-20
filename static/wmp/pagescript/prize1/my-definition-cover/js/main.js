require(['jquery','pagescript/prize1/base/js/share-prompt','pagescript/prize1/base/js/wxshare'],function($,sharePrompt){
	function adjustBaseFontSize() {
		var IPHONE_6_HEIGHT = 667;
		var BASE_FONT_SIZE = 16;
		fontSizeCaculated = BASE_FONT_SIZE * $(window).height() / IPHONE_6_HEIGHT;
		$('html').css({
			'font-size':fontSizeCaculated+'px',
		});
	}
	adjustBaseFontSize();
	$('.content-wrap').fadeIn();
	$(window).on('resize',adjustBaseFontSize);
	if(isMe) {
		sharePrompt.show();
	}
});
