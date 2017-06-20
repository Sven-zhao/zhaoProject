define(['jquery'],function($) {

	function ChkRadio(){

		var _$chkContainer;		

		this.initCheckBox = function($chkContainer){
			_$chkContainer = $chkContainer;		
		}	
		this.bindCheckBoxEvent = function(callBack){
			_$chkContainer.on('click', function(){
				var $this = $(this);
				var $checkBox = $(this).find('.checkbox');
				$checkBox.toggleClass('checked');
				callBack&&callBack($checkBox.hasClass('checked'));
			}); 
		}
		this.setChecked = function(isChecked){
			_$chkContainer.find('.checkbox').removeClass('checked')
			if(isChecked) {
				_$chkContainer.find('.checkbox').addClass('checked');
			}
		}
		this.getChecked = function(){
			return _$chkContainer.find('.checkbox').hasClass('checked');
		}

		var _$radioGroup;

		this.initRadio = function($radioGroup){
			_$radioGroup = $radioGroup;
			$('.radio-group').find('.radio').removeClass('checked');	
		}	
		this.bindRadioEvent = function(callBack){		
			_$radioGroup.on('click', '.radio-container',function(){
				var $this = $(this);
				var $radio = $(this).find('.radio');
				_$radioGroup.find('.radio').removeClass('checked');	
				$radio.addClass('checked');
				callBack&&callBack($radio.attr('value'));
			}); 
		}
		this.setRadioChkecked = function(value) {
			_$radioGroup.find('.radio').removeClass('checked');	
			_$radioGroup.find(".radio[value=" + value + "]").addClass('checked');
		}
		this.getRadioChkecked = function(){
			if(_$radioGroup.find('.radio.checked').length == 0)return 0;
			return _$radioGroup.find('.radio.checked').attr('value');
		}
	}
	return ChkRadio;
});