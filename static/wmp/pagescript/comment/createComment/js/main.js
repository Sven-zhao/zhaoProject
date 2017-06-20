require(['jquery','modules/net/wAjax','modules/ui/showMsg/js/complete','modules/base/js/util','wxapi.default.config','modules/ui/wx-plugin/autoMoveUp'],function($,wAjax,showCompleteMsg,util){
    var $comment = $('textarea');
    var $relationShip = $('.relationShip');
    var $errorMsgBox = $('.error-msg');
    var $submitBtn = $('#btn-submit');
    var key = $('input[name=key]').val();
    var showTips = $('input[name=showTips]').val();
    var isLogin = $('input[name=isLogin]').val();
    var nextUrl = $('input[name=nextUrl]').val();

    (function(){
        if(showTips == "true") {
            $submitBtn.hide();
            showCompleteMsg({
                msg: "评论发送成功！",
                interval: 2000,
                callback: function(){
                    window.location.href=nextUrl;
                }
            });
        }
    })();

    function valid() {
        $comment.val($.trim($comment.val()));
        $relationShip.val($.trim($relationShip.val()));
        if($comment.val().length == 0) {
            return "请输入评价内容";
        }
        if($relationShip.val().length == 0) {
            return "请输入您和对方的关系";
        }
        return ""; 
    }

    $comment.add($relationShip).on('input',function(){
        $errorMsgBox.html('');
    })

    $submitBtn.on('click',function(){
        var errMsg = valid();
        if(errMsg == "") {
            wAjax({
                url: '/wmp/user/'+appConfigId+'/comment/add',
                type: 'post',
                data: {'key':key, 'comment':$comment.val(), 'relation':$relationShip.val()},
                success: function(obj){
                    if(isLogin == "true") {
                        showCompleteMsg({
                            msg: "评论发送成功！",
                            callback: function(){
                                window.location.href=util.addTimeStamp(obj['data']);
                            }
                        });
                    }
                    else {
                        window.location.href=util.addTimeStamp(obj['data']);
                    }
                },
                error: function(obj) {
                    $errorMsgBox.html(obj['msg']);
                },
                generalError: function(obj) {
                   
                }
            }); 
            
        }
        else {
            $errorMsgBox.html(errMsg);
        }
    });


});
