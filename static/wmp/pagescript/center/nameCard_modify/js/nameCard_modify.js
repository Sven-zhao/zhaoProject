require(['jquery','modules/net/wAjax','wxapi'],function($,wAjax,wx) {
	// Browser environment sniffing
	var inBrowser =
	  typeof window !== 'undefined' &&
	  Object.prototype.toString.call(window) !== '[object Object]';

	var UA = inBrowser && window.navigator.userAgent.toLowerCase();
	var isIE = UA && /msie|trident/.test(UA);
	var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
	var isEdge = UA && UA.indexOf('edge/') > 0;
	var isAndroid = UA && UA.indexOf('android') > 0;
	var isIOS = UA && /iphone|ipad|ipod|ios/.test(UA);


	wx.config($.extend({
		debug: DEBUG,
		jsApiList: ['chooseImage','uploadImage','getLocalImgData']
	},WXCONFIG));

	wx.ready(function(){
		wx.hideOptionMenu();
	});

	$('#my-card-page').on('click',function(evt){
		var timestamp = Date.parse(new Date());
		window.location.href = "/wmp/user/"+ appConfigId +"/personal/my/home"+'?timestamp='+timestamp;
	});

	$('.face-image').on('click',function(evt){
		evt.stopPropagation();
		var $this = $(this);
		wx.chooseImage({
			count: 1, // 默认9
			sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
			sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
			success: function (res) {
				var localId = res.localIds[0]; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
				uploadPhoto(localId);
			}
		});
		function uploadPhoto(localId) {
			wx.uploadImage({
					localId: localId, // 需要上传的图片的本地ID，由chooseImage接口获得
					isShowProgressTips: 1, // 默认为1，显示进度提示
					success: function (res) {
						var photoServerId = res.serverId; // 返回图片的服务器端ID
						wAjax({
							url: '/wmp/user/'+appConfigId+'/personal/save/avatar',
							data: {
								type: $('[name="type"]'),
								imageType: 'head_url',
								serverId: photoServerId
							},
							success: function(obj) {
                                if(isIOS){
									wx.getLocalImgData({
	                                    localId:localId,
	                                    success:function(source){
	                                        $this.css('background-image','url('+source.localData+')');
	                                    }
	                                });
								}else{
									$this.css('background-image','url('+localId+')');
								}
                            }
						});
					}
			});
		}
	});
});
