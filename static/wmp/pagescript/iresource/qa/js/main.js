require(['jquery', 'common/jquery-plugins/fastclick', 'wxapi', 'pagescript/quiz/base/js/wAjax','common/jquery-plugins/iscroll'], function($, fastclick, wx, wAjax) {
	// init
	(function() {
		fastclick.attach(document.body);
	})();
	wx.config($.extend({
		debug: DEBUG,
		jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage']
	}, WXCONFIG));
	
	// 去掉分享功能
	wx.ready(function() {
		wx.hideOptionMenu();
	});

	var clientHeight = document.documentElement.clientHeight;

	// 获取隐藏域值
	var userId = parseInt($("input[name='userId']").val());

	$(function() {

		//显示根据 pageId 显示当前页 并显示当前进度
		var pageId = parseInt($("input[name='pageId']").val());
		if(pageId != 0) {
			$('.qa').removeClass('active');
			$('.qa').eq(pageId - 1).addClass('active');
			$('.progress i').css('width', 100 / $('.qa').length * pageId + '%');
		}
		// 如果有跳过重新计算当前进度
		$('body').on('click',function() {
			var nowIndex = $('.qa').index($('.qa.active')) + 1;
			$('.progress i').css('width', 100 / $('.qa').length * nowIndex + '%');
		});
		
		// 初始化页面，如果是安卓“下一题”按钮不吸底
		window.isAndroid = navigator.userAgent.toLowerCase().indexOf("android") != -1;
		if (isAndroid){
			$('.btns-box').addClass('btns-box-A');
			$('.qa-cot').css('paddingBottom', '0');
		}

		// 初始化所有必填的表单项是否填写了，如果填写了则增加属性 dat
		// 初始化必填input 		
		$('.qa .need-inp').each(function(i) {
			if($(this).val() != '' && jQuery.trim($(this).val()) != $(this).attr('placeholder')) {
				$(this).attr('data', 'yes');
				$(this).attr('data-value', $(this).val());
			}
		});
		$('.qa').on('input', '.need-inp', function() {
			if($(this).val() != '' && jQuery.trim($(this).val()) != $(this).attr('placeholder') && !isNull($(this).val())) {
				$(this).attr('data', 'yes');
				$(this).attr('data-value', jQuery.trim($(this).val()));
			} else {
				if( $(this).hasClass('noInput') ) {
					$(this).removeAttr('data','yes');
					$(this).removeAttr('data-value');
				}else {
					$(this).attr('data', 'no');
				}
			}
		});

		// 初始化必填textarea
		$('.qa textarea').each(function(i) {
			if($(this).val() != '' && jQuery.trim($(this).val()) != $(this).attr('placeholder')) {
				$(this).attr('data', 'yes');
			}
		});
		$('.qa').on('input', 'textarea', function() {
			if($(this).val() != '' && jQuery.trim($(this).val()) != $(this).attr('placeholder') && !isNull($(this).val())) {
				$(this).attr('data', 'yes');
				$(this).attr('data-value', $(this).val());
			} else {
				if( $(this).hasClass('noInput') ) {
					$(this).removeAttr('data','yes');
					$(this).removeAttr('data-value');
				}else {
					$(this).attr('data', 'no');
				}				
			}
		});	

		// 初始化必填单选浮层
		$('.qa .btn-sel-one').each(function(i) {
			if($(this).text() != $(this).attr('placeholder')) {
				$(this).attr('data', 'yes');
				$(this).addClass('active');
			}
		});
		$('.qa').on('click', '.btn-sel-one', function() {
			var $qa = $(this).parents('.qa');
			$qa.find('.mask-sel-one').addClass('active');
			$qa.find('.btn-cls-mask').addClass('active');
			var $menu = $qa.find('.sel-one-cot');
			$menu.addClass('active');
			$qa.find('.sel-one-cot ul').removeClass('active').eq($qa.find('.btn-sel-one').index(this)).addClass('active');
			$(this).addClass('indexNum');			
			if(this.isc != undefined) {
				this.isc.destroy();
			} 
			this.isc = new IScroll($menu.get(0),{
				preventDefault: true, 
				preventDefaultException: {
					tagName: /^(LI)$/
				}
			});
			
		});

		$('.btn-cls-mask').on('click', function() {
			$(this).removeClass('active');
			$(this).parents().find('.mask-sel-one').removeClass('active');
			$(this).parents().find('.sel-one-cot').removeClass('active');
			$(this).parents('.qa').find('.indexNum').removeClass('indexNum');
		});

		$('.sel-one-cot').on('click', 'li', function() {
			$(this).parent().children().removeClass('active');
			$(this).addClass('active');
			$(this).parents().find('.btn-cls-mask').removeClass('active');
			$(this).parents().find('.mask-sel-one').removeClass('active');
			$(this).parents().find('.sel-one-cot').removeClass('active');
			$('.btn-sel-one').parents().find('.indexNum').text($(this).text());
			$('.btn-sel-one').parents().find('.indexNum').attr('data-value', $(this).attr('value')).attr('data', 'yes');
			$('.btn-sel-one').parents().find('.indexNum').addClass('active').removeClass('indexNum');
		});

		// 初始化必填多选浮层
		$('.qa .btn-sel-more').each(function(i) {
			$('.qa .btn-sel-more').eq(i).on('click', function() {
				$(this).parents().find('.mask-sel-more').addClass('active');
				$(this).parents().find('.btn-cls-mask').addClass('active');
				var $menu = $(this).parents().find('.sel-more-cot');
				$(this).parents().find('.sel-more-cot').addClass('active');
				$(this).parents().find('.sel-more-cot ul').removeClass('active').eq(i).addClass('active');
				$(this).addClass('indexNum');
				if(this.isc != undefined) {
					this.isc.destroy();
				} 
				this.isc = new IScroll($menu.get(0),{
					preventDefault: true, 
					preventDefaultException: {
						tagName: /^(LI)$/
					}
				});
			});
		});
		$('.sel-more-cot li').on('click', function() {
			var nowIndex = $(this).parents('.qa.active').find('.menu-box ul').index($(this).parents('.qa.active').find('.menu-box ul.active'));
			$(this).addClass('active');
			if( !$(this).hasClass('clicked') ) {
				$(this).addClass('clicked');
			}else {
				$(this).removeClass('active');
				$(this).removeClass('clicked');
			}
			if( $(this).parent().children('li.active').length > 10 ) {
				$(this).removeClass('clicked');
				$(this).removeClass('active');
				alert('最多选10个');				
			}
			if( $(this).parents('.qa.active').find('.menu-box ul.active').children('li.active').length > 0 ) {
				$(this).parents().find('.btns-save').removeClass('btns-save-off');
			}else {
				$(this).parents().find('.btns-save').addClass('btns-save-off');
			}
		});
		$('.sel-more-cot .btns-box.posFixed .btns-save').on('touchstart', function() {
			var nowIndex = $(this).parents('.qa.active').find('.menu-box ul').index($(this).parents('.qa.active').find('.menu-box ul.active'));
			event.stopPropagation();
			if(!$(this).hasClass('btns-save-off')) {
				$(this).parents().find('.mask-sel-more').removeClass('active');
				$(this).parents().find('.sel-more-cot').removeClass('active');
				var moreSelTxt = '';
				var moreSelTxtValue = '';
				$(this).parents('.qa.active').find('.menu-box ul.active').children('li.active').each(function(index) {
					moreSelTxt += $('.sel-more-cot ul.active').children('li.active').eq(index).text() + '、';
				});
				$(this).parents('.qa.active').find('.menu-box ul.active').children('li.active').each(function(index) {
					moreSelTxtValue += $('.sel-more-cot ul.active').children('li.active').eq(index).attr('value') + ';';
				});
				moreSelTxt = moreSelTxt.substring(0, moreSelTxt.length - 1);
				moreSelTxtValue = moreSelTxtValue.substring(0, moreSelTxtValue.length - 1);
				$('.btn-sel-one').parents().find('.indexNum').children('span').text(moreSelTxt);
				$('.btn-sel-one').parents().find('.indexNum').attr('data-value', moreSelTxtValue).attr('data', 'yes');
				$('.btn-sel-one').parents().find('.indexNum').addClass('active').removeClass('indexNum');
				if($(this).parents('.qa.active').find('[data="no"]').length === 0) {
					$(this).parents('.qa.active').find('.btns-green').removeClass('btns-green-off');
				}
			}
		});

		// 初始化必填单选按钮组
		$('.qa').on('click', '.need-radio span', function(index) {
			$(this).parent().children('span').removeClass('active');
			$(this).addClass('active');
			$(this).parent().attr('data', 'yes');
			var labelIndex = $(this).parent().children().index($(this));
			var lastIndex = $(this).parent().children().length - 1;		
			$(this).parent().attr('data-value', $(this).children('input').val());
			if( $(this).parent().next('dd.dis-none').length ) {
				if( labelIndex !== lastIndex ) {
					$(this).parent().next('dd.dis-none').hide();
					$(this).parent().next('dd.dis-none').children('textarea').removeAttr('data');
					$(this).parent().next('dd.dis-none').children('textarea').removeAttr('data-value').val('');
				}else {
					$(this).parent().next('dd.dis-none').show();
					$(this).parent().next('dd.dis-none').children('textarea').attr('data','no');
				}
			}			
		});
		
		// 初始化必填多选按钮组
		$('.qa').on('click', '.need-checkbox span', function() {
			event.stopPropagation();
			// 判断是否选中，如果选中勾子图标显示
			$(this).addClass('active');
			if( !$(this).hasClass('clicked') ) {
				$(this).addClass('clicked');
			}else {
				$(this).removeClass('active');
				$(this).removeClass('clicked');
			}
			// 如果选择当前父级ID增加data yes 属性
			$(this).parent().attr('data', 'yes');			
			if( $(this).parent().children('span.active').length === 0 ) {
				if( $(this).parent().hasClass('noSel') ) {
					$(this).removeAttr('data');
					$(this).removeAttr('data-value');
				}else {
					$(this).parent().attr('data','no');
				}				
				$(this).parent().removeAttr('data-value');
				$(this).parents('.qa.active').find('.btns-green').addClass('btns-green-off');
			}
			if($(this).parents('.qa.active').find('[data="no"]').length === 0) {
				$(this).parents('.qa.active').find('.btns-green').removeClass('btns-green-off');
			}
			// 把当前选中的value 传值给父级ID的 data-value
			var moreSelTxtValue = '';				
			$(this).parent().children('span.active').each(function(index) {
				moreSelTxtValue += $(this).parent().children('span.active').eq(index).children('input').attr('value') + ';';
			});	
			moreSelTxtValue = moreSelTxtValue.substring(0, moreSelTxtValue.length - 1);	
			if( $(this).parent().children('span.active').length !== 0 ) {
				$(this).parent().attr('data-value', moreSelTxtValue);
			}
			
			
			// 定义当前label索引，及最后一个ID索引
			var labelIndex = $(this).parent().children().index($(this));
			var lastIndex = $(this).parent().children().length - 1;
			
			// 如果点的是最后一个索引，触发文字输入框
			if( $(this).parent().next('dd.dis-none').length ) {				
				if( labelIndex === lastIndex ) {
					if( $(this).hasClass('clicked') ) {
						$(this).parent().next('dd').show();
						$(this).parent().next('dd').children('textarea').attr('data','no');
						$(this).parents('.qa.active').find('.btns-green').addClass('btns-green-off');
						
					}else {						
						$(this).parent().next('dd.dis-none').hide();
						$(this).parent().next('dd.dis-none').children('textarea').removeAttr('data');
						$(this).parent().next('dd.dis-none').children('textarea').removeAttr('data-value').val('');
						$(this).parents('.qa.active').find('.btns-green').removeClass('btns-green-off');						
					}
				}
			}			
		});

		// 初始化单选滑动
		var isMarket = 0;
		$('#enterprise_is_market').on('click', function() {
			event.stopPropagation();
			if(isMarket === 0) {
				$(this).attr('data-value', 'enterprise_is_market_1');
				$(this).addClass('active');
				isMarket = 1;

			} else if(isMarket === 1) {
				$(this).attr('data-value', 'enterprise_is_market_2');
				$(this).removeClass('active');
				isMarket = 0;

			}
		});
		$('#isFollow').on('click', function() {
			var isFollow = $('#isFollow').is(':checked');
			if(!isFollow) {
				$(this).attr('data-value', '1');
				$(this).parent().addClass('active');
			} else {
				$(this).attr('data-value', '0');
				$(this).parent().removeClass('active');
			}
		});

		// 显示下一步按钮
		$('.qa').each(function(index) {
			if($('.qa').eq(index).find('[data="no"]').length === 0) {
				$(this).find('.btns-green').removeClass('btns-green-off');
			}
		});
		$('body').on('click input', '.qa', function() {
			emptyTest($(this));
		});

		function emptyTest($this) {
			if($this.find('[data="no"]').length === 0) {
				$this.find('.btns-green').removeClass('btns-green-off');
			} else {
				$this.find('.btns-green').addClass('btns-green-off');
			}
		}

		// 点击下一步按钮
		$('.btns-green').on('click', function() {
			var nowIndex = $('.qa').index($('.qa.active'));
			var isNeed = 1;
			
			//判断年代
			if(!$(this).hasClass('btns-green-off')) {
				if($('.qa.active .timeSel').length) {
					$('.qa.active .timeSel').each(function(index) {
						if(parseInt($(this).val().charAt(0)) < 1 || parseInt($(this).val().charAt(0)) > 2 || parseInt($('.qa.active .timeSel').eq(index).val().length) !== 4 || isNaN($('.qa.active .timeSel').eq(index).val())) {
							alert('请输入数字，如1995');
							isNeed = 0;
							$('.qa.active .timeSel').eq(index).focus().val('');
							$(this).attr('data','no');
							$(this).removeAttr('data-value');
							$(this).parents('.qa.active').find('.btns-green').addClass('btns-green-off');
							return false
						}				
					});
					if($('.bgeinTime').length && $('.endTime').length) {
						$('.bgeinTime').each(function(index) {
							if(parseInt($('.bgeinTime').eq(index).val()) > parseInt($('.endTime').eq(index).val())) {
								alert('合作结束年份不能小于合作开始年份');
								isNeed = 0;
							}
						});			
					}
				}
			}
			
			// 判断手机号
			if(!telValidate($('#contact_phone').val(), $('#contact_country_code').attr('data-value'))) {
				if(!$(this).parents().find('.btns-green').hasClass('btns-green-off')) {
					$(this).parents().find('.btns-green').addClass('btns-green-off');
				}				
				alert('请输入正确的手机号');
				isNeed = 0;
				$('#contact_phone').focus();
				return false;
			}
			if(!telValidate($('#contact_phone').val(), $('#contact_country_code').attr('data-value'))) {
				if(!$(this).parents().find('.btns-green').hasClass('btns-green-off')) {
					$(this).parents().find('.btns-green').addClass('btns-green-off');
				}				
				alert('请输入正确的手机号');
				isNeed = 0;
				$('#contact_phone').focus();
				return false;
			}
			
			// 判断邮箱
			if($('.qa.active #contact_email').length) {
				var emailStr = /^[\w\-\.]+@[\w\-\.]+(\.\w+)+$/;
				var emialVal = jQuery.trim($('#contact_email').val());
				if(!emailStr.test(emialVal)) {
					if(!$(this).parents().find('.btns-green').hasClass('btns-green-off')) {
						$(this).parents().find('.btns-green').addClass('btns-green-off');
					}
					alert('请输入正确的邮箱');
					isNeed = 0;
					return false;
				}
			}			
			
			// 判断是否进入提交数据
			event.stopPropagation();
			if(!$(this).hasClass('btns-green-off') && isNeed == 1) {
				var that = $(this);

				// 提交当页数据
				var json = {};
				for (var i = 0; i < $('.qa').eq(nowIndex).find('[data="yes"]').length; i++) {
					json[$('.qa').eq(nowIndex).find('[data="yes"]').eq(i).attr('id')] = $('.qa').eq(nowIndex).find('[data="yes"]').eq(i).attr('data-value');
				}
				if($('.qa.active .cloneBox').length) {
					var jsonArr = [];
					for (var j = 0; j < $('.needClone').length; j++) {
						var jsonNew = {};
						for (var k = 0; k < ($('.needClone').eq(j).find('[data="yes"]').length); k++) {
							var nowItem = $('.needClone').eq(j).find('[data="yes"]').eq(k);
							jsonNew[nowItem.attr('id')] = nowItem.attr('data-value');
						}
						jsonArr[j] = jsonNew;
					}
					json = jsonArr;
				}

				wAjax({
					url: '/wmp/user/' + appConfigId + '/iresource/postInvestigate',
					type: 'post',
					dataType: "json",
					data: {
						pageId: nowIndex + 1,
						json: JSON.stringify(json)
					},
					success: function(rs) {
						var json_rs = $.parseJSON((rs));
						if(parseInt(json_rs.code) === 0) {
							that.parents().find('.qa').eq(nowIndex).removeClass('active');
							that.parents().find('.qa').eq(nowIndex + 1).addClass('active');
							$('.progress i').css('width', 100 / $('.qa').length * (nowIndex + 2) + '%');
						} else {
							alert(json_rs.msg);
						}
					},
					complete: function() {
						if(nowIndex === 15) {
							window.location = '/wmp/user/' + appConfigId + '/iresource/investigateComplete/' + userId;
						}
					}
				});
			}
		});
		
		// 第3题 初始化手机号
		if( $('#contact_country_code').attr('data-value') === "country_207" || $('#contact_country_code').attr('data-value') === '0086') {
			$('#contact_phone').attr('maxlength','11');
		}else {
			$('#contact_phone').attr('maxlength','20');
		}
		$('#mobSel li').on('click', function() {
			if( $('#contact_country_code').attr('data-value') === "country_207" || $('#contact_country_code').attr('data-value') === '0086') {
				$('#contact_phone').attr('maxlength','20');
			}else {
				$('#contact_phone').attr('maxlength','11');
			}
		});		

		// 第5题跳到第6题
		$('#jumpTo6').on('click', function() {
			$(this).parents().find('.qa').removeClass('active');
			$(this).parents().find('.qa').eq(5).addClass('active');
			var nowIndex = $('.qa').index($('.qa.active'));
			var json = {};
			wAjax({
				url: '/wmp/user/' + appConfigId + '/iresource/postInvestigate',
				type: 'post',
				dataType: "json",
				data: {
					pageId: nowIndex,
					json: JSON.stringify(json)
				}
			});
		});

		// 第6题跳到第7题
		$('#jumpTo7').on('click', function() {
			$(this).parents().find('.qa').removeClass('active');
			$(this).parents().find('.qa').eq(9).addClass('active');
			var nowIndex = $('.qa').index($('.qa.active'));
			var json = {};
			json['has_overseas_business'] = '0';
			console.log(json);
			wAjax({
				url: '/wmp/user/' + appConfigId + '/iresource/postInvestigate',
				type: 'post',
				dataType: "json",
				data: {
					pageId: nowIndex,
					json: JSON.stringify(json)
				}
			});
		});

		// 省市二级联动		
		$('#city').on('change',function(){			
			var $city = $(this);
			if($(this).get(0).selectedIndex !== 0) {
				$(this).attr('data', 'yes');
				$city.attr('data-city-id', $city.find('option:selected').val());
				$city.attr('data-value', $city.find('option:selected').val());
			} else {
				$(this).attr('data', 'no');
			}
			emptyTest($(this).parents('.qa'));
		});

		$('#province').on('change', function() {
			var $city = $('#city');
			event.stopPropagation();
			$city.find('option').eq(0).attr('selected','');
			$city.attr('disabled','');
			if($(this).get(0).selectedIndex !== 0) {
				var provinceId = $(this).find('option:selected').val();

				wAjax({
					url: '/wmp/tool/dict/city?id=' + provinceId,
					type: 'get',
					success: function(rs) {
						var json_rs = $.parseJSON((rs));
						console.log(json_rs.data);
						var cityOption = ['<option value="0">选择城市</option>'];						
						$.each(json_rs.data, function(k, v) {
							cityOption.push('<option value="' + k + '">' + v.value + '</option>');
						});
						$city.html(cityOption.join(''));		
						$city.removeAttr('disabled');				
					}
				});
				$(this).attr('data', 'yes');
				$(this).parent().next().children().attr('data', 'no');
				$(this).attr('data-value', $(this).find('option:selected').val());

				
			} else {
				$(this).attr('data', 'no');
				$(this).removeAttr('data-vale');
			}
			emptyTest($(this).parents('.qa'));
		});

		$('#city,#province').each(function(){
			var $this = $(this);
			if($this.attr('data-value') == '') {
				$this.attr('data','no');
			} else {
				$this.attr('data','yes');
			}
		})

		// 第8题 添加更多		
		var cloneHTML = $('.qa').eq(7).find(' .qa-cot .needClone').prop("outerHTML");
		var cloneMini = $('.qa').eq(7).find('.cloneMini .sel-one-cot .menu-box').html();
		$('.btn-add-partner').on('click', function() {
			if($('.qa.active .needClone').length < 5) {
				$(this).parents('.qa.active').find('.cloneBox').append(cloneHTML);
				$(this).parents('.qa.active').find('.sel-one-cot .menu-box').append(cloneMini);
				if($('.qa.active .needClone').length == 5) {
					$(this).addClass('btn-add-partner-off');
				}
			}
		});

		// 第8题 点击删除此经历
		$('.cloneBox').on('click', '.needClone .btn-del a', function() {
			var isIndex = $('.needClone').index( $(this).parent().parent() ); 
			if( $(this).parent().parent().parent().children('.needClone').not( $('.needClone').eq(isIndex) ).find('[data="no"]').length === 0 ) {
				$(this).parents().find('.btns-green').removeClass('btns-green-off');
			}
			var $willDelDomContainer = $(this).parents('.qa.active').find('.cloneMini .sel-one-cot .menu-box').children('ul');
			$willDelDomContainer.filter(':eq('+(isIndex*2)+'),:eq('+(isIndex*2+1)+')').remove();
			// $(this).parents('.qa.active').find('.cloneMini .sel-one-cot .menu-box').children('ul').eq(isIndex).remove();
			$(this).parents('.needClone').remove();
			$('.qa').eq(7).find('.btn-add-partner').removeClass('btn-add-partner-off');			
		});

		// 第8题 判断选择时间
		$('#sel-time li').on('click', function() {
			if($('#coop_begin_time').attr('data-value')) {
				var timeBefore = $('#coop_begin_time').attr('data-value');
				if(parseInt($(this).val()) < parseInt(timeBefore)) {
					event.stopPropagation();
					alert('结束年份不能小于开始年份');
					$('#coop_end_time').trigger("click");
				}
			}
		});
		
		// 第8题 点其它弹出500字输入框
		$('.qa.active').on('click', '.needOtherWay span:last', function() {			
			$(this).parent().next('dd').show();
			$(this).parent().next('dd').children('textarea').attr('data-no');			
		});

		// 第9题跳到第10题
		$('#jumpTo10').on('click', function() {
			$(this).parents().find('.qa').removeClass('active');
			$(this).parents().find('.qa').eq(9).addClass('active');
			var nowIndex = $('.qa').index($('.qa.active'));
			var json = {};
			wAjax({
				url: '/wmp/user/' + appConfigId + '/iresource/postInvestigate',
				type: 'post',
				dataType: "json",
				data: {
					pageId: nowIndex,
					json: JSON.stringify(json)
				}
			});
		});
		
		// 第15题跳到第16题
		$('#jumpTo16').on('click', function() {
			$(this).parents().find('.qa').removeClass('active');
			$(this).parents().find('.qa').eq(15).addClass('active');
			var nowIndex = $('.qa').index($('.qa.active'));
			var json = {};
			wAjax({
				url: '/wmp/user/' + appConfigId + '/iresource/postInvestigate',
				type: 'post',
				dataType: "json",
				data: {
					pageId: nowIndex,
					json: JSON.stringify(json)
				}
			});
		});

		// 公用相关函数
		function telValidate(tel, disNum) {
			//common rules
			var telReg = new RegExp("^[0-9]+$");
			//rule for China cell phone number
			if(disNum == "country_207" || disNum== '0086') {
				$('#contact_phone').attr('maxlength','11');
				telReg = new RegExp("^1[0-9]{10}$");
			}
			return telReg.test(tel);
		}

		function isNull(str) {
			if(str === "") return true;
			var regu = "^[ ]+$";
			var re = new RegExp(regu);
			return re.test(str);
		}
	});
});
