require(['jquery','pagescript/prize/base/js/share-prompt'],function($,sharePrompt) {
	$('.share-btn').on('click',function() {
		sharePrompt.show();
	});
});
