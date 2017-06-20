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
                setTimeout(function(){
                    $mask.hide();
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

    var referUid = $('input[name=referUid]').val();

    // scroll the window to load more content
    var $lastItemGroup = $('.item-group:last'),
        initPage = $lastItemGroup.data('pageNum'),
        initHasMore = $lastItemGroup.data('hasMore');
    initPage = $.isNumeric(initPage)?initPage+1:1;
    initHasMore = initHasMore == 'true' || initHasMore == 'yes';

    new load({
        url: '/wmp/user/'+appConfigId+'/forum/corp/support/list',
        firstLoad: true,
        extraData: {'referUid':referUid},
        nextPage: initPage,
        hasMore: initHasMore,
        listRoot: $('.list'),
        listItemGroupSelector: '.item-group',
        loadRate: 0.8
    });  

    var $mask = $('.mask');
    // show the share mask
    $('#invite').on('touchstart',function(){
        $mask.show();
    });
    $mask.on('touchstart',function(){
        $mask.hide();
    });   

    (function(){
        var isShared = $('input[name=isShared]').val();
        if(isShared == 'true') {
            $mask.show();
        }
    })(); 
});