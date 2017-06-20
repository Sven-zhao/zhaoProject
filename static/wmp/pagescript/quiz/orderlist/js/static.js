require(['jquery','wxapi'],function($,wx){
	//height of order-list
	var hasFixedFooter = ($('.fix').length === 0)?0:1,
		fix_h = 0;
	if(hasFixedFooter) {
		fix_h = $('.fix').height();
	}

	var h = $(window).height(),		
		s_h = h - 75 - fix_h,
		td_w = $('table').width() - $('table tr').eq(0).find('td').eq(0).width() - $('table tr').eq(0).find('td').eq(2).width();
	if(hasFixedFooter) {
		$('.container-orderlist').css({'padding-bottom':fix_h+15+'px'});
	}
	$('.container-orderlist .order-list').css({'min-height':h-fix_h-75+'px'});
	$('table tr').each(function(){
		$(this).find('td').eq(1).width(td_w);
	});

	var hasmore = $('input[name="hasMore"]:last').val();
	scrollLoadJudge({
		url:'/wmp/user/'+appConfigId+'/relation/compete/rank/list',
		sendData:{},
		hasmore:hasmore,
		box:$('.order-list table tbody')
	});
	
	wx.config($.extend({
		debug: DEBUG,
		jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage']
	},WXCONFIG));
	wx.ready(function(){
		//朋友圈
		wx.onMenuShareTimeline({
			title: SHARE_CONFIG.title + SHARE_CONFIG.desc,
			link: SHARE_CONFIG.link, // 分享链接
			imgUrl: SHARE_CONFIG.imgUrl, // 分享图标
			success: function () {
			},
			cancel: function () { 
			}
		});
		//朋友
		wx.onMenuShareAppMessage({
			title: SHARE_CONFIG.title,
			link: SHARE_CONFIG.link, // 分享链接
			imgUrl: SHARE_CONFIG.imgUrl, // 分享图标
			desc: SHARE_CONFIG.desc, // 分享描述
			success: function () {
			},
			cancel: function () {
			}
		});
		wx.showOptionMenu();
	});
});