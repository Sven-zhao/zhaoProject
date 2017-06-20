require(['jquery','modules/ui/showMsg/js/main','modules/net/wAjax','wxapi.default.config'],function($,showMsg,ajax){
	try {
		history.replaceState(null,null,document.referrer);
	} catch(e) {
	}
	var $btnWrap = $('.btn-container');
	var $submitBtn = $('#submit-btn');
	var $curEditTagInput;
	var referId = $('#referUnionId').val();
	var $confirmBtn = $('.confirm-btn');
	$('.tag-input-container').on('click','.tag-input:not([editable])',function(){
		var $this = $(this);
		$curEditTagInput = $this;
		turnTagEditMode($this);
	});

	$('#input-form').on('submit',function(evt){
		evt.preventDefault();
		turnTagFilledMode($curEditTagInput);
		$('input').blur();
	});

	// $('.tag-input input').on('blur',function(){
	// 	turnTagFilledMode($curEditTagInput);
	// });

	function simulateSubmit(evt) {
		console.log(evt);	
		var $target = $(evt.target);
		if($target.is('a.item') || $target.is('.tag-input input') || $target.is('.input-container') || $target.is('.tag-input') ) {
		} else {
			turnTagFilledMode($curEditTagInput);
		}
	}

	$('.suggests').on('click','.item',function(){
		$curEditTagInput.find('input').val($(this).html());
		turnTagFilledMode($curEditTagInput);
	});

	$('html').on('mousedown',simulateSubmit);
	$confirmBtn.on('click',simulateSubmit);

	function turnTagEditMode($curTagInput) {
		$btnWrap.hide();
		$confirmBtn.addClass('show');
		var $cur = $curTagInput;
		clearTimeout(hideSubTimeoutId);
		$cur.siblings('.tag-input').hide();	
		$cur.removeAttr('filled').attr('editable','').find('input').removeAttr('disabled');
		$cur.find('input').focus();
		var $suggests = $cur.siblings('.suggests').empty();
		$suggests.append(tagGetter.getSevenTags()).show();
		$('.tip').hide();
		$('.input-tip').show();
	}

	function checkEmpty() {
		var hasEmpty = false;
		$('.tag-input input').each(function(){
			var $this = $(this);
			if($this.val() == '') {
				hasEmpty = true;
				return;
			}	
		});
		return !hasEmpty;
	}

	function checkDuplicate($curTagInput) {
		var hasDuplicate = false;
		var curInputContent = $curTagInput.find('input').val();
		$curTagInput.siblings('.tag-input').each(function(){
			var $this = $(this);
			var inputContent = $this.find('input').val();
			if(inputContent != '' && inputContent == curInputContent) {
				hasDuplicate = true;
				return;
			} 
		});
		return !hasDuplicate;
	}

	function checkIsAllBlank($curTagInput) {
		var inputText = $curTagInput.find('input').val();
		if(/^\s*$/g.test(inputText)) {
			return false;
		} else {
			return true;
		}
	}

	function completeTest () {
		if($('.tag-input[filled]').length == 3) {
		//	$('.tip').html('这是你送给我的印象标签吗？');
		}
	}


	var tagGetter = {
		init: function() {
			this.tagObjArr = [];
			var tagArr = this.tagObjArr;
			$('.suggests .item').each(function(){
				var $this = $(this);	
				var obj = {
					weight: 0,
					$ele: $this
				};
				tagArr.push(obj);
			});
	    },
		getSevenTags: function() {
			var arr = this.tagObjArr;
			for( var index in arr ) {
				arr[index].weight = Math.random();
			}
			arr.sort(function(a,b) {
				if(a.weight > b.weight) {
					return 1;
				} else if(a.weight < b.weight) {
					return -1;
				} else {
					return 0;
				}
			});
			return arr.slice(0,7).map(function(obj){
				return obj.$ele;
			});
		}
	};

	tagGetter.init();


	var hideSubTimeoutId;
	function turnTagFilledMode($curTagInput) {
		var $cur = $curTagInput;
		if(!checkDuplicate($curTagInput)) {
			showMsg({
				type: 'prompt',
				msg: '这个词儿用过了！'
			});
			setTimeout(function(){
				$cur.focus();
			},1000);
		} else if(!checkIsAllBlank($curTagInput)) {
			showMsg({
				type: 'prompt',
				msg: '标签不能全部为空格字符'
			});
			setTimeout(function(){
				$cur.focus();
			},1000);
		} else {
			$cur.siblings('.tag-input').show();	
			$cur.removeAttr('editable').attr('filled','');
			$cur.siblings('.suggests').hide();
			$cur.find('input').attr('disabled','');
			hideSubTimeoutId = setTimeout(function(){
				$btnWrap.show();
				$confirmBtn.removeClass('show');
			});
			if(checkEmpty()) {
				$submitBtn.removeAttr('disabled');	
			}
			$('.tip').show();
			$('.input-tip').hide();
		}
		completeTest();
	}

	function gaterTagData() {
		var dataArr = [];
		$('.tag-input input').each(function(){
			dataArr.push($(this).val());
		});
		return dataArr;
	}

	var $loadingMask = $('.loading-mask');
	function submitData() {
		$loadingMask.show();
		$submitBtn.attr('disabled','');
		ajax({
			url: '/wmp/user/'+appConfigId+'/trust/answer/'+referId+'/tag',
			type: 'post',
			data: {data: JSON.stringify(gaterTagData())},
			success: function(obj) {
				window.location.href = obj['data'];
			},
			error: function(obj) {
				$submitBtn.removeAttr('disabled');
				$loadingMask.hide();
				showMsg({
					type: 'prompt',
					msg: obj['msg'] 
				});
		    }
		});	
	}
	$('body').on('click','#submit-btn:not([disabled])',submitData);
});
