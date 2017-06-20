require([
    'jquery',
    'modules/ui/danmaku/js/main'
],function($,Danmaku){
    // var curPageCount = 1;
    // var curDanmakuCount = 2;
    // $.ajax = function(obj){
    //     if(obj.url.indexOf('getTags') > 0){
    //         console.log(obj.data.page);
    //         if(obj.data.page > 2){
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
    //                     "hasMore":true
    //                 }
    //             }
    //         }
    //     };
    //     obj.success(callbackData);
    // };


    var unionId = $('input[name="unionId"]').val();

    new Danmaku({
            request:{
            url:'/wmp/user/' + appConfigId + '/trust/ajax/personal/getTags',
            data:{unionId:unionId}
        },
        lineNumber:4,
        pond : pondData,
    });

    setTimeout(function(){
        $('.loading-mask').remove();
    },0);
});
