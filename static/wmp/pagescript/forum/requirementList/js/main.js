require(['jquery','wxapi','modules/ui/load/js/load'],function($,wx,load){
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
            },
            cancel: function () { 
            }
        });
        wx.onMenuShareAppMessage({
            title: SHARE_CONFIG.title,
            link: SHARE_CONFIG.link, // 分享链接
            imgUrl: SHARE_CONFIG.imgUrl, // 分享图标
            desc: SHARE_CONFIG.desc, // 分享描述
            success: function () {
            },
            cancel: function () {
            }
        });
        wx.showOptionMenu();
    });    

    (function(){
        //show the tip
        var storage = window.localStorage;
        if(storage){
            if(!storage.getItem('forum.showTip')) {
                $('.cover').show();
                $('.cover').on('click',function(){
                    storage.setItem('forum.showTip',true); 
                    $(this).hide();
                })
            }
        }
    })();

    // scroll the window to load more content
    var $lastItemGroup = $('.item-group:last'),
        initPage = $lastItemGroup.data('pageNum'),
        initHasMore = $lastItemGroup.data('hasMore');
    initPage = $.isNumeric(initPage)?initPage+1:1;
    initHasMore = initHasMore == 'true' || initHasMore == 'yes';

    new load({
        url: '/wmp/user/'+appConfigId+'/forum/rank/index',
        firstLoad: false,
        nextPage: initPage,
        hasMore: initHasMore,
        listRoot: $('.list'),
        listItemGroupSelector: '.item-group',
        loadRate: 0.8
    });     
});