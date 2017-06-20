require(['jquery','modules/net/wAjax','wxapi','modules/base/js/util','modules/ui/wx-plugin/autoMoveUp'],function($,wAjax,wx,util){

    var $desc = $('#desc');
    var $advantage = $('#advantage');
    var $qualification = $('#qualification');
    var $errorMsgBox = $('.error-msg');
    var corpId = $('input[name=corpId]').val();

    function valid() {
        $desc.val($.trim($desc.val()));
        $advantage.val($.trim($advantage.val()));
        $qualification.val($.trim($qualification.val()));
        if($desc.val().length == 0) {
            return "请输入公司简介";
        }
        if($advantage.val().length == 0) {
            return "请输入公司优势";
        }
        return ""; 
    }

    $desc.add($advantage).add($qualification).on('input',function(){
        $errorMsgBox.html('');
        $errorMsgBox.hide();
    });

    /*岛亲，无需支付*/
    $('.vip').on('click',function(){
        var errMsg = valid();
        if(errMsg == "") {
            var inputs = $('input, textarea');
            var data = {};
            inputs.each(function(){
                var $this = $(this);
                data[$this.attr('name')] = $this.val();
            });
            wAjax({
                url: '/wmp/user/'+appConfigId+'/forum/apply/corp',
                type: 'post',
                data: data,
                success: function(obj){
                    window.location.href=util.addTimeStamp(obj['data']);
                },
                error: function(obj) {
                    $errorMsgBox.html(obj['msg']);
                    $errorMsgBox.show();
                },
                generalError: function(obj) {
                   
                }
            }); 
            
        }
        else {
            $errorMsgBox.html(errMsg);
            $errorMsgBox.show();
        }
    });

    var payConfig = undefined;
    var successRedirectURL = '';
    function getWXPayConfig() {
        wAjax({
            url: '/wmp/user/'+appConfigId+'/forum/pay/unifiedOrder?corpId='+corpId+'&t='+new Date().getTime(),
            type: "get",
            success: function(result) {
                payConfig = result.data;
                // payConfig need to be a json object.
                payConfig.success = function(res) {
                   window.location.href=util.addTimeStamp(successRedirectURL);
                };
                //接口调用失败时
                payConfig.fail = function(){

                };
                //用户点击取消时的回调函数
                payConfig.cancel = function(){

                }
                
            }
        });
    }


    // 配置支付
    if($('.payment').length > 0) {
        wx.config($.extend({
            debug: DEBUG,
            jsApiList: ['chooseWXPay']
        },WXCONFIG));   
        wx.ready(function(){
            wx.hideOptionMenu();
        });
        getWXPayConfig();
        /*非岛亲，需支付*/    
        $('.payment').on('click',function(){
            var errMsg = valid();
            if(errMsg == "") {
                var inputs = $('input, textarea');
                var data = {};
                inputs.each(function(){
                    var $this = $(this);
                    data[$this.attr('name')] = $this.val();
                });
                wAjax({
                    url: '/wmp/user/'+appConfigId+'/forum/apply/corp',
                    type: 'post',
                    data: data,
                    success: function(obj){
                        successRedirectURL = obj['data'];
                        if (payConfig) {
                            wx.chooseWXPay(payConfig);
                        }
                    },
                    error: function(obj) {
                        $errorMsgBox.html(obj['msg']);
                        $errorMsgBox.show();
                    },
                    generalError: function(obj) {
                       
                    }
                }); 
                
            }
            else {
                $errorMsgBox.html(errMsg);
                $errorMsgBox.show();
            }
        });
    }
    else {
        wx.config($.extend({
            debug: DEBUG,
            jsApiList: []
        },WXCONFIG));   
        wx.ready(function(){
            wx.hideOptionMenu();
        });
    }


});