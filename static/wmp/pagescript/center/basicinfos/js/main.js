require(['jquery','modules/net/wAjax','wxapi','modules/ui/wx-plugin/autoMoveUp'],function($,wAjax,wx){
	var $submitBtn = $('#submit-btn');
	wx.config($.extend({
		debug: DEBUG,
		jsApiList: []
	},WXCONFIG));	

	wx.ready(function(){
		wx.hideOptionMenu();
	});

	//邮箱校验
	function checkEmail(val){
		var temp = false;
		if(val !== '' && /^[a-zA-Z0-9.]{1,}\@[a-zA-Z0-9.]{1,}$/.test(val) == false){
			$('.msg2').show();
			temp = true;
		}else{
			$('.msg2').hide();
		}
		return temp;
	}

	var $tel = $('#tel-input');
	var $districtNumber = $('.district-number select');

	(function(){
		if($districtNumber.val() == '0086') {
			$tel.attr('maxlength',11);
		}
		else {
			$tel.attr('maxlength',20);
		}
	})();

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

	function submit() {
		if(!telValidate()) {
			$('.msg1').show();
			return false;
		}
		if(hasEmpty()) {
			return false;
		}
		if(checkEmail($('input[name="email"]').val())){
			return false;
		}
		var postObj = {};
		$('[name]:visible').each(function(){
			var $this = $(this);
			postObj[$this.attr('name')] = $.trim($this.val());
		});
		postObj['gender'] = $('[name="gender"]:checked').val();
		wAjax({
			url: '/wmp/user/'+appConfigId+'/personal/save/baseinfo?template='+$('#template').val(),
			data: {
				jsonStr: JSON.stringify(postObj),
				type: $('[name="type"]').val(),
                visibility:$('#visibility').val()? $('#visibility').val():''
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
		if ($(':text:not([name="email"]),[type=tel]').filter(function(){return $.trim($(this).val()) == '';}).length > 0) {
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

	$districtNumber.on('change',function(){
		var tel_v = $tel.val();
		if($districtNumber.val() == '0086') {
			$tel.attr('maxlength',11);
			$tel.val(tel_v.substring(0,11));
		}
		else {
			$tel.attr('maxlength',20);
		}
	});

	$("input[type=tel]").on("input", function(){
		var $this = $(this);
		$this.val($this.val().replace(/[^0-9]*/g,""));
		$('.msg1').hide();
	});

	function telValidate() {
		var disNum = $('select[name=country_code_show]').val();
		var tel = $("input[name=mobile]").val();
		//common rules
		var telReg = new RegExp("^[0-9]+$");
		//rule for China cell phone number
		if(disNum == "0086") {
			telReg = new RegExp("^1[0-9]{10}$");
		}
		return telReg.test(tel);
	}
});
