require(['jquery','modules/net/wAjax','modules/ui/popup/js/popup','modules/ui/showMsg/js/main','wxapi','modules/ui/carousel/js/main','jquery-hammer','common/jquery-plugins/jquery.dotdotdot'],function($,wAjax,Popup,showMsg,wx,Carousel){	
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
				$.get('/static/wmp/common/stat1.gif');
            },
            cancel: function () { 
            }
        });
        //朋友
        wx.onMenuShareAppMessage({
            title: SHARE_CONFIG.title,
            link: SHARE_CONFIG.link, // 分享链接
            imgUrl: SHARE_CONFIG.imgUrl, // 分享图标
            desc: SHARE_CONFIG.desc, // 分享描述
            success: function () {
				$.get('/static/wmp/common/stat2.gif');
            },
            cancel: function () {
            }
        });
        wx.showOptionMenu();
    });

	/*
	 * 轮播图
	 */
	var clientWidth =  $(window).width();
	$('#swipterView .swiper-slide').css('height',clientWidth/4*3);
	if( $('.swiper-slide').length > 1 ) {
		var swiper = new Swiper('.swiper-container', {
			pagination: '.swiper-pagination',
			paginationClickable: true,
			spaceBetween: 30,
			centeredSlides: true,
			autoplay: 2500,
			loop : true,
			autoplayDisableOnInteraction: false
		});	
	}   
	
	
	var headerCarousel = new Carousel({
		$dom:$('.carousel'),
		interval: 5000,
		duration: 800 
	});
	headerCarousel.play();

	var likedPop = new Popup({
		$popup: $('#like-success')
	});

	$('.more-event a').on('click',function(){
		window.location.href = '/wmp/user/'+appConfigId+'/activity/list?r='+Math.random();
	});



	$('.footer').on('click','.btn-like:not([disabled])',function(){
		if(uid == 0 || completeInfo == 'false') {
			window.location.href = registUrl;
			return;
		}
		var $this = $(this);
		$this.attr('disabled','');
		wAjax({
			url: '/wmp/user/'+appConfigId+'/activity/favorActivity',
			type: 'post',
			data: {id:aid},
			success: function(obj) {
				$this.text('已喜欢');
				var storage = window.localStorage;
				if(storage.getItem('liked') == "1") {
					showMsg({
						type: 'prompt',
						msg:'已记录您的喜好'
					});
				} else {
					likedPop.show();
					storage.setItem('liked','1');
				}
			},
			error: function(obj) {
				$this.removeAttr('disabled');
		    }
		});
	});

	//define the var
	var $guestGroup = $('.guest-group');
    var $seeMore = $('.desc .see-more');
    var $download = $('.download-banner');

    var $eventDesc = $('.desc .text');

    var guestLen = $('.guest',$guestGroup).length;
    var GUESTWIDTH = 140;
    var index = 0;
    var rootContainerWidth = $('.guest-board').width();
    var lengthOfBlock = parseInt(rootContainerWidth/GUESTWIDTH);

    //init
    (function(){
        $eventDesc.dotdotdot({
            height: 200,
            callback: function(isTruncated, orgContent ) {
                if(isTruncated) {
                    $seeMore.show();
                }
            }
        });
	    $guestGroup.css('width',GUESTWIDTH*guestLen);
	    $guestGroup.show();
	})();



    /*limit words*/
    /*$seeMore:显示更多按钮*/
    /*
    var limit = {
        options:{
            actural_txt : '',
            index_hide : 0,
            word_w : 15,
            box_w : 0,
            //每行显示几个字
            n : 0
        },
        //box:截字的容器，nLine:显示几行
        init:function(box,nLine){
            this['options']['box_w'] = Math.floor(box.width());
            this['options']['n'] = this['options']['box_w']/this['options']['word_w'];
            this.limitWords(box,nLine);
            this.event(box);
        },
        getLine:function(txt_total){
            var line = Math.ceil(txt_total/this['options']['n']);
            return line;
        },
        limitWords:function(box,nLine){
            var _self = this;
            var tag = box.find('*'),
                len = tag.length;
            $seeMore.hide();
        //没有子元素      
           if(len == 0){
                var txt = box.text(),
                    total = txt.length;
                if(total != 0){
                    this['options']['actural_txt'] = box.html();
                    this['options']['index_hide'] = 0;
                    var line = _self.getLine(total);
                    if(line > nLine){
                        var num_txt = nLine * this['options']['n'];
                        txt = txt.substr(0,num_txt);
                        box.text(txt + '...');
                        $seeMore.show();
                    }
                }
           }else{
                var cur = 0;
                $(tag).hide();
               for(var i = 0;i<len;i++){
                    $(tag[i]).show();
                    var txt = $(tag[i]).text();
                    var line = _self.getLine(txt.length);
                    var temp = cur;
                    cur += line;
                    if(cur > nLine){
                        $seeMore.show();
                        $(tag[i]).show();
                        this['options']['actural_txt'] = $(tag[i]).html();
                        this['options']['index_hide'] = i;
                        var temp_l = nLine - temp;
                        var num_txt = temp_l * this['options']['n'];
                        txt = txt.substr(0,num_txt);
                        $(tag[i]).text(txt + '...');
                        break;
                    }
               } 
           }
        },
        event:function(box){
            var _self = this;
            $seeMore.on('touchend',function(){
                var tag = box.find('*');
                $seeMore.hide();
                if(tag.length == 0){
                    box.html(_self['options']['actural_txt']).find('*').show();
                }else{
                    $(tag).show();
                    $(tag[_self['options']['index_hide']]).html(_self['options']['actural_txt']).find('*').show();
                }
            });
        }
    }
    limit.init($eventDesc,11);
    */

    //functions
    var showGuest = function(index){    	
        var newPostionLeft = -index * GUESTWIDTH;
        $guestGroup.stop(true, false).animate({ 'left': newPostionLeft}, 300);
    }

    //bind event
    $guestGroup.hammer().bind('panend',function(e){
    	//right
    	if(e.gesture.direction == 4) {
    		if(index>0) {
    			index--;
    			showGuest(index);
    		}
    	}
    	//left
    	else if(e.gesture.direction == 2) {
    		if(index<guestLen-lengthOfBlock) {
    			index++;
    			showGuest(index);
    		}
    	}
    });


     $('.btn-client').on('click',function(){
        var scheme = $(this).data('scheme');
        var host = window.location.host;
        var downloadHost = 'share.zhisland.com';
        if(host == 'test.mp.zhisland.com') {
            downloadHost = 'test.share.zhisland.com';
        }
        var downloadPageURL = 'http://' +downloadHost+ '/app/download?isAutoOpen=false';
         // var t = 1000;
         //    var t1 = Date.now();
         //    var ifr = $('<iframe id="ifr"></iframe>')
         //    ifr.attr('src', scheme);
         //    ifr.hide();
         //    $('body').append(ifr);
         //    setTimeout(function () {
         //        var t2 = Date.now();
         //        if (!t1 || t2 - t1 < t + 200) {
         //            window.location.href = "http://m.zhisland.com";
         //        }
         //    }, t);

        if (navigator.userAgent.match(/(QQ|baidu|Baidu)/i)) {
			window.location.href = downloadPageURL;
		} else if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
            window.setTimeout(function() {
                window.location.href = downloadPageURL;
            },5000);
			window.location.href = scheme;
        }
        else if (navigator.userAgent.match(/android/i)) {
            var state = null;
            try {
              state = window.open(scheme, '_blank');
            } 
            catch(e) {};
            if (state) {
                setTimeout(function(){ 
                    state.close();
                    window.location.href = downloadPageURL;
                },500);
            } else {
              //window.location = "要跳转的页面URL";
            }
        }
        else {
            window.location.href = downloadPageURL;
        }
     });


     $seeMore.on('click',function(){
        $eventDesc.trigger("destroy");
        $seeMore.hide();
     });

     $download.on('click',function(){
        var timestamp = Date.parse(new Date());
        window.location.href = "http://m.zhisland.com?uri=zhisland%3A%2F%2Fcom.zhisland%2Fevent%2F"+ aid + "&source=act_detail";
     });
	
	
	// 轮播
	if( $('.swiper-pagination span').length == 1) {
		$('.swiper-pagination span').hide();
	}
	
});
