require(['jquery','modules/net/wAjax','modules/ui/showMsg/js/main','wxapi.default.config'],function($,ajax,showMsg) {
	history.replaceState(null,null,document.referrer);
	$('head').append('<style id="respons-style"></style>');
	function updateOptionSize() {
		var optionWidth = ($('.active .options-container').width()-12)/3;
		$('#respons-style').text('.option{width:'+optionWidth+'px !important;height:'+optionWidth+'px !important;}');
		$('.options-container').animate({
			opacity: 1
		},500);
	}

	$(window).on('resize',updateOptionSize);
	updateOptionSize();



	var MIN_OPT_NUM = 3;
	$('.option').on('touchstart',function(){
		var $this = $(this);
		if(!$this.hasClass('checked')){
			if($this.parent().find('.checked').length < MIN_OPT_NUM) {
				$this.addClass('checked');
			} else {
				showMsg({
					type: 'prompt',
					msg: '最多限选' + MIN_OPT_NUM + '项，可先取消已选项，再选其他'
				});
			}
		} else {
			$this.removeClass('checked');
		}

		var $pubBtn = $(this).parents('.question').find('.btn-red');
		if($this.parent().find('.checked').length < MIN_OPT_NUM) {
			$pubBtn.attr('disabled','');
		} else {
			$pubBtn.removeAttr('disabled');
		}
	});

	var curPageNum = 0,
		maxPageNum = $('.options').length - 1;
	$('.question').on('click','.next-btn:not([disabled])',function(){
		curPageNum++;
		var $this = $(this),
			$questionEle = $this.parents('.question'),
			$willShowQuesEle = $questionEle.siblings('.question[data-page-num="'+curPageNum+'"]');
		$questionEle.removeClass('active');
		if(curPageNum == maxPageNum) {
			$willShowQuesEle.find('.btn-red').toggleClass('show');
		}
		$willShowQuesEle.addClass('active');
	});

	$('.question').on('click','.finish-btn:not([disabled])',function(){
		var	referId = $('#refer').val();
		var questionType= $('#questionType').val();
		var dataUrl = (referId != undefined) ? '/wmp/user/'+appConfigId+'/trust/answer/' + referId + '/scene' : '/wmp/user/'+appConfigId+'/trust/answer/basic';
		var dataObjArr = [];
		$('.question').each(function(){
			var $this = $(this)
				$optChecked = $this.find('.option.checked'),
				obj = {};
			obj['qId'] = $this.attr('data-qid');
			obj['category'] = $this.attr('data-cat');
			obj['score'] = $optChecked.map(function(){
				return $(this).attr('data-score');
			}).get().join();	
			obj['aId'] = $optChecked.map(function(){
				return $(this).attr('data-aid');
			}).get().join();	
			obj['type'] = questionType;
			dataObjArr.push(obj);
		});

		console.log(dataObjArr);

		ajax({
			url: dataUrl,
			type: 'post',
			data: {
				data: JSON.stringify(dataObjArr),
			},
			success: function(obj) {
				window.location.href=obj['data'];
			}
		});

	});

});
