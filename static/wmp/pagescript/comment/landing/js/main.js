require(['jquery','wxapi','pagescript/base/js/wxStat','modules/net/wAjax'],function($,wx,wxStat,wAjax){
    if(SHARE_CONFIG.title != "") {
        wx.config($.extend({
            debug: DEBUG,
            jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage']
        },WXCONFIG));
        wx.ready(function(){
            wx.onMenuShareTimeline({
                title: SHARE_CONFIG.title, 
                link: SHARE_CONFIG.link, // 分享链接
                imgUrl: SHARE_CONFIG.imgUrl, // 分享图标
                desc: SHARE_CONFIG.desc, // 分享描述
                success: function () { 
                    setTimeout(function(){
                        $mask.hide();
                        wxStat({
                            appConfigId: appConfigId,
                            data: STAT_CONFIG.custom
                        });
                     },100);
                },
                cancel: function () { 
                    setTimeout(function(){
                        $mask.hide();
                     },100);
                }
            });
            wx.onMenuShareAppMessage({
                title: SHARE_CONFIG.title,
                link: SHARE_CONFIG.link, // 分享链接
                imgUrl: SHARE_CONFIG.imgUrl, // 分享图标
                desc: SHARE_CONFIG.desc, // 分享描述
                success: function () {
                    setTimeout(function(){
                        $mask.hide();
                        wxStat({
                            appConfigId: appConfigId,
                            data: STAT_CONFIG.custom
                        });
                     },100);
                },
                cancel: function () {
                    setTimeout(function(){
                        $mask.hide();
                     },100);
                }
            });
            wx.showOptionMenu();
        });   
    } 
    else {
        require(['wxapi.default.config']);
    }
    
    var $mask = $('.share-box');
    var source = $('input[name=source]').val();
    var openid = $('input[name=openid]').val();
    // show the share mask
    $('#invite-btn').on('touchstart',function(){
        wAjax({
            url: '/wmp/user/'+appConfigId+'/comment/share/click',
            type: 'get',
            data: {'source':source,'openid':openid},
            success: function(obj){
                
            },
            error: function(obj) {
              
            },
            generalError: function(obj) {
               
            }
        }); 
        $mask.show();
    });
    $mask.on('touchstart',function(){
        $mask.hide();
    });

});