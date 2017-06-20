jQuery(function($){
	function getUrl(){
		$.ajax({
			url:'/pcinnovation/landingStatus',
			type:'get',
			dataType:'json',
			cache:false,
			data:{'id':window.id},
			success:function(rs){
				isRequest = false;
				if(rs.code == 0){
					window.location.href = rs.data.url;
				}else{
					setTimeout(getUrl,3000);
				}
			},
			error:function(){
				setTimeout(getUrl,3000);
			}
		});
	}
	getUrl();
	
});