require(['jquery',
    'anime',
    'modules/ui/loadinglist/js/main',
    'swig',
    'modules/net/wAjax',
    'modules/ui/showMsg/js/complete',
    'pagescript/trust/base/js/wxshare',
    'modules/ui/danmaku/js/main',
    'modules/ui/goTop/js/main'],function($,anime,LoadingList,swig,wAjax,Msg,wxshare,Danmaku,goTop){
    // var curPageCount = 1;
    // var curDanmakuCount = 1;
    // $.ajax = function(obj){
    //     var callbackData = {};
    //     if(obj.url.indexOf('List') > 0){
    //         callbackData = {
    //             "code": 0,
    //             "msg": "success",
    //             "data": {
    //                 "curPage": curPageCount++,
    //                 "resultData": [{
    //                     "similarScore": 15,
    //                     "unionId":"oL22ft4c82lCxTSgkGOJ8RAvrpKQ",
    //                     "userAvatar": "http://192.168.2.81:8201/impic/T1cNLTBXLT1RXrhCrK.jpg",
    //                     "userName": "zzx",
    //                     "userIdentityType": 5,
    //                     "tagMap":"aaa、bb、cccaaaaaaaaaaaaaaaaaaaaa"
    //                 }],
    //                 "hasMore": true,
    //                 "friendCount":312
    //             }
    //         }
    //     };
    //     if(obj.url.indexOf('getTags') > 0){
    //         console.log(obj.data.page);
    //         if(obj.data.page > 1){
    //
    //             callbackData = {
    //                 "code": 0,
    //                 "msg": "success",
    //                 "data": {
    //                     "curPage": curDanmakuCount++,
    //                     "resultData": [{
    //                         "tagList": ["22耳机耳机耳机", "发额发额耳机", "而且而且耳机"],
    //                         "userAvatar": "http://192.168.2.81:8201/impic/T1cNLTBXLT1RXrhCrK.jpg"
    //                     }, {
    //                         "tagList": ["22大哥", "二哥", "三哥"],
    //                         "userAvatar": "http://192.168.2.81:8201/impic/T1N4YTByZT1RXrhCrK.jpg"
    //                     }],
    //                     "hasMore": false
    //                 }
    //             }
    //         }else{
    //             callbackData =  {
    //                 "code": 0,
    //                 "msg": "success",
    //                 "data": {
    //                     "curPage": curDanmakuCount++,
    //                     "resultData": [{
    //                         "tagList": ["耳机耳机耳机", "发额发额发额", "而且而且而且"],
    //                         "userAvatar": "http://192.168.2.81:8201/impic/T1cNLTBXLT1RXrhCrK.jpg"
    //                     }, {
    //                         "tagList": ["大哥", "二哥", "三哥"],
    //                         "userAvatar": "http://192.168.2.81:8201/impic/T1N4YTByZT1RXrhCrK.jpg"
    //                     },{
    //                         "tagList": ["耳机耳机耳机", "发额发额发额", "而且而且而且"],
    //                         "userAvatar": "http://192.168.2.81:8201/impic/T1cNLTBXLT1RXrhCrK.jpg"
    //                     }, {
    //                         "tagList": ["大哥", "二哥", "三哥"],
    //                         "userAvatar": "http://192.168.2.81:8201/impic/T1N4YTByZT1RXrhCrK.jpg"
    //                     },{
    //                         "tagList": ["耳机耳机耳机", "发额发额发额", "而且而且而且"],
    //                         "userAvatar": "http://192.168.2.81:8201/impic/T1cNLTBXLT1RXrhCrK.jpg"
    //                     }, {
    //
    //                         "tagList": ["大哥", "二哥", "三哥"],
    //                         "userAvatar": "http://192.168.2.81:8201/impic/T1N4YTByZT1RXrhCrK.jpg"
    //                     },{
    //                         "tagList": ["耳机耳机耳机", "发额发额发额", "而且而且而且"],
    //                         "userAvatar": "http://192.168.2.81:8201/impic/T1cNLTBXLT1RXrhCrK.jpg"
    //                     }, {
    //                         "tagList": ["大哥", "二哥", "三哥"],
    //                         "userAvatar": "http://192.168.2.81:8201/impic/T1N4YTByZT1RXrhCrK.jpg"
    //                     },{
    //                         "tagList": ["耳机耳机耳机", "发额发额发额", "而且而且而且"],
    //                         "userAvatar": "http://192.168.2.81:8201/impic/T1cNLTBXLT1RXrhCrK.jpg"
    //                     }, {
    //
    //                         "tagList": ["大哥", "二哥", "三哥"],
    //                         "userAvatar": "http://192.168.2.81:8201/impic/T1N4YTByZT1RXrhCrK.jpg"
    //                     }],
    //
    //                     "hasMore":true
    //                 }
    //             }
    //         }
    //     };
    //     obj.success(callbackData);
    // };
//


    var unionId = $('input[name="unionId"]').val();

    (function(){
        var newFriendNum = $('input[name="newFriendNum"]').val();
        if(newFriendNum > 0 ){
            Msg({
                msg: ("有 "+newFriendNum+ " 位新朋友加入你的靠谱蜜友录"),
                interval : 2500,
            });
        }
    })();


    (function(){
        var waitingFriendNum = $('input[name="waitingFriendNum"]').val();
        var delay = $('input[name="newFriendNum"]').val() > 0 ? 3000: 0;
        if(waitingFriendNum > 0){
            setTimeout(function(){
                $('.waiting-task-bar').addClass('show').on('click',function(){
                    $(this).removeClass('show');
                });
            },delay);
        }
    })();
    //

    new Danmaku({
        request:{
            url:'/wmp/user/' + appConfigId + '/trust/ajax/personal/getTags',
            data:{unionId:unionId}
        },
        lineNumber:2,
    });

    //tab
    (function(){
        var screenHeight = $(window).height();
        var fiexdBottomBarHeight = $('.fixed-bottom-bar').innerHeight();
        var $listArea = $('.reliable-person');

        $listArea.css({
            height:(screenHeight - fiexdBottomBarHeight),
            marginBottom: fiexdBottomBarHeight,
        });

        var createLoading = (function(){
            var WhosMyList ,WhosemIList;
            return function(identify){
                if(identify == "whosMy" && WhosMyList === undefined){
                    WhosMyList = new LoadingList({
                        dataUrl: '/wmp/user/' + appConfigId + '/trust/ajax/personal/WhoIsMineFriendListByPage',
                        itemTemplate: $('#reliable-person-item-tpl'),
                        loadingEle: $('.reliable-person-loading'),
                        emptyPrompt: $('.reliable-person-empty'),
                        list: $('#whosMy ul'),
                        scrollBox : $('#whosMy'),
                        scroller : $('#whosMy ul'),
                        getDataList: function(obj) {
                            return {
                                result:obj['data']['resultData'],
                                type:'0',
                                appConfigId: appConfigId,
                                unionId:unionId,
                            };
                        },
                        hasMoreTest: function(obj) {
                            return obj['data']['hasMore'];
                        },
                        param: {
                            page: 1,
                            unionId : unionId
                        },
                        onLoaded: function(obj) {
                            this.param['page'] = obj['data']['curPage']+1;

                            var count = obj['data']['friendCount'];
                            var text = $('[href="#whosMy"]').text();
                            text = text.replace(/\d+/g,count);
                            $('[href="#whosMy"]').text(text);
                        }
                    });
                }else if(identify == "whosemI" && WhosemIList === undefined){
                    WhosemIList = new LoadingList({
                        dataUrl: '/wmp/user/' + appConfigId + '/trust/ajax/personal/getIAmWhosFriendListByPage',
                        itemTemplate: $('#reliable-person-item-tpl'),
                        loadingEle: $('.reliable-person-loading'),
                        emptyPrompt: $('.reliable-person-empty'),
                        list: $('#whosemI ul'),
                        scrollBox : $('#whosemI'),
                        scroller : $('#whosemI ul'),
                        getDataList: function(obj) {
                            return {
                                result:obj['data']['resultData'],
                                type:'1',
                                appConfigId: appConfigId,
                                unionId:unionId,
                            };
                        },
                        hasMoreTest: function(obj) {
                            return obj['data']['hasMore'];
                        },
                        param: {
                            page: 1,
                            unionId : unionId
                        },
                        onLoaded: function(obj) {
                            this.param['page'] = obj['data']['curPage']+1;

                            var count = obj['data']['friendCount'];
                            var text = $('[href="#whosemI"]').text();
                            text = text.replace(/\d+/g,count);
                            $('[href="#whosemI"]').text(text);
                        }
                    });
                }
            }
        })();


        var $switchers = $('.reliable-person-switch a');
        var $switchContainers = $('.reliable-person-list > div');

        //init
        var init = function(){
            $switchers.removeClass('active');
            $($switchers[0]).addClass('active');
            $switchContainers.css({visibility:'hidden',zIndex:'1'});
            $($switchContainers[0]).css({visibility:'visible',zIndex:'2'});

            createLoading("whosMy");
        }

        var switchCallBack = function(event){
            event.preventDefault();
            var self = $(this);
            if(self.hasClass('active')){
                return;
            }
            //toggle Class
            $switchers.removeClass('active');
            self.addClass('active');

            var targetId = self.attr('href');
            var target = $(targetId);
            $switchContainers.css({visibility:'hidden',zIndex:'1',display:'none'});
            target.css({visibility:'visible',zIndex:'2',display:'block'});
            createLoading(targetId.replace(/#/,""));
        };

        $switchers.on('click',switchCallBack);
        init();
    })();


    //goTop
    goTop(200);

    $('.reliable-person-list a').on('touchmove touchstart touchend',function(event){
        event.preventDefault();
    });
});
