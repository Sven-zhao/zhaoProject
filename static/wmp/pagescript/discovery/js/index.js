require(['jquery','common/jquery-plugins/fastclick','wxapi','pagescript/quiz/base/js/wAjax'],function($,fastclick,wx,wAjax){
	// init
    (function(){
        fastclick.attach(document.body);
    })();  
	
	wAjax({
		url: '/wmp/user/'+appConfigId+'/channel/show/currActivies',
		type: 'get',
		data: {
		},
		success: function(rs) {	
			var json_rs = $.parseJSON((rs));
			var data = $.parseJSON(json_rs.data)
			if( json_rs.code == 0 ) {
				for( var i=0; i<data.length; i++) {
					//console.log(data);
					var tit = '';
					var friend = '';
					if( data[i].type == 0 ) {
						tit = '<h4 class="personage">' + data[i].title + '</h4>'
					}else {
						tit = '<h4>' + data[i].title + '</h4>'
					} 
					console.log(data[i].friend);
					if( data[i].signedCount == 0 ) {
						friend = ''
					}else {
						if( data[i].friend == '' ) {
							friend = '<p class="tip-peo">' + data[i].signedCount + '人已报名</p>';
						}else {
							friend = '<p class="tip-peo">好友<em>' +data[i].friend + '</em>等' + data[i].signedCount + '人已报名</p>';
						}						
					}
					var str = 
						'<li class="pr"><a href="zhisland://com.zhisland/event/' + data[i].id + '">' + 
						tit +
						'<p class="tip-time"><span>' + data[i].period + '</span></p>' +
						friend +
						'<div class="img-pa" style="background-image: url(' + data[i].imgUrl + ')"></div>' +
						'</a>';
					$('.activity-list ul').append(str);
				}
			}else{
				alert('网络繁忙，请稍后再试。');
			}
		},
		error: function(rs) {					
		}
	});	
});
