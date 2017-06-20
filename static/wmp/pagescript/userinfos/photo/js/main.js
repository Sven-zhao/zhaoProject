require(['jquery','modules/net/wAjax','wxapi','crop'],function($,wAjax,wx) {

	//wechat config
	wx.ready(function(){
		wx.hideOptionMenu();
	});
	wx.config($.extend({
		debug: DEBUG,
		jsApiList: ['chooseImage','uploadImage']
	},WXCONFIG));	

	//bind UI event
	function toggleUI(editMode){
		toggleCreateUI(!editMode);
		toggleEditUI(editMode);
	}	
	function toggleEditUI(show){
		$('.btn-change-photo,#submit-btn').css('display',[show?'block':'none']);
	}
	function toggleCreateUI(show) {
		$('.btn-upload').css('display',[show?'block':'none']);
	}	
	var editMode = ($('[name="type"]').val() == "edit");
	toggleUI(editMode);
	$('h1').on('click',function(){
		window.location.reload();
	});

	//image crop class
	function ImageCrop($bgContainer,$img) {
		this.$bgContainer = $bgContainer;
		this.$img = $img;		
	}
	ImageCrop.prototype = {
		constructor: ImageCrop,
		imgURL:'',
		init: function() {
			var self = this;
			this.$bgContainer.show();
			this.$img.cropper({
			  	aspectRatio: 4 / 3,
			  	autoCropArea: 0.999999, 
			  	minContainerHeight: 300,
				viewMode: 1,
				dragMode: 'move',
				guides: false,
				center: false,
				scalable: false,
				rotatable: false,
				cropBoxMovable: false,
				cropBoxResizable: false,
				toggleDragModeOnDblclick: false,
				checkCrossOrigin: false,
			
				built: function() {
					var MINWIDTH = self.$bgContainer.width();
					var MINHEIGHT = self.$bgContainer.width()*3/4;
					var needFixedScroll = false;
					if($(this).cropper('getCanvasData')['width']<MINWIDTH || $(this).cropper('getCanvasData')['height']<MINHEIGHT) {
						if($(this).cropper('getCanvasData')['width']/MINWIDTH >$(this).cropper('getCanvasData')['height']/MINHEIGHT) {
							$(this).cropper('setCanvasData',{height:MINHEIGHT});
						}
						else {
							$(this).cropper('setCanvasData',{width:MINWIDTH});
						}
						needFixedScroll = true;
					}
					$(this).cropper('setCanvasData',{left:1,top:1});
				  	$(this).cropper('setCropBoxData',{left:1,top:1,width:$(this).cropper('getContainerData')['width']-2});
				  	
					var croppedBoxTop = $(this).cropper('getCropBoxData')['top'];
				  	if(needFixedScroll) {
					  	$(window).scrollTop(croppedBoxTop-100);
				  	}
				  	else {
					  	$(window).scrollTop(croppedBoxTop);
						$(this).cropper('setCropBoxData',{top:croppedBoxTop+100});
					}
				 }
			});
		},
		destroy: function() {			
			this.$img.cropper('destroy');
			this.$img.attr('src','');
			this.imgURL = '';
			this.$bgContainer.hide();
		},
		getFullDate: function() {
			var imgDate = this.$img.cropper('getImageData',true); 
			var croppedImgDate = this.$img.cropper('getData',true); 
			var cropFullDate = {
				x: croppedImgDate['x'],
				y: croppedImgDate['y'],
				width: croppedImgDate['width'],
				height: croppedImgDate['height'],
				naturalWidth: imgDate['naturalWidth'],
				naturalHeight: imgDate['naturalHeight']
			}
			return cropFullDate;
		},
		setImgUrl: function(imgURL) {
			this.imgURL = imgURL;
			this.$img.attr('src',imgURL);
		},
		getImgUrl: function() {
			return this.imgURL;
		}
	}

	//jquery object
	var $preview = $('#photo-preview');			
	var $submitBtn = $('#submit-btn');
	var $imgContainer = $('#img-crop-container');
	var $img = $('#img-crop-container #image');
	var $fixedBtn = $("#img-crop-container .fixed-btn");
	var imageCrop = new ImageCrop($imgContainer,$img);


	+(function(){
		if($preview.data('imgUrl')) {
			var timestamp = Date.parse(new Date());
			$preview.css('background-image','url('+$preview.data('imgUrl')+'?timestamp='+timestamp+')');
		}
	})();

	//global variables
	var localId = '';
	var photoServerId = '';
	var croppedImgFullDate = {};
	var newPhotoURL = '';
	
	//bind image crop event
	$('#btn-crop-confirm').on('click',function() {
		$fixedBtn.off('touchmove');
		if(imageCrop.getImgUrl() != '') {
			newPhotoURL = imageCrop.getImgUrl();
			croppedImgFullDate = imageCrop.getFullDate();
			var CONTAINTERWIDTH = $('#photo-preview').width();
			var CONTAINTERHEIGHT = $('#photo-preview').height();
			var newWidth = croppedImgFullDate.naturalWidth*CONTAINTERWIDTH/croppedImgFullDate.width;
			var newX = croppedImgFullDate.x*CONTAINTERWIDTH/croppedImgFullDate.width;
			var newY = croppedImgFullDate.y*CONTAINTERHEIGHT/croppedImgFullDate.height;
			var timestamp = Date.parse(new Date());
			$preview.css('background-image','url('+imageCrop.getImgUrl()+'?timestamp='+timestamp+')');
			$preview.css('background-size',newWidth);
			$preview.css('background-position-x',-newX);
			$preview.css('background-position-y',-newY);
			toggleUI(true);
		}
		imageCrop.destroy();
	});
	$('#btn-crop-cancel').on('click',function() {
		$fixedBtn.off('touchmove');
		imageCrop.destroy();
	});

	$('#photo-preview, .btn-upload, .btn-change-photo').on('click',function(){
		wx.chooseImage({
			count: 1, // 默认9
			sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
			sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
			success: function (res) {
				localId = res.localIds[0]; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
				$imgContainer.show(); 
				$('#loading').removeClass('show').addClass('show');

				wx.uploadImage({
					localId: localId, // 需要上传的图片的本地ID，由chooseImage接口获得
					isShowProgressTips: 0, // 默认为1，显示进度提示
					success: function (res) {
						photoServerId = res.serverId; // 返回图片的服务器端ID
						wAjax({
							url: '/wmp/user/'+appConfigId+'/personal/save/image',
							data: {
								serverId: photoServerId
							},
							success: function(obj) {
								if(obj['data'] != '') {									
									$('#loading').removeClass('show');
									imageCrop.setImgUrl(obj['data']);
									imageCrop.init();
									$fixedBtn.on('touchmove',function(e){e.preventDefault();})
								}
								else {
									$('#loading').removeClass('show');
									$imgContainer.hide();
								}
							},
							generalError: function(obj) {
								$('#loading').removeClass('show');
								$imgContainer.hide();
							},
							error: function(obj) {
								$('#loading').removeClass('show');
								$imgContainer.hide();
							}
						});	
					},
					fail: function (res) {
						$('#loading').removeClass('show');
						$imgContainer.hide();
					}
				});
			}
		}); 
	});

	$submitBtn.on('click',function(){
		if(newPhotoURL != '') {
			wAjax({
				url: '/wmp/user/'+appConfigId+'/personal/abscut/image',
				data: {
					type: $('[name="type"]').val(),
					imageUrl: newPhotoURL,
					imgInfo: JSON.stringify(croppedImgFullDate)
				},
				success: function(obj) {
					var newUrl = obj['data'];
                    var sep = '?';
                    if (newUrl.indexOf('?') > -1) {
                        sep = '&';
                    }
                    var timestamp = Date.parse(new Date());
                    newUrl = newUrl + sep + 'timestamp=' + timestamp;
                    window.location.href = newUrl;
				}
			});
		}
		else {
			window.history.back();
		}
	});

});
