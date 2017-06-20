require(['jquery','modules/net/wAjax','wxapi','touchJs'],function($,wAjax,wx,touch) {
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
	var croppedImgFullDate = {};
	
	//crop function
	function crop(url,id){
		var cropWrap = $('#crop_wrap'),
			cropContainer = $('#crop_container'),
			showImg = $('#show_img'),
			cropBox = $('.crop-box'),
			pic = $('#pic'),
			preview = $('#photo-preview');
		
		var cropBoxWidth = cropBox.width(),
			cropBoxHeight = cropBoxWidth * 0.75,
			cropContainerWidth = cropContainer.width(),
			cropContainerHeight = cropContainer.height(),
			offsetTopClipBox = (cropContainerHeight-cropBoxHeight)*0.5;
			
		showImg.removeAttr('style');
		pic.removeAttr('style');
		cropBox.css({'height':cropBoxHeight+'px','margin-top':-cropBoxHeight/2+'px'});
		showImg.css({'margin-top':-offsetTopClipBox+'px'});
		var img = new Image();
		img.onload = function(){
			showImg.attr('src',url);
			pic.attr('src',url);
			var picWidth = pic.width(),
				picHeight = pic.height(),
				imgW = img.width,
				imgH = img.height;
			
			//初始化
			//图片以高度为准适应屏幕
			if(imgW/imgH > 4/3){
				picHeight = cropBoxHeight;
				picWidth = cropBoxHeight * (imgW/imgH);
			}

			var top = (cropContainerHeight-picHeight)*0.5;
			var left = (cropContainerWidth-picWidth)*0.5;
			//touch
			var target = $(id)[0];
			var dx = left, dy = top;
			var offx = left,
				offy = top;
			var initialScale = 1;
			var currentScale = 1;
			
			pic.css({'width':picWidth*initialScale+'px','left':left+'px','top':top+'px'});
			showImg.css({'width':picWidth*initialScale+'px','left':left+'px','top':top+'px'});

			//drag
			touch.on(id, 'touchstart', function(ev){
				ev.preventDefault();
			});
			
			touch.on(id, 'drag', function(ev){
				dx = dx || 0;
				dy = dy || 0;

				offx = dx + ev.x;
				offy = dy + ev.y;
				
				//限制在裁剪框内
				if(offx >= 0){
					offx = 0;
					dx = offx;
					if(ev.direction == 'right'){
						ev.x = 0;
					}
				};
				
				if(offx <= picWidth-picWidth*currentScale+left*2){
					offx = picWidth-picWidth*currentScale+left*2;
					dx = offx;
					if(ev.direction == 'left'){
						ev.x = 0;
					}
				};
				
				if(offy > offsetTopClipBox){
					offy = offsetTopClipBox;
					dy = offy;
					if(ev.direction == 'down'){
						ev.y = 0;
					}
				};
				
				if(offy < offsetTopClipBox+cropBoxHeight-picHeight*currentScale){
					offy = offsetTopClipBox+cropBoxHeight-picHeight*currentScale;
					dy = offy;
					if(ev.direction == 'up'){	
						ev.y = 0;
					}
				};
				pic.css({'width':picWidth*currentScale,'top':offy+'px','left':offx+'px'});
				showImg.css({'width':picWidth*currentScale,'top':offy+'px','left':offx+'px'});
			});

			touch.on(id, 'dragend', function(ev){
				dx = offx;
				dy = offy;
			});

			touch.on(id, 'pinch', function(ev){
				currentScale = ev.scale - 1;
				currentScale = initialScale + currentScale;
				currentScale = currentScale < 1 ? 1 : currentScale;

				offx = cropContainerWidth*0.5 - (cropContainerWidth*0.5 - offx)*(currentScale/initialScale);
				offy = cropContainerHeight*0.5 - (cropContainerHeight*0.5 - offy)*(currentScale/initialScale);
				
				if(offx >= 0){
					offx = 0;
				};
				if(offx <= picWidth-picWidth*currentScale+left*2){
					offx = picWidth-picWidth*currentScale+left*2;
				};
				if(offy >= offsetTopClipBox){
					offy = offsetTopClipBox;
				};
				if(offy <= offsetTopClipBox+cropBoxHeight-picHeight*currentScale){
					offy = offsetTopClipBox+cropBoxHeight-picHeight*currentScale;
				};

				pic.css({'width':picWidth*currentScale,'top':offy+'px','left':offx+'px'});
				showImg.css({'width':picWidth*currentScale,'top':offy+'px','left':offx+'px'});
				initialScale = currentScale;
				dx = offx;
				dy = offy;
			});

			touch.on(id, 'pinchend', function(ev){
				//initialScale = currentScale;
			});

			//calc position
			function calcPosition(){
				var ratio = imgW/picWidth;
				var x = -(offx/currentScale)*ratio,
					y = ((offsetTopClipBox-offy)/currentScale)*ratio,
					cropW = (cropBoxWidth/currentScale)*ratio,
					cropH = cropW*0.75;
				return {'x':x,'y':y,'cropW':cropW,'cropH':cropH,'imgW':imgW,'imgH':imgH};
			}
			
			function setPreview(){	
				var obj = calcPosition();
				croppedImgFullDate = obj;
				var sc = preview.width()/obj.cropW;
				preview.css({'background-image':'url('+url+')','background-repeat':'no-repeat','background-position-x':-obj.x * sc+'px','background-position-y':-obj.y * sc+'px','background-size':imgW * sc +'px '+imgH * sc +'px'});
			}
			
			//确定
			$('#sureBtn').click(function(){
				cropWrap.hide();
				setPreview();
				toggleUI(true);
			});

			//取消
			$('#cancelBtn').click(function(){
				cropWrap.hide();
			});
		}
		img.src = url;
	}

	$('#photo-preview, .btn-upload, .btn-change-photo').on('click',function(){
		wx.chooseImage({
			count: 1, // 默认9
			sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
			sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
			success: function (res) {
				localId = res.localIds[0]; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
				//alert(localId);//wxLocalResource://474445012193567
				$('#crop_wrap').show();
				//处理照片
				crop(localId,'#crop_container');
				//提交给微信
				uploadImg(localId);
				
			}
		}); 
	});

	//提交照片裁剪信息
	$('#submit-btn').on('click',function(){
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
