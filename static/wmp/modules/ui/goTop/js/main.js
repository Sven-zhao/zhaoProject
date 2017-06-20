define([
    'jquery'
],function($){
    var goTop = function (height) {
    	var imgbase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFIAAABSCAYAAADHLIObAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjdCODI4ODY4RDYwMDExRTU4QjNFRjBGM0U3ODA5MUFGIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjdCODI4ODY5RDYwMDExRTU4QjNFRjBGM0U3ODA5MUFGIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6N0I4Mjg4NjZENjAwMTFFNThCM0VGMEYzRTc4MDkxQUYiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6N0I4Mjg4NjdENjAwMTFFNThCM0VGMEYzRTc4MDkxQUYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz539znQAAAKD0lEQVR42uydbVBT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";
    	var $btn = $('<a href="javascript:;" id="gotopBtn"></a>');
    	$btn.css({
    		position: "fixed",
    		bottom: 125,
    		right: 15,
    		width: 40,
    		height: 40,
    		backgroundImage: ("url(" + imgbase64 + ")"),
    		backgroundSize: "100% 100%",
    		display: "none",
            zIndex: 99
    	});
    	$btn.appendTo($('body'));

        var switchHeight = height ? height : $(window).height();

    	var gotop = $btn,
    		update = function () {
    			gotop[window.pageYOffset > switchHeight ? 'show' : 'hide']();
    		};
    	gotop.click(function () {
    		$('html,body').stop().animate({
    			scrollTop: 0
    		}, {
    			duration: 500,
    			complete: function () {
    				update();
    			}
    		});
    		return false;
    	});
    	$(window).bind('scroll refreshGotop', function () {
    		update();
    	});
    	setTimeout(update, 500);
    };
    return goTop;
});
