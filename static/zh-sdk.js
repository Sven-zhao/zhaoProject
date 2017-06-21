/**!
 * zh-sdk.js v0.0.1
 * (c) 2016-2017
 * author bojan
 */
(function(){'use strict';var f,g=[];function l(a){g.push(a);1==g.length&&f()}function m(){for(;g.length;)g[0](),g.shift()}f=function(){setTimeout(m)};function n(a){this.a=p;this.b=void 0;this.f=[];var b=this;try{a(function(a){q(b,a)},function(a){r(b,a)})}catch(c){r(b,c)}}var p=2;function t(a){return new n(function(b,c){c(a)})}function u(a){return new n(function(b){b(a)})}function q(a,b){if(a.a==p){if(b==a)throw new TypeError;var c=!1;try{var d=b&&b.then;if(null!=b&&"object"==typeof b&&"function"==typeof d){d.call(b,function(b){c||q(a,b);c=!0},function(b){c||r(a,b);c=!0});return}}catch(e){c||r(a,e);return}a.a=0;a.b=b;v(a)}}
function r(a,b){if(a.a==p){if(b==a)throw new TypeError;a.a=1;a.b=b;v(a)}}function v(a){l(function(){if(a.a!=p)for(;a.f.length;){var b=a.f.shift(),c=b[0],d=b[1],e=b[2],b=b[3];try{0==a.a?"function"==typeof c?e(c.call(void 0,a.b)):e(a.b):1==a.a&&("function"==typeof d?e(d.call(void 0,a.b)):b(a.b))}catch(h){b(h)}}})}n.prototype.g=function(a){return this.c(void 0,a)};n.prototype.c=function(a,b){var c=this;return new n(function(d,e){c.f.push([a,b,d,e]);v(c)})};
function w(a){return new n(function(b,c){function d(c){return function(d){h[c]=d;e+=1;e==a.length&&b(h)}}var e=0,h=[];0==a.length&&b(h);for(var k=0;k<a.length;k+=1)u(a[k]).c(d(k),c)})}function x(a){return new n(function(b,c){for(var d=0;d<a.length;d+=1)u(a[d]).c(b,c)})};window.Promise||(window.Promise=n,window.Promise.resolve=u,window.Promise.reject=t,window.Promise.race=x,window.Promise.all=w,window.Promise.prototype.then=n.prototype.c,window.Promise.prototype["catch"]=n.prototype.g);}());

;(function() {
	if (window.WebViewJavascriptBridge) {
		return;
	}

	if (!window.onerror) {
		window.onerror = function(msg, url, line) {
			console.log("WebViewJavascriptBridge: ERROR:" + msg + "@" + url + ":" + line);
		}
	}
	window.WebViewJavascriptBridge = {
		registerHandler: registerHandler,
		callHandler: callHandler,
		disableJavscriptAlertBoxSafetyTimeout: disableJavscriptAlertBoxSafetyTimeout,
		_fetchQueue: _fetchQueue,
		_handleMessageFromObjC: _handleMessageFromObjC
	};

	var messagingIframe;
	var sendMessageQueue = [];
	var messageHandlers = {};

	var CUSTOM_PROTOCOL_SCHEME = 'https';
	var QUEUE_HAS_MESSAGE = '__wvjb_queue_message__';

	var responseCallbacks = {};
	var uniqueId = 1;
	var dispatchMessagesWithTimeoutSafety = true;

	function registerHandler(handlerName, handler) {
		messageHandlers[handlerName] = handler;
	}

	function callHandler(handlerName, data, responseCallback) {
		if (arguments.length == 2 && typeof data == 'function') {
			responseCallback = data;
			data = null;
		}
		_doSend({ handlerName:handlerName, data:data }, responseCallback);
	}
	function disableJavscriptAlertBoxSafetyTimeout() {
		dispatchMessagesWithTimeoutSafety = false;
	}

	function _doSend(message, responseCallback) {
		if (responseCallback) {
			var callbackId = 'cb_'+(uniqueId++)+'_'+new Date().getTime();
			responseCallbacks[callbackId] = responseCallback;
			message['callbackId'] = callbackId;
		}
		sendMessageQueue.push(message);
		messagingIframe.src = CUSTOM_PROTOCOL_SCHEME + '://' + QUEUE_HAS_MESSAGE;
	}

	function _fetchQueue() {
		var messageQueueString = JSON.stringify(sendMessageQueue);
		sendMessageQueue = [];
		return messageQueueString;
	}

	function _dispatchMessageFromObjC(messageJSON) {
		if (dispatchMessagesWithTimeoutSafety) {
			setTimeout(_doDispatchMessageFromObjC);
		} else {
			 _doDispatchMessageFromObjC();
		}

		function _doDispatchMessageFromObjC() {
			var message = JSON.parse(messageJSON);
			var messageHandler;
			var responseCallback;

			if (message.responseId) {
				responseCallback = responseCallbacks[message.responseId];
				if (!responseCallback) {
					return;
				}
				responseCallback(message.responseData);
				delete responseCallbacks[message.responseId];
			} else {
				if (message.callbackId) {
					var callbackResponseId = message.callbackId;
					responseCallback = function(responseData) {
						_doSend({ handlerName:message.handlerName, responseId:callbackResponseId, responseData:responseData });
					};
				}

				var handler = messageHandlers[message.handlerName];
				if (!handler) {
					console.log("WebViewJavascriptBridge: WARNING: no handler for message from ObjC:", message);
				} else {
					handler(message.data, responseCallback);
				}
			}
		}
	}

	function _handleMessageFromObjC(messageJSON) {
        _dispatchMessageFromObjC(messageJSON);
	}

	messagingIframe = document.createElement('iframe');
	messagingIframe.style.display = 'none';
	messagingIframe.src = CUSTOM_PROTOCOL_SCHEME + '://' + QUEUE_HAS_MESSAGE;
	document.documentElement.appendChild(messagingIframe);

	registerHandler("_disableJavascriptAlertBoxSafetyTimeout", disableJavscriptAlertBoxSafetyTimeout);

	setTimeout(_callWVJBCallbacks, 0);
	function _callWVJBCallbacks() {
		var callbacks = window.WVJBCallbacks;
		delete window.WVJBCallbacks;
		for (var i=0; i<callbacks.length; i++) {
			callbacks[i](WebViewJavascriptBridge);
		}
	}
})();

