require(['jquery','modules/net/wAjax','wxapi.default.config'],function($,wAjax){

    // define variable
    var $loginBtn = $('#btn-login'),
        $tel = $('#tel-input'),
        $sendBtn = $('.btn-send-code'),
        $sendBtnContainer = $('.input-group-btn'),
        $msgContainer = $('.msg');
        $code = $('#code-input');
        $postType = $('#postType');
        $templateName = $('#template');
        $tc = $('.tc');
        $districtNumber = $('.district-number select');

    //init
    (function(){
        activeBtn();
    })()


    function telValidate(tel,disNum) {
        //common rules
        var telReg = new RegExp("^[0-9]+$");
        //rule for China cell phone number
        if(disNum == "0086") {
            telReg = new RegExp("^1[0-9]{10}$");
        }
        return telReg.test(tel);
    }

    function vcodeValidate(code) {
        var codeReg = new RegExp("^[0-9]{4}$");
        return codeReg.test(code);
    }

    function activeBtn() {
        if($tel.val().length > 0 && $code.val().length > 0 && $tc.hasClass("selected")) {
            $loginBtn.removeAttr('disabled');
        } else {
            $loginBtn.attr('disabled','disabled');
        }
    }

    function displayMsg(obj) {
        if(typeof obj == 'boolean' && obj === false) {
            $msgContainer.html("");
        } else {
            $msgContainer.html(obj['msg']);
        }
    }

    function activeSendBtn() {
        $sendBtnContainer.removeAttr('disabled');
        $sendBtn.html('发送验证码');
    }

    var countDownNum = 0;
    function countDown() {
        clearInterval(countDownNum);
        $sendBtn.addClass('msg-mode');
        var maxTime = 30;
        countDownNum = setInterval(function(){
            if(--maxTime > 0) {
                $sendBtn.html(maxTime+'秒后重发');
            } else {
                clearInterval(countDownNum);
                activeSendBtn();
            }
        },1000);
    }

    $("input[type=tel]").on("input", function(){
        var $this = $(this);
        $this.val($this.val().replace(/[^0-9]*/g,""));
        displayMsg(false);
        activeBtn();
    });

    $districtNumber.on('change',function(){
        displayMsg(false);
        if($districtNumber.val() == '0086') {
            $tel.attr('maxlength',11);
        }
        else {
            $tel.attr('maxlength',20);
        }
    });

    $('a',$tc).on('click',function(e) {
        e.stopPropagation();
    });

    $tc.on('click',function() {
        $(this).toggleClass('selected');
        activeBtn();
    });

    $('.container').on('click','.btn-login:not([disabled])',function(){
        if (!telValidate($tel.val(),$districtNumber.val())) {
            displayMsg({
                msg: '请输入正确的手机号'
            });
            return false;
        }
        if (!vcodeValidate($code.val())) {
            displayMsg({
                msg: '请输入正确的验证码'
            });
            return false;
        }
        wAjax({
            url: '/wmp/user/'+appConfigId+'/loginSubmit?template='+$templateName.val(),
            data: {
                dcc: $districtNumber.val(),
                mobile: $tel.val(),
                code: $code.val(),
                type: $postType.val()
            },
            success: function(obj) {
                var newUrl = obj['data'];
                var sep = '?';
                if (newUrl.indexOf('?') > -1) {
                    sep = '&';
                }
                var timestamp = Date.parse(new Date());
                newUrl = newUrl + sep + 'timestamp=' + timestamp;
                window.location.href = newUrl;
            },
            error: function(obj) {
                displayMsg(obj);
            }
        });
    });


    $('.container').on('click','.input-group-btn:not([disabled])',function(e){
        e.stopPropagation();
        if (!telValidate($tel.val(),$districtNumber.val())) {
            displayMsg({
                msg: '请输入正确的手机号'
            });
            return false;
        }
        $sendBtnContainer.attr('disabled','disabled');
        wAjax({
            url: '/wmp/user/'+appConfigId+'/mobile/check?template='+$templateName.val(),
            data: {
                dcc: $districtNumber.val(),
                mobile: $tel.val(),
                type: $('input[name="type"]').val()
            },
            success: function(obj){
                displayMsg(false);
                countDown();
            },
            error: function(obj) {
                displayMsg(obj);
                activeSendBtn();
            },
            generalError: function(obj) {
                displayMsg(false);
                activeSendBtn();
            }
        });
    });

});
