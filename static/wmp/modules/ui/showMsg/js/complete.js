/* start: msg-box */
define(['jquery'],function($) {
	showCompleteMsg = function(settings) {
		var _interval = settings.interval || 1000;
		var _msg = settings.msg || "";

		if ( $('.complete-msg-box').length == 0 ) {
			$(window.document.body).append('<div class="complete-msg-box"><div class="msg-container"><div class="msg"></div></div></div>');
			$('.complete-msg-box').on('click',function() {
				clearTimeout(timeOutFlag);
				$(this).fadeOut();
				settings.callback&&settings.callback();
			});
		} 

		$('.complete-msg-box>.msg-container>.msg').html(_msg);
		var self = $('.complete-msg-box');
		settings.beforeShow&&settings.beforeShow();
		self.fadeIn();

		var timeOutFlag = setTimeout(function(){
			self.fadeOut();
			settings.callback&&settings.callback();
		},_interval);
	}
	return showCompleteMsg;
});
/* end: msg-box */
