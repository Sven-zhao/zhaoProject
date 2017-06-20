require(['jquery','chart','modules/net/wAjax'],function($,Chart,ajax) {

	if(eval(login) === true) {
		require(['pagescript/trust/base/js/wxshare'],function(){});
	} else {
		require(['wxapi.default.config'],function(){});
	}	

	var $radarContainer = $('.radar-container');
	var labels = $radarContainer.attr('data-radar-name').split(',');
	var dataMine = $radarContainer.attr('data-mine') ? $radarContainer.attr('data-mine').split(',').map(function(a){ return Number(a);}) : [];
	var dataFriend = $radarContainer.attr('data-friend') ? $radarContainer.attr('data-friend').split(',').map(function(a){ return Number(a);}) : [];
	var ctx = document.getElementById('rad');
	var rada = new Chart(ctx, {
		type: 'radar',
		data: {
			labels: labels ,
			datasets: [
		        {
					//label: "My First dataset",
		            backgroundColor: "transparent",
		            borderColor: "rgba(86, 171, 228,1)",
		            pointBackgroundColor: "transparent",
		            pointBorderColor: "transparent",
		            pointHoverBackgroundColor: "#fff",
		            pointHoverBorderColor: "rgba(179,181,198,1)",
					borderJoinStyle: 'round',
		            data: dataMine
		        },
		        {
					// label: "My Second dataset",
					backgroundColor: "transparent",
					borderColor: "rgba(255, 83, 100,1)",
		            pointBackgroundColor: "transparent",
		            pointBorderColor: "transparent",
					pointHoverBackgroundColor: "#fff",
					pointHoverBorderColor: "rgba(255,99,132,1)",
					borderJoinStyle: 'round',
					borderWidth: 4,
					data: dataFriend
				}
			]
		},
		options: {
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



	$('.confirm-btn,#cancel-btn').on('click',function(){
		var $this = $(this);
		var isFriend;
		if($this.hasClass('confirm-btn')) {
			isFriend = 1;
		} else {
			isFriend = 2;
		}
		ajax({
			url: '/wmp/user/'+ appConfigId +'/trust/friendConfirm',
			type: 'post',
			data: {
				unionId: unionId,
				friendUnionId : friendUnionId,
				isFriend: isFriend,
				dealNext: dealNext
			},
			success: function(obj) {
				var url = obj['data']['nextUrl'];
				if(url) {
					window.location.href = url;
				}
			}
		});
	});
});
