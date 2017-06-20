require(['jquery','modules/ui/load/js/load','wxapi.default.config'],function($,load){

	var type = $('input[name=type]').val();

	var $lastItemGroup = $('.item-group:last'),
		initPage = $lastItemGroup.data('pageNum'),
		initHasMore = $lastItemGroup.data('hasMore');
	initPage = $.isNumeric(initPage)?initPage+1:1;
	initHasMore = initHasMore == 'true' || initHasMore == 'yes';

	new load({
		url: '/wmp/user/'+appConfigId+'/comment/rank/list',
		extraData: {'type':type},
		firstLoad: false,
		nextPage: initPage,
		hasMore: initHasMore,
		listRoot: $('.list'),
		listItemGroupSelector: '.item-group',
		loadRate: 0.8
	});
});