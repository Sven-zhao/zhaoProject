require(['jquery','wxapi','modules/net/wAjax','pagescript/quiz/base/js/wAjax'],function($,wx,wAjax,tplAjax){
	wx.config($.extend({
		debug: DEBUG,
		jsApiList: []
	},WXCONFIG));	
	wx.ready(function(){
		wx.hideOptionMenu();
	});

	//replace the history with the landing page url
	window.history.replaceState('','','/wmp/user/'+appConfigId+'/relation/compete/index');

	//variable defination	
	var $questionArea = $('.question-area');
	var $changeQuestion = $('#change-question');
	var $nextQuestion = $('#next-question');
	var $counter = $('.counter');
	var $currentQuestionNum = $('.current',$counter);
	var MAX_FIXED_QUESTION_LENGTH = 5;
	var MAX_QUESTION_LENGTH = 10;
	var currentQuestionNum = $('#question-num').val();
	var isLastQ = 0;
	var isRewardQ = 0;
	var isFixedQ = 0;

	//init
	(function(){
		if(currentQuestionNum <= MAX_FIXED_QUESTION_LENGTH) {
					isFixedQ = 1;
		}
		else if(currentQuestionNum == MAX_QUESTION_LENGTH) {
					isLastQ = 1;
		}
		else if(currentQuestionNum > MAX_QUESTION_LENGTH){
			isRewardQ = 1;
		}
		if(isFixedQ) {
			$changeQuestion.hide();			
		}
		if(isLastQ) {
			$nextQuestion.html('下一步');
		}
	})();

	//function defination
	function setBtnStatus(isAvailable) {
		if(isAvailable) {
			$nextQuestion.removeAttr('disabled');
		}
		else {
			$nextQuestion.attr('disabled','disabled');
		}
	}

	function changeQuestion(newQuestionFragement, isNew) {
		$questionArea.html(newQuestionFragement);
		if(isNew) {
			currentQuestionNum++;
			isLastQ = 0;
			isRewardQ = 0;
			isFixedQ = 0;
			if(currentQuestionNum <= MAX_FIXED_QUESTION_LENGTH) {
					isFixedQ = 1;
			}
			else if(currentQuestionNum == MAX_QUESTION_LENGTH) {
				isLastQ = 1;
			}
			else if(currentQuestionNum > MAX_QUESTION_LENGTH){
				isRewardQ = 1;
			}
			if(isFixedQ) {
				$changeQuestion.hide();			
			}
			else {
				$changeQuestion.show();
			}
			if(isLastQ) {
				$nextQuestion.html('下一步');
			}
			if(isRewardQ) {
				$counter.hide();
				$changeQuestion.hide();
				$nextQuestion.html('完成');
			}
			$currentQuestionNum.html(currentQuestionNum);
		}
	}

	//bind event 
	$('.question-area').on('click','li',function(){
		var $this = $(this);
		var $answerGroup = $('.answer-group');
		var $freeInput = $('li input',$answerGroup);
		$('li',$answerGroup).not($this).removeClass('select');
		// the standard answer
		if($('input',$this).length == 0) {
			$this.toggleClass('select');
			setBtnStatus($this.hasClass('select'));
		}
		// the free answer
		else {
			$this.addClass('select');
			setBtnStatus($.trim($freeInput.val()).length > 0);
		}
	});

	$('.question-area').on('input','input',function(){
		var $this = $(this);
		setBtnStatus($.trim($this.val()).length > 0);
	});

	//change the answer
	$changeQuestion.on('click',function(){
		setBtnStatus(false);
		tplAjax({
			url: '/wmp/user/'+appConfigId+'/relation/compete/next/question',
			type: 'post',
			data: {},
			success: function(obj){
				changeQuestion(obj,false);
				setBtnStatus(false);
			},
			error: function(obj) {
		    }
		});	
	});

	//submit the answer
	$('.container').on('click','#next-question:not([disabled])', function(){
		setBtnStatus(false);
		var $answerGroup = $('.answer-group');
		var $freeInput = $('li input',$answerGroup);
		var freeAnswer = $.trim($freeInput.val());
		var questionID = "",
			answerID = "",
			answerText = "";

		var $selectedAnswer = $('li.select',$answerGroup);

		$freeInput.val(freeAnswer);
		questionID = $('.question-text',$questionArea).data('questionId');
		answerID = $selectedAnswer.data('answerId');

		//check free answer is same with standard answer
		if($selectedAnswer.find('input').length > 0) {	
			answerText = freeAnswer;
			$('li',$answerGroup).not( $selectedAnswer).each(function(){
				var $this = $(this);
				if($this.find('span').html() == freeAnswer) {
					answerID = $this.data('answerId');
					answerText = "";
					return false;
				}
			});
		}
		var resultData = {qid:questionID,tagId:answerID,tag:answerText};
		wAjax({
			url: '/wmp/user/'+appConfigId+'/relation/compete/save/question',
			type: 'post',
			data: resultData,
			success: function(obj){
				// save reward question successfully, go to the comment page
				if(isRewardQ) {
					var timestamp = Date.parse(new Date());
					window.location.href = '/wmp/user/'+appConfigId+'/relation/compete/comment/result?timestamp=' + timestamp;
					return;
				}
				else {
					// otherwise, retrieve a new question
					var data = {};
					// the last question is reward question
					if(isLastQ) {
						data = {type:'reward'};					
					}
					tplAjax({
							url: '/wmp/user/'+appConfigId+'/relation/compete/next/question',
							type: 'post',
							data: data,
							success: function(obj){
								changeQuestion(obj,true);
								setBtnStatus(false);
							},
							error: function(obj) {
						    }
					});	
				}
			},
			error: function(obj) {
				//allow user to submit again
				setBtnStatus(true);
		    },
		    generalError: function(obj) {
				//allow user to submit again
				setBtnStatus(true);
		    }
		});	
	});

});