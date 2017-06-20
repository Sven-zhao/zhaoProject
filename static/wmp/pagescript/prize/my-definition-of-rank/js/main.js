require(['jquery','pagescript/prize/base/js/wxshare'],function($) {
	$('.nominate').on('click','tbody tr',function() {
		window.location.href = $(this).attr('data-url'); 
	});
});
