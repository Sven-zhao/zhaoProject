require(['jquery','wxapi','modules/net/wAjax','modules/base/js/util'],function($,wx,wAjax,util){
	wx.config($.extend({
		debug: DEBUG,
		jsApiList: []
	},WXCONFIG));	
	wx.ready(function(){
		wx.hideOptionMenu();
	});

	//variable defination	
	var $questionArea = $('.question-area');
	var $questionAreaList = $('.question',$questionArea);
	var $commentArea = $('.comment-area');
	var $counter = $('.counter');
	var $currentQuestionNum = $('.current',$counter);
	var $mask = $('.mask');
	var $resultIcon = $('.result-icon', $mask);
	var $resutText = $('.result-text', $mask);
	var MAX_QUESTION_LENGTH = 10;
	var currentQuestionNum = $('#question-num').val();	
	var currentQuestionIndex = 0;
	var key = $('#key').val();
	var isHasComment = $('#hasCommented').val();

	//init
	(function(){
		$questionAreaList.eq(currentQuestionIndex).addClass('active');
		displayComment();
		//replace the history with the landing page url
		window.history.replaceState('','','/wmp/user/'+appConfigId+'/relation/compete/share/question?key='+key);
	})();

	//function defination
	function displayComment() {
		if(currentQuestionNum > MAX_QUESTION_LENGTH) {
			$questionArea.hide();
			$counter.hide();
			if(isHasComment == 'true') {
				window.location.href=util.addTimeStamp('/wmp/user/'+appConfigId+'/relation/compete/match/result?key='+key);
			}
			else {
				$commentArea.show();				
			}
		}
	}
	function nextQuestion() {
			$questionAreaList.eq(currentQuestionIndex).removeClass('active');
			currentQuestionIndex++;
			currentQuestionNum++;
			// already answer all the question, show the comment area
			if(currentQuestionNum > MAX_QUESTION_LENGTH) {
				displayComment();
				$mask.hide();
			}
			else {
				$currentQuestionNum.html(currentQuestionNum);
				$questionAreaList.eq(currentQuestionIndex).addClass('active');
				$mask.hide();
			}
	}

	function showResult(isCorrect,questionID,selectedAnswerID,callBack) {
		$resultIcon.removeClass('true false').addClass(isCorrect.toString());
		if(isCorrect) {
			$resutText.html('恭喜你答对了！');
		}
		else {
			$resutText.html('好遗憾答错了...');
		}
		var submit = setTimeout(function() {
			submitAnswer(questionID,isCorrect,selectedAnswerID);
		}, 300);
		// $mask.one('click',function(){
		// 	clearTimeout(submit);
		// 	submitAnswer(questionID,isCorrect,selectedAnswerID);
		// });
		$mask.show();
	}

	function submitAnswer(questionID, isCorrect, selectedAnswerID) {
		var data={key:key,qid:questionID,tagId:selectedAnswerID,isCorrect:Number(isCorrect)}
		wAjax({
			url: '/wmp/user/'+appConfigId+'/relation/compete/save/answer',
			type: 'post',
			data: data,
			success: function(obj){
				nextQuestion();
			},
			error: function(obj) {
				$mask.hide();
		    },
		    generalError: function(obj) {
				$mask.hide();
		    }
		});	
	}

	//bind event 
	$('li').on('click',function(){
		var $this = $(this);
		$('li').not($this).removeClass('select');
		$this.toggleClass('select');
		var $curretQuestion = $questionAreaList.eq(currentQuestionIndex);
		var questionID = $curretQuestion.data('questionId');
		var correctAnswerID = $curretQuestion.data('correctAnswerId');
		var selectedAnswerID = $this.data('answerId');
		var isCorrect = selectedAnswerID == correctAnswerID;
		showResult(isCorrect,questionID,selectedAnswerID,submitAnswer);
	});

	$mask.on('click',function(e){
		e.stopPropagation();
	});

	//comment area
	var limit = 30;
	$('.comment-box textarea').on('input',function(){
		if($.trim($(this).val()).length > 0){
			$('.btn-primary').removeAttr('disabled');
		}else{
			$('.btn-primary').attr('disabled','disabled');
		}
		if($.trim($(this).val()).length >= limit){
			$(this).val($(this).val().substring(0,limit));
		}
		//$('.words-num').text($.trim($(this).val()).length + '/30');
	});

	//提交评论
	$('.container').on('click','.btn-primary:not([disabled])',function(){
		wAjax({
			url:'/wmp/user/'+appConfigId+'/relation/compete/add/comment',
			data:{key:key,'comment':$.trim($('.comment-box textarea').val())},
			success:function(rs){
				var timestamp = Date.parse(new Date());
				window.location.href='/wmp/user/'+appConfigId+'/relation/compete/match/result?key='+key+'&timestamp=' + timestamp;
			}
		});
	});


});