(function(global, callback){//向客户端发送请求 注入jsBridge
    if (global.WebViewJavascriptBridge) {
        return callback(WebViewJavascriptBridge);
    }
    if (global.WVJBCallbacks) {
        return global.WVJBCallbacks.push(callback);
    }
    global.ZHHybridCallbacks = [];
    global.zh = {
        ready:function(handler){
            global.ZHHybridCallbacks.push(handler);
        }
    };

    global.WVJBCallbacks = [callback];

    //此段外层setTimeout 影响浏览器后退事件
    //bug描述：未加时 浏览器后退动作会导致scheme请求被取消 jsBridge不被注入
    //修复原因：未知
    setTimeout(function(){
        var WVJBIframe = document.createElement('iframe');
        WVJBIframe.style.display = 'none';
        WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
        document.documentElement.appendChild(WVJBIframe);
        setTimeout(function() {
            document.documentElement.removeChild(WVJBIframe)
        }, 0)
    }, 0);
})(window, function(bridge){
    (function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.zh = factory());
}(this, (function () { 'use strict';

// 判断js运行环境
var inBrowser = typeof window !== 'undefined' && Object.prototype.toString.call(window) !== '[object Object]';

var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isAndroid = UA && UA.indexOf('android') > 0;
var isIOS = UA && /iphone|ipad|ipod|ios/.test(UA);

//判断该函数是否为原生函数
// function isNative (Ctor: Function): boolean {
//   return /native code/.test(Ctor.toString())
// }

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

//处理传递给底层bridge接口的数据格式
function _formatParam(param) {

    if ((typeof param === 'undefined' ? 'undefined' : _typeof(param)) === 'object') {
        for (var key in param) {
            param[key] = _formatParam(param[key]);
        }
        param = JSON.stringify(param);
    } else if (typeof param === 'string') {
        param = encodeURI(param);
    } else if (typeof param !== 'function') {
        param = param.toString();
    }

    return param;
}

function _registerHandler(name, func) {
    bridge.registerHandler(name, func);
}

function _callHandler(taskName, param) {

    return new Promise(function (resolve, reject) {
        if (!(taskName && typeof taskName === "string")) {
            reject(taskName + " 缺少参数");
            return;
        }

        var config = {
            taskId: taskName
        };

        if (!!param) {
            config["param"] = _formatParam(param);
        }

        bridge.callHandler('NativeHybrid', config, function (response) {
            resolve(response);
        });
    });
}

/**
 * titleBar
 * @param  {Object} config
 *     {
 *      backgroundColor {String} : '0xFFFFFF' or '#FFFFFF',
 *      text {String} : "",
 *      fontSize {Number} : 12,
 *      color {String} : '0xFFFFFF' or '#FFFFFF',
 *     }
 */
function setNavigationBar(config) {
    if (config.backgroundColor) {
        _callHandler('zhhybrid/titleBar/background/color', config.backgroundColor);
    }
    if (config.text) {
        _callHandler('zhhybrid/titleBar/title/text', config.text);
    }
    if (config.fontSize) {
        _callHandler('zhhybrid/titleBar/title/fontSize', config.fontSize);
    }
    if (config.color) {
        _callHandler('zhhybrid/titleBar/title/textColor', config.color);
    }
}

/**
 * setNavigationBarTitle 设置导航栏标题
 * @param {String}   text     标题文本
 * @param {Function} callback 设置完成后的回调
 */
function setNavigationBarTitle(text) {
    return _callHandler('zhhybrid/titleBar/title/text', text);
}

/**
 * setNavigationBarColor 设置导航栏字体颜色
 * @param {String}   color    颜色字符串 格式为‘0xFFFFFF’ 或 '#FFFFFF'
 * @param {Function} callback 设置完成后的回调
 */
function setNavigationBarColor(color) {
    return _callHandler('zhhybrid/titleBar/title/textColor', color);
}

/**
 * setNavigationBarFontSize 设置导航栏字号
 * @param {Number}   fontSize 字号
 * @param {Function} callback 设置完成后的回调
 */
function setNavigationBarFontSize(fontSize) {
    return _callHandler('zhhybrid/titleBar/title/fontSize', fontSize);
}

/**
 * setNavigationBarBackgroundColor 设置导航栏背景颜色
 * @param {String}   backgroundColor 颜色字符串 格式为‘0xFFFFFF’ 或 '#FFFFFF'
 * @param {Function} callback        设置完成后的回调
 */
function setNavigationBarBackgroundColor(backgroundColor) {
    return _callHandler('zhhybrid/titleBar/background/color', backgroundColor);
}

/**
 * _createMenuButtonEventName 为button 创建固定格式的毁掉函数名
 */
function _createMenuButtonEventName(txt) {
    txt = encodeURI(txt).replace(/%/g, ""); //替换中文编码
    return '_' + txt + '_Callback';
}

/**
 * createMenuButton navigationBar增加导航按钮
 * @param  {String}   buttonName      button下方文本
 * @param  {Function} callback        正确执行后的回调
 * @param  {Function} createdCallback 创建button完成后的回调
 */
function createMenuButton(buttonName, handlerFunc) {

    var config = {
        txt: buttonName,
        handlerName: _createMenuButtonEventName(buttonName)
    };

    _registerHandler(config.handlerName, handlerFunc); //注册回调函数

    return _callHandler('zhhybrid/titleBar/button', config); //返回一个promise对象
}

/**
 * refreshButton 定义一个刷新功能的menuButton //test
 */
function showRefreshButton() {
    createMenuButton('刷新', function (data, responseCallback) {
        location.replace("");
        responseCallback();
    }).then(function () {
        console.log('refresh-button created!');
    }).catch(function (err) {
        warn(err);
    });
}

/**
 * navigateTo 保留当前页面，在新层中打开新页面。
 * 注意：调用 navigateTo 跳转时，调用该方法的页面会被加入堆栈，而 redirectTo 方法则不会。
 * @param  {object} config [url值为有效的http地址]
 *       {
 *          url {String} : "",
 *       }
 */
function navigateTo(config) {
  _callHandler('zhhybrid/navigator/openGroup', config);
}

/**
 * redirectTo 替换当前页面，打开新页面
 * @param  {object} config
 *       {
 *          url {String} : "",
 *       }
 */
function redirectTo(config) {
  _callHandler('zhhybrid/navigator/openPage', config);
}

/**
 * [navigateBack 关闭当前多级页面]
 */
function navigateBack() {
  _callHandler('zhhybrid/navigator/closeCurGroup');
}

/**
 * [redirectTo 后退当前页面]
 */
function redirectBack() {
  _callHandler('zhhybrid/navigator/closeCurPage');
}



var api = Object.freeze({
	setNavigationBar: setNavigationBar,
	setNavigationBarTitle: setNavigationBarTitle,
	setNavigationBarColor: setNavigationBarColor,
	setNavigationBarFontSize: setNavigationBarFontSize,
	setNavigationBarBackgroundColor: setNavigationBarBackgroundColor,
	showRefreshButton: showRefreshButton,
	navigateTo: navigateTo,
	redirectTo: redirectTo,
	navigateBack: navigateBack,
	redirectBack: redirectBack
});

function ready(handler) {
    handler();
}



var lifecycle = Object.freeze({
	ready: ready
});

var ZHHybrid$1 = Object.assign({}, api, lifecycle);

return ZHHybrid$1;

})));


    setTimeout(function(){
        //ready event alpha
        if(window.ZHHybridCallbacks.length > 0){
            for (var i = 0; i < window.ZHHybridCallbacks.length; i++) {
                window.ZHHybridCallbacks[i]()
            }
        }
    }, 0);
}.bind(window))
