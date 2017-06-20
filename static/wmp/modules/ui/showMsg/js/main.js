/* start: msg-box */
define(['jquery'],function($) {
	showMsgBox = function(settings) {
		var domStr;
		switch(settings['type']) {
			case 'prompt':
				domStr = '<div class="msg-box" id="msg-box"><div class="msg-card"><div class="prompt content"></div></div></div>';
				break;
			case 'alert':
				domStr = '<div class="msg-box" id="msg-box"><div class="msg-card alert content"></div></div>';
				break;
			default: 
				domStr = '<div class="msg-box" id="msg-box"><div class="msg-card"><div class="prompt content"></div></div></div>';
		}
		var timeOutFlag;
		if ( $('#msg-box').length == 0 ) {
			$(window.document.body).append(domStr);
			$('#msg-box').on('click',function() {
				clearTimeout(timeOutFlag);
				$(this).fadeOut();
			});
		} 
		var self = $('#msg-box');
		$('#msg-box .content').html(settings['msg']);
		self.fadeIn();
		timeOutFlag = setTimeout(function(){
			self.fadeOut();
			settings['callback']&&settings['callback']();
		},3000);
	}
	return showMsgBox;
});
/* end: msg-box */
