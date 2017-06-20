require([
    ‘jquery’
],function(){
    /**
     * [setupWebViewJavascriptBridge 建立通信函数]
     * @param  {Function} callback [app端注入回调]
     * @return {[type]}            [void]
     */
    function setupWebViewJavascriptBridge(callback) {
        if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
        if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
        window.WVJBCallbacks = [callback];
        var WVJBIframe = document.createElement('iframe');
        WVJBIframe.style.display = 'none';
        WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
        document.documentElement.appendChild(WVJBIframe);
        setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0);
    }
    var iOSbridge = {};
    setupWebViewJavascriptBridge(function(bridge) {
        iOSbridge = bridge;
    });


    window.requestAuth = function (){

        var authCallback = function(data){

            brige.registerHadler('operationHandler',function(responseCallback){
                var operation = '';
                responseCallback(operation);
            });
        };

        $.get('',authCallback);
    }
});
