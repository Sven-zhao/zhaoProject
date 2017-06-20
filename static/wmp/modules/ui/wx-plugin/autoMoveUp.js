define(['jquery','jquery/browser'],function($) {
	$(document).ready(function(){		
		/*
			remedy for some android cellphone, such as sumsung.
			The input box may be blocked by the keyboard when it is clicked
		*/ 
		if($.browser.android) {
			$('[autoMoveUp]').on('focus',function(){
				var $this = $(this); 
				$this.data('orgWinScrollTop',$(window).scrollTop());
				setTimeout(function(){
				 	$('body').css('min-height',$(window).height()+$('body').height());
				    $(window).scrollTop($this.offset().top - $this.attr('autoMoveUp'));
				},200);
			}).on('blur',function(){
				var $this = $(this); 
				setTimeout(function(){
				 	$('body').css('min-height',0);
				    $(window).scrollTop($this.data('orgWinScrollTop'));
				},200);
			});
		}
	});
});