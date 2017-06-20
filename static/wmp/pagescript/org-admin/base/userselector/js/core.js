define(['jquery','modules/net/wAjax','pagescript/org-admin/base/js/loadinglist'],function($,wAjax,LoadingList){
	var tpl = '<div class="user-selector hide" id="user-selector">'+
				'<template us-data-role="add-member-item-tpl">'+
				'<a class="item" href="javascript:;" data-uid="{{uid}}">'+
						'<div class="avatar" style="background-image:url({{avatar}});"></div>'+
						'<div class="title">{{name}}</div>'+
						'<div class="desc">{{corpName}} {{position}}</div>'+
						'{% if isMember == true %}'+
						'<div class="status">已添加</div>'+
						'{% else %}'+
						'<div class="add-btn"></div>'+
						'{% endif %}'+
				'</a>'+
				'</template>'+
				'<div class="container">'+
					'<div class="title-bar">'+
						'<h1>选择岛邻</h1>'+
						'<div class="search">'+
							'<form id="us-search-form">'+
								'<input type="search" us-data-role="search-key-word">'+
								'<a class="search-btn" us-data-role="search-btn" href="javascript:;" disabled></a>'+
							'</form>'+
						'</div>		'+
					'</div>'+
					'<div class="item-list" us-data-role="item-list">'+
					'</div>'+
					'<div class="loading" us-data-role="loading"></div>'+
					'<div class="prompt-pic search-result-empty" us-data-role="empty-result">'+
						'<div class="pic"></div>'+
						'<div class="prompt">没有找到该岛邻</div>'+
					'</div>'+
				'</div>'+
			'</div>';
	$('body').append(tpl);
	var $titleBar = $('#user-selector .title-bar').hide().css('height','90px');
	$('body').append($titleBar);
	function getEleByRoleName(roleName) {
		return $('#user-selector [us-data-role="'+roleName+'"]');
	}

	function UserSelector(conf) {
		var self = this;
		this.$ele = $('#user-selector');
		this.$searchBtn =  $titleBar.find('[us-data-role="search-btn"]');	
		this.$searchInput = $titleBar.find('[us-data-role="search-key-word"]');
		this.onMemberAdd = conf['onMemberAdd'];
		this.orgId = conf['orgId'];
		this.$ele.on('click','a:has(.add-btn)',function(){
			self.onMemberAdd({
				uid: $(this).attr('data-uid'),
				uname: $(this).find('.title').html()  
			});	
			window.history.back();
		});

		this.$searchInput.on('input',function(){
			if($.trim($(this).val()).length > 0) {
				self.$searchBtn.removeAttr('disabled');
			} else {
				self.$searchBtn.attr('disabled','');
			}
		});

		$titleBar.find('#us-search-form').on('submit',function(evt) {
			evt.preventDefault();
			search();
		});

		function search() {
			if(self.$searchInput.val() == '') {
				return;
			}
			self.$searchInput.blur();
			self.loadingList && self.loadingList.destroy();
		   	self.loadingList = new LoadingList({
				loadingEle: getEleByRoleName('loading'),
				emptyPrompt: getEleByRoleName('empty-result'),
				itemTemplate: getEleByRoleName('add-member-item-tpl'),
				scrollBox: self.$ele,
				scroller: self.$ele.find('.container'),
				list: getEleByRoleName('item-list'),
				extraParam: {
					orgId: self.orgId,
					uname: self.$searchInput.val()
				},
				dataUrl: "/wz/org/"+ appConfigId +"/user/search"
			});
		}
	
		this.$searchBtn.on('click',function(){
				search();
		});
	}

	UserSelector.prototype = {
		constructor: UserSelector,
		loadingList: null,
		$ele: null,
		$searchBtn: null,
		$searchInput: null,
		onMemberAdd: null,
		orgId: null,
		open: function() {
			this.$ele.removeClass('hide');
			$titleBar.show();
			this.$searchInput.focus();
			window.history.pushState({search:true},'','#search');
			getEleByRoleName('item-list').empty();
			this.$searchInput.val('');
		},
		close: function() {
			this.$searchInput.blur();
			this.$ele.addClass('hide');
			$titleBar.hide();
			this.loadingList && this.loadingList.destroy();
		}
	};

	return UserSelector;
});
