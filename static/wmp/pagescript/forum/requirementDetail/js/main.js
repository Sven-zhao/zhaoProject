require(['jquery','wxapi','modules/ui/load/js/load','jquery-hammer'],function($,wx,load){
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

    var corpId = $('input[name=corpId]').val();

    // scroll the window to load more content
    var $lastItemGroup = $('.item-group:last'),
        initPage = $lastItemGroup.data('pageNum'),
        initHasMore = $lastItemGroup.data('hasMore');
    initPage = $.isNumeric(initPage)?initPage+1:1;
    initHasMore = initHasMore == 'true' || initHasMore == 'yes';

    new load({
        url: '/wmp/user/'+appConfigId+'/forum/require/apply/list',
        firstLoad: true,
        extraData: {'corpId':corpId},
        nextPage: initPage,
        hasMore: initHasMore,
        listRoot: $('.list'),
        listItemGroupSelector: '.item-group',
        loadRate: 0.8
    });     

    var screenWidth = $(window).width();
    var $bannerContainer = $('.banner ul');
    var $bannerItem = $('.banner ul li');
    var bannerLen = $bannerItem.length;
    var index = 0;

    //init
    (function(){
        $bannerContainer.css('width',screenWidth*bannerLen);
        $bannerItem.css({'width':screenWidth,'display':'inline-block'});
    })();

    //functions
    var bannerDisplay = function(index){       
        var newPostionLeft = -index * screenWidth;
        $bannerContainer.stop(true, false).animate({ 'left': newPostionLeft}, 300);
    }
    //bind event
    $bannerContainer.hammer().bind('panstart',function(e){
        //right
        if(e.gesture.direction == 4) {
            if(index>0) {
                index--;
                bannerDisplay(index);
            }
        }
        //left
        else if(e.gesture.direction == 2) {
            if(index<bannerLen-1) {
                index++;
                bannerDisplay(index);
            }
        }
    });

    $('.banner').on('touchmove',function(e){
        e.preventDefault();
    })


});