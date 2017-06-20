require(['jquery','modules/net/wAjax','wxapi','modules/ui/wx-plugin/autoMoveUp'],function($,wAjax,wx){
	wx.config($.extend({
		debug: DEBUG,
		jsApiList: []
	},WXCONFIG));	

	wx.ready(function(){
		wx.hideOptionMenu();
	});

	var $submitBtn = $('#submit-btn');

	$.fn.selectStyleAtuoChange = function(){		
		var $this = $(this); 
		$this.removeClass("select-default");
		if($this.val() == 0) {
			$this.addClass("select-default");
		}
	}	

	$("select").selectStyleAtuoChange();

	$("select").on("change", function(){
		$(this).selectStyleAtuoChange();
	});
	
	function updateCityAvailable() {
		if($('#province-sel').val() == 0) {
			$('#city-sel').attr('disabled',true);
		}
		else {	
			$('#city-sel').removeAttr('disabled');
		}
	}
	
	//setTimeout(function(){
		updateCityAvailable();
		initLocation.call($('[name="province"]'));
	//},300);
	
	$('[name="province"]').change(initLocation);


	function initLocation(){
		var $this = $(this);
		var provinceId = $this.val();
		if(provinceId == '0') {
			drawSelect({});	
			return;
		}
		wAjax({
			url: '/wmp/tool/dict/city?id='+provinceId,
			type: 'get',
			success: function(obj) {
				drawSelect(obj['data']);
			}
		});
	}

	function drawSelect(data) {
		var $container = $('#city-sel');
		var idSel = $('#city-sel').data('cityId');
		var $optTpl = $('<option value="0">常驻城市</option>');
		$container.empty().append($optTpl);
		for(var key in data) {
			var $tmp = $optTpl.clone();
			$tmp.attr('value',key);
			$tmp.html(data[key]['value']);
			if( key == idSel ) {
				$tmp.attr('selected','');
			}
			$container.append($tmp);
		}
		$container.selectStyleAtuoChange();
		updateCityAvailable();
	}

	//submit is enabled
	function submit_status(){
		if($('select[name="province"]').val() == 0 || $('select[name="city"]').val() == 0 || $('select[name="industry"]').val() == 0){
			$submitBtn.attr('disabled',true);
		}else{
			$submitBtn.removeAttr('disabled');
		}
	}
	submit_status();

	setInterval(function(){
		submit_status();
	},1000);

	//submit
	$('.container').on('click','#submit-btn:not([disabled])',function(){
		//clear localStorage
		window.localStorage.clear();
		//trim
		$('input[type="text"]').each(function(){
			var txt = $.trim($(this).val());
			$(this).val(txt);
		});	
		var postObj = {};
		$('[name]').each(function(){
			//if($(this).val()){
				var $this = $(this);
				postObj[$this.attr('name')] = $.trim($this.val());
			//}
		});
		wAjax({
			url: '/wmp/user/'+appConfigId+'/personal/drip/save',
			type: 'get',
			data:{jsonStr: JSON.stringify(postObj)},
			success: function(obj){
				var newUrl = obj['data'];
                var sep = '?';
                if (newUrl.indexOf('?') > -1) {
                    sep = '&';
                }
                var timestamp = Date.parse(new Date());
                newUrl = newUrl + sep + 'timestamp=' + timestamp;
                window.location.href = newUrl;
			}
		});
	});

	//localStorage save input value
	function saveForm(){
		var obj;
		if(!window.localStorage.formData){
			obj = {};
			window.localStorage.setItem('formData',JSON.stringify(obj));
		}else{
			var objstr = window.localStorage.getItem('formData');
			obj = jQuery.parseJSON(objstr);
		}
		//input[type="text"]
		$('input[type="text"]').each(function(){
			$(this).on('input',function(){
				var key = $(this).attr('name'),
					val = $(this).val();
				obj[key] = val;
				var objstr = JSON.stringify(obj);
				window.localStorage.setItem('formData',objstr);
			});
		});
		//select
		$('select').each(function(){
			$(this).on('change',function(){
				var key = $(this).attr('name'),
					val = $(this).val();
				obj[key] = val;
				var objstr = JSON.stringify(obj);
				window.localStorage.setItem('formData',objstr);
			});
		});
	}
	saveForm();
	//init
	function initGetFormData(){
		var objstr = window.localStorage.getItem('formData');
		var obj = jQuery.parseJSON(objstr);
		if(obj){
			for(var k in obj){
				$('input[type="text"][name="'+k+'"]').val(obj[k]);
				$('select[name="'+k+'"]').find('option[value="'+obj[k]+'"]').attr('selected',true);
			}
		}else{

		}
	}
	initGetFormData();
});
