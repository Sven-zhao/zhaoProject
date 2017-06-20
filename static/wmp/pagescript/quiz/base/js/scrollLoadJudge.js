define(['jquery','pagescript/quiz/base/js/wAjax'],function($,wAjax){
	function scrollLoadJudge(settings){
		var url = settings.url,
			sendData = settings.sendData,
			box = settings.box,
			initPage = settings.initPage,
			isloading = false,
			hasmore = settings.hasmore,
			page = 1;
		function loadCon(ops){
			isloading = true;
			box.append('<div class="loading"></div>');
			wAjax({
				url:ops.url,
				data:ops.sendData,
				success:function(rs){
					box.append(rs);
					hasmore = $('input[name="page"][value="'+page+'"]').prev($('input[name="hasMore"]')).val() || 'no';
				},
				complete:function(){
					if(box.find('.loading').size() == 1){
						box.find('.loading').remove();
					}
					isloading = false;
				}
			});
		}
		//默认显示第一页
		if(initPage){
			page = initPage;
			var data = $.extend({},sendData,{'page':page});
			loadCon({
				url:url,
				sendData:data
			});
		}
		$(window).on('scroll touchmove',function(){
			var win_h = $(window).height(),
				body_h = $('body').height(),
				scroll_h = document.body.scrollTop,
				fix_h = $('.fix').height();
			if((win_h+scroll_h >= 0.5*body_h) && (body_h >= win_h) && !isloading && hasmore == 'yes'){
				page++;
				var data = $.extend({},sendData,{'page':page});
				loadCon({
					url:url,
					sendData:data
				});
			}
		});
	}
	return scrollLoadJudge;
});