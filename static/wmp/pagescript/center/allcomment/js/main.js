require(['jquery','modules/net/wAjax','wxapi','modules/ui/wx-plugin/autoMoveUp'],function($,wAjax,wx){
	var $submitBtn = $('#submit-btn');
	wx.config($.extend({
		debug: DEBUG,
		jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage']
	},WXCONFIG));	

	wx.ready(function(){
		//wx.hideOptionMenu();
	});

	wx.ready(function(){
        //朋友圈
        wx.onMenuShareTimeline({
            title: SHARE_CONFIG.title,
            link: SHARE_CONFIG.link, // 分享链接
            imgUrl: SHARE_CONFIG.imgUrl, // 分享图标
            success: function () { 
                //setTimeout(hideMask,100);
            },
            cancel: function () { 
                //setTimeout(hideMask,100);
            }
        });
        //朋友
        wx.onMenuShareAppMessage({
            title: SHARE_CONFIG.title,
            link: SHARE_CONFIG.link, // 分享链接
            imgUrl: SHARE_CONFIG.imgUrl, // 分享图标
            desc: SHARE_CONFIG.desc, // 分享描述
            success: function () {
               //setTimeout(hideMask,100);
            },
            cancel: function () {
                //setTimeout(hideMask,100);
            }
        });
        wx.showOptionMenu();
    });

	//ajax all comment
	var isloading = false,
		hasmore = true,
		page = 1;
	function templ(list){
		var shtml = '';
		for(var i=0,len=list.length;i<len;i++){
			var obj = list[i];
			var arr = [
				'<div class="item">',
				'	<div class="item-inner">',
				'		<div class="details">'+obj.name+'</div>',
				'		<div class="name"><span class="border"></span>张亚勤 百度公司 集团总裁</div>',
				'	</div>',
				'	<div class="time">2016-02-18</div>',
				'</div>'
			];
			shtml += arr.join('');
		}
		return shtml;
	}
	function getAjaxList(page){
		isloading = true;
		$('#comment').append('<div class="loading"></div>');
		wAjax({
			url: '/wmp/user/'+appConfigId+'/save/introduce',
			data: {page: page},
			success: function(rs){
				if(rs.totalCount == 0){
					$('.no-comment').show();
					return;
				}
				$('.no-comment').hide();
				var shtml = templ(rs.list);
				$('#comment .con').append(shtml);
				hasmore = rs.hasMore;
				if(!hasmore){
					$('#comment .con').append('<div class="no-more">— 暂无更多 —</div>');
				}
			},
			complete:function(){
				if($('#comment').find('.loading').size() == 1){
					$('#comment').find('.loading').remove();
				}
				isloading = false;
			}
		});
	}

	//init
	getAjaxList(1);
	
	//touchmove or scroll
	$(window).on('touchmove scroll',function(e){
		var win_h = $(window).height(),
			body_h = $('body').height(),
			scroll_h = document.documentElement.scrollTop || document.body.scrollTop;
		if(win_h+scroll_h >= body_h*0.5 && (body_h >= win_h) && (isloading == false) && hasmore){
			page++;
			getAjaxList(page);
		}
	});

});
