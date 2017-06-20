require(['jquery','pagescript/quiz/base/js/scrollLoadJudge','wxapi','modules/base/js/util','modules/net/wAjax','pagescript/base/js/wxStat'],function($,scrollLoadJudge,wx,util,wAjax,wxStat){
	
	var key = $('input[name="key"]').val();
	$('.judge-list').empty();
	scrollLoadJudge({
		url:'/wmp/user/'+appConfigId+'/relation/compete/comment/list',
		sendData:{key:key},
		hasmore: 'yes',
		initPage: 1,
		box:$('.judge-list')
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
		//朋友
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

	var $mask = $('.mask');
	$('.btn-share').on('click',function(e){
		$mask.show();
		e.stopPropagation();
	});
	$mask.on('click',function(){
		$mask.hide();
	});

	var $popup = $('.popup');
	var $delete = null;
	$('.btn-cancel', $popup).on('click',function(e){
		$popup.hide();
	});
	$('.btn-confirm', $popup).on('click',function(e){		
		if($delete) {
			wAjax({
	            url: '/wmp/user/'+appConfigId+'/relation/compete/delete/comment',
	            type: 'post',
	            data: {uid:$delete.data('uid')},
	            success: function(obj){
	                $delete.parents('.judge:eq(0)').remove();
	                $popup.hide();
	            },
	            error: function(obj) {        
	            	$popup.hide(); 
	            },
	            generalError: function(obj) {
	            	$popup.hide();
	            }
	        }); 
		}
	});
	$('.pop-window', $popup).on('click',function(e){
		e.stopPropagation();
	});
	$popup.on('click',function(){
		$popup.hide();
	});
	$('.container').on('click','.judge .delete', function(){
		$delete = $(this);		
		$popup.show();
	});

	$('.container').on('click','.judge .comment .reply-container', function(){
		var $this = $(this);
		var url = $this.data('url');
		window.location.href = util.addTimeStamp(url);
	});
});