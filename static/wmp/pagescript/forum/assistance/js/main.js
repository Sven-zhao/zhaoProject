require(['jquery','modules/net/wAjax','modules/ui/showMsg/js/complete','modules/base/js/util','wxapi.default.config','modules/ui/wx-plugin/autoMoveUp'],function($,wAjax,showCompleteMsg,util){
    var $comment = $('textarea');
    var $relationShip = $('.relationShip');
    var $errorMsgBox = $('.error-msg');
    var $submitBtn = $('#btn-submit');
    var key = $('input[name=key]').val();
    var corpId  = $('input[name=corpId ]').val();

    function valid() {
        $comment.val($.trim($comment.val()));
        $relationShip.val($.trim($relationShip.val()));
        if($comment.val().length == 0) {
            return "请输入背书内容";
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
            var data = {};
            data.comment = $comment.val();
            data.relation = $relationShip.val();
            data.key = key;
            data.corpId = corpId;
            wAjax({
                url: '/wmp/user/'+appConfigId+'/forum/apply/support',
                type: 'post',
                data: data,
                success: function(obj){
                    showCompleteMsg({
                        msg: "助力成功！",
                        callback: function(){
                            window.location.href=util.addTimeStamp('/wmp/user/'+appConfigId+'/forum/apply/support/detail?key='+key+'&corpId='+corpId);
                        }
                    });
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
