require(['jquery','pagescript/prize1/base/js/share-prompt'],function($,sharePrompt) {
	$('.share-btn').on('click',function() {
		sharePrompt.show();
	});
});
