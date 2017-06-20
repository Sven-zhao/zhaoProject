require(['jquery','jquery-hammer','common/jquery-plugins/jquery.dotdotdot'],function($){	
	
	//define the var
	var $guestGroup = $('.guest-group');
    var $seeMore = $('.desc .see-more');
    var $appFooter = $('.app-footer');

    var $eventDesc = $('.desc .text');

    var guestLen = $('.guest',$guestGroup).length;
    var GUESTWIDTH = 140;
    var index = 0;
    var rootContainerWidth = $('.guest-board').width();
    var lengthOfBlock = parseInt(rootContainerWidth/GUESTWIDTH);

    //init
    (function(){

        window.isIOS = (/iphone|ipad/gi).test(navigator.userAgent);
        window.isAndroid = navigator.userAgent.toLowerCase().indexOf("android") != -1;

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

    /*
     * 轮播图
     */
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


     $seeMore.on('click',function(){
        $eventDesc.trigger("destroy");
        $seeMore.hide();
     });

     $appFooter.on('click',function(){
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

        if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
            window.setTimeout(function() {
                window.location.href = downloadPageURL;
            },60000);
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
});
