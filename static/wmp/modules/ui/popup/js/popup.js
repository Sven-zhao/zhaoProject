define(['jquery'],function($) {
	var Popup = function(settings){

		var _$popup = settings.$popup || $('.popup');

		var show = function(){			
			_$popup.show();		
		}
		var hide = function(){	
			_$popup.hide();			
		}

		this.show = show;
		this.hide = hide;

		_$popup.on('click','.btn-cancel',function(){
			hide();
			settings.cancel&&settings.cancel();
		});
		_$popup.on('click','.btn-confirm',function(){
			hide();
			settings.confirm&&settings.confirm();
		});
	}

	return Popup;
});