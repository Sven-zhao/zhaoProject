require(['jquery','modules/net/wAjaxV2','modules/net/wAjax','wxapi','jquery-hammer'],function($,wAjax,wAjax1,wx){
    var $submitBtn = $('#submit-btn');
    wx.config($.extend({
        debug: DEBUG,
        jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage']
    },WXCONFIG));   

    wx.ready(function(){
        //wx.hideOptionMenu();
    });

    //ajax-url
    var ajaxUrl = {
        'changeCard':'/wmp/user/'+appConfigId+'/personal/add/friend/agreed'
    }

    var topurl = window.location.href;

    //varibles defination
    var $mask = $('#sharePop');
    var $btnShare = $('#share');

    //bind event
    $btnShare.on('click',function(){
        $mask.show();
    });
    $mask.on('click',function(){
        $mask.hide();
    });

    function hideMask() {
        $mask.hide();
    }

    wx.ready(function(){
        //朋友圈
        wx.onMenuShareTimeline({
            title: SHARE_CONFIG.title,
            link: SHARE_CONFIG.link, // 分享链接
            imgUrl: SHARE_CONFIG.imgUrl, // 分享图标
            success: function () { 
                setTimeout(hideMask,100);
            },
            cancel: function () { 
                setTimeout(hideMask,100);
            }
        });
        //朋友
        wx.onMenuShareAppMessage({
            title: SHARE_CONFIG.title,
            link: SHARE_CONFIG.link, // 分享链接
            imgUrl: SHARE_CONFIG.imgUrl, // 分享图标
            desc: SHARE_CONFIG.desc, // 分享描述
            success: function () {
               setTimeout(hideMask,100);
            },
            cancel: function () {
                setTimeout(hideMask,100);
            }
        });
        wx.showOptionMenu();
    });

    var $asynContentContainer = $('#asyn-content-container');
    var uid = $('input[name=uid]').val();
    var showFrags = $('input[name=showFrags]').val();

    function retrieveComment(resolve, reject){
        wAjax({
                url: '/wmp/user/'+appConfigId+'/personal/frag/'+uid+'/comment',
                data: {},
                success: function(rs) {
                    resolve(rs);
                },
                error: function(obj) {
                    reject();
                }
        });
    }
    function retrieveFriends(resolve, reject){
        if(showFrags == 'true') {
            wAjax({
                    url: '/wmp/user/'+appConfigId+'/personal/frag/'+uid+'/friends',
                    data: {},
                    success: function(rs) {
                        resolve(rs);
                    },
                    error: function(obj) {
                        reject();
                    }
            });
        }
        else {
            resolve('');
        }
    }
    function retrieveResource(resolve, reject){
        if(showFrags == 'true') {
            wAjax({
                    url: '/wmp/user/'+appConfigId+'/personal/frag/'+uid+'/resource',
                    data: {},
                    success: function(rs) {
                        resolve(rs);
                    },
                    error: function(obj) {
                        reject();
                    }
            });
        }
        else {
            resolve('');
        }
    }
    function retrieveDrips(resolve, reject){
        wAjax({
                url: '/wmp/user/'+appConfigId+'/personal/frag/'+uid+'/drips',
                data: {},
                success: function(rs) {
                    resolve(rs);
                },
                error: function(obj) {
                    reject();
                }
        });
    }
    function retrieveContact(resolve, reject){
        if(showFrags == 'true') {
            wAjax({
                    url: '/wmp/user/'+appConfigId+'/personal/frag/'+uid+'/contact',
                    data: {},
                    success: function(rs) {
                        resolve(rs);
                    },
                    error: function(obj) {
                        reject();
                    }
            });
        }
        else {
            resolve('');
        }
    }

    (function(){
        new Promise(retrieveComment).then(function(rs){
            $asynContentContainer.append(rs);
            return new Promise(retrieveFriends);
        }).then(function(rs){
            $asynContentContainer.append(rs);
            initCommonFriend();
            return new Promise(retrieveResource);
        }).then(function(rs){
            $asynContentContainer.append(rs);
            return new Promise(retrieveDrips);
        }).then(function(rs){
            $asynContentContainer.append(rs);
            return new Promise(retrieveContact);
        }).then(function(rs){
            $asynContentContainer.append(rs);
        })
    })();


    //tab
    $('.tab-btn').on('touchend','li',function(e){
        var index = $(this).index();
        $('.tab-btn li').removeClass('cur');
        $(this).addClass('cur');
        $('.tab-con-item').hide();
        $('.tab-con-item').eq(index).show();
    });

    function initCommonFriend() {
        //commonfriend
        var $commonfriend = $('#common_friend .head-list');
        var friendLen = $commonfriend.find('li').length;
        var FRIENDWIDTH = 40;
        var index = 0;
        var rootContainerWidth = $('#common_friend .mod-con-box').width();
        var lengthOfBlock = parseInt(rootContainerWidth/FRIENDWIDTH);
        //init
        $commonfriend.css({'width':FRIENDWIDTH*friendLen+'px'});
        $commonfriend.show();
        //functions
        var showFriend = function(index){       
            var newPostionLeft = -index * FRIENDWIDTH;
            $commonfriend.stop(true, false).animate({ 'left': newPostionLeft}, 300);
        }
        //bind event
        $commonfriend.hammer().bind('panstart',function(e){
            //right
            if(e.gesture.direction == 4) {
                if(index>0) {
                    index--;
                    showFriend(index);
                }
            }
            //left
            else if(e.gesture.direction == 2) {
                if(index<friendLen-lengthOfBlock) {
                    index++;
                    showFriend(index);
                }
            }
        });
    }

    //弹窗-交换名片成功
    $('#changeCard').on('click',function(){
        $('.changetips-window').show();
        //ajax
        wAjax({
            url:ajaxUrl.changeCard,
            data: {key:$('input[name="key"]').val()},
            success: function(rs) {
                
            }
        });
    });
    
    $('.confirm-btn').on('click',function(e){
        e.stopPropagation();
        $('.changetips-window').hide();
        //document.location.reload();
        window.location.href = topurl + '&t=' +new Date().getTime();
        //$('#changeCard').text('打开APP聊天').attr('href','http://m.zhisland.com').removeAttr('id');
    });

});
