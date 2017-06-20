require(['modules/net/wAjax','modules/base/js/util','wxapi.default.config'],function(wAjax,util){

    var key = $('input[name=key]').val();
    var from = $('input[name=from]').val();
    var id = $('.profile-v').data('id');

    $('#ignore').on('click',function(){
        wAjax({
            url: '/wmp/user/'+appConfigId+'/comment/ignore/invite',
            type: 'post',
            data: {'key':key, 'from':from, 'id':id},
            success: function(obj){
                window.location.href=util.addTimeStamp(obj['data']);
            }
        });         
    });

});