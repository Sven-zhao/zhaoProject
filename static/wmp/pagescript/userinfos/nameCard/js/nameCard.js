require(['jquery', 'modules/net/wAjax', 'wxapi'], function ($, wAjax, wx) {
	wx.config($.extend({
		debug: DEBUG,
		jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage']
	},WXCONFIG));

	wx.ready(function(){
		wx.onMenuShareTimeline({
			title: SHARE_CONFIG.title, 
			link: SHARE_CONFIG.link, // 分享链接
			imgUrl: SHARE_CONFIG.imgUrl, // 分享图标
			desc: SHARE_CONFIG.desc, // 分享描述
			success: function () { 
				$('.closeEvent').hide();
			},
			cancel: function () { 
				$('.closeEvent').hide();
			}
		});

		wx.onMenuShareAppMessage({
			title: SHARE_CONFIG.title,
			link: SHARE_CONFIG.link, // 分享链接
			imgUrl: SHARE_CONFIG.imgUrl, // 分享图标
			desc: SHARE_CONFIG.desc, // 分享描述
			success: function () {
				$('.closeEvent').hide();
			},
			cancel: function () {
				$('.closeEvent').hide();
			}
		});
		wx.showOptionMenu();
	});

    var init = function () {
        initEvent();
    };

    var initEvent = function () {
        $('#editCard').on('click', editCardOnClick);
        $('#sendCard').on('click', sendCardOnClick);
        $('.closeEvent').on('click', closeEventOnClick)
        $('#changeCard').add('#createCard').on('click', changeCardOnClick)
    };

    var editCardOnClick = function(){
    	wAjax({
			url: '/wmp/user/'+appConfigId+'/isfocus?r='+Math.random(),
			type: 'get',
			success: function(obj){
				var timestamp = Date.parse(new Date());
				window.location.href = "/wmp/user/"+appConfigId+"/card/edit"+'?timestamp='+timestamp;    
			},
			error: function(obj) {
				$('.barcode-2d').add('#covered').show();
		    }
		});	
    }

	var sendCardOnClick = function () {
		$('#covered').add('#sendGuide').show();
	};
	var closeEventOnClick = function () {
		$('.closeEvent').hide();
	};
	var changeCardOnClick = function () {
		var $this = $(this);
		wAjax({
			url: '/wmp/user/'+appConfigId+'/isfocus?r='+Math.random(),
			type: 'get',
			success: function(obj){
				if ($this.hasClass('create-card')){
					 location.href = "/wmp/user/"+appConfigId+"/login";
					return false;
				};
				$('.exchange-prompt').add('#covered').show();
				$.post('/wmp/user/'+appConfigId+'/change/card',{
					key: $('[name="key"]').val()
				});
			},
			error: function(obj) {
				$('.barcode-2d').add('#covered').show();
		    }
		});
	};

    init();

	$().ready(function(){
		var timestamp = Date.parse(new Date());
		$('.image-photo').css('background-image', 'url('+$('.image-photo').data('bgImg')+'?timestamp='+timestamp+')');
	});

});
