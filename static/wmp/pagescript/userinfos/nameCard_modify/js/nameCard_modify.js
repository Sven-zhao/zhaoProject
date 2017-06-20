require(['jquery','modules/net/wAjax','wxapi'],function($,wAjax,wx) {
	wx.config($.extend({
		debug: DEBUG,
		jsApiList: ['chooseImage','uploadImage']
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
								$this.css('background-image','url('+localId+')');
							}
						});
					}
			});
		}
	});
});
