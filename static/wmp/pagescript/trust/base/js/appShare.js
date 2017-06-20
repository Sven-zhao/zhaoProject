require([
    'jquery',
    'modules/net/wAjax'
],function($,wAjax){

    window.shareCallback = function(data){
        if(typeof data === "string"){
            data = $.parseJSON(data);
        }

        if(data.b && !data.channel){
            data.channel = data.b;
            // delete data.b;
        }

        if(data.channel == 11){//朋友圈
            $.get('http://s.zhisland.com/share.gif?r='+Math.random()+'&pj=wmp&oid='+uid+'&module=appTrust&s_url='+encodeURIComponent(window.location.href)+'&scope=shareTimeline');
        }else if(data.channel == 10){//朋友
            $.get('http://s.zhisland.com/share.gif?r='+Math.random()+'&pj=wmp&oid='+uid+'&module=appTrust&s_url='+encodeURIComponent(window.location.href)+'&scope=shareAppMessage');
        };

        if(window.appShareFinish){
            window.appShareFinish(data);
        }

        //通知app端 success

        if(window.Android){
            window.Android.serverShare();
        };

        return data.channel;
    }
});
