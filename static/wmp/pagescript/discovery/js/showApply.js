require(['jquery','common/jquery-plugins/fastclick','wxapi','pagescript/quiz/base/js/wAjax'],function($,fastclick,wx,wAjax){
	// init
    (function(){
        fastclick.attach(document.body);
    })();
	
	var userId = $("input[name='userId']").val();
	
	// 判断手机号
	var mobNum = $('#inpTel');
	/*
	$('#inpTel').on('blur',function() {
		if (!telValidate(mobNum.val()) || $('#inpTel').attr('placeholder')) {
			alert('请输入正确的手机号');
			$('#inpTel').focus()
			return false;
		}
	});	
	*/
	
	// 点击确定
	$('.apply-footer .btn-blue').on('click',function() {
		if (!telValidate(mobNum.val()) || $('#inpTel').attr('placeholder')) {
			alert('请输入正确的手机号');
			$('#inpTel').focus();
			return false;
		}else {
			wAjax({
				url: '/wmp/user/'+appConfigId+'/channel/show/save',
				type: 'post',
				data: {
					uId: userId,
					mobile: mobNum.val()
				},
				success: function(rs) {
					var json_rs = $.parseJSON((rs));
					if( json_rs.code == 0 ) {
						window.location = json_rs.data;
					}
				},
				error: function(rs) {					
				}
			});
		}		
	});
	
	function telValidate(tel) {
		var telReg = new RegExp("^[0-9]+$");
		return telReg.test(tel);
	}	
});
