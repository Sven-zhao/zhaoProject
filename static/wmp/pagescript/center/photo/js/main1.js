require(['jquery','modules/net/wAjax','wxapi','touchJs','cropImg'],function($,wAjax,wx,touch,crop) {
	var editMode = ($('[name="type"]').val() == "edit");
	toggleUI(editMode);
	$('h1').on('click',function(){
		window.location.reload();
	});
	wx.ready(function(){
		wx.hideOptionMenu();
	});

	function toggleUI(editMode){
		toggleCreateUI(!editMode);
		toggleEditUI(editMode);
	}
	
	function toggleEditUI(show){
		$('.btn-change-photo,.upload-tip,#submit-btn')[show?'show':'hide']();
		$('.contact')[show?'hide':'show']();
	}
	function toggleCreateUI(show) {
		$('.btn-upload').css('display',[show?'block':'none']);
	}

	wx.config($.extend({
		debug: DEBUG,
		jsApiList: ['chooseImage','uploadImage']
	},WXCONFIG));	


	var localId = '';
	var photoServerId = '';
	
	$('#photo-preview, .btn-upload, .btn-change-photo').on('click',function(){
		wx.chooseImage({
			count: 1, // 默认9
			sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
			sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
			success: function (res) {
				localId = res.localIds[0]; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
				//提交给微信
				uploadImg(localId);
				//处理照片
				$('#crop_wrap').show();
				crop({
					'url':localId,
					'preview':$('#photo-preview'),
					'container':$('#crop_wrap'),
					'callback':function(croppedImgFullDate){
						toggleUI(true);
						//提交照片裁剪信息
						document.querySelector('#submit-btn').onclick = function(){
							alert('pic_x0:'+ croppedImgFullDate.x + ';  pic_y0:'+croppedImgFullDate.y + ';  cropW:'+croppedImgFullDate.cropW + ';  cropH:'+croppedImgFullDate.cropH + '; imgW:'+croppedImgFullDate.imgW + '; imgH:'+croppedImgFullDate.imgH);
							if(photoServerId != '') {
								wAjax({
									url: '/wmp/user/'+appConfigId+'/abscut/image',
									data: {
										type: $('[name="type"]').val(),
										imageUrl: photoServerId,
										imgInfo: JSON.stringify(croppedImgFullDate)
									},
									success: function(obj) {
										var timestamp = Date.parse(new Date());
										window.location.href = obj['data'] + "?timestamp=" + timestamp;
									}
								});
							}
						}
					}
				});
			}
		}); 
	});

	function uploadImg(localId){
		wx.uploadImage({
			localId: localId, // 需要上传的图片的本地ID，由chooseImage接口获得
			isShowProgressTips: 0, // 默认为1，显示进度提示
			success: function (res) {
				photoServerId = res.serverId; // 返回图片的服务器端ID	
			},
			fail: function (res) {
				$('#crop_wrap').hide();
			}
		});	
	}
});
