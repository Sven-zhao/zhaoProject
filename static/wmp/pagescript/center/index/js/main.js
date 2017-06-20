require(['jquery','modules/net/wAjaxV2','wxapi','jquery-hammer'],function($,wAjax,wx){
	wx.config($.extend({
		debug: DEBUG,
		jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage']
	},WXCONFIG));	

	wx.ready(function(){
		//wx.hideOptionMenu();
	});

	//varibles defination
    var $mask = $('.mask');
    var $btnShare = $('#share');

    //bind event
    $btnShare.on('click',function(){
        $mask.show();
    });
    $mask.on('click',function(){
        $mask.hide();
    });

    function hideMask() {
        $mask.hide();
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

    var $asynContentContainer = $('#asyn-content-container');
    var uid = $('input[name=uid]').val();
    var isMe = $('input[name=isMe]').val();
    var hasFigure = $('input[name=hasFigure]').val();


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
	
	// banner背景图
	var bgPeoDefault = 0;
	$('.bg-peo').on('touchstart',function() {
		if( hasFigure === 'true' ) {
			if( bgPeoDefault == 0 ) {
				$(this).css('height', clientHeight);
				$(this).addClass('bg-peo-active');
				$('.share-my,.bot-btn').css('display','none');
				bgPeoDefault = 1;
				
			}else {
				$(this).css('height', '192px');
				$(this).removeClass('bg-peo-active');
				$('.share-my,.bot-btn').css('display','block');
				bgPeoDefault = 0;
			}	
		}	
	});	
	
	// 个人简介
	var peoInfoPHeight = $('.peo-name pre').height();
	if( peoInfoPHeight > 46 ) {
		$('.peo-name pre').addClass('hide-more');	
		$('.btn-show-down').show();		
		if( $('.peo-show-more').length ) {
			$('.peo-show-more').addClass('margin-top-x');
		}	
	}
	if( $('.peo-show-more').length ) {
		$('.btn-show-down').show();			
	}	
	$('.btn-show-down').on('touchstart', function() {
		$(this).hide();	
		if( $('.peo-name pre').hasClass('hide-more') ) {
			$('.peo-name pre').removeClass('hide-more');
			$('.peo-name pre').addClass('p-has-border');	
			if( $('.peo-show-more').length ) {
				$('.peo-name pre').addClass('p-has-border2');	
			}
			$('.peo-name').addClass('margin-botttom');
		}			
		$('.peo-show-more').show();
	});

	// app资源下载页
	$('.res-tag li:first-child a').on('click', function() {
		if(isMe=='true') {
			window.location = 'http://m.zhisland.com?uri='+encodeURI('zhisland://com.zhisland/'+wmpurl+'/wmp/user/'+appConfigId+'/resource/app/user/'+uid);
		}else {
			window.location = 'http://m.zhisland.com?uri='+encodeURI('zhisland://com.zhisland/'+wmpurl+'/wmp/user/'+appConfigId+'/resource/app/otherUser/'+uid);
		}
	});
	
	// app动态下载页
	$('.res-tag li:last-child a').on('click', function() {		
		window.location = 'http://m.zhisland.com?uri=zhisland://com.zhisland/user/' + uid +'/feeds';
	});
	
	// app个人主页
	$('.share-my a').on('click', function() {		
		window.location = 'http://m.zhisland.com?uri=zhisland://com.zhisland/user/' + uid;
	});
	
	function part1(resolve, reject){
        wAjax({
			url: '/wmp/user/'+appConfigId+'/personal/frag/'+uid+'/resource',
			data: {},
			success: function(rs) {
				resolve(rs);
			},
			error: function(obj) {
				reject();
			}
		});
    }
    function part2(resolve, reject){
        wAjax({
			url: '/wmp/user/'+appConfigId+'/personal/frag/'+uid+'/comment',
			data: {},
			success: function(rs) {
				resolve(rs);
			},
			complete: function() {
				// 展开全部
				$('.show-all a').on('click', function() {
					$(this).parent().hide();
					$(this).parent().prev('ul').children('li.li-hide').removeClass('li-hide');
				});
				
				// 印象
				var ulNum = $('.impression-list ul').length;
				$('.impression-list').css('width', ulNum*75);
				// 印象-点击进入App下载页
				$('.impression-box .tit a,.impression-p a,.impression-box .add-box a').on('click', function() {		
					window.location = 'http://m.zhisland.com?uri=zhisland://com.zhisland/user/' + uid;
				});
			},
			error: function(obj) {
				reject();
			}
        });
    }

    (function(){
        new Promise(part1).then(function(rs){
            $asynContentContainer.append(rs);
            return new Promise(part2);
        }).then(function(rs){
                $asynContentContainer.append(rs);
            });
    })();
	
});
