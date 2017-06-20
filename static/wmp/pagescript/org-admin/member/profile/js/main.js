require(['jquery','modules/net/wAjax','wxapi', 'modules/ui/chk-radio/js/main', 'modules/ui/num-op/js/main','pagescript/org-admin/base/userselector/js/core', 'modules/ui/popup/js/popup','modules/ui/showMsg/js/complete'],function($,wAjax,wx,ChkRadio,NumOperator,UserSelector, Popup,completeMsgBox){
	wx.config($.extend({
		debug: DEBUG,
		jsApiList: []
	},WXCONFIG));	

	wx.ready(function(){
		wx.hideOptionMenu();
	});

	var $type = $('[name=type]');
	var $uid = $('[name=uid]');
	var $orgId = $('[name=orgId]');
	var $uname = $('[name=uname]');
	var $role = $('[name=role]');
	var $weight = $('[name=weight]');
	var $badge = $('[name=badge]');

	var $submit = $('.btn#submit');

	if($type == "edit") {
		var defaultRole = $role.val() || "成员";
		$role.val($.trim(defaultRole));
	}

	var profile = {
		type: $type.val(),
		uid: $uid.val(), 
		orgId: $orgId.val(),
		uname: $uname.val(),
		role: $role.val(),
		weight: $weight.val(),
		badge: $badge.val()
	}

	$(window).on('touchstart',function(evt){
		if($(evt.target).is('input')) {
		} else {
			$('input').blur();
		}
	});



	var numOp = new NumOperator();
	numOp.init(1,30);
	numOp.initUI($('.number-operator-container'));
	numOp.setNum(profile.weight);
	numOp.bindEvent();

	var radioBadge = new ChkRadio();	
	radioBadge.initRadio($('.set-badge .radio-group'));
	radioBadge.bindRadioEvent(function(){
		updateSubmitStatus();		
	});
	radioBadge.setRadioChkecked(profile.badge);

	var $topPosition = $('.set-top .position');
	var chkTop = new ChkRadio();
	chkTop.initCheckBox($('#chk-top'));
	chkTop.bindCheckBoxEvent(function(checked){
		$topPosition[checked?'show':'hide']();
	});
	if(profile.weight == "0") {
		chkTop.setChecked(false);
		$topPosition.hide();
	}
	else{
		chkTop.setChecked(true);
		$topPosition.show();
	}

	var $badgeContainer = $('.set-badge .badge');
	var chkBadge = new ChkRadio();	
	chkBadge.initCheckBox($('#chk-badge'));
	chkBadge.bindCheckBoxEvent(function(checked){
		$badgeContainer[checked?'show':'hide']();		
		if(checked && radioBadge.getRadioChkecked() == 0) {
			radioBadge.setRadioChkecked(10);
		}
		updateSubmitStatus();
	});
	if(profile.badge == "0") {
		chkBadge.setChecked(false);
		$badgeContainer.hide();
	}
	else{
		chkBadge.setChecked(true);
		$badgeContainer.show();
	}

	var userSelector = new UserSelector({
		orgId: $orgId.val(),
		onMemberAdd: function(obj) {			
			profile.uname = obj.uname;
			$uname.val(profile.uname);
			$uname.removeClass('uname').addClass('uname');
			profile.uid = obj.uid;
			$uid.val(profile.uid);
			updateSubmitStatus();
		}
	});

	$(window).on('popstate',function(){
		userSelector.close();
	});

	$('.icon-arrow-right').on('click', function(){
		userSelector.open();
	});

	$uname.filter(function(){return $type.val() == 'create'?true:false}).on('click', function(){
		userSelector.open();
	});

	var popup = new Popup({
		confirm: function(){
			var postDate = {
				orgId: profile.orgId,
				uid: profile.uid
			}
			wAjax({
				url: '/wz/org/' + appConfigId + '/member/delete',
				type: 'post',
				data: postDate,
				success: function(obj){
	 				completeMsgBox({
					msg: '踢出成功！',
					interval: 1500,
					beforeShow: function(){
						$submit.attr('disabled','');						
					},
					callback: function(){
						redirect();
					}
				});
				}
			});
		}
	});

	function redirect() {
		var historyBackStep;
		if(window.location.hash == '#fromSearch') {
			historyBackStep = -2;
		} else {
			historyBackStep = -1;
		}
		window.history.go(historyBackStep);
	}

	$('.kick-out').on('click', function(){
		popup.show();
	});


	function vadiateInput() {
		if($uname.val() == "") {
			return false;
		}
		if(chkBadge.getChecked()) {
			if(radioBadge.getRadioChkecked() == 0) {
				return false;
			}
		}
		return true;
	}
	
	function updateSubmitStatus(){
		if(vadiateInput()){
			$submit.removeAttr('disabled');
		} else {
			$submit.attr('disabled','');
		}
	};
	updateSubmitStatus();


	$('.container').on('click', '#submit:not([disabled])',function(){
		var postDate = profile;
		postDate.role = $.trim($role.val());
		postDate.weight = chkTop.getChecked()?numOp.getNum():0;
		postDate.badge = chkBadge.getChecked()?radioBadge.getRadioChkecked():0;
		wAjax({
			url: '/wz/org/' + appConfigId + '/member/info/' + profile.type,
			type: 'post',
			data: postDate,
			success: function(obj){
 				completeMsgBox({
					msg: $type.val()=='create'?'添加成功！':'修改成功！',
					interval: 1500,
					beforeShow: function(){
						$submit.attr('disabled','');						
					},
					callback: function(){
						redirect();
					}
				});
			}
		});
	});

});	
