require(['jquery','modules/net/wAjax','pagescript/org-admin/base/js/loadinglist','wxapi','jquery/browser'],function($,wAjax,LoadingList,wx){
	var orgId =	window.location.search.match(/\?orgId=(\d+)/)[1]; 
	var $searchBtn = $('.search-btn');
	var $searchInput = $('#search-key-word').val('');
	var searchList = null;
	var history = window.history;
	var normalListConf = {
		loadingEle: $('#loading'),
		emptyPrompt: $('.member-list-empty'),
		itemTemplate: $('#member-item-tpl'),
		list: $('#item-list'),
		extraParam: {
			orgId: orgId
		},
		dataUrl: "/wz/org/"+ appConfigId +"/member/list"
	};
	wx.config($.extend({
		debug: DEBUG,
		jsApiList: []
	},WXCONFIG));	

	wx.ready(function(){
		wx.hideOptionMenu();
	});

	if(window.history.state && window.history.state['pagetype'] == 'search') {
		$searchInput.val(window.history.state['keyword']);
		search();
	} else {
		var list = new LoadingList(normalListConf);
		window.history.replaceState({pagetype:'normalList'},"test","");
	}

	$(window).on('popstate',function(){
		var pageType = window.history.state['pagetype'];
		switch(pageType) {
			case "normalList":
				searchList && searchList.destroy();
				$searchInput.val('');
				list  = new LoadingList(normalListConf);
				break;
		}
	});

	var $listFooter = $('.list-footer');
	$searchInput.on('focus',function(){
		$listFooter.hide();
	}).on('blur',function(){
		setTimeout(function(){
			$listFooter.show();
		},300);
	});

	$(window).on('touchstart',function(evt){
		if($(evt.target).is('input')) {
		} else {
			$('#search-key-word').blur();
		}
	});
	/*兼容 iphone 上软键盘弹出后fixed 样式失效问题*/
	var $titleBar = $('.title-bar');
	if($.browser.iphone == true) {
		$searchInput.on('focus',function(){
			$titleBar.removeClass('title-bar').addClass('ios-fix');
		});

		$searchInput.on('blur',function(){
			$titleBar.removeClass('ios-fix').addClass('title-bar');
			$('body').off('touchstart');
		});
	}

	$searchInput.on('input',function(){
		if($.trim($(this).val()).length > 0) {
			$searchBtn.removeAttr('disabled');
		} else {
			$searchBtn.attr('disabled','');
		}
	});

	$('.container').on('click','a.item,#add-member-btn',function(evt){
		evt.preventDefault();
		var gotoUrl = $(this).attr('href');
		if(history.state['pagetype'] == 'search') {
			gotoUrl	+= '#fromSearch';
		} 
		window.location.href=gotoUrl;
	});

	function search() {
		$searchInput.blur();
		var uname = $searchInput.val();
		list && list.destroy();
		var action = (history.state['pagetype'] == 'search') ? 'replace' : 'push';
		window.history[action+'State']({pagetype:'search',keyword:uname},"搜索","#search");
		searchList = new LoadingList({
			loadingEle: $('#loading'),
			emptyPrompt: $('.search-result-empty'),
			itemTemplate: $('#member-item-tpl'),
			list: $('#item-list'),
			extraParam: {
				orgId: orgId,
				uname: uname
			},
			dataUrl: "/wz/org/"+ appConfigId +"/member/list"
		});	
	}

	$('#search-form').on('submit',function(evt){
		evt.preventDefault();
		search();
	});

	$('.container').on('click','.search-btn:not([disabled])',function(){
		search();
	});
});
