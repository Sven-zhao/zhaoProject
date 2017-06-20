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
    $('#return-project').on('click',function() {
        window.location = '/wmp/user/' + appConfigId + '/innovation/project/index?t=' + Math.random();
    });

});

