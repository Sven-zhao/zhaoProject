require(['jquery','common/jquery-plugins/fastclick','wxapi','pagescript/quiz/base/js/wAjax','common/zh-sdk/zh-sdk.min'],function($,fastclick,wx,wAjax,zh){
	// init
    (function(){
        fastclick.attach(document.body);
    })();
	wx.config($.extend({
		debug: DEBUG,
		jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage']
	},WXCONFIG));
	
	wx.ready(function(){
		wx.showOptionMenu();
		//朋友圈
		wx.onMenuShareTimeline({
			title: SHARE_CONFIG.title,
			link: SHARE_CONFIG.link, // 分享链接
			imgUrl: SHARE_CONFIG.imgUrl, // 分享图标
			success: function () { 
				setTimeout(function(){
				 	$mask.hide();
				 },100);
			},
			cancel: function () { 
				$mask.hide();
			}
		});
		//朋友
		wx.onMenuShareAppMessage({
			title: SHARE_CONFIG.title,
			link: SHARE_CONFIG.link, // 分享链接
			imgUrl: SHARE_CONFIG.imgUrl, // 分享图标
			desc: SHARE_CONFIG.desc, // 分享描述
			success: function () {
				setTimeout(function(){
				 	$mask.hide();
				 },100);
			},
			cancel: function () {
				$mask.hide();
			}
		});
		wx.showOptionMenu();
	});
	
	var title = SHARE_CONFIG.title,
		desc = SHARE_CONFIG.desc,
		imgUrl = SHARE_CONFIG.imgUrl,
		link = SHARE_CONFIG.link; 
	
	zh.ready(function () {
		zh.onMenuShareWxTimeLine ({
			title: title,
			desc: desc,
			imgUrl: imgUrl,
			link: link,
		})
		zh.onMenuShareWxMessage ({
			title: title,
			desc: desc,
			imgUrl: imgUrl,
			link: link,
		})
		zh.showGraphicalButton('navShare', function (){
			zh.showShareMenu();
		});
	})
		
	// 大咖秀轮播
	var clientWidth =  $(window).width();
	var clientHeight =  $(window).height();
	var imgNum = $('.show-box .swiper-slide').length - 1;
	$('.show-box').css({
		'width': clientWidth,
		'height': clientHeight
	});
	
	if( $('.show-box .swiper-slide').length > 1 ) {
		var swiper = new Swiper('.show-box', {	
			mode: 'horizontal',
			//pagination : '.swiper-pagination',
			//paginationType : 'custom',
			//paginationCustomRender: function (swiper, current, total) {
			 // return current + ' / <span>' + total + '</span>';
			//},
			slideToClickedSlide: true,
			onSlideChangeStart: function(swiper) {
				if( swiper.activeIndex > 0 ) {
					$('.show-footer').addClass('active');	
					$('.show-info').hide();
				}else{
					$('.show-footer').removeClass('active');
					$('.show-info').show();
				}
				if( swiper.activeIndex === (swiper.slides.length-1) ) {
					$('.show-footer').removeClass('active');
					$('.show-info').hide();
				}
			}
		});			
	} 
	
	// 微信最后一页下载
	$('.last-slide a.btn-blue').on('click', function() {		
		window.location = 'http://m.zhisland.com?uri=zhisland://com.zhisland/home/';
	});
	
	var userid = $("input[name='userid']").val(),
		isFollow = parseInt($("input[name='isFollow']").val()),
		isOtherWebView = parseInt($("input[name='isOtherWebView']").val()),
		sms = $("input[name='sms']").val(),
		isNeedFollow = $("input[name='isNeedFollow']").val();
	
	// 点赞	
	if( isOtherWebView == 1 && sms == 'sms' ) {
		$('.swiper-slide .ico-like').hide();
	}
	if( isOtherWebView == 0 || sms == 'sms') {
		$('.swiper-slide .ico-like').hide();
	}
	if( $('.swiper-slide').length ) {
		if( $('.swiper-slide .ico-like').length ) {
			$('.swiper-slide .ico-like').on('click',function() {
				if ($(this).hasClass('ico-like-active') ) {
					//alert('已经点过了');
				}else {
					var imgId = parseInt($(this).parent().children("input[name='imageId']").val())
					$(this).addClass('ico-like-active');	
					wAjax({
						url: '/wmp/user/'+appConfigId+'/channel/zambia/doLike',
						type: 'post',
						data: {
							oUid: userid,
							imgId: imgId
							
						},
						success: function(rs) {
							
						},
						error: function(rs) {					
						}
					});	
				}		
			});
			
		}
	}
	
	// 关注	
	var loginUrl = $("input[name='loginUrl']").val(),
		loginStatus = $("input[name='loginStatus']").val(),
		followNum = parseInt($("input[name='followNum']").val()),
		displayStatus = $("input[name='displayStatus']").val(); 		
	// 判断是否大于5位
	if( followNum <= 99999 ) {
		$('.show-footer strong i').text( followNum );
	}else {
		$('.show-footer strong i').text( '10W+' );
	}
	if( isNeedFollow == 0 ) {
		if(displayStatus == 1){
			$('.show-footer em').text('关注');
			$('.show-footer em').addClass('ico-add');
		}else{
			$('.show-footer em').text('');
			$('.show-footer em').hide();
		}
	}else {
		if( isFollow == -1 || isFollow == 21 ) {
			$('.show-footer em').text('关注');
			$('.show-footer em').addClass('ico-add');		
		}else if( isFollow == 12 ) {
			$('.show-footer em').text('已关注');
		}else if( isFollow == 22 ) {
			$('.show-footer em').text('互相关注');
		}else {
			$('.show-footer em').text('关注');
			$('.show-footer em').addClass('ico-add');	
		}
	}
	
	var attentionFlag = 0;
	if( $('.show-footer em').text() == '关注' ) {
		attentionFlag = 1;
	}else {
		attentionFlag = 0;
	}	
	
	$('.show-footer em').on('click',function() {		
		if( attentionFlag == 1 ) {
			if(loginStatus == 0){
				wAjax({
					url: '/wmp/user/'+appConfigId+'/channel/atten/doFollow',
					type: 'post',
					data: {
						oUid: userid,
					},
					success: function(rs) {	
						isFollow = $("input[name='isFollow']").val();
						var json_rs = $.parseJSON((rs));	
						var nowFollowNum = parseInt($('.show-footer strong i').text());						
						if( ( nowFollowNum + 1 ) <= 99999 ) {
							$('.show-footer strong i').text( nowFollowNum + 1 );
						}else {
							$('.show-footer strong i').text( '10W+' );
						}						
						if( json_rs.code == 1 ) {
							if( json_rs.data == 22 ) {
								$('.show-footer em').removeClass('ico-add');
								$('.show-footer em').text('互相关注');
							}else if(json_rs.data == 12){
								$('.show-footer em').removeClass('ico-add');
								$('.show-footer em').text('已关注');
							}else{
								$('.show-footer em').removeClass('ico-add');
								$('.show-footer em').text('关注');
							}
						}else{
							alert('网络繁忙，请稍后再试。');
						}
					},
					error: function(rs) {					
					}
				});	
				attentionFlag = 0;
			}else{
				window.location = loginUrl;
			}			
		}else if( attentionFlag == 0 ) {
			if( loginStatus == 0 ) {
				wAjax({
					url: '/wmp/user/'+appConfigId+'/channel/atten/unFollow',
					type: 'post',
					data: {
						oUid: userid,
					},
					success: function(rs) {	
						isFollow = $("input[name='isFollow']").val();
						var json_rs = $.parseJSON((rs));
						var nowFollowNum = parseInt($('.show-footer strong i').text());
						if( json_rs.code == 1 ) {							
							if( ( nowFollowNum - 1 ) <= 99999 ) {
								$('.show-footer strong i').text( nowFollowNum - 1 );
							}else {
								$('.show-footer strong i').text( '10W+' );
							}	
							$('.show-footer em').addClass('ico-add');
							$('.show-footer em').text('关注');
						}else{
							alert('网络繁忙，请稍后再试。');
						}
					},
					error: function(rs) {					
					}
				});
				attentionFlag = 1;	
			}else {
				window.location = loginUrl;
			}					
		}			
	});		
});
