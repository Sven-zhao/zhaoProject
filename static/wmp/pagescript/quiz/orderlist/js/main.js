require(['jquery','pagescript/quiz/base/js/scrollLoadJudge','wxapi','pagescript/base/js/wxStat'],function($,scrollLoadJudge,wx,wxStat){
	//height of order-list
	var h = $(window).height(),
		fix_h = $('.fix').height(),
		s_h = h - 75 - fix_h,
		td_w = $('table').width() - $('table tr').eq(0).find('td').eq(0).width() - $('table tr').eq(0).find('td').eq(2).width();
	$('.container-orderlist').css({'padding-bottom':fix_h+15+'px'});
	$('.container-orderlist .order-list').css({'min-height':h-fix_h-75+'px'});
	$('table tr').each(function(){
		$(this).find('td').eq(1).width(td_w);
	});
	var type=$('input[name=type]').val();
	var hasmore = $('input[name="hasMore"]:last').val();
	scrollLoadJudge({
		url:'/wmp/user/'+appConfigId+'/relation/compete/rank/list',
		sendData:{type:type},
		hasmore:hasmore,
		box:$('.order-list table tbody')
	});
	wx.config($.extend({
		debug: DEBUG,
		jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage']
	},WXCONFIG));
	wx.ready(function(){
		wx.onMenuShareTimeline({
			title: SHARE_CONFIG.title +'，'+ SHARE_CONFIG.desc,
			link: SHARE_CONFIG.link, // 分享链接
			imgUrl: SHARE_CONFIG.imgUrl, // 分享图标
			success: function () {
				 setTimeout(function(){
				 	wxStat({
				 		appConfigId: appConfigId,
				 		data: STAT_CONFIG.custom
				 	});
				 },100);
			},
			cancel: function () { 
			}
		});
		wx.onMenuShareAppMessage({
			title: SHARE_CONFIG.title,
			link: SHARE_CONFIG.link, // 分享链接
			imgUrl: SHARE_CONFIG.imgUrl, // 分享图标
			desc: SHARE_CONFIG.desc, // 分享描述
			success: function () {
				setTimeout(function(){
				 	wxStat({
				 		appConfigId: appConfigId,
				 		data: STAT_CONFIG.custom
				 	});
				 },100);
			},
			cancel: function () {
			}
		});
		wx.showOptionMenu();
	});

	var $mask = $('.mask');
	$('.btn-share').on('click',function(e){
		$mask.show();
		e.preventDefault();
	});
	$mask.on('click',function(){
		$mask.hide();
	});
});