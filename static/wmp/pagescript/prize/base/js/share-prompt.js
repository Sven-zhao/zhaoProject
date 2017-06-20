define(['jquery','common/jquery-plugins/jquery.browser.min'],function($) {
	var tpl = 	'<div id="prize-share-tip" style="display:none;">' +
					'<div class="content">' +
						'<div class="slogan">把我这份中国商界2016年度记录<br>分享至我伟大的朋友圈！</div>' +
						'<div class="tip">点击右上角“'+' <span class="sys-btn"></span> '+'”，发给你的微信朋友</div>'+						
					'</div>' +
				'</div>';	

	var $ele;
	if($('#prize-share-tip').length == 0) {
		$('head').append('<link rel="stylesheet" href="'+staticurl+'/pagescript/prize/base/css/share-prompt.css">');
		$ele = $(tpl);	
		if($.browser.iphone) {
			$ele.find('.sys-btn').addClass('ios');				
		} 
		$ele.find('.rank-link').on('click',function(evt) {
			evt.stopPropagation();
		});
		$ele.on('click',function() {
			$ele.removeClass('show');
		});
		setTimeout(function() {
			$('body').append($ele);
		});
	} else {
		$ele = $('#prize-share-tip');
	}

	return {
		show: function() {
			$ele.addClass('show');
	    },
		hide: function() {
			$ele.removeClass('show');
		}
	};
});
