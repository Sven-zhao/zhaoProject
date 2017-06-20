require(['jquery','modules/net/wAjax','modules/ui/showMsg/js/main','common/jquery-plugins/jquery.browser.min','pagescript/wishing-tree/base/js/adjustRem','common/wx.default.config'],function($,ajax,showMsg){

	history.replaceState({},$('title').html(),document.referrer);
	var $inputCounter = $('.input-counter span'),
		$contentWrap = $('.content-wrap'),
		$textarea = $('.wish-textarea'),
		$nextBtn = $('.btn-next');


	$textarea.on('focus',function(){
		if($.browser.android) {
			setTimeout(function(){
				$(window).scrollTop(130);
			},500);
		}
	});

	$('.wish-textarea').on('input',function(){
		var $this = $(this);
		var count = $.trim($this.val()).length; 
		$inputCounter.html(count > 100 ? 100 : count);
		$nextBtn[count>0?'removeClass':'addClass']('disabled');
	});

	$('.btn-wrap').on('click','a',function() {
		var $btn = $(this);
		if($btn.is('.btn-next:not(.disabled)')) {
			postData();
			// $contentWrap.addClass('preview-mode');	
			// $textarea.attr('readonly','');
		} else if ($btn.is('.btn-rewrite')) {
			$contentWrap.removeClass('preview-mode');	
			$textarea.removeAttr('readonly').focus();
		} else if ($btn.is('.btn-next.disabled')) {
			showMsg({msg:"先定个小目标吧!"});	
		} else if ($btn.is('.btn-pub')) {
		}
	});

	function postData() {
		ajax({
			url: '/wmp/user/' + appConfigId + '/dream/postDream',
			type: 'post',
			data: {
				content: $textarea.val()
			},
			success: function(obj) {
				showMsg({
					msg: '完成许愿'
				});
				window.location.href = '/wmp/user/' + appConfigId + '/dream/userDream/' + uid;
			}
		});
	}


});
