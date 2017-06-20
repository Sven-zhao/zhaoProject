
require(['jquery','common/jquery-plugins/fastclick','wxapi','pagescript/quiz/base/js/wAjax'],function($,fastclick,wx,wAjax){
	// init
    (function(){
        fastclick.attach(document.body);
    })();	
	
	// 分享成功后不能再分享
	if( $('.detail-txt').length ) {
		require(['wxapi.default.config']);
	}
	
	// 分享到朋友圈    
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
				if( $('.cp-logo-info').length ) {		
					shareAfter();
					shartInfo();				
				}				
			},
			cancel: function () { 
				if( $('a.btn-blue[data-type="2"]').length ) {
					$('.vote-mini').css({
						'top':'-280px',
						'opacity':'0'
					});
				}				
				$('.mask').css({
					'height':'0',
					'opacity':'0'
				});
			}
		});
		//朋友
		wx.onMenuShareAppMessage({
			title: SHARE_CONFIG.title,
			link: SHARE_CONFIG.link, // 分享链接
			imgUrl: SHARE_CONFIG.imgUrl, // 分享图标
			desc: SHARE_CONFIG.desc, // 分享描述
			success: function () {
				if( $('.cp-logo-info').length ) {		
					shareAfter();
					shartInfo();				
				}
			},
			cancel: function () {
				if( $('a.btn-blue[data-type="2"]').length ) {
					$('.vote-mini').css({
						'top':'-280px',
						'opacity':'0'
					});
				}
				$('.mask').css({
					'height':'0',
					'opacity':'0'
				});
			}
		});
		wx.showOptionMenu();
	});
	
	// 点击标签切换	
	var loadList = 0;
	$('.subj-tag li').on('click',function() {
		var nowIndex = $(this).index();
		if( loadList == 0 ) {
			showList('.subj-cot-new','2');	
			loadList = 1;
		}
		$('.subj-cot-box').removeClass('active');
		$('.subj-cot-box').eq(nowIndex).addClass('active');
		$('.subj-tag li').removeClass('active');
		$(this).addClass('active');
		if(nowIndex == 0) {
			$('.subj-tag i').css('left','0');
		}else {
			$('.subj-tag i').css('left','80px');
		}		
	});
	
	
	//点击固定底部链接
	$('#my-share-subject').on('click',function() {
		window.location = '/wmp/user/' + appConfigId + '/innovation/project/support/list?t=' + Math.random();
	});
	
	$('#enter-subject').on('click',function() {
		window.location = '/wmp/user/' + appConfigId + '/innovation/project/index?t=' + Math.random();
	});
		
	// 左可滑动
	$('.team-list ul').each(function(index) {
		var ulWidth = 145*($(this).children('li').length);
        $(this).css('width',ulWidth);
    });
	
	// 默认载入人气项目列表
	if( $('.subj-tag').length ) {		
		showList('.subj-cot-top','1');				
	}
	
	// 项目列表点击展开全部事件	
	var subjInfoHeight = $('.subj-info').height();
	if( subjInfoHeight >= 300) {
		$('.subj-info').css('height','295px');
	}else{
		$('a.btn-unfolded').hide();
	}	
	$('a.btn-unfolded').on('click',function() {	
		$('.subj-info').css('height',subjInfoHeight);	
		$('a.btn-unfolded').hide();
	});
	
	// 投票支持事件
	var voteFlag = 1;
	$('.btn-orange').on('click',function() {	
		var projectId = getUrlParam('projectId',SHARE_CONFIG.link.split('?')[1]);
		//console.log(projectId);
		wAjax({
			url: '/wmp/user/'+appConfigId+'/innovation/project/vote',
			type: 'post',
			data: {
				projectId:projectId
			},
			success: function(rs){
				rs = JSON.parse(rs);				
				//console.log(rs);
				if( rs.code == 0 ) {
					//console.log('rs.code = ' + rs.code + ' 提交成功');	
					$('.mask').css({
						'height':'100%',
						'opacity':'1'
					});
					$('.vote-mini').css({
						'top':'61px',

						'opacity':'1'
					});	
					$('.btn-orange').text('已完成投票').addClass('btn-gray');
					$('.btn-orange').on('click',function() {
						return false;
					});			
				}else if( rs.code == 1 ) {
					//console.log('rs.code = ' + rs.code + ' 已经投票或助力');
					$('.mask').css({
						'height':'100%',
						'opacity':'1'
					});
					$('.vote-mini').css({
						'top':'61px',
						'opacity':'1'
					});		
				}else if( rs.code == 2 && voteFlag == 1) {
					//console.log('rs.code = ' + rs.code + ' 投票数已达3次');						
					if(confirm('每人最多可投票三个项目！\n但您仍可以通过微信右上角分享项目为其助力，赢取伯乐奖。')){
						//按确认后做什么
						//console.log('杯子');
						voteFlag = 0;
					}else {
						//按否做些什么
						//console.log('否杯子');
						return false;
					}	
												
				}else {
					return false;
				}
			},
			error: function(obj) {
			},
			generalError: function(obj) {
			}
		});
	});
	
	// 遮罩层事件
	$('.mask').on('click',function() {
		$('.mask').css({
			'height':'0',
			'opacity':'0'
		});
		$('.vote-mini').css({
			'top':'-280px',
			'opacity':'0'
		});
	});
	
	// 分享助力事件
	$('a.btn-blue[data-type="2"]').on('click',function() {
		$('.vote-mini-bg h2').hide();
		$('.vote-mini p').html('分享项目为其助力<br>即有机会共享万元伯乐奖。');
		$('.vote-mini p').css('padding-top','50px');
		$('.mask').css({
			'height':'100%',
			'opacity':'1'
		});
		$('.vote-mini').css({
			'top':'61px',
			'opacity':'1'
		});
	});
	
	// 滚动加载
	function showList(boxID,typeValue) {
		isloading = true;
		if($(boxID).find('.loading').size() == 0){
            $(boxID).append('<div class="loading"></div>');
        }else{
            return false;
        }
		$.ajax({
			url: '/wmp/user/'+appConfigId+'/innovation/project/list',
			type:'post',
			data: {
				type:typeValue,
				page:1
			},
			success:function(rs){
				$(boxID).append(rs);
				var currentpage = $(boxID+ ' .subj-cot').attr('data-page-num');
				var hasmore = $(boxID+ ' .subj-cot').attr('data-has-more');
				var isloading = false;
				if(hasmore == 'yes') {
					$(boxID+ ' .subj-cot:last-child').on('touchmove',function(){
						var win_h = $(window).height(),
							body_h = $('body').height(),
							scroll_h = document.body.scrollTop;
						if($(window).scrollTop()>=$(document).height()-$(window).height()){
							currentpage++;
							$(boxID+ ' .subj-cot').attr('data-page-num',currentpage);
							var data = {
								type:typeValue,
								'page':currentpage};
							if(isloading == false) {
								loadCon(boxID,{
									url: '/wmp/user/'+appConfigId+'/innovation/project/list',
									sendData:data
								});							
							}
						}
					});
				}else {
					return false;
				}
			},
			complete:function(){
				if($(boxID).find('.loading').size() == 1){
					$(boxID).find('.loading').remove();
				}
				isloading = false;
			}
		});		
	}
	
	// 载入列表
	function loadCon(boxID,ops){
		isloading = true;
		if($(boxID).find('.loading').size() == 0){
            $(boxID).append('<div class="loading"></div>');
        }else{
            return false;
        }
		wAjax({
			url:ops.url,
			data:ops.sendData,
			success:function(rs){
				$(boxID).append(rs);
				hasmore = $(boxID + ' .subj-cot').attr('data-has-more');
				isloading = false;
			},
			complete:function(){
				if($(boxID).find('.loading').size() == 1){
					$(boxID).find('.loading').remove();
				}
				isloading = false;
			}
		});
	}	
	
	// 分享之后
	function shareAfter() {
		setTimeout(function(){
			$('.mask').css({
				'height':'0',
				'opacity':'0'
			});
			$('.vote-mini').css({
				'top':'-280px',
				'opacity':'0'
			});
		 },100);
		 
		 // 判断是否关注
		if( $('a.btn-blue[data-type="2"]').length && $('a.btn-orange[data-type="1"]').length ) {
           shartInfo();
		}
	}
	
	function shartInfo() {
		var projectId = getUrlParam('projectId',SHARE_CONFIG.link.split('?')[1]);
		wAjax({
			url: '/wmp/user/'+appConfigId+'/innovation/project/share',
			type: 'post',
			data: {
				projectId:projectId
			},
			success: function(rs){
				rs = JSON.parse(rs);
				if( rs.code == 0 ) {
					console.log('rs.code = ' + rs.code + ' 已关注');
					window.location = '/wmp/user/' + appConfigId + '/innovation/project/detail?projectId='+projectId+'&showTips=1';
				}else if( rs.code == -1 ) {
					console.log('rs.code = ' + rs.code + ' 未关注');
					window.location = '/wmp/user/' + appConfigId + '/innovation/project/follow/guide';	
					/*wx.ready(function(){
						wx.hideOptionMenu();
					});*/
				}else {
					return false;
				}
			},
			error: function(obj) {
			},
			generalError: function(obj) {
			}
		});
	}
	
	// 截取URL参数方法
	function getUrlParam(name,str) {
		var url = str||window.location.search.substr(1);
		if (!url) {
			return null;
		}
		url = decodeURI(url);
		if (name) {
			var value = new RegExp('(?:^|&)' + name + '=([^&]*)(&|$)', 'g').exec(url);
			return value && window.decodeURIComponent(value[1]) || '';
		}
		var result = {};
		var reg = /(?:^|&)([^&=]+)=([^&]*)(?=(&|$))/g;
		var item;
		while (item = reg.exec(url)) {
			result[item[1]] = window.decodeURIComponent(item[2]);
		}
		return result;
	  }	
});
