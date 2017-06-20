require(['jquery','modules/net/uploader','modules/net/wAjax','pagescript/innovation/base/js/logout','jquery/browser'],function($,FileUploader,ajax,logouter){
	
	var browser = $.browser.name;
	logouter.init({
		needConfirm: true,
		msg:'您尚未完成项目发布，确定要离开当前页面吗？',
		onConfirm: function() {
			window.onbeforeunload = null;
		},
		onCancel: function() {
			window.onbeforeunload = function(){
				return '您尚未完成项目发布';
			};
		}
	});
	var UPLOAD_URL = '/wmp/tool/file/upload',
		FILE_UPLOAD_MAX_BYTES = 2 * 1024 * 1024;
	//'/wmp/innovation/file/upload'
	var logoUploader = new FileUploader({
		url: UPLOAD_URL,
		maxBytes: FILE_UPLOAD_MAX_BYTES,
		accept: '.jpg,.jpeg,.png',
		maxBytesMsg: '请添加小于2MB的JPG/PNG格式文件',
		before: function(){
			$('.logo-placeholder .loading').addClass('show');
		},
		success: function(obj) {
			var data = obj['data'];
			$('.logo-placeholder .loading').removeClass('show');
			$('.logo-placeholder').css('background-image','url("'+data +'")').siblings(':hidden').val(data );
		}
	});

	var idCardUploader = new FileUploader({
		url: UPLOAD_URL,
		accept: '.jpg,.jpeg,.png',
		maxBytes: FILE_UPLOAD_MAX_BYTES,
		maxBytesMsg: '请添加小于2MB的JPG/PNG格式文件',
		before: function(){
			$('.id-card .loading').addClass('show');
		},
		success: function(obj) {
			$('.id-card .loading').removeClass('show');
			var data = obj['data'];
			$('.id-card').css('background-image','url("'+data+'")').siblings(':hidden').val(data );
		}
	});

	var bpUploader = new FileUploader({
		url: UPLOAD_URL,
		maxBytes: FILE_UPLOAD_MAX_BYTES,
		maxBytesMsg: '请添加小于2MB的PDF格式文件',
		accept: '.pdf',
		before: function() {
			$('.bp-placeholder').removeClass('loaded');
			$('.bp-placeholder .loading').addClass('show');
		},
		success: function(obj) {
			$('.bp-placeholder .loading').removeClass('show');
			$('.bp-placeholder').addClass('loaded').siblings(':hidden').val(obj['data']);
		}
	});

	$('.bp-upload-btn').on('click',function(){
		bpUploader.start();
	});	

	$('.logo-upload-btn').on('click',function(){
		logoUploader.start();
	});	

	$('.id-card-upload-btn').on('click',function(){
		idCardUploader.start();
	});

	$('.nav a').on('click',function(evt){
		evt.preventDefault();
		var $target = $($(this).attr('href'));
		$('.nav a.active').removeClass('active');
		$(this).addClass('active');
		var selector;
		if(browser == 'mozilla') {
			selector = 'html';
		} else {
			selector = 'body';
		}
		$(selector).animate({
			scrollTop: $target.offset().top - 140
		},1000);		
	});

	var MEMBER_ADD_MAX = 9;
	var curAddedMember = 0;
	$('.content').on('click','.add-member-btn',function(){
		var $this = $(this);
		var $curMember = $this.parents('.member');
		var $newMember = $curMember.clone();
		$newMember.find('input').val('');
		$this.remove();
		if(++curAddedMember >= MEMBER_ADD_MAX) {
			$newMember.find('.add-member-btn').remove();
		}
		$curMember.after($newMember);
	});

	$('#province').on('change',function(){
		var $city = $('#city');
		var $this = $(this);
		$city.attr('disabled','disabled');
		if( $this.val() == '') {
			$city.html('<option value="">请选择</option>');
			return;
		}
		ajax({
			url: '/wmp/innovation/logged/getCityByPId',
			type: 'get',
			data: {
				pId: $this.val()
			},
			success: function(obj) {
				var data = obj['data'];
				var optArr = ['<option value="">请选择</option>'];
				for(var key in data) {
					var $ele = $('<option value="'+key+'">'+data[key]['value']+'</option>');
					optArr.push($ele);
				}	
				$city.html(optArr);
				$city.removeAttr('disabled');
			}

		});
	});

	function gatherFormData() {
		var reg = /^\s*|\s*$/g;
		var data = {};
		var dictArr = [];
		$('[name="dictArea"]:checkbox:checked').each(function(){
			dictArr.push($(this).val());	
		});
		var intentionStrArr = [];
		$('[name="intentionStr"]:checkbox:checked').each(function(){
			intentionStrArr.push($(this).val());	
		});
		var members = [];
		$('.member').each(function(){
			var $this = $(this);
			members.push({
				userName: $this.find('[data-name="userName"]').val().replace(reg,''),
			   	position: $this.find('[data-name="position"]').val().replace(reg,'')	
			});
		});
		data['teamMember'] = JSON.stringify(members);
		var locationArr = [];
		$('[name="location"]').each(function(){
			locationArr.push($(this).val());
		});
		data['location'] = locationArr.toString();
		data['dictArea'] = dictArr.toString();
		data['intentionStr'] = intentionStrArr.toString();
		$(':text:not(.member input),textarea,select:not([name="location"]),input[type="hidden"]').each(function(){
			var $this = $(this);
			data[$this.attr('name')] = $this.val().replace(reg,'');
		});
		console.log(data);
		return data;
	}
	
	$('body').on('click','.submit-btn.active',function(){
		gatherFormData();
		ajax({
			url: '/wmp/innovation/logged/addItem',
			type: 'post',
			data: gatherFormData(),
			success: function(obj) {
				window.history.replaceState(null,null,'/pcinnovation/2/landing');
				window.location.href=obj['data'];
			}
		});
	});

	setInterval(function(){
		var $submitBtn = $('.submit-btn');
		if(verify()) {
			$submitBtn.addClass('active');
			window.onbeforeunload = null;
		} else {
			$submitBtn.removeClass('active');
			window.onbeforeunload = function(){
				return '您尚未完成项目发布';
			};
		}
	},500);

	/*
	$('.control-item.required :input,.control-item.required select').on('change',function(){
		var $submitBtn = $('.submit-btn');
		if(verify()) {
			$submitBtn.addClass('active');
		} else {
			$submitBtn.removeClass('active');
		}
	});
	*/

	window.onbeforeunload = function(){
			return '您尚未完成项目发布';
	};

	function verify() {
		var pass = true;

		$('.control-item:not(.user).required :input:not(:checkbox)').each(function(){
			var $this = $(this);
			if($.trim($this.val()).length == 0) {
				pass = false;
				return false;
			}
		});

		if(!pass) {
			return pass;
		}

		if($('.control-item.checkbox :checkbox:checked').length == 0) {
			pass = false;
			return pass;
		}

		$('.control-item.required select').each(function() {
			var $this = $(this);
			if($this.val() == '') {
				pass = false;
				return false;
			}	
		});
		if(!pass) {
			return pass;
		}
		
		var memberFullFillCount = 0;
		var memberHalfFillCount = 0;
		$('.member').each(function(){
			var $this = $(this);	
			var name = $.trim($this.find('[data-name="userName"]').val());	
			var pos = $.trim($this.find('[data-name="position"]').val());	
			if( name.length == 0 && pos.length == 0) {
			} else if(name.length > 0 && pos.length > 0) {
				memberFullFillCount++; 
			} else {
				memberHalfFillCount++;
			}
		});
		if(memberFullFillCount >=1 && memberHalfFillCount == 0) {
			pass = true;
		} else {
			pass = false;
		}
		return pass;
	}
});
