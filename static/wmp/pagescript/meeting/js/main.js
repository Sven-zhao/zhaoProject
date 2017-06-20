require(['jquery', 'common/jquery-plugins/fastclick', 'modules/net/wAjaxV2','wxapi','jquery-hammer'],function($,fastclick,wAjax,wx){
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

	// 获取隐藏域变量
    var termId = $('input[name=termId]').val();
    var meetingId = $('input[name=meetingId]').val();
    var uid = $('input[name=uid]').val();
    var aid = $('input[name=aid]').val();
    var appId = $('input[name=appId]').val();
    var redir_url =  $('input[name=redir_url]').val();
    var conflictId =  $('input[name=conflictId]').val();
	
	

    // 弹窗相关
    $('body').on('click', '.ico-share', function(){
		window.isWeiXin = navigator.userAgent.toLowerCase().indexOf("micromessenger") != -1;
		window.isIOS = (/iphone|ipad/gi).test(navigator.userAgent);
		window.isAndroid = navigator.userAgent.toLowerCase().indexOf("android") != -1;
		if(isWeiXin) {
			$('.mask').show();
			$('.share-box').show();
		}else {

			$('.mask').show();
			$('.share-box-pc').show();
			// 3秒后跳过
			var wait = parseInt( $('.share-box-pc .auto-close em').text() );
			timeOut();
			function timeOut(){
				if( wait === 0 ){
					$('.mask').hide();
					$('.share-box-pc').hide();
					$('.share-box-pc .auto-close em').text('6')
				}else {
					setTimeout(function(){
						wait--;
						$('.share-box-pc .auto-close em').text( wait );
						timeOut();
					},1000);
				}
			}
		}

    });

	$('body').on('click', '.apply-box a.btns', function(){
        $('.mask').hide();
		$('.apply-box').hide();
    });

	$('body').on('click', '.cry-box a', function(){
        $('.mask').hide();
		$('.cry-box').hide();
    });

	$('body').on('click', '.pay-box .bot a', function(){
        $('.mask').hide();
		$('.pay-box').hide();
    });


	// 点击遮罩层，弹窗隐藏
    $('.mask').on('click',function(){
        $('.mask').hide();
		$('.share-box,.share-box-pc,.apply-box,.pay-box,.cry-box').hide();
    });

    function hideMask() {
        $('.mask').hide();
		$('.share-box,.apply-box').hide();
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

    //tab
    $('.tab-btn').on('touchend','li',function(e){
        var index = $(this).index();
        $('.tab-btn li').removeClass('cur');
        $(this).addClass('cur');
        $('.tab-con-item').hide();
        $('.tab-con-item').eq(index).show();
    });

	var clientWidth =  $(window).width();
	var clientHeight =  $(window).height();
	
	// 详情页电话可打
	/*
	if( $('.cot-box ul').length ) {
		if( parseInt( $('.cot-box li:last p').text() ) > 0 ) {
			var str = $('.cot-box li:last p').text();
			var strs = '';
			str = str.split('/');
			for(var i=0; i<str.length; i++) {
				strs += '<a href="tel:' + str[i] + '">' + str[i] +'</a>/'                    
			}
			strs=strs.substring(0,strs.length-1);
			$('.cot-box li:last p').html(strs);
		}
	});
	*/	

	// 详情页报名获取两条数据
	$('body').on('click', '.apply ul li', function() {
		window.location = '/wmp/user/' + appConfigId + '/meeting/sign/list?meetingId=' + meetingId;
	});

	if( $('.apply ul').length ) {
		wAjax({
			url:'/wmp/user/' + appConfigId + '/meeting/sign/list?&meetingId=' + meetingId + '&page=1&pageSize=30&isListPage=0',
			type: 'get',
			data: {
				'termId': termId,
				'meetingId': meetingId
			},
			success: function(rs) {
				$('.apply ul').append('<div class="loading"></div>');
				$('.apply ul').append(rs);
				var count =  parseInt( $('.apply ul input[name=count]').val() );
				$('.apply .tit h2 em').text( count + 1 );
			},
			complete: function() {
				$('.apply ul').find('.loading').remove();
			}
		});
	}

	// 详情页点击 “我要报名” 按钮操作
	var clickFlag = 0;
	$('body').on('click', '.btn-box .need-apply', function() {
		if( conflictId > 0 ) {
			// show minbox
			$('.mask').show();
			$('.cry-box').show();	
		}else {
			var self = this;
			if(clickFlag == 0) {
				$(self).removeClass('need-apply');
				wAjax({
					url: '/wmp/user/'+appConfigId+'/meeting/meeting/doSign?meetingId=' + meetingId + '&uid=' + uid,
					type: 'post',
					data: {},
					success: function(rs) {
						var json_rs = $.parseJSON((rs));
						if(json_rs.code == 8 || json_rs.code == 3) {
							$(self).text(json_rs.msg);
							$('.mask').show();
							$('.apply-box').show();
							//clickFlag = 1;
						}else if(json_rs.code == 7) {
							var str = '/wmp/user/' + appConfigId + '/mobile/activity/pay/' + aid + '?from=chat&redir_url='+redir_url;
							$(self).text(json_rs.msg).removeClass("btns-blue").addClass("btns-green");
							window.location = str;
						} else if (json_rs.code == -1) {
							$(self).addClass('need-apply');
							//alert(json_rs.msg);
							//clickFlag = 1;
						} else if (json_rs.code < 0) {
							$(self).addClass('need-apply');
							alert(json_rs.msg);
							//clickFlag = 1;
						}else{
							$(self).addClass('need-apply');
							alert('网络错误');
						}
					},
					error: function(rs) {
						$(self).addClass('need-apply');
					}
				});
			}
		}
		
	});

	// 详情页点击 “赞” 按钮操作
	var zanFlag = 0;
	var zanNum = parseInt($('.btn-box .btn-zan').text());
	
	$('body').on('click', '.btn-box .btn-zan', function() {
		if( !$('.btn-box .btn-zan').hasClass('btn-zan-active') ) {
			var self = this;
			if(zanFlag == 0) {
				wAjax({
					url: '/wmp/user/'+appConfigId+'/meeting/meeting/doLike?meetingId=' + meetingId,
					type: 'post',
					data: {},
					success: function(rs) {
						var json_rs = $.parseJSON((rs));
						if(json_rs.code == 1) {
							$(self).addClass('btn-zan-active').text( zanNum + 1 );
							zanFlag = 1;
						} else if(json_rs.code == -1){
							window.location.href = json_rs.msg;
						}
						else {
							alert('请刷新页面');
						}
					},
					error: function(rs) {
					}
				});
			}
		}else {
			$('.zan-past').css('top', clientHeight/2).show();
			timeOut();
			var wait = 1;
			function timeOut(){
				if( wait === 0 ){
					$('.zan-past').hide();
				}else {
					setTimeout(function(){
						wait--;
						timeOut();
					},1000);
				}
			}
		}
	});

	// 列表点击“同意”按钮操作
	$('.list').on('click', 'li a.btn-agree', function() {
		var dataId = $(this).parent().parent().attr('data-id');
		var dataUid = $(this).parent().parent().attr('data-uid');
		var self = this;
		wAjax({
			url: '/wmp/user/'+appConfigId+'/meeting/meeting/audit?id=' + dataId + '&status=1',
			type: 'post',
			data: {
				id: dataId,
				uid: dataUid,
				status: 1,
				meetingId: meetingId
			},
			success: function(rs) {
				$(self).parent().html('<a class="btn-clicked">已同意</a>');
			},
			error: function(rs) {
			}
		});
	});

	// 列表点击“拒绝”按钮操作
	$('.list').on('click', 'li a.btn-reject', function() {
		var dataId = $(this).parent().parent().attr('data-id');
		var dataUid = $(this).parent().parent().attr('data-uid');
		var self = this;
		wAjax({
			url: '/wmp/user/'+appConfigId+'/meeting/meeting/audit?id=' + dataId + '&status=2',
			type: 'post',
			data: {
				id: dataId,
				uid: dataUid,
				status: 2,
				meetingId: meetingId
			},
			success: function(rs) {
				$(self).parent().html('<a class="btn-clicked">已拒绝</a>');
			},
			error: function(rs) {
			}
		});
	});

	// 滚动加载
	if( $('.list').length ) {
		var box = $('.list');
		var isloading = false;
		var hasmore = true;
		$(window).on('scroll', function() {	
			var windowHeight = $(window).height();
			var bodyHeight = $(document).height();
			var scrollHeight = $(document).scrollTop();			
			var hasMoreValue = box.children('input[name=hasMore]:last').val();
			if( hasMoreValue == 'true') {
				hasmore = true;
			}	
				
			if (  hasMoreValue === 'true' ) {	
				var nextPage = parseInt( box.children('input[name=page]:last').val() ) + 1;
				if ( (scrollHeight >= ( bodyHeight - windowHeight )/2 ) && ( bodyHeight >= windowHeight ) && !isloading && hasmore == true ) {
					isloading = true;
					$('.list').append('<div class="loading"></div>');
					wAjax({
						url:'/wmp/user/' + appConfigId + '/meeting/sign/list?termId=' + termId + '&meetingId=' + meetingId + '&page=' + nextPage,
						type: 'get',
						data: {
							'termId': termId,
							'meetingId': meetingId,
							'page': nextPage
						},
						success: function(rs) {							
							box.append(rs);
							hasMoreValue = box.children('input[name=hasMore]:last').val();
											
							if ( hasMoreValue === 'true' ) {
								hasmore = true;
							} else {
								hasmore = false;
							}
						},
						complete: function() {							
							if (box.find('.loading').size() === 1) {
								box.find('.loading').remove();
							}
							isloading = false;
						}
					});
				}	
			}else {
				isloading = false;
				return false;
			}			
		});	
	};
	
	// 支付按钮操作
	$('body').on('touchstart', '.pay .pay-bot .btn-h5', function() {
		wAjax({
			url: '/wmp/user/' + appConfigId + '/mobile/activity/' + aid + '/configPay',
			type: 'post',
			data: {
				'aid': aid,
				'redir_url':redir_url,
			},
			success: function(rs) {
				var json_rs = $.parseJSON((rs));
				if(json_rs.code == 0) {
					window.location = json_rs.msg;
				}else {
					alert( json_rs.msg );
				}
			},
			error: function(rs) {
			}
		});
	});

	// 微信支付功能
	var payConfig;
	function getWXPayConfig() {
		wAjax({
			url: '/wmp/user/'+appConfigId+'/mobile/activity/'+aid+'/payConfig?appid='+appId,
			type: "get",
			success: function(result) {
				var json_rs = $.parseJSON((result));
				payConfig = json_rs.data;
				payConfig.success = function(res) {
					wAjax({
						url: '/wmp/user/'+appConfigId+'/mobile/activity/'+aid+'/toPay?appid='+appId,
						type: "get",
						data:{},
						success: function(rs) {
								window.location.href = '/wmp/user/'+appConfigId+'/mobile/activity/'+aid+'/sign/suc?'+new Date().getTime();
						}
					});
				};
				//接口调用失败时
				payConfig.fail = function(){
	
				};
				//用户点击取消时的回调函数
				payConfig.cancel = function(){	
				}				
			}
		});
	}	
	if( $('.btn-v-pay').length ) {
		getWXPayConfig();
		$('body').on('click', '.btn-v-pay', function(e) {		
			wAjax({
				url: '/wmp/user/'+appConfigId+'/mobile/activity/'+aid+'/checkpay?t='+new Date().getTime(),
				type: "get",
				data:{},
				success: function(rs) {
					if (payConfig) {
						wx.chooseWXPay(payConfig);
					}
				}
			});
		});
	}
	

});
