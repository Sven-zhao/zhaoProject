require(['jquery','pagescript/trust/base/js/wxshare','modules/ui/showMsg/js/complete'],function($,wxshare,Msg){
    (function(){
        var newFriendNum = $('input[name="newFriendNum"]').val();
        if(newFriendNum > 0 ){
            Msg({
                msg: ("有 "+newFriendNum+ " 位新朋友加入你的靠谱蜜友录"),
                interval : 2500,
            });
        }
    })();


    (function(){
        var waitingFriendNum = $('input[name="waitingFriendNum"]').val();
        var delay = $('input[name="newFriendNum"]').val() > 0 ? 3000: 0;
        if(waitingFriendNum > 0){
            setTimeout(function(){
                $('.waiting-task-bar').addClass('show').on('click',function(){
                    $(this).removeClass('show');
                });
            },delay);
        }
    })();
});
