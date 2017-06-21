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
