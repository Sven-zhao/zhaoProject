require(['jquery','modules/net/wAjax','wxapi','modules/base/js/util','modules/ui/showMsg/js/complete'],function($,wAjax,wx,util,completeMsgBox){
	wx.config($.extend({
		debug: DEBUG,
		jsApiList: []
	},WXCONFIG));	

	wx.ready(function(){
		wx.hideOptionMenu();
	});

	var INTRO_MAX_LENGTH = 500;
	var $orgId = $('[name=orgId]');
	var $intro = $('textarea');
	var $counter = $('.counter');
	var $submitBtn = $('#submit');

	$intro.val($.trim($intro.val()));

	var count = function() {
		$intro.val($intro.val().substring(0,INTRO_MAX_LENGTH));
		var inputCount = $intro.val().length;
		$counter.html(INTRO_MAX_LENGTH - inputCount);
		if(inputCount > 0) {
			$submitBtn.removeAttr('disabled');	
		} else {
			$submitBtn.attr('disabled','');	
		}
		return arguments.callee;
	}();

	$intro.on('input',count);

	$('.container').on('click','#submit:not([disabled])',function(){
		$intro.val($.trim($intro.val()));
		count();
		if($intro.val().length == 0) {
			return false;			
		}
		var postDate = {
			orgId: $orgId.val(),
			intro: util.convertParagrapToPTag($intro.val())
		}
		wAjax({
			url: '/wz/org/' + appConfigId + '/intro/save',
			type: 'post',
			data: postDate,
			success: function(obj){
				completeMsgBox({
					msg: '修改成功！',
					interval: 1500,
					beforeShow: function(){
						$submitBtn.attr('disabled','');						
					},
					callback: function(){
						window.history.back();
					}
				});
			}
		});
	});
	
});
