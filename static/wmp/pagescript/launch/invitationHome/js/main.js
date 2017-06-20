require(['jquery','wxapi','pagescript/base/js/wxStat','modules/ui/load/js/load'],function($,wx,wxStat,load){
	wx.config($.extend({
		debug: DEBUG,
		jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage']
	},WXCONFIG));
	wx.ready(function(){
		wx.onMenuShareTimeline({
			title: SHARE_CONFIG.title, 
			link: SHARE_CONFIG.link, // 分享链接
			imgUrl: SHARE_CONFIG.imgUrl, // 分享图标
			desc: SHARE_CONFIG.desc, // 分享描述
			success: function () { 
				 setTimeout(function(){
				 	$mask.hide();
				 	wxStat({
				 		appConfigId: appConfigId,
				 		data: STAT_CONFIG.custom
				 	});
				 },100);
				
			},
			cancel: function () { 
				$mask.hide();
			}
		});
		wx.onMenuShareAppMessage({
			title: SHARE_CONFIG.title,
			link: SHARE_CONFIG.link, // 分享链接
			imgUrl: SHARE_CONFIG.imgUrl, // 分享图标
			desc: SHARE_CONFIG.desc, // 分享描述
			success: function () {
				setTimeout(function(){
				 	$mask.hide();
				 	wxStat({
				 		appConfigId: appConfigId,
				 		data: STAT_CONFIG.custom
				 	});
				 },100);
			},
			cancel: function () {
				$mask.hide();
			}
		});
		wx.showOptionMenu();
	});

	var $lastItemGroup = $('.item-group:last'),
		initPage = $lastItemGroup.data('pageNum'),
		initHasMore = $lastItemGroup.data('hasMore');
	initPage = $.isNumeric(initPage)?initPage+1:1;
	initHasMore = initHasMore == 'true' || initHasMore == 'yes';

	new load({
		url: '/wmp/user/'+appConfigId+'/zhisland/invite/list',
		extraData: {},
		firstLoad: false,
		nextPage: initPage,
		hasMore: initHasMore,
		listRoot: $('.list'),
		listItemGroupSelector: '.item-group',
		loadRate: 0.8
	});

	var $mask = $('.mask'),
		$invitationLink = $('#invitation-link');

	$invitationLink.on('click',function(){
		$mask.show();
	});
	$mask.on('click',function(){
		$mask.hide();
	});
});