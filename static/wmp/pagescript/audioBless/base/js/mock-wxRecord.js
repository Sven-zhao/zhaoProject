var wx = {
    showOptionMenu:function(){
        console.log("[wx-record] wx.showOptionMenu()");
    },
    hideOptionMenu:function(){
        console.log("[wx-record] wx.hideOptionMenu()");
    },
    startRecord:function(config){
        console.log("[wx-record] wx.startRecord()");
        config.success();
    },
    stopRecord:function(config){
        console.log("[wx-record] wx.stopRecord()");
        var res = {
            localId : parseInt(Math.random()*9999),
        }
        config.success(res);
    },
    playVoice:function(config){
        console.log("[wx-record] wx.playVoice()",config.localId);
    },
    stopVoice:function(config){
        console.log("[wx-record] wx.stopVoice()",config.localId);
        config.success();
    },
    onVoicePlayEnd:function(config){
        var res = {
            localId : parseInt(Math.random()*9999),
        }
        setTimeout(function(){
            console.log("[wx-record] wx.onVoicePlayEnd()");
            config.success(res);
        },2500);
    },
    onVoiceRecordEnd:function(config){
        console.log("[wx-record] wx.onVoiceRecordEnd()");
        var res = {
            localId : parseInt(Math.random()*9999),
        }
        config.complete(res);
    },
    uploadVoice:function(config){
        console.log("[wx-record] wx.uploadVoice()","localId:",config.localId);
        var res = {
            serverId : parseInt(Math.random()*9999),
        }
        console.log("[wx-record] serverId:",res.serverId);
        config.success(res);
    },
    downloadVoice:function(config){
        console.log("[wx-record] wx.downloadVoice()","serverId:",config.serverId);
        var res = {
            localId : parseInt(Math.random()*9999),
        }
        config.success(res);
    },
    ready:function(callback){
        setTimeout(function(){
            console.log("[wx-record] wxReady");
            callback();
        },2000);
    }
}
