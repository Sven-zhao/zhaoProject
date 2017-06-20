/**
 * Created by liuxiaofei on 16/7/26.
 */
require(['jquery','common/jquery-plugins/fastclick','wxapi','pagescript/quiz/base/js/wAjax'],function($,fastclick,wx,wAjax){
    // init

    (function(){
        fastclick.attach(document.body);
    })();

    // 分享到朋友圈
    var $mask = $('.mask');

    wx.config($.extend({
        debug: DEBUG,
        jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage']
    },WXCONFIG));
    wx.ready(function(){
        //朋友圈
        wx.onMenuShareTimeline({
            title: SHARE_CONFIG.title,
            link: SHARE_CONFIG.link, // 分享链接
            imgUrl: SHARE_CONFIG.imgUrl, // 分享图标
            success: function () {
                setTimeout(function(){
                    $mask.hide();
                },100);
            },
            cancel: function () {
                $mask.hide();
            }
        });
        //朋友
        wx.onMenuShareAppMessage({
            title: SHARE_CONFIG.title,
            link: SHARE_CONFIG.link, // 分享链接
            imgUrl: SHARE_CONFIG.imgUrl, // 分享图标
            desc: SHARE_CONFIG.desc, // 分享描述
            success: function () {
                setTimeout(function(){
                    $mask.hide();
                },100);
            },
            cancel: function () {
                $mask.hide();
            }
        });
        wx.showOptionMenu();
    });
        $(".wrap-all").css("visibility","visible");
    //解决底部按钮加载的问题
    $('#send-project').on('click',function() {
        window.location = 'http://x.eqxiu.com/s/oB600Zpl';
    });

    $('#enter-project').on('click',function() {
        window.location = '/wmp/user/' + appConfigId + '/innovation/project/index?t=' + Math.random();
    });

    //===================================

    // 滚动加载
    var box = $('.warp-ideal-project');
    var loading = $('<div class="loading"></div>');
    loading.css("height","0px");
    box.append(loading);
    var isajax = false;

    var sendData = {'corpId':$("[name='corpId']").val(),'page':0};

    function loadCon(ops){
        if(isajax == 1){
            return ;
        }
        var ops = {
            url:'/wmp/user/' + appConfigId + '/innovation/project/corp/intention',
            type:'post',
            data:sendData
        };
        sendData.page += 1;
        isajax = 1;
        $.ajax(ops).then(function(rs) {
            rs = $(rs);
            loading.before(rs);
            if($('.ideal-project').length == 0){
                $('.required-content:last').css("padding-bottom","1.5rem");
            }
            if(rs.attr("data-has-more") == 'no'){
                $(".ideal-project").not(":last").find(".ideal-list-type").css("border-bottom","1px solid #cecece");
                loading.remove();
                return ;
            }
            isajax = 0;
        });
    }
    loadCon();
    touchmove();
    function touchmove(){
        $("body").on('touchmove',function(){
            var win_h = $(window).height(),
                body_h = $('body').height(),
                scroll_h = document.body.scrollTop,
                fix_h = $('.fix').height();
            //if((win_h+scroll_h >= 0.5*body_h) && (body_h >= win_h) && !isloading && hasmore == "yes"){
            if($(window).scrollTop()>=$(document).height()-$(window).height()){
                loadCon();
            }
        });
    }


});
