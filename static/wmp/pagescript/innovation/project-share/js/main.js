/**
 * Created by liuxiaofei on 16/7/26.
 */
/**
 * Created by liuxiaofei on 16/7/26.
 */
require(['wxapi.default.config']);
require(['jquery','common/jquery-plugins/fastclick','wxapi','pagescript/quiz/base/js/wAjax'],function($,fastclick,wx,wAjax){
    // init
    (function(){
        fastclick.attach(document.body);
    })();

    $(".wrap-all").css("visibility","visible");
    $.ajax({
        url:'/wmp/user/' + appConfigId + '/innovation/project/support/list',
        type:'get',
        //dataType:'json',
        //cache:false,
        success:function(rs){
            console.log(rs);
        },
        error:function(){

        }
    });

    $('#share-more').on('click',function() {
        window.location = '/wmp/user/' + appConfigId + '/innovation/project/index?t=' + Math.random();
    });

});
