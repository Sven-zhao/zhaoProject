define(['jquery'],function($){
	function adjustBaseFontSize() {
		var IPHONE_5_HEIGHT = 568;
		var BASE_FONT_SIZE = 16;
		fontSizeCaculated = BASE_FONT_SIZE * $(window).height() / IPHONE_5_HEIGHT;
		$('html').css({
			'font-size':fontSizeCaculated+'px',
		});
	}
	adjustBaseFontSize();
	$('.content-wrap').fadeIn();
	// $(window).on('resize',adjustBaseFontSize);
});
