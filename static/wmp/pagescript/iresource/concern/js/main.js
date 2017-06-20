require(['jquery','wxapi'],function($,wx){

	wx.config($.extend({
		debug: DEBUG,
		jsApiList: ['scanQRCode']
	},WXCONFIG));

	wx.ready(function(){
		wx.hideOptionMenu();
	});
	
	// 3秒后跳过
	var isAttention = parseInt($("input[name='isAttention']").val());
	var needURL = $('.startAnswer a').attr('href');
	if( isAttention === 1 ) {
		$('body').addClass('hideDiv');
		var wait = parseInt( $('.skipSign span').text() );  
		timeOut();  
		function timeOut(){  
			if( wait === 0 ){  
				window.location = needURL;     
			}else {                    
				setTimeout(function(){  
					wait--;  
					$('.skipSign span').text( wait );  
					timeOut();  
				},1000);  
			}  
		}
	}else {
		$('body').removeClass('hideDiv');
	}
});
