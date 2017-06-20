require(['jquery','modules/net/wAjax','wxapi'],function($,wAjax,wx){
	wx.config($.extend({
		debug: DEBUG,
		jsApiList: []
	},WXCONFIG));	

	wx.ready(function(){
		wx.hideOptionMenu();
	});
	
	//radio
	$('.item-box').on('touchend','.radio',function(){
		if($(this).hasClass('selected')){
			$(this).removeClass('selected');
		}else{
			$(this).addClass('selected');
		}
	});
	
	$('.container').on('click','#submit-btn',function(){
		var arr = [];
		$('.item-box .selected').each(function(){
			arr.push($(this).attr('name'));
		});
		wAjax({
			url: '/wmp/user/'+appConfigId+'/personal/drip/other/save',
			data:{'jsonStr':arr.join(',')},
			success: function(obj){
				var newUrl = obj['data'];
                var sep = '?';
                if (newUrl.indexOf('?') > -1) {
                    sep = '&';
                }
                var timestamp = Date.parse(new Date());
                newUrl = newUrl + sep + 'timestamp=' + timestamp;
                window.location.href = newUrl;
			}
		});	
	});
	
});
