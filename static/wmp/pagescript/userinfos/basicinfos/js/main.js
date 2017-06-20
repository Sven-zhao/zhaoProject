require(['jquery','modules/net/wAjax','wxapi','modules/ui/wx-plugin/autoMoveUp'],function($,wAjax,wx){
	var $submitBtn = $('#submit-btn');
	wx.config($.extend({
		debug: DEBUG,
		jsApiList: []
	},WXCONFIG));	

	wx.ready(function(){
		wx.hideOptionMenu();
	});

	 $.fn.selectStyleAtuoChange = function(){
        var $selects = $(this);
        $selects.each(function(){
            var $this = $(this);
            $this.removeClass("select-default");
            if($this.val() == 0) {
                $this.addClass("select-default");
            }
        });
    };

	$("select").selectStyleAtuoChange();

	$("select").on("change", function(){
		$(this).selectStyleAtuoChange();
	});

	function updateCityAvailable() {
		if($('#province-sel').val() == 0) {
			$('#city-sel').attr('disabled','');
		}
		else {
			$('#city-sel').removeAttr('disabled');
		}
	}
	updateCityAvailable();

	function submit() {
		if(hasEmpty()) {
			return false;
		}
		var postObj = {};
		$('[name]:visible').each(function(){
			var $this = $(this);
			postObj[$this.attr('name')] = $.trim($this.val());
		});
		postObj['gender'] = $('[name="gender"]:checked').val();
		wAjax({
			url: '/wmp/user/'+appConfigId+'/save/baseinfo?template='+$('#template').val(),
			data: {
				jsonStr: JSON.stringify(postObj),
				type: $('[name="type"]').val()
			},
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
	}

	initLocation.call($('[name="province"]'),$('#city-sel').attr('data-city-id'));
	$('[name="province"]').change(initLocation);


	function initLocation(cityId){
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
				drawSelect(obj['data'],cityId);
			}
		});
	}

	function drawSelect(data,idSel) {
		var $container = $('#city-sel');
		var $optTpl = $('<option value="0">请选择</option>');
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

	$('.container').on('click','#submit-btn:not([disabled])',submit);

	setInterval(function(){
		if(hasEmpty()){
			$submitBtn.attr('disabled','');
		} else {
			$submitBtn.removeAttr('disabled');
		}
	},1000);

	function hasEmpty() {
		if ($('[name="gender"]:checked').val() == undefined) {
			return true;
		}
		if ($(':text').filter(function(){return $.trim($(this).val()) == '';}).length > 0) {
        	return true;
        }
		var selectVal = 1;
		$('select').each(function(){
			if($(this).val() == "0") {
				selectVal = 0;
				return false;
			}
		});
		if (selectVal == 0) {
			return true;
		}
		return false;
	}
});
