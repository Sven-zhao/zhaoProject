require(['jquery', 'common/jquery-plugins/fastclick', 'wxapi', 'pagescript/quiz/base/js/wAjax', 'pagescript/base/js/wxStat'], function($, fastclick, wx, wAjax, wxStat) {
	// init
	(function() {
		fastclick.attach(document.body);
	})();
	// 分享到朋友圈
	var $mask = $('.mask');
	var share_flag = 0;
	console.log(share_flag);
	wx.config($.extend({
		debug: DEBUG,
		jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage']
	}, WXCONFIG));
	wx.ready(function() {
		//朋友圈
		wx.onMenuShareTimeline({
			title: SHARE_CONFIG.title,
			link: SHARE_CONFIG.link, // 分享链接
			imgUrl: SHARE_CONFIG.imgUrl, // 分享图标
			success: function() {
				share_flag = 1;
				//console.log(share_flag);
				setTimeout(function() {
					wxStat({
						appConfigId: appConfigId,
						data: STAT_CONFIG.custom
					});
					if ($('.code2-info').is(':hidden') && $('.download-wrap').is(':hidden')) {
						$('.mask').css({
							'height': '0',
							'opacity': '0'
						});
					}
					if (!$('.tip-share').is(':hidden')) {
						$('.tip-share').hide();
						$('.mask').css({
							'height': '0',
							'opacity': '0'
						});
					}
				}, 100);
			},
			cancel: function() {
				share_flag = 1;
				//console.log(share_flag);
				if ($('.code2-info').is(':hidden') && $('.download-wrap').is(':hidden')) {
					$('.mask').css({
						'height': '0',
						'opacity': '0'
					});
				}
				if (!$('.tip-share').is(':hidden')) {
					$('.tip-share').hide();
					$('.mask').css({
						'height': '0',
						'opacity': '0'
					});
				}
			}
		});
		//朋友
		wx.onMenuShareAppMessage({
			title: SHARE_CONFIG.title,
			link: SHARE_CONFIG.link, // 分享链接
			imgUrl: SHARE_CONFIG.imgUrl, // 分享图标
			desc: SHARE_CONFIG.desc, // 分享描述
			success: function() {
				share_flag = 1;
				//console.log(share_flag);
				setTimeout(function() {
					wxStat({
						appConfigId: appConfigId,
						data: STAT_CONFIG.custom
					});
					if ($('.code2-info').is(':hidden') && $('.download-wrap').is(':hidden')) {
						$('.mask').css({
							'height': '0',
							'opacity': '0'
						});
					}
					if (!$('.tip-share').is(':hidden')) {
						$('.tip-share').hide();
						$('.mask').css({
							'height': '0',
							'opacity': '0'
						});
					}
				}, 100);

			},
			cancel: function() {
				share_flag = 1;
				//console.log(share_flag);
				if ($('.code2-info').is(':hidden') && $('.download-wrap').is(':hidden')) {
					$('.mask').css({
						'height': '0',
						'opacity': '0'
					});
				}
				if (!$('.tip-share').is(':hidden')) {
					$('.tip-share').hide();
					$('.mask').css({
						'height': '0',
						'opacity': '0'
					});
				}
			}
		});
		wx.showOptionMenu();
	});

	
	// 404无法分享
	if( $('.del').length ) {		
		wx.ready(function(){
			wx.hideOptionMenu();
		});
	}
	
	// 初始化视频高度
	var clientWidth = document.documentElement.clientWidth;
	$('.video_iframe').css('height', clientWidth * 3 / 4 + 'px');
	
	//判断是否显示展开全部
	var needp = $('.recommend-cot .recommend-cot-list').eq(0).children('.recommend-cot-info');
	if( needp.children('p').height() > 54 ) {
		$('.recommend-cot .tc').show();	
	}	
	
	if( $('.recommend-cot-list').length > 1) {
		$('.recommend-cot .tc').show();	
	}
	
	$('.recommend-cot-app .tc a').on('click', function() {
		$('.recommend-cot').addClass('active');
		$('.recommend-cot .recommend-cot-list').eq(0).children('.recommend-cot-info').removeClass('row3');	
		needp.css('maxHeight', needp.children('p').height());
		$(this).parent().hide();
	});
	
	// 如果是app端
	if( $('.recommend-cot-app').length ) {
		$('.recommend-cot-app .tc a').on('click', function() {
			$('.recommend-cot-app').addClass('active');
			$(this).parent().hide();
		});
	}

	// need mini-box	
	var newsID = $("input[name='aid']").val();
	$('.recd-from a,.peo-info-point a,.viewpoint-tool a,.bot-cmt li a,.bot-cmt .tr a,.bot-view-v').on('click', function() {	
		window.location = 'http://m.zhisland.com?uri=zhisland://com.zhisland/news/' + newsID;
	});

	// 404页面
	$('.box-404 a').on('click', function() {
		window.location = 'http://m.zhisland.com?uri=zhisland://com.zhisland/';
	});

	//统计埋点
	$("[data-href]").on("click", function() {
		//console.log($(this).attr("data-href"));
		$.ajax({
			url: $(this).attr("data-href"),
			type: 'get',
			success: function(rs) {
				//alert("请求成功");
			},
			complete: function() {
				//alert("请求完成");
			},
			error: function() {
				//alert("请求失败");
			}
		})
	})

	//下导航
	setTimeout(function() {
		$('.download-bar-top').css("bottom", 0).slideDown("slow");
	}, 2000);

	// 点击正文页下面的分享
	$('.share-box a.ico-2,.share-box a.ico-3').on('click', function() {
		$('.mask').css({
			'height': '100%',
			'opacity': '1'
		});
		$('.tip-share').show();
	});

	// 顶部下载关闭
	$('.download-tip .btn-top-close').on('click', function() {
		$('.download-bar-top').css({
			'bottom': '-65px',
			'opacity': '0'
		});
	});

	// 企业家观点按钮点击事件
	$('.btn-view,.btn-get-more').on('click', function() {
		$('.mask').css({
			'height': '100%',
			'opacity': '1'
		});
		$('.code2-info').fadeIn();
	});

	$('.code2-info').on('click', function() {
		$('.mask').css({
			'height': '0',
			'opacity': '0'
		});
		$('.code2-info').hide();
	});

	$('.code2-info img').on('click', function() {
		event.stopPropagation();
	});

	// mini-box mask click
	$('.mask').on('click', function() {
		$('.mask').css({
			'height': '0',
			'opacity': '0'
		});
		$('.download-wrap').css({
			'top': '-140px',
			'opacity': '0'
		});
		$('.tip-share').hide();
	});

	// mini-box button download
	$('.download-wrap a').on('click', function() {
		$('.mask').css({
			'height': '0',
			'opacity': '0'
		});
		$('.download-wrap').css({
			'top': '-140px',
			'opacity': '0'
		});
		getLink(this);
	});
	$('.btn-top-download').on('click', function() {
		$('.download-bar-top').css({
			'top': '-65px',
			'opacity': '0'
		});
		var uid = $("input[name='uid']").val();
		if(uid == 0){
			//未登录
          	window.location = $("input[name='loginUrl']").val();
		}else{
            window.location = 'http://m.zhisland.com?uri=zhisland://com.zhisland/news/' + newsID;
        }
	});

	// 点击返回列表链接
	$('.go-back a,.del a').on('click', function() {
		window.location = '/wmp/user/' + appConfigId + '/news/m/index?t=' + Math.random();
	});

	// 异步加载推荐列表
	if ($('.related').length) {
		var aid = $("input[name='aid']").val();
		wAjax({
			url: '/wmp/user/' + appConfigId + '/news/m/' + aid + '/related',
			type: 'get',
			data: {},
			success: function(rs) {
				//console.log(rs);
				$('.related').append(rs);
			},
			error: function(rs) {}
		});
	}

	// 滚动加载
	var isloading = false,
		hasmore = true;
	var box = $('.container');

	function loadCon(ops) {
		isloading = true;
		box.append('<div class="loading"></div>');
		wAjax({
			url: ops.url,
			data: ops.sendData,
			success: function(rs) {
				box.append(rs);
				if ($("input[name='nextId']:last").val() != '') {
					hasmore == true
				} else {
					hasmore = false;
				}
			},
			complete: function() {
				if (box.find('.loading').size() == 1) {
					box.find('.loading').remove();
				}
				isloading = false;
			}
		});
	}
	
	// 客坐主编 关注
	var editorDataUid = $('.editor').attr('data-uid');
	$('.editor .isApp').on('click', function() {	
		window.location = 'zhisland://com.zhisland/user/' + editorDataUid;
	});
	$('.editor .isWXB').on('click', function() {	
		window.location = '/wmp/user/' + appConfigId + '/personal/other/home?uid=' + editorDataUid;
	});
	$('.editor .isOther').on('click', function() {	
		window.location = 'http://m.zhisland.com?uri=zhisland://com.zhisland/news/' + newsID;	
	});
	
	var uid = $("input[name='uid']").val(),
	editorUid = $("input[name='editorUid']").val(); 	
	var addFlag = 1;
	if( $('.btn-need-add').length ) {
		$('.editor em').on('click',function() {	
			if( addFlag == 1 ) {
				wAjax({
					url: '/wmp/user/'+appConfigId+'/news/m/follow',
					type: 'post',
					data: {
						uid: uid,
						editorUid: editorUid
					},
					success: function(rs) {	
						var json_rs = $.parseJSON((rs));
						console.log(json_rs.code);
						if( json_rs.code == '0' ) {
							$('.editor em').text('已关注');
							$('.editor em').removeClass('ico-add');
							addFlag = 0;
						}					
					},
					error: function(rs) {		
						if( parseInt(json_rs.code) < 0 ) {
							alert(json_rs.msg);
						}		
					}
				});	
			}						
		});	
	}	
	
	if ($("input[name='nextId']:last").val() != '' && $("input[name='nextId']").length) {

		$(window).on('scroll touchmove', function() {
			console.log('1');
			var win_h = $(window).height(),
				body_h = $('body').height(),
				scroll_h = document.body.scrollTop,
				fix_h = $('.fix').height();
			var nextId = $("input[name='nextId']:last").val();
			if ((win_h + scroll_h >= 0.5 * body_h) && (body_h >= win_h) && !isloading && hasmore == true) {
				var data = {
					'nextId': nextId
				};
				loadCon({
					url: '/wmp/user/' + appConfigId + '/news/m/list?nextId=' + nextId,
				});
			}
		});
	} else {
		isloading = false;
		return false;
	}
		
	function getLink(links) {
		// getLink()在点击事件中调用 getLink(this); 即可

		var link1 = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.zhisland.android.blog&g_f=991653',
			link2 = 'http://www.zhisland.com/data/client/android/zhisland.apk',
			link3 = 'https://itunes.apple.com/us/app/zheng-he-dao/id525751375?mt=8';
		window.isWeiXin = navigator.userAgent.toLowerCase().indexOf("micromessenger") != -1;
		window.isIOS = (/iphone|ipad/gi).test(navigator.userAgent);
		window.isAndroid = navigator.userAgent.toLowerCase().indexOf("android") != -1;
		if (isWeiXin) {
			links.href = link1;
		} else if (isIOS) {
			links.href = link3;
		} else {
			links.href = link2;
		}
	}

});