require(['jquery','modules/net/wAjaxV2','wxapi','jquery-hammer'],function($,wAjax,wx){
	wx.config($.extend({
		debug: DEBUG,
		jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage']
	},WXCONFIG));
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
	$(".tablist > div").eq(0).addClass('isShow');
    $('.tabIndex').on('click','li',function(){
        var index = $(this).index();
        $(this).find("div").addClass("bluehover").parent("li").siblings().find("div").removeClass("bluehover");
        $(".tablist > div").eq(index).addClass('isShow').show().siblings().hide().removeClass('isShow');
    });

	// 将数据填充到tag对应的标签下
	var term_id = $("input[name='termId']").val();
	//initHtml(0);
	initHtml(1);
	initHtml(2);
	initHtml(3);
	
	// 初始化标签HTML函数
	function initHtml( typeNum ) {
		wAjax({
			url:'/wmp/user/' + appConfigId + '/meeting/rank',
			type: 'get',
			data: {
				termId:term_id,
				page:'1',
				type:typeNum
			},
			success: function(rs) {
				if( typeNum == 1 ) {
                    $('.tablist').children().eq(3).append('<div class="loading"></div>');
                    $('.tablist').children().eq(3).append(rs);
                    $(".returnPage").show();
                }else if( typeNum == 2 ) {
                    $('.tablist').children().eq(2).append('<div class="loading"></div>');
                    $('.tablist').children().eq(2).append(rs);
                }else if( typeNum == 3 ) {
                    $('.tablist').children().eq(1).append('<div class="loading"></div>');
                    $('.tablist').children().eq(1).append(rs);
                }else{
                    $('.tablist').children().eq(0).append('<div class="loading"></div>');
                    $('.tablist').children().eq(0).append(rs);
                }
			},
			complete: function() {
				if( typeNum == 1 ) {
                    $('.tablist').children().eq(3).find('.loading').remove();
                }else if( typeNum == 2 ) {
                    $('.tablist').children().eq(2).find('.loading').remove();
                }else if( typeNum == 3 ) {
                    $('.tablist').children().eq(1).find('.loading').remove();
                }else{
                    $('.tablist').children().eq(0).find('.loading').remove();
                }
			}
		});
	}
	
	// 滚动加载标签内容
	var nowIndex = $('.tablist > div').index($('.tablist > div.isShow'));
	var box = $('.tablist').children().eq(nowIndex);
	var isloading = false;
	var hasmore = true;
	
	$(window).on('scroll', function() {	
		var windowHeight = $(window).height();
		var bodyHeight = $(document).height();
		var scrollHeight = $(document).scrollTop();			
		var nowTypeNum = parseInt( $('.tablist > div.isShow').attr('typeNum'));
		var hasMoreValue;
		
		if( nowTypeNum == 0 ) {
			hasMoreValue = $('.tablist').children().eq( 0 ).children('input[name=hasMore]:last').val();
		}else if( nowTypeNum == 1 ) {
			hasMoreValue = $('.tablist').children().eq( 3 ).children('input[name=hasMore]:last').val();
		}else if( nowTypeNum == 2 ) {
			hasMoreValue = $('.tablist').children().eq( 2 ).children('input[name=hasMore]:last').val();
		}else if( nowTypeNum == 3 ) {
			hasMoreValue = $('.tablist').children().eq( 1 ).children('input[name=hasMore]:last').val();
		}
		
		if( hasMoreValue == 'true') {
			hasmore = true;
		}	
			
		nowIndex = $('.tablist > div').index($('.tablist > div.isShow'));	
		if (  hasMoreValue === 'true' ) {	
			var page = parseInt($('.tablist > div.isShow input[name=page]:last').val()) + 1;
			if ( (scrollHeight >= ( bodyHeight - windowHeight )/2 ) && ( bodyHeight >= windowHeight ) && !isloading && hasmore == true) {
				isloading = true;
				if( nowTypeNum === 0 ) {
					box = $('.tablist').children().eq( 0 );
				}else if( nowTypeNum === 1 ) {
					box = $('.tablist').children().eq( 3 );
				}else if( nowTypeNum === 2 ) {
					box = $('.tablist').children().eq( 2 );
				}else if( nowTypeNum === 3 ) {
					box = $('.tablist').children().eq( 1 );
				}
				box.append('<div class="loading"></div>');
				wAjax({
					url:'/wmp/user/' + appConfigId + '/meeting/rank',
					type: 'get',
					data: {
						termId: term_id,
						page: page,
						type: nowTypeNum
					},
					success: function(rs) {							
						if( nowTypeNum == 0 ) {
							$('.tablist').children().eq( 0 ).append(rs);
							hasMoreValue = $('.tablist').children().eq( 0 ).children('input[name=hasMore]:last').val();
						}else if( nowTypeNum == 1 ) {
							$('.tablist').children().eq( 3 ).append(rs);
							hasMoreValue = $('.tablist').children().eq( 3 ).children('input[name=hasMore]:last').val();
						}else if( nowTypeNum == 2 ) {
							$('.tablist').children().eq( 2 ).append(rs);
							hasMoreValue = $('.tablist').children().eq( 2 ).children('input[name=hasMore]:last').val();
						}else if( nowTypeNum == 3 ) {
							$('.tablist').children().eq( 1 ).append(rs);
							hasMoreValue = $('.tablist').children().eq( 1 ).children('input[name=hasMore]:last').val();
						}
										
						if ( hasMoreValue === 'true' ) {
							hasmore = true;
						} else {
							hasmore = false;
						}
					},
					complete: function() {
						if( nowTypeNum === 0 ) {
							box = $('.tablist').children().eq( 0 );
						}else if( nowTypeNum === 1 ) {
							box = $('.tablist').children().eq( 3 );
						}else if( nowTypeNum === 2 ) {
							box = $('.tablist').children().eq( 2 );
						}else if( nowTypeNum === 3 ) {
							box = $('.tablist').children().eq( 1 );
						}
						
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
});
