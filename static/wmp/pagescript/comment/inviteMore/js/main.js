require(['jquery','modules/net/wAjax','modules/ui/showMsg/js/complete','modules/base/js/util','wxapi.default.config'],function($,wAjax,showCompleteMsg,util){

    var $submitBtn = $('#submit-btn');
    var $ignoreBtn = $('#ignore-btn');
    var $delete = $('.delete');
    var $listRoot = $('.invite-list');

    var key = $('input[name=key]').val();

    (function(){
       updateListStatus();
    })();

    function updateListStatus() {
        $listRoot.find('.invite-list-item:lt(5) hr').show();
        $listRoot.find('.invite-list-item:lt(5):last hr').hide();
        $listRoot.find('.invite-list-item:lt(5)').show();
    }

    function getPostData() {
        var inviteList = $listRoot.find('.invite-list-item:lt(5)');
        var arrayList = new Array();
        inviteList.each(function(){
            var $this = $(this);
            arrayList.push($this.data('id'));
        });
        return arrayList;
    }

    $delete.on('click',function(){
        var $this = $(this);
        var $deleteItem = $this.parents('.invite-list-item:first');
        var id = $deleteItem.data('id');
        var postData = {};
        postData.id = id;
        postData.status = 2; 
        postData.key = key;
        wAjax({
            url: '/wmp/user/'+appConfigId+'/comment/batch/handle',
            type: 'post',
            data: postData,
            success: function(obj){
                $deleteItem.remove();
                updateListStatus();
                if($listRoot.find('.invite-list-item').length == 0) {
                    window.location.href=util.addTimeStamp(obj['data']);          
                }
            }
        });
        updateListStatus();
    })

    $submitBtn.on('click',function(){        
        var postData = {};
        postData.id = getPostData();
        postData.status = 1; 
        postData.key = key;
        wAjax({
            url: '/wmp/user/'+appConfigId+'/comment/batch/handle',
            type: 'post',
            data: postData,
            success: function(obj){
                showCompleteMsg({
                    msg: "评论请求已发送！",
                    interval: 1500,
                    callback: function(){
                       window.location.href=util.addTimeStamp(obj['data']);
                    }
                });               
            }
        }); 
    });

    $ignoreBtn.on('click',function(){
        var postData = {};
        postData.id = getPostData();
        postData.status = 2; 
        postData.key = key;
        wAjax({
            url: '/wmp/user/'+appConfigId+'/comment/batch/handle',
            type: 'post',
            data: postData,
            success: function(obj){
               window.location.href=util.addTimeStamp(obj['data']);
            }
        });         
    });


});
