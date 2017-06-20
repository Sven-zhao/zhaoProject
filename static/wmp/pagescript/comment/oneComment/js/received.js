require(['jquery','wxapi','modules/ui/popup/js/popup','modules/net/wAjax','modules/base/js/util'],function($,wx,Popup,wAjax,util){
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
                    $mask1.hide();
                    $mask2.hide();
                 },100);
            },
            cancel: function () { 
                setTimeout(function(){
                    $mask1.hide();
                    $mask2.hide();
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
                    $mask1.hide();
                    $mask2.hide();
                 },100);
            },
            cancel: function () {
                setTimeout(function(){
                    $mask1.hide();
                    $mask2.hide();
                 },100);
            }
        });
        wx.showOptionMenu();
    });   

    var $mask1 = $('.mask');
    var $mask2 = $('.share-box');
    var refer = $('input[name=refer]').val();

    (function(){
        if($('input[name=isShared]').val()=='true') {
            $mask1.show();
        }
    })();

    // show the share mask
    $('.exhibit').on('touchstart',function(){
        $mask1.show();
    });
    $mask1.add($mask2).on('touchstart',function(){
        $mask1.hide();
        $mask2.hide();
    });

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
                    window.location.href=util.addTimeStamp(obj['data']);
                }

            }); 
        }
    });
    var $detailRoot = undefined;
    $('.delete').on('touchstart',function(){
        popupConfirm.show();
        var $this = $(this);
        $detailRoot = $this.parents('.comment-list');
    });

    // celebrate
    $('.celebrate').on('touchstart',function(){
        var $this = $(this);
        var bingoNum = $this.attr('bingo');        
        var $detailRoot = $this.parents('.comment-list');
        var uid = $detailRoot.data('uid');   
        if(!$.isNumeric(bingoNum)) {
            bingoNum = 0;
        }
        else {
            bingoNum = parseInt(bingoNum);
        }
        if(!$this.hasClass('true')) {
            bingoNum++;
            $this.addClass('true');
            $this.attr('bingo',bingoNum); 
            $mask2.show();
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