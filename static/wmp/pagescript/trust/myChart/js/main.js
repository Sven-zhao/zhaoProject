require(['jquery','chart','wxapi','modules/net/wAjax','common/jquery-plugins/jquery.browser.min','pagescript/trust/base/js/appShare'],function($,Chart,wx,ajax) {
	//app分享后操作
	(function(exports){
		exports.appShareFinish = function (data){
			$('.share-layer').removeClass('show');
			if(data.channel == 11){
				$('#share-friend').addClass('show');
			}else if (data.channel == 10){
				$('#share-circle').addClass('show');
			}

			if(data.channel){//channel 11朋友圈 10朋友
				exports.sendShareStatistics(12-data.channel);
			}

			$('#first-share').on('click',function(){
				$(this).removeClass('show');
			});
		}
	})(window);


	wx.config($.extend({
        debug: DEBUG,
        jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage']
    },WXCONFIG));
    wx.ready(function(){
        //朋友圈
        wx.onMenuShareTimeline({
			title:SHARE_TIMELINE_CONFIG.title ? SHARE_TIMELINE_CONFIG.title : SHARE_CONFIG.title ,
            link: SHARE_TIMELINE_CONFIG.link ? SHARE_TIMELINE_CONFIG.link: SHARE_CONFIG.link, // 分享链接
            imgUrl: SHARE_TIMELINE_CONFIG.imgUrl? SHARE_TIMELINE_CONFIG.imgUrl: SHARE_CONFIG.imgUrl, // 分享图标
            success: function () {
				$('.share-layer:visible').removeClass('show');
				$('#share-friend').addClass('show');
				sendShareStatistics(1);
				$.get('http://s.zhisland.com/share.gif?r='+Math.random()+'&pj=wmp&oid='+oid+'&module=trust&s_url='+encodeURIComponent(window.location.href)+'&scope=shareTimeline');
            },
            cancel: function () {
				$('.share-layer:visible .bottom-tip.normal').hide();
				$('.share-layer:visible .bottom-tip.canceled').show();
            }
        });
        //朋友
        wx.onMenuShareAppMessage({
            title: SHARE_CONFIG.title,
            link: SHARE_CONFIG.link, // 分享链接
            imgUrl: SHARE_CONFIG.imgUrl, // 分享图标
            desc: SHARE_CONFIG.desc, // 分享描述
            success: function () {
				$('.share-layer:visible').removeClass('show');
				$('#share-circle').addClass('show');
				sendShareStatistics(2);
				$.get('http://s.zhisland.com/share.gif?r='+Math.random()+'&pj=wmp&oid='+oid+'&module=trust&s_url='+encodeURIComponent(window.location.href)+'&scope=shareAppMessage');
            },
            cancel: function () {
				$('.share-layer:visible .bottom-tip.normal').hide();
				$('.share-layer:visible .bottom-tip.canceled').show();
            }
        });
        wx.showOptionMenu();
    });

	window.sendShareStatistics = function(type) {

		ajax({
			url: $('#addShareUrl').val(),
			type: 'post',
			data: {
				unionId: $('#unionId').val(),
				shareType: type
			}
		});
	}

	var $radarContainer = $('.chart-container');
	var labels = $radarContainer.attr('data-radar-name').split(',');
	var datas = $radarContainer.attr('data-mine').split(',').map(function(a){ return Number(a);});
	var ctx = document.getElementById('rad');
	var rada = new Chart(ctx, {
		type: 'radar',
		data: {
			labels: labels,
			datasets: [
		        {
		            backgroundColor: "transparent",
		            borderColor: "#56abe4",
		            pointBackgroundColor: "transparent",
		            pointBorderColor: "transparent",
		            pointHoverBackgroundColor: "#fff",
		            pointHoverBorderColor: "rgba(179,181,198,1)",
		            data: datas
				},
			]
		},
		options: {
			responsive: false,
			legend: {
				display: false
			},
			scale: {
				ticks: {
					min: 0,
					max: 20,
					display: false
				}
		    },
			pointLabels: {
				fontColor: 'transparent'
			}
		}
	});

	if($.browser.android) {
		$('.share-layer').addClass('android');
	}

	var $shareFriendTime = $('#shareFriendTimes');
	var $shareCircleTime = $('#shareFriendCircleTimes');

	$('#btn-analyze-friends').on('click',function(){
		var ftime = $shareFriendTime.val();
		var ctime = $shareCircleTime.val();
		$('.share-layer:visible .bottom-tip.normal').show();
		$('.share-layer:visible .bottom-tip.canceled').hide();
		if(ftime == '0' && ctime == '0') {
			$('#first-share').addClass('show');
		} else if (ftime == '0') {
			$('#share-friend').addClass('show');
		} else if(ctime == '0') {
			$('#share-circle').addClass('show');
		} else {
			if(Math.random() > 0.5) {
				$('#share-friend').addClass('show');
			} else {
				$('#share-circle').addClass('show');
			}
		}
	});
});
