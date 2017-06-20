define(['jquery','modules/net/wAjax'],function($,ajax){
	var logouter = {};
	function doLogout() {
		ajax({
			url: '/pcinnovation/logout?r='+Math.random(),
			type: 'get',
			success: function(obj) {
				window.location.href=obj['data']['url'];
			}
		});
	}
	logouter.init = function(setting) {
		var setting = setting ? setting : {};
		$('.logout-btn').on('click',function(){
			if(setting['needConfirm'] == true) {
				if(confirm(setting['msg'])){
					setting['onConfirm'] && setting['onConfirm']();
					doLogout();
				} else {
					setting['onCancel'] && setting['onCancel']();
				}
			} else {
				doLogout();
			}
		});
	}
	return logouter;
});
