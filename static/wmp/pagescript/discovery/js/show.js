require(['jquery','common/jquery-plugins/fastclick','wxapi','pagescript/quiz/base/js/wAjax'],function($,fastclick,wx,wAjax){
	// init
    (function(){
        fastclick.attach(document.body);
    })();
	
	wx.config($.extend({
		debug: DEBUG,
		jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage']
	},WXCONFIG));
	
	//大咖秀列表顶部点击事件
	$('.btnIsWeixn').on('click',function() {
		$('.mask').show();
		$('.download-wrap').css({
			'top':'137px',
			'opacity':'1'
		});
	});
	
	// mini-box mask click
	$('.mask').on('click',function() {
		$('.mask').hide();
		$('.download-wrap').css({
			'top':'-140px',
			'opacity':'0'
		});
	});
	
	// mini-box button download
	$('.download-wrap a').on('click',function() {
		$('.mask').hide();
		$('.download-wrap').css({
			'top':'-140px',
			'opacity':'0'
		});
		getLink(this);		
	});
	
	// 隐藏大咖啡秀列表微信分享功能
	wx.ready(function(){
		wx.hideOptionMenu();
	});
	
	function getLink(links) {	
		// getLink()在点击事件中调用 getLink(this); 即可			
		var link1 = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.zhisland.android.blog&g_f=991653',
			link2 = 'http://www.zhisland.com/data/client/android/zhisland.apk',
			link3 = 'https://itunes.apple.com/us/app/zheng-he-dao/id525751375?mt=8';
		window.isWeiXin = navigator.userAgent.toLowerCase().indexOf("micromessenger") != -1;
		window.isIOS = (/iphone|ipad/gi).test(navigator.userAgent);
		window.isAndroid = navigator.userAgent.toLowerCase().indexOf("android") != -1;
		if(isWeiXin) {
			links.href = link1;
		}else if (isIOS){
			links.href = link3;
		}else {
			links.href = link2;
		}
	}
	
	// 大咖秀列表滚动加载
	var hasmore = $("input[name='hasmore']").val();
	var isloading = false;
	var box = $('.show-list ul');
	var nowPageNum = getUrlParam().pageNo;
	function loadCon(ops){
		isloading = true;
		box.append('<div class="loading"></div>');
		wAjax({
			url:ops.url,
			data:ops.sendData,
			success:function(rs){
				nowPageNum++;
				box.append(rs);
			},
			complete:function(){
				if(box.find('.loading').size() == 1){
					box.find('.loading').remove();
				}
				isloading = false;
			}
		});
	}
	
	$(window).on('scroll touchmove',function(){
		var win_h = $(window).height(),
			body_h = $('body').height(),
			scroll_h = document.body.scrollTop,
			fix_h = $('.fix').height();		
		if((win_h+scroll_h >= 0.5*body_h) && (body_h >= win_h) && !isloading){	
			if( hasmore == 'yes') {
				hasmore = $("input[name='hasmore']:last").val();
				var data = {
					'pageNo': parseInt(nowPageNum) +1,
					'pageSize': 20
				};
				loadCon({
					url:'/wmp/user/' + appConfigId + '/channel/show/hisList',
					sendData:data
				});
			}
			
		}		
	});
	
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
