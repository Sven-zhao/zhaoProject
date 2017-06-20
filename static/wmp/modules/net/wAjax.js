define(['jquery','modules/ui/showMsg/js/main'],function($,showError){
	/**
	 * communicate with backend through jquery ajax. 
	 * @requires jquery 
	 * @requires modules/ui/showMsg/js/main 
	 * @exports modules/net/wAjax 
	 * @param {String} settings.url - 数据接口的 url.
	 * @param {String} settings.type="post" - 数据接口的 http 方法（get，post）.
	 * @param {callback} settings.error - 未获取期待数据时调用的回调函数.
	 * @param {callback} settings.success - 成功获取期待数据时调用的回调函数.
	 * @param {callback} settings.complete - 后端接口调用返回数据后调用无论是否成功获取期待数据.
	 */
	var wAjax = function(settings) {
		function callback(obj) {
			var code = obj['code'];
			if( code == undefined) {
				showError({
					msg: '服务器返回数据格式不正确'
				});
				settings.generalError&&settings.generalError(obj);
			} else if(code == 0) {
				settings.success && settings.success(obj);		
			} else {
				if( settings.error == undefined ) {
					showError(obj);
					settings.generalError&&settings.generalError(obj);
				} else {

					/**
					 * @callback callback
					 * @param {Number} obj.code - 状态码 
					 * @param {String} obj.msg - 状态描述 
					 * @param {*} obj.data - 后端返回给前端需要的数据 
					 */
					settings.error(obj);
				}
			}
		}

		$.ajax({
			url: settings.url || window.location.href,
			type: settings.type || "post",
			data: settings.data,
			traditional:settings.traditional || true,
			dataType: "json",
			beforeSend:function(request){request.setRequestHeader("requestType", "ajax");},
			success: callback,
			error: function(xhr, status) {
				var map = {
					"abort": {
						code: -1,
						msg: "网络请求被取消"
					},
					"parsererror": {
						code: -2,
						msg: "网络返回解析错误"
					},
					"timeout": {
						code: -3,
						msg: "网络请求超时"
					},
					"error": {
						code: -4,
						msg: "网络错误"
					}
				};
				var result = map[status];
				if (!result) {
					result = {
						code: -5,
						msg: "未知的网络错误"
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
