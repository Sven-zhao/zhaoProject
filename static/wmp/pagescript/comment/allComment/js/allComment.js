require(['jquery','wxapi','modules/ui/load/js/load','modules/ui/popup/js/popup','modules/net/wAjax','pagescript/base/js/wxStat'],function($,wx,load,Popup,wAjax,wxStat){
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

    var refer = $('input[name=refer]').val();
    
    // scroll the window to load more content
    var $lastItemGroup = $('.item-group:last'),
        initPage = $lastItemGroup.data('pageNum'),
        initHasMore = $lastItemGroup.data('hasMore');
    initPage = $.isNumeric(initPage)?initPage+1:1;
    initHasMore = initHasMore == 'true' || initHasMore == 'yes';

    new load({
        url: '/wmp/user/'+appConfigId+'/comment/list',
        extraData: {'refer':refer},
        firstLoad: true,
        nextPage: initPage,
        hasMore: initHasMore,
        listRoot: $('.list'),
        listItemGroupSelector: '.item-group',
        loadRate: 0.8
    });

    var $mask = $('.share-box');
    // show the share mask
    $('.me .btn').on('touchstart',function(){
        $mask.show();
    });
    $mask.on('touchstart',function(){
        $mask.hide();
    });

    // set top
    var popupMsgbox = new Popup({
        $popup: $('#pop-msgbox.popup')
    });
    var $commentList = $('.comment-list');
    $commentList.on('click','.set-top',function(){
        var $this = $(this);
        var $detailRoot = $this.parents('.comment-list-detail:first');
        var topCommentLength = $commentList.find('.set-top.true').length;
        var dotopOpt = true;
        var status = 0;
        var uid = $detailRoot.data('uid');
        if($this.hasClass('true')) {
            status = 0;
            if (topCommentLength >= 2) {
                $commentList.find('.set-top.true:last').parents('.comment-list-detail:first').after($detailRoot);
            }
        }
        else {
            if(topCommentLength <=2 ) {
                status = 1;
                $commentList.find('.comment-list-group:first').prepend($detailRoot);
            }
            else {
                popupMsgbox.show();
                dotopOpt = false;
            }
        }
        if(dotopOpt) {
            $this.toggleClass('true');        
            wAjax({
                url: '/wmp/user/'+appConfigId+'/comment/set/top',
                type: 'post',
                data: {'status':status,'uid':uid},
                success: function(obj){
                    
                }
            }); 
        }
    })

    // delete
    var popupConfirm = new Popup({
        $popup: $('#pop-confirm.popup'),
        confirm: function(){
            var uid = $detailRoot.data('uid');            
            wAjax({
                url: '/wmp/user/'+appConfigId+'/comment/delete',
                type: 'post',
                data: {'uid':uid},
                success: function(obj){
                    $detailRoot.remove();
                }
            }); 
        }
    });
    var $detailRoot = undefined;
    $commentList.on('click','.delete',function(){
        popupConfirm.show();
        var $this = $(this);
        $detailRoot = $this.parents('.comment-list-detail:first');
    });

    // celebrate
    $commentList.on('click','.celebrate',function(){
        var $this = $(this);
        var bingoNum = $this.attr('bingo');
        var $detailRoot = $this.parents('.comment-list-detail:first');
        var uid = $detailRoot.data('uid');
        if(!$.isNumeric(bingoNum)) {
            bingoNum = 0;
        }
        else {
            bingoNum = parseInt(bingoNum);
        }
        if(!$this.hasClass('true')) {
            bingoNum++;
            var allTheSameComments = $('.comment-list [data-uid='+uid+']');
            allTheSameComments.each(function(){
                var $that = $(this).find('.celebrate');                
                $that.addClass('true');
                $that.attr('bingo',bingoNum); 
            });
            wAjax({
                url: '/wmp/user/'+appConfigId+'/comment/like',
                type: 'post',
                data: {'uid':uid,'refer':refer},
                success: function(obj){
                    
                }
            }); 
        }
    });
});