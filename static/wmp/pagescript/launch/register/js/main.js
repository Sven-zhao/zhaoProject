require(['jquery','wxapi','modules/net/wAjax','modules/ui/wx-plugin/autoMoveUp'],function($,wx,wAjax){
	wx.config($.extend({
		debug: DEBUG,
		jsApiList: []
	},WXCONFIG));	
	wx.ready(function(){
		wx.hideOptionMenu();
	});

	//select
	$('body').on('change','select',function(){
		if($(this).val() == 0){
			$(this).css('color','#A7ADAA');
		}else{
			$(this).css('color','#252D29');
		}
		updateBtn();
	});
	$('.click-here').on('touchend',function(){
		$('.other-info').show();
	});

	$('.establish-year').on('input',function(){
		$(this).val($(this).val().replace(/[^0-9]/,''));
		updateBtn();
	});

	//check phone
	$('.country-code').on('change',function(){
		if($(this).val() == '0086' || $(this).val() == '86' || $(this).val() == '+86'){
			$('input[name="mobile"]').attr('maxlength',11).val($('input[name="mobile"]').val().substr(0,11));
		}else{
			$('input[name="mobile"]').attr('maxlength',20);
		}
	});
	$('input[name="mobile"]').on('input',function(){
		$('.msg').hide();
		$(this).val($(this).val().replace(/[^0-9]/,''));
		if($('.country-code').val() == '86' || $('.country-code').val() == '0086' || $('.country-code').val() == '+86'){
			$(this).attr('maxlength',11);
			if($(this).val().length > 11){
				$(this).val($(this).val().substr(0,11));
			}
		}else{
			$(this).attr('maxlength',20);
			if($(this).val().length > 20){
				$(this).val($(this).val().substr(0,20));
			}
		}
	});
	function checkTel(v){
		if($('.country-code').val() == '86' || $('.country-code').val() == '0086' || $('.country-code').val() == '+86'){
			if(/^1[0-9]{10}$/.test(v)){
				$('.msg').hide();
				return true;
			}else{
				$('.msg').text('请输入正确的手机号').show();
				return false;
			}
		}else{
			if(/^[0-9]{1,}$/.test(v)){
				$('.msg').hide();
				return true;
			}else{
				$('.msg').text('请输入正确的手机号').show();
				return false;
			}
		}
	}

	//check date
	function checkDate(v){
		if(v < 1901 || v > new Date().getFullYear()){
			$('.msg').text('请输入正确的年份').show();
			return false;
		}else{
			$('.msg').hide();
			return true;
		}
	}
	$('.establish-year').on('input',function(){
		$('.msg').hide();
		if($(this).val().length > 4){
			$(this).val($(this).val().substr(0,4));
		}
	});

	//inviter
	$('input[name="inviter"]').on('input',function(){
		if($(this).val().length > 20){
			$(this).val($(this).val().substr(0,20));
		}
	});


	//nessary
	function updateBtn(){
		if($('select.type').val() == '' || $('select.stage').val() == '' || $('select.sales').val() == '' || $.trim($('.establish-year').val()) == ''){
			$('.btn-complete').prop('disabled',true);
		}else{
			$('.btn-complete').prop('disabled',false);
		}
	}

	//init
	updateBtn();

	//submit
	$('body').on('touchend','.btn-complete:not([disabled])',function(){
		if(!checkDate($('.establish-year').val())){
			return false;
		}
		if($('input[name="mobile"]').val() != ''){
			if(!checkTel($('input[name="mobile"]').val())){
				return false;
			}
		}
		$('.establish-year').val($.trim($('.establish-year').val()));
		$('input[name="inviter"]').val($.trim($('input[name="inviter"]').val()));
		$('input[name="uname"]').val($.trim($('input[name="uname"]').val()));
		$('input[name="mobile"]').val($.trim($('input[name="mobile"]').val()));
		wAjax({
			'url':$('form').attr('action'),
			'data':$('form').serialize(),
			'success':function(rs){
				window.location.href = rs.data + '?t='+new Date().getTime();
			}
		});
	});
});
