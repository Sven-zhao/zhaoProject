require(['jquery','modules/net/wAjax','pagescript/userinfos/base/js/tagSelector','wxapi'],function($,wAjax,tagSelector,wx){
	$addBtn = $('#add-btn');
	$tagTpl = $(' <a class="tag tag-green checked" href="javascript:;"></a>');
	$inputWindow = $('.input-window');
	$delWindow = $('.del-window');

	wx.config($.extend({
		debug: DEBUG,
		jsApiList: []
	},WXCONFIG));	

	wx.ready(function(){
		wx.hideOptionMenu();
	});

	$('#submit-btn').on('click',function(){
		tagSelector.save('find');
	});

	$addBtn.on('click',function(){
		$inputWindow.removeClass('hide');
		$inputWindow.find('input').focus();
	});

	function toggleInputWindow(show) {
		if(show) {
			$inputWindow.removeClass('hide');
		} else {
			$inputWindow.addClass('hide').find('input').val('');
		}
	}

	$('.cancel-btn',$inputWindow).on('click',function(){
		toggleInputWindow(false);
	});

	$('.cancel-btn',$delWindow).on('click',function(){
		$delWindow.addClass('hide');
	});
	$('.container').on('click','.tag.checked',function(){
		var $this = $(this);
		$delWindow.removeClass('hide');
		$('.confirm-btn',$delWindow).off('click').one('click',function(){
			$this.remove();	
			$delWindow.addClass('hide');
		});
	});

	$('.confirm-btn',$inputWindow).on('click',function(){
		var inputText = $.trim($inputWindow.find('input').val());
		if(inputText != '') {
			var $tagForAdd = $tagTpl.clone().html(inputText);	
			$tagForAdd.insertBefore($addBtn);
		}
		toggleInputWindow(false);
	});

});
