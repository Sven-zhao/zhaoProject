require(['jquery', 'common/jquery-plugins/fastclick', 'modules/net/wAjaxV2', 'wxapi', 'html5ImgCompress'], function($, fastclick, wAjax, wx, html5ImgCompress) {
	(function() {
	fastclick.attach(document.body);
	})();
	
	wx.config($.extend({
		debug: DEBUG,
		jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage']
	},WXCONFIG));

	wx.ready(function(){
		//wx.hideOptionMenu();
	});
	
	//  去掉分享功能
	if( $('.list').length || $('.pay').length ) {
		wx.ready(function() {
			wx.hideOptionMenu();
		});
	}
	
	wx.ready(function(){
        //朋友圈
        wx.onMenuShareTimeline({
            title: SHARE_CONFIG.title,
            link: SHARE_CONFIG.link, // 分享链接
            imgUrl: SHARE_CONFIG.imgUrl, // 分享图标
            success: function () {
                setTimeout(hideMask,100);
            },
            cancel: function () {
                setTimeout(hideMask,100);
            }
        });
        //朋友
        wx.onMenuShareAppMessage({
            title: SHARE_CONFIG.title,
            link: SHARE_CONFIG.link, // 分享链接
            imgUrl: SHARE_CONFIG.imgUrl, // 分享图标
            desc: SHARE_CONFIG.desc, // 分享描述
            success: function () {
               setTimeout(hideMask,100);
            },
            cancel: function () {
                setTimeout(hideMask,100);
            }
        });
        wx.showOptionMenu();
    });
	
	// 获取隐藏域变量
    var uid = $('input[name=uid]').val();
    var id = $('input[name=id]').val();
    var step = parseInt( $('input[name=step]').val() );	
	var isFaceSucceed;  
	var isCardSucceed;  
	var faceUrl;
	var cardUrl;
	var maxFileSize = 1024 * 1024 * 2;
	
	// 控制图像比例
	var clientWidth =  $(window).width();
	var clientHeight =  $(window).height();
	var faceHeight = clientWidth*0.46; 
	var cardHeight = clientWidth*0.78*3/5; 
	$('.page2 .eg div,.face div').css('height', faceHeight);
	$('.page4 .eg div,.page5 .card div').css('height', cardHeight);	
	
	// 兼容性
	if( clientWidth === 320 && clientHeight===460 ) {
		$('.btn-face').removeAttr('multiple').attr('capture', 'camera');
		$('.btn-card').removeAttr('multiple').attr('capture', 'camera');
	}
	
	//step = 1;
	
	// 初始化第几页
	if( step === 1 ) {
		$('.pages').children().removeClass('active');
		$('.pages').children().eq( 0 ).addClass('active');
		$('.btn-box li').removeClass('active');	
		$('.btn-box li').eq( 0 ).addClass('active');
	}else if( step === 2 ) {
		$('.pages').children().removeClass('active');
		$('.pages').children().eq( 3 ).addClass('active');
		$('.btn-box li').removeClass('active');	
		$('.btn-box li').eq( 3 ).addClass('active');
	}else if( step === 3 ) {
		$('.pages').children().removeClass('active');
		$('.pages').children().eq( 5 ).addClass('active');
		$('.btn-box li').removeClass('active');	
		$('.btn-box li').eq( 5 ).addClass('active');
	}else if( step === 4 ) {
		// 提交成功后进入结果页
		$('.banner,.pages,.btn-box').hide();
		$('.mask-box').show();
	}

	// page1
	if( $('.page1.active').length ) {
		$('body').on('click',function() {		
			$('.btn-box li').removeClass('active');	
			$('.btn-box li').eq(1).addClass('active');
			$('.pages').children().removeClass('active');
			$('.pages').children().eq(1).addClass('active');
		});
	}	
	
	// page2--拍摄人脸照片	
	// 拍摄名片照片--相关对象	
	var faceUpload = $('#faceUpload'); //获取显示图片的div元素
	var cardUpload = $('#cardUpload'); //获取显示图片的div元素
	var btnFace = $('.btn-face'); //获取选择图片的input元素
	var btnCard = $('.btn-card'); //获取选择图片的input元
		
	var j = 1;
	$(function () {
		// 单张
		$('.btn-face').on('change', function (e) {
			//console.log(e.target);
			new html5ImgCompress(e.target.files[0], {
				before: function(file) {
					$('.mask,.loading-box').show();
					//console.log('单张: 压缩前...');
				},
				done: function (file, base64) {
					//insertImg(file, j);
					console.log('单张: 压缩成功...');
					//insertImg(file, j); // 显示原图
					// base64 为图片编码
					// 求请ajax
					var newStr = base64;
					var newStrNew = newStr.substring(23, newStr.length);
					//console.log(newStrNew);					
					var img = new Image();
					var src, size, base;
					size = file.length;
					src = file;
					base = 1333;	
					var imgHTML = '<img src="' + base64 + '" alt="" id="js_img"/>';					
					$('.page3 .face div').html(imgHTML);				
					var screenImage = $('#js_img');
					$("<img/>").attr("src", $(screenImage).attr("src")).load(function() { 
						var imageWidth = parseInt(this.width);
						var imageHeight = parseInt(this.height); 						
						if(imageWidth>imageHeight) {
							$('#js_img').css({
								'width': '100%',
								'height': 'auto'
							});
						}else {
							$('#js_img').css({
								'width': 'auto',
								'height': '100%'
							});							
						}						
					});	
					wAjax({
						url: '/wmp/tool/file/createPic',
						type: 'post',
						data: {
							'imgStr': newStrNew
						},
						success: function(rs) {
							//console.log(rs);
							var json_rs = $.parseJSON((rs));
							if (json_rs.code === 0 && json_rs.data !== '') {
								// 上传图片成功，进入下一页
								$('.btn-box li').removeClass('active');
								$('.btn-box li').eq(2).addClass('active');
								$('.pages').children().removeClass('active');
								$('.pages').children().eq(2).addClass('active');
								isFaceSucceed = 1;
								faceUrl = json_rs.data;
								return isFaceSucceed;
								return faceUrl;
							} else {
								// 上传失败						
								alert('上传失败，请重新拍照');
							}
						},
						complete: function() {
							$('.mask,.loading-box').hide();
						}
					});
					img.onload = function() {						
					};						
				},
				fail: function(file) {
					alert('上传失败，请重新拍摄...');
					//console.log('单张: 压缩失败...');
				},
				complete: function(file) {
					//console.log('单张: 压缩完成...');
					//$('.mask,.loading-box').hide();
				},
				notSupport: function(file) {
					alert('浏览器不支持！');
				}
			});
		});
		$('.btn-card').on('change', function (e) {
			new html5ImgCompress(e.target.files[0], {
				before: function(file) {
					$('.mask,.loading-box').show();
					//console.log('单张: 压缩前...');
				},
				done: function (file, base64) {
					//insertImg(file, j);
					console.log('单张: 压缩成功...');
					//insertImg(file, j); // 显示原图
					// base64 为图片编码
					// 求请ajax
					var newStr = base64;
					var newStrNew = newStr.substring(23, newStr.length);
					//console.log(newStrNew);					
					var img = new Image();
					var src, size, base;
					size = file.length;
					src = file;
					base = 1333;	
					var imgHTML = '<img src="' + base64 + '" alt="" id="js_img"/>';					
					$('.page5 .card div').html(imgHTML);
					var screenImage = $('#js_img');
					$("<img/>").attr("src", $(screenImage).attr("src")).load(function() { 
						var imageWidth = parseInt(this.width);
						var imageHeight = parseInt(this.height); 						
						if(imageWidth>imageHeight) {
							$('#js_img').css({
								'width': '100%',
								'height': 'auto'
							});
						}else {
							$('#js_img').css({
								'width': 'auto',
								'height': '100%'
							});							
						}						
					});
					wAjax({
						url: '/wmp/tool/file/createPic',
						type: 'post',
						data: {
							'imgStr': newStrNew
						},
						success: function(rs) {
							var json_rs = $.parseJSON((rs));
							if (json_rs.code === 0 && json_rs.data !== '') {
								// 上传图片成功，进入下一页
								$('.card img').css({
									//'top': '50%',
									//'marginTop': marginTop
								});
								$('.btn-box li').removeClass('active');
								$('.btn-box li').eq(4).addClass('active');
								$('.pages').children().removeClass('active');
								$('.pages').children().eq(4).addClass('active');
								isCardSucceed = 1;
								cardUrl = json_rs.data;
								return isCardSucceed;
								return cardUrl;
							} else {
								// 上传失败						
								alert('上传失败，请重新拍照');
							}
						},
						complete: function() {
							$('.mask,.loading-box').hide();
						}
					});
					img.onload = function() {						
					};						
				},
				fail: function(file) {
					alert('上传失败，请重新拍摄...');
					//console.log('单张: 压缩失败...');
				},
				complete: function(file) {
					//console.log('单张: 压缩完成...');
					//$('.mask,.loading-box').hide();
				},
				notSupport: function(file) {
					alert('浏览器不支持！');
				}
			});
		});
	});
	
	// 拍摄人脸照片成功后，点击底部按钮
	$('.btn-box li').eq(2).on('click',function() {	
		if( isFaceSucceed === 1) {
			wAjax({				
				url: '/wmp/user/' + appConfigId + '/meeting/auditInfo/updateAvatarUrl',
				type: 'post',
				data: {
					'uid': uid,
					'avatarUrl': faceUrl,
				},
				success: function(rs) {
					var json_rs = $.parseJSON((rs));
					if( json_rs.code === 1 ) {
						// 上传图片成功，进入下一页
						$('.btn-box li').removeClass('active');	
						$('.btn-box li').eq(3).addClass('active');
						$('.pages').children().removeClass('active');
						$('.pages').children().eq(3).addClass('active');
						id = json_rs.data;
						return id;
					}else {
						// 上传失败						
						alert('上传失败，请重新拍照');
					}
				},
				complete: function() {
					//$('.apply ul').find('.loading').remove();
				}
			});			
		}else {
			alert('上传失败，请重新拍照');
		}		
	});
	
	// 拍摄名片照片成功后，点击底部按钮
	$('.btn-box li').eq(4).on('click',function() {
		if( isCardSucceed === 1) {
			wAjax({			
				url: '/wmp/user/' + appConfigId + '/meeting/auditInfo/updateCardUrl',
				type: 'post',
				data: {
					'id': id,
					'cardUrl': cardUrl
				},
				success: function(rs) {
					var json_rs = $.parseJSON((rs));
					if( json_rs.code === 1 ) {
						// 上传图片成功，进入下一页
						$('.btn-box li').removeClass('active');	
						$('.btn-box li').eq(5).addClass('active');
						$('.pages').children().removeClass('active');
						$('.pages').children().eq(5).addClass('active');
						id = json_rs.data;
						return id;
					}else {
						// 上传失败						
						alert('上传失败，请重新拍照');
					}
				},
				complete: function() {
					//$('.apply ul').find('.loading').remove();
				}
			});	
		}else {
			alert('上传失败，请重新拍照');
		}
	});
	
	// 个人简介表单相关
	// 初始化必填input 		
	$('.id-info .need-inp').each(function() {
		if($(this).val() != '' && jQuery.trim($(this).val()) != $(this).attr('placeholder')) {
			$(this).attr('data', 'yes');
			$(this).attr('data-value', $(this).val());
		}
	});	
	
	$('.id-info').on('input', '.need-inp', function() {
		if($(this).val() != '' && jQuery.trim($(this).val()) != $(this).attr('placeholder') && !isNull($(this).val())) {
			$(this).attr('data', 'yes');
			$(this).attr('data-value', jQuery.trim($(this).val()));
			$('.id-info li.inp-tips').hide();
		} else {
			if( $(this).hasClass('noInput') ) {
				$(this).removeAttr('data','yes');
				$(this).removeAttr('data-value');
			}else {
				$(this).attr('data', 'no');
			}
		}
		// 判断身份证或是护照是否正确
		if( $('.id-num input').hasClass('inp-id') ) {
			isCardNo( $('.id-num input').attr('data-value') );				
		}else if( $('.id-num input').hasClass('inp-hz') ) {
			isCardCNNo( $('.id-num input').attr('data-value') );	
		}
		
		if( $('.id-num input').val() === '' ) {
			$('.id-num input').removeAttr('data');
			$('.id-info li.inp-tips').hide();
		}
	});
	
	// 点击提交表单
	$('.btn-box li').eq(5).on('click',function() {
		if($('.id-info').find('[data="no"]').length === 0) {
			// 可以入进入点击提交数据
			// 准备提交的数据
			var userName = $("input[name='userName']").attr('data-value');
			var company = $("input[name='company']").attr('data-value');
			var position = $("input[name='position']").attr('data-value');
			var mobile = $("input[name='mobile']").val();
			var identificationCard = $("input[name='identificationCard']").attr('data-value');
			wAjax({
				url: '/wmp/user/' + appConfigId + '/meeting/auditInfo/updateUserInfo',
				type: 'post',
				data: {
					'userName': userName,
					'company': company,
					'position': position,
					'identificationCard': identificationCard,
					'mobile': mobile,
					'id': id
				},
				success: function(rs) {
					
				},
				complete: function() {
					// 提交成功后进入结果页
					$('.banner,.pages,.btn-box').hide();
					$('.mask-box').show();
				}
			});
		}else {
			if( $("input[name='userName']").attr('data') === 'no') {
				$('.id-info li').eq(1).show();
				$("input[name='userName']").focus();
				return false;
			}
			if( $("input[name='company']").attr('data') === 'no') {
				$('.id-info li').eq(3).show();
				$("input[name='company']").focus();
				return false;
			}
			if( $("input[name='position']").attr('data') === 'no') {
				$('.id-info li').eq(5).show();
				$("input[name='position']").focus();
				return false;
			}
			if( $("input[name='identificationCard']").attr('data') === 'no') {
				$('.id-info li').eq(7).show();
				$("input[name='identificationCard']").focus();
				return false;
			}
		}
	});
		
	var clickFlag = 0;
	$('.id-num span').on('click', function() {				
		if( clickFlag === 0 ) {
			$(this).addClass('active');
			$('.sel-box').show();
			$('.btn-box').hide();
			clickFlag = 1;
		}else {
			$(this).removeClass('active');
			$('.sel-box').hide();
			$('.btn-box').show();
			clickFlag = 0;
		}
		
	});
	
	// 身份证和护照菜单选择
	$('.sel-box a').on('click', function() {
		var nowIndex = $('.sel-box a').index(this);
		var nowText = $('.sel-box a').eq( nowIndex ).text();
		$('.btn-box').show();
		$('.sel-box a').removeClass('active');
		$('.sel-box a').eq( nowIndex ).addClass('active');
		$('.id-num span').html( nowText + '<i></i>:' );
		$('.id-num input').val('');
		$('.id-info li.inp-tips').hide();
		if( nowIndex === 0 ) {
			$('.id-num').removeClass('hz');
			$('.id-num input').removeClass('inp-hz').addClass('inp-id');
			$('.id-num span').removeClass('active')
			$('.sel-box').hide();
		}else {			
			$('.id-num').addClass('hz');
			$('.id-num input').removeClass('inp-id').addClass('inp-hz');
			$('.id-num span').removeClass('active')
			$('.sel-box').hide();
		}
	});	

	function isNull(str) {
		if(str === "") return true;
		var regu = "^[ ]+$";
		var re = new RegExp(regu);
		return re.test(str);
	}
	
	function isCardNo(card) {  
		// 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X  
		var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;  
		if(reg.test(card) === false) {  
			$('.id-num input').attr('data', 'no')
			$('.id-info li').eq(7).show();
			return  false;  
		}  
	} 
});