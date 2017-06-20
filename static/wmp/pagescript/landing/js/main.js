require(['jquery','wxapi','jquery-hammer'],function($,wx){
	wx.config($.extend({
		debug: DEBUG,
		jsApiList: []
	},WXCONFIG));	
	wx.ready(function(){
		wx.hideOptionMenu();
	});

	//define the var
	var $imgContainer = $('.img-container');
	var $imgRoot = $('.img-container ul');
	var	$bulletContainer = $('.bullet-container');
	var $bullets = $('.bullet-container .bullet');

    var containerWidth = $imgContainer.width();
    var imgLen = $imgContainer.find('ul li').length;
    var index = 0;
    //init
    (function(){
	    $imgRoot.css('width',containerWidth*imgLen);
	    $imgRoot.find('img').css({'width':containerWidth,'display':'block'});
	    $bulletContainer.css('display','block');
	})();
    //functions
    var imgDisplay = function(index){    	
        var newPostionLeft = -index * containerWidth;
        $imgRoot.stop(true, false).animate({ 'left': newPostionLeft}, 300, function(){
        	$bullets.removeClass('bullet-selected');
        	$bullets.eq(index).addClass('bullet-selected');
        });
    }
    //bind event
    $imgRoot.hammer().bind('panend',function(e){
    	//right
    	if(e.gesture.direction == 4) {
    		if(index>0) {
    			index--;
    			imgDisplay(index);
    		}
    	}
    	//left
    	else if(e.gesture.direction == 2) {
    		if(index<imgLen-1) {
    			index++;
    			imgDisplay(index);
    		}
    	}
    });
});