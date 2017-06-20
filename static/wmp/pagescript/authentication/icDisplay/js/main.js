require(['jquery', 'modules/net/wAjax','wxapi'], function ($, wAjax, wx) {
	wx.config($.extend({
		debug: DEBUG,
		jsApiList: []
	},WXCONFIG));	
	wx.ready(function(){
		wx.hideOptionMenu();
	});

    var $window = $(window);
    var $html = $("html");

    $window.on("load resize", function() {
        $html.css("fontSize", $window.width() / 640 * 28 + "px");
    });

    var $mask = $('.mask');
	var $qr = $('.mask .qr');
	var $register = $('.footer .btn, .bottom-footer');

    var link2 = 'http://www.zhisland.com/data/client/android/zhisland.apk',
    link3 = 'https://itunes.apple.com/us/app/zheng-he-dao/id525751375?mt=8';

    window.isWeiXin = navigator.userAgent.toLowerCase().indexOf("micromessenger") != -1;
    window.isIOS = (/iphone|ipad/gi).test(navigator.userAgent);
    window.isAndroid = navigator.userAgent.toLowerCase().indexOf("android") != -1;

    if(isWeiXin){
        $register.on('click',function(){
            wAjax({
                url: '/wmp/user/'+appConfigId+'/isfocus?r='+Math.random(),
                type: 'get',
                success: function(obj){
                    var timestamp = Date.parse(new Date());
                    window.location.href = "/wmp/user/"+appConfigId+"/register"+'?timestamp='+timestamp;
                },
                error: function(obj) {
                    $mask.children().hide();
                    $qr.show();
                    $mask.show();
                }
            });
        });
    }else{
        if(isIOS){
            $register.on('click',function(){
                window.location.href = link3;
            });
        }else{
            $register.on('click',function(){
                window.location.href = link2;
            });
        }
    }

	$qr.on('click',function(e){
		e.stopPropagation();
	});
	$mask.on('click',function(){
		$mask.hide();
	});
});