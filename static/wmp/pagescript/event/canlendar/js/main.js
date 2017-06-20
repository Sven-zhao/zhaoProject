require(['jquery','wxapi','modules/net/wAjax','modules/ui/showMsg/js/main','modules/base/js/util','common/jquery-plugins/fastclick'],function($,wx,wAjax,showError,util,fastclick){
	wx.config($.extend({
		debug: DEBUG,
		jsApiList: []
	},WXCONFIG));	
	wx.ready(function(){
		wx.hideOptionMenu();
	});

    //fapiao 2016/4/27
    $('.fapiao').on('touchend','.radio',function(e){
        e.stopPropagation();
        updateBtn();
        if($(this).hasClass('selected')){
            $(this).removeClass('selected');
            $('#a').addClass('disabled');
            $('#b').hide().val('');
            $('.tips').show();
            $('.fapiao .error').hide();
        }else{
            $(this).addClass('selected');
            $('#a').removeClass('disabled');
            $('.tips').hide();
            $('#b').show();
        }
    });

    //check phone 2016/3/24 new add
    $('select').on('change',function(){
        $('.formInfo .error').hide();
        if($('select').val() == '86' || $('select').val() == '0086' || $('select').val() == '+86'){
            $('.tel-input').attr('maxlength',11);
        }else{
            $('.tel-input').attr('maxlength',20);
        }
    });
    $('.tel-input').on('input',function(){
        $('.formInfo .error').hide();
        $(this).val($(this).val().replace(/[^0-9]/g,''));
        if($('select').val() == '86' || $('select').val() == '0086' || $('select').val() == '+86'){
            $(this).attr('maxlength',11);
            if($(this).val().length > 11){
                $(this).val($(this).val().substr(0,11));
            }
        }else{
            $(this).attr('maxlength',20);
            if($(this).val().length > 20){
                $(this).val($(this).val().substr(0,20));
            }
        }
    });
    function checkTel(type,v){
        if(type == '86' || type == '0086' || type == '+86'){
            if(/^1[0-9]{10}$/.test(v)){
                $('.formInfo .error').hide();
                return true;
            }else{
                $('.formInfo .error').show();
                return false;
            }
        }else{
            if(/^[0-9]{1,}$/.test(v)){
                $('.formInfo .error').hide();
                return true;
            }else{
                $('.formInfo .error').show();
                return false;
            }
        }
    }

    function QuestionAndAnswer($question) {
        self = this;
        this.voteId = parseInt($question.data('questionId'));

        $question.find('li.select').each(function(){
            var $answer = $(this);
            self.choice = self.choice + ',' + $answer.data('answerId');
        });
        this.choice = this.choice.substring(1);
    }

    QuestionAndAnswer.prototype = {
        constructor: QuestionAndAnswer,
        //question ID
        voteId: '',
        //answer IDs
        choice: ''
    }

    //variables defineation
    var $allQuestions = $('.question');
    var $submit = $('#submit');
    var aid = $('input[name=aid]').val();


    //init
    (function(){
        updateBtn();
        fastclick.attach(document.body);
    })();

    //update the status of Button
    function atvBtn(isShow) {
        if(isShow) {
            $submit.removeAttr('disabled');
        }
        else {
             $submit.attr('disabled','disabled');
        }
    }
    function updateBtn() {
        var allAnswered = true;
        var $requiredQuestions = $('.question[data-question-required=required]');
        $requiredQuestions.each(function(){
            var $question = $(this);
            var $answers = $('li.select',$question);
            if($answers.length == 0) {
                allAnswered = false;
                return false;
            }
        });
        atvBtn(allAnswered);
    }

    //bind event
    $('.answer li').on('click',function(){
        var $selectAnswer = $(this);
        var $question = $selectAnswer.parents('.question:eq(0)');
        var questionType = $question.data('questionType');
        var isRequired = $question.data('questionRequired');
        //必选题，保证至少有一个选项勾选，如果是唯一一个勾选的选项，不能取消
        if(isRequired == "required") {
             //多选
            if(questionType == 'multiple') {    
                /* 
                //禁止取消勾选，如果当前选项是唯一的一个勾选项
                if($selectAnswer.is('.select') && $question.find('li.select').not($selectAnswer).length == 0) {
                    //do nothing
                }
                else {
                  $selectAnswer.toggleClass('select');
                }
                */
                $selectAnswer.toggleClass('select');
            }
            //单选
            else {
                $question.find('li.select').not($selectAnswer).removeClass('select');
                if($selectAnswer.not('.select')) {
                    $selectAnswer.addClass('select');
                }
            }

        }
        //非必选题
        else {            
            //多选
            if(questionType == 'multiple') {         
                //do nothing      
            }
            //单选
            else {
                $question.find('li.select').not($selectAnswer).removeClass('select');
            }
            $selectAnswer.toggleClass('select');
        }
        updateBtn();
    });

    $('input[name="fapiao"]').on('input',function(){
        $('.fapiao .error').hide();
        updateBtn();
    });

    $('.container').on('click','#submit:not([disabled])',function(){
        var arrayQA = [];
        $allQuestions.each(function(){
            var questionAndAnswer = new QuestionAndAnswer($(this));
            arrayQA.push(questionAndAnswer);
        });
        if(!checkTel($('.formInfo select').val(),$('.formInfo .tel-input').val())){
            return false;
        }
        atvBtn(false); 
        var needReceipt = 1;
        if($('.fapiao-item').eq(0).find('.radio').hasClass('selected')){
            needReceipt = 1;
        }else{
            needReceipt = 0;
        }
        var receiptPhone = $('input[name="fapiao"]').val();
        if(receiptPhone == '' && needReceipt == 1){
            var fapiaoPos = $('.fapiao')[0].offsetTop - 30;
            window.scrollTo(0,fapiaoPos);
            $('.fapiao .error').show();
            return false;
        }
        //显示处理中蒙版
        $('.mask').show();
        wAjax({
            url: '/wmp/user/'+appConfigId+'/activity/'+aid+'/calendar/submit',
            type: 'post',
            data: {
                calendarStr:JSON.stringify(arrayQA),
                usermobile:$('.formInfo .tel-input').val(),
                countryCode:$('.formInfo .country_Code').val(),
                needReceipt:needReceipt,
                receiptPhone:receiptPhone
            },
            success: function(obj){
                $('.mask').hide();
                window.location.href = util.addTimeStamp('/wmp/user/'+appConfigId+'/activity/topay?aid='+aid);
            },
            error: function(obj) {         
                //code equls 1, means event is full,  
                if(obj['code'] == 1) {
                  window.location.href = util.addTimeStamp('/wmp/user/'+appConfigId+'/activity/'+aid+'/sign/failed');
                }
                else {
                    showError(obj);
                    //allow user to submit again
                    atvBtn(true);
                }
            },
            generalError: function(obj) {
                //allow user to submit again
                atvBtn(true);
            }
        }); 
    });
    
    
    history.replaceState(null,null,window.location.origin+'/wmp/user/'+appConfigId+'/activity/'+aid+'/detail');

});