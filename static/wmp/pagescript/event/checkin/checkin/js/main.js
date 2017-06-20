require(['jquery','modules/net/wAjax','modules/ui/showMsg/js/main','wxapi'],function($,ajax,prompt,wx){
	 
	wx.config($.extend({
        debug: DEBUG,
        jsApiList: ['hideOptionMenu']
    },WXCONFIG));
    wx.ready(function(){
        wx.hideOptionMenu();
    });

	var $waitSign = $('.wait-sign'),
		$checkinBtn = $('.checkin-btn'),
		$success = $('.success');

	function reset() {
		$checkinBtn.show();
		$waitSign.hide();
	}

	$checkinBtn.on('click',function(){
		$(this).fadeOut(function(){
			$waitSign.fadeIn(function(){
				try {
					ajax({
						url: '/wmp/user/'+appConfigId+'/activity/'+aid+'/signIn',
						type: 'post',
						data: {
							uid: uid
						},
						success: function(obj) {
							$waitSign.fadeOut(function(){
								$success.show().addClass('up');
							});
						},
						error: function(obj) {
							prompt({
								type: 'alert',
								msg: obj['msg']
							});
							reset();		
						},
						generalError: function() {
							reset();
						}
					});
				} catch(e) {
					prompt({
						type: 'alert',
						msg: e
					});
					reset();		
				}
			});
		});
	});
});
