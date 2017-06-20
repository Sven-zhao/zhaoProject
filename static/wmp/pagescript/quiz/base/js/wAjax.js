/*
 * 前后端数据通讯方法
 */
define(['jquery','modules/ui/showMsg/js/main'],function($,showError){
	var wAjax = function(settings) {
		function callback(obj) {
			if(obj == '') {
				showError({
					msg: '服务器返回数据格式不正确'
				});
				settings.generalError&&settings.generalError(obj);
			}else{
				settings.success && settings.success(obj);		
			}
		}

		$.ajax({
			url: settings.url || window.location.href,
			type: settings.type || "post",
			data: settings.data,
			traditional:settings.traditional || true,
			dataType: "html",
			beforeSend:function(request){request.setRequestHeader("requestType", "ajax");},
			success: callback,
			error: function(xhr, status) {
				var map = {
					"abort": {
						code: -1,
						msg: "网络请求被取消。"
					},
					"parsererror": {
						code: -2,
						msg: "网络返回解析错误。"
					},
					"timeout": {
						code: -3,
						msg: "网络请求超时。"
					},
					"error": {
						code: -4,
						msg: "网络错误。"
					}
				};
				var result = map[status];
				if (!result) {
					result = {
						code: -5,
						msg: "未知的网络错误。"
					};
				}
				showError(result);
				settings.generalError&&settings.generalError(result);
			},
			complete: settings.complete	
		});	
	};
	return wAjax;
});
