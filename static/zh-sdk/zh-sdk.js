/**!
 * zh-sdk.js v0.3.0
 * (c) 2016-2017
 * author bojan
 */
(function(){'use strict';var f,g=[];function l(a){g.push(a);1==g.length&&f()}function m(){for(;g.length;)g[0](),g.shift()}f=function(){setTimeout(m)};function n(a){this.a=p;this.b=void 0;this.f=[];var b=this;try{a(function(a){q(b,a)},function(a){r(b,a)})}catch(c){r(b,c)}}var p=2;function t(a){return new n(function(b,c){c(a)})}function u(a){return new n(function(b){b(a)})}function q(a,b){if(a.a==p){if(b==a)throw new TypeError;var c=!1;try{var d=b&&b.then;if(null!=b&&"object"==typeof b&&"function"==typeof d){d.call(b,function(b){c||q(a,b);c=!0},function(b){c||r(a,b);c=!0});return}}catch(e){c||r(a,e);return}a.a=0;a.b=b;v(a)}}
function r(a,b){if(a.a==p){if(b==a)throw new TypeError;a.a=1;a.b=b;v(a)}}function v(a){l(function(){if(a.a!=p)for(;a.f.length;){var b=a.f.shift(),c=b[0],d=b[1],e=b[2],b=b[3];try{0==a.a?"function"==typeof c?e(c.call(void 0,a.b)):e(a.b):1==a.a&&("function"==typeof d?e(d.call(void 0,a.b)):b(a.b))}catch(h){b(h)}}})}n.prototype.g=function(a){return this.c(void 0,a)};n.prototype.c=function(a,b){var c=this;return new n(function(d,e){c.f.push([a,b,d,e]);v(c)})};
function w(a){return new n(function(b,c){function d(c){return function(d){h[c]=d;e+=1;e==a.length&&b(h)}}var e=0,h=[];0==a.length&&b(h);for(var k=0;k<a.length;k+=1)u(a[k]).c(d(k),c)})}function x(a){return new n(function(b,c){for(var d=0;d<a.length;d+=1)u(a[d]).c(b,c)})};window.Promise||(window.Promise=n,window.Promise.resolve=u,window.Promise.reject=t,window.Promise.race=x,window.Promise.all=w,window.Promise.prototype.then=n.prototype.c,window.Promise.prototype["catch"]=n.prototype.g);}());
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





















var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

function _instanceof(obj, type) {
  return type != null && obj instanceof type;
}

var nativeMap;
try {
  nativeMap = Map;
} catch (_) {
  // maybe a reference error because no `Map`. Give it a dummy value that no
  // value will ever be an instanceof.
  nativeMap = function nativeMap() {};
}

var nativeSet;
try {
  nativeSet = Set;
} catch (_) {
  nativeSet = function nativeSet() {};
}

var nativePromise;
try {
  nativePromise = Promise;
} catch (_) {
  nativePromise = function nativePromise() {};
}

/**
 * Clones (copies) an Object using deep copying.
 *
 * This function supports circular references by default, but if you are certain
 * there are no circular references in your object, you can save some CPU time
 * by calling clone(obj, false).
 *
 * Caution: if `circular` is false and `parent` contains circular references,
 * your program may enter an infinite loop and crash.
 *
 * @param `parent` - the object to be cloned
 * @param `circular` - set to true if the object to be cloned may contain
 *    circular references. (optional - true by default)
 * @param `depth` - set to a number if the object is only to be cloned to
 *    a particular depth. (optional - defaults to Infinity)
 * @param `prototype` - sets the prototype to be used when cloning an object.
 *    (optional - defaults to parent prototype).
 * @param `includeNonEnumerable` - set to true if the non-enumerable properties
 *    should be cloned as well. Non-enumerable properties on the prototype
 *    chain will be ignored. (optional - false by default)
*/
function clone(parent, circular, depth, prototype, includeNonEnumerable) {
  if ((typeof circular === 'undefined' ? 'undefined' : _typeof(circular)) === 'object') {
    depth = circular.depth;
    prototype = circular.prototype;
    includeNonEnumerable = circular.includeNonEnumerable;
    circular = circular.circular;
  }
  // maintain two arrays for circular references, where corresponding parents
  // and children have the same index
  var allParents = [];
  var allChildren = [];

  var useBuffer = typeof Buffer != 'undefined';

  if (typeof circular == 'undefined') circular = true;

  if (typeof depth == 'undefined') depth = Infinity;

  // recurse this function so we don't reset allParents and allChildren
  function _clone(parent, depth) {
    // cloning null always returns null
    if (parent === null) return null;

    if (depth === 0) return parent;

    var child;
    var proto;
    if ((typeof parent === 'undefined' ? 'undefined' : _typeof(parent)) != 'object') {
      return parent;
    }

    if (_instanceof(parent, nativeMap)) {
      child = new nativeMap();
    } else if (_instanceof(parent, nativeSet)) {
      child = new nativeSet();
    } else if (_instanceof(parent, nativePromise)) {
      child = new nativePromise(function (resolve, reject) {
        parent.then(function (value) {
          resolve(_clone(value, depth - 1));
        }, function (err) {
          reject(_clone(err, depth - 1));
        });
      });
    } else if (clone.__isArray(parent)) {
      child = [];
    } else if (clone.__isRegExp(parent)) {
      child = new RegExp(parent.source, __getRegExpFlags(parent));
      if (parent.lastIndex) child.lastIndex = parent.lastIndex;
    } else if (clone.__isDate(parent)) {
      child = new Date(parent.getTime());
    } else if (useBuffer && Buffer.isBuffer(parent)) {
      child = new Buffer(parent.length);
      parent.copy(child);
      return child;
    } else if (_instanceof(parent, Error)) {
      child = Object.create(parent);
    } else {
      if (typeof prototype == 'undefined') {
        proto = Object.getPrototypeOf(parent);
        child = Object.create(proto);
      } else {
        child = Object.create(prototype);
        proto = prototype;
      }
    }

    if (circular) {
      var index = allParents.indexOf(parent);

      if (index != -1) {
        return allChildren[index];
      }
      allParents.push(parent);
      allChildren.push(child);
    }

    if (_instanceof(parent, nativeMap)) {
      parent.forEach(function (value, key) {
        var keyChild = _clone(key, depth - 1);
        var valueChild = _clone(value, depth - 1);
        child.set(keyChild, valueChild);
      });
    }
    if (_instanceof(parent, nativeSet)) {
      parent.forEach(function (value) {
        var entryChild = _clone(value, depth - 1);
        child.add(entryChild);
      });
    }

    for (var i in parent) {
      var attrs;
      if (proto) {
        attrs = Object.getOwnPropertyDescriptor(proto, i);
      }

      if (attrs && attrs.set == null) {
        continue;
      }
      child[i] = _clone(parent[i], depth - 1);
    }

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(parent);
      for (var i = 0; i < symbols.length; i++) {
        // Don't need to worry about cloning a symbol because it is a primitive,
        // like a number or string.
        var symbol = symbols[i];
        var descriptor = Object.getOwnPropertyDescriptor(parent, symbol);
        if (descriptor && !descriptor.enumerable && !includeNonEnumerable) {
          continue;
        }
        child[symbol] = _clone(parent[symbol], depth - 1);
        if (!descriptor.enumerable) {
          Object.defineProperty(child, symbol, {
            enumerable: false
          });
        }
      }
    }

    if (includeNonEnumerable) {
      var allPropertyNames = Object.getOwnPropertyNames(parent);
      for (var i = 0; i < allPropertyNames.length; i++) {
        var propertyName = allPropertyNames[i];
        var descriptor = Object.getOwnPropertyDescriptor(parent, propertyName);
        if (descriptor && descriptor.enumerable) {
          continue;
        }
        child[propertyName] = _clone(parent[propertyName], depth - 1);
        Object.defineProperty(child, propertyName, {
          enumerable: false
        });
      }
    }

    return child;
  }

  return _clone(parent, depth);
}

/**
 * Simple flat clone using prototype, accepts only objects, usefull for property
 * override on FLAT configuration object (no nested props).
 *
 * USE WITH CAUTION! This may not behave as you wish if you do not know how this
 * works.
 */
clone.clonePrototype = function clonePrototype(parent) {
  if (parent === null) return null;

  var c = function c() {};
  c.prototype = parent;
  return new c();
};

// private utility functions

function __objToStr(o) {
  return Object.prototype.toString.call(o);
}
clone.__objToStr = __objToStr;

function __isDate(o) {
  return (typeof o === 'undefined' ? 'undefined' : _typeof(o)) === 'object' && __objToStr(o) === '[object Date]';
}
clone.__isDate = __isDate;

function __isArray(o) {
  return (typeof o === 'undefined' ? 'undefined' : _typeof(o)) === 'object' && __objToStr(o) === '[object Array]';
}
clone.__isArray = __isArray;

function __isRegExp(o) {
  return (typeof o === 'undefined' ? 'undefined' : _typeof(o)) === 'object' && __objToStr(o) === '[object RegExp]';
}
clone.__isRegExp = __isRegExp;

function __getRegExpFlags(re) {
  var flags = '';
  if (re.global) flags += 'g';
  if (re.ignoreCase) flags += 'i';
  if (re.multiline) flags += 'm';
  return flags;
}
clone.__getRegExpFlags = __getRegExpFlags;

//处理传递给底层bridge接口的数据格式
function _formatParam(oldParam) {
    var param = clone(oldParam);

    if ((typeof param === 'undefined' ? 'undefined' : _typeof(param)) === 'object') {
        for (var key in param) {
            param[key] = _formatParam(param[key]);
        }
        // param = JSON.stringify(param);
    } else if (typeof param === 'string') {
        param = encodeURI(param);
    } else if (typeof param !== 'function') {
        param = param.toString();
    }

    return param;
}

//处底层bridge接口接收的数据格式
function _decodeString(param) {
    // return decodeURI(param);
    return decodeURIComponent(param);
}

/**
 * _createMenuButtonEventName 为button 创建固定格式的毁掉函数名
 */
function _createEventName(txt) {
    txt = encodeURI(txt).replace(/%/g, ""); //替换中文编码
    return '_' + txt + '_Callback';
}

var callQueue = [];
var registerQueue = [];

function createBridge() {
    var fakeBridge = {
        callHandler: function callHandler() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            callQueue.push(function () {
                window.WebViewJavascriptBridge.callHandler.apply(window.WebViewJavascriptBridge, args);
            });
        },
        registerHandler: function registerHandler() {
            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
            }

            registerQueue.push(function () {
                window.WebViewJavascriptBridge.registerHandler.apply(window.WebViewJavascriptBridge, args);
            });
        }
    };

    var callback = function callback(realBridge) {
        bridge = realBridge;

        while (registerQueue.length > 0) {
            var fn = registerQueue.shift();
            fn();
        }

        while (callQueue.length > 0) {
            var fn = callQueue.shift();
            fn();
        }
    };

    window.WVJBCallbacks = [callback];
    setTimeout(function () {
        var WVJBIframe = document.createElement('iframe');
        WVJBIframe.style.display = 'none';
        WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
        document.documentElement.appendChild(WVJBIframe);
        setTimeout(function () {
            document.documentElement.removeChild(WVJBIframe);
        }, 0);
    }, 0);

    return fakeBridge;
}

var bridge = window.WebViewJavascriptBridge ? window.WebViewJavascriptBridge : createBridge();

function _registerHandler(name, func) {
    bridge.registerHandler(name, function (res) {

        res = _decodeString(res);
        try {
            res = JSON.parse(res);
        } catch (e) {} finally {
            func(res);
        }
    });
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

        bridge.callHandler('NativeHybrid', config, function (res) {

            res = _decodeString(res);
            try {
                res = JSON.parse(res);
            } catch (e) {} finally {
                resolve(res);
            }
        });
    });
}

var obMap = {};

function _registerNotify(key, val) {
    obMap[key] = val;
}

function _notifyCenter() {

    _registerHandler('HybridNativeNotification', function (res) {
        var callbacks = obMap[res.type];

        var success = 'success' in callbacks ? callbacks.success : function () {};
        var fail = 'fail' in callbacks ? callbacks.fail : function () {};
        var complete = 'complete' in callbacks ? callbacks.complete : function () {};

        switch (res.code) {
            case 200:
            case 501:
                success(res.type);
                break;
            case 500:
                fail(res.type);
                break;
        }
        complete(res.type);
    });
}

_notifyCenter();

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
    var pArr = [];
    if (config.backgroundColor) {
        pArr.push(setNavigationBarBackgroundColor(config.backgroundColor));
    }
    if (config.title) {
        pArr.push(setNavigationBarTitle(config.title));
    }
    if (config.fontSize) {
        pArr.push(setNavigationBarFontSize(config.fontSize));
    }
    if (config.color) {
        pArr.push(setNavigationBarFontColor(config.color));
    }
    return pArr.length > 0 ? Promise.all(pArr) : undefined;
}

/**
 * setNavigationBarTitle 设置导航栏标题
 * @param {String}   text     标题文本
 * @param {Function} callback 设置完成后的回调
 */
function setNavigationBarTitle(title) {
    return _callHandler('zhhybrid/titleBar/title/text', { content: title });
}

/**
 * setNavigationBarColor 设置导航栏字体颜色
 * @param {String}   color    颜色字符串 格式为‘0xFFFFFF’ 或 '#FFFFFF'
 * @param {Function} callback 设置完成后的回调
 */
function setNavigationBarFontColor(color) {
    return _callHandler('zhhybrid/titleBar/title/textColor', { color: color });
}

/**
 * setNavigationBarFontSize 设置导航栏字号
 * @param {Number}   fontSize 字号
 * @param {Function} callback 设置完成后的回调
 */
function setNavigationBarFontSize(size) {
    return _callHandler('zhhybrid/titleBar/title/fontSize', { size: size });
}

/**
 * setNavigationBarBackgroundColor 设置导航栏背景颜色
 * @param {String}   backgroundColor 颜色字符串 格式为‘0xFFFFFF’ 或 '#FFFFFF'
 * @param {Function} callback        设置完成后的回调
 */
function setNavigationBarBackgroundColor(color) {
    return _callHandler('zhhybrid/titleBar/background/color', { color: color });
}

/**
 * createMenuButton navigationBar增加导航按钮
 */
function createRightButton(config, handlerFunc) {
    var buttonName = config.txt ? config.txt : config.navBtnType ? config.navBtnType : '';
    config['handlerName'] = _createEventName(buttonName);
    _registerHandler(config.handlerName, handlerFunc); //注册回调函数

    return _callHandler('zhhybrid/titleBar/button', config); //返回一个promise对象
}

function showTxtRightButton(txt, handlerFunc) {
    return createRightButton({ txt: txt }, handlerFunc);
}

function showGraphicalButton(navBtnType, handlerFunc) {
    return createRightButton({ navBtnType: navBtnType }, handlerFunc);
}

/**
 * refreshButton 定义一个刷新功能的menuButton //test
 */
// export function showBackButton (){
//     createRightButton ('back', function(data, responseCallback) {
//         responseCallback();
//     })
//     .catch(function(err){
//         warn(err);
//     })
// }

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

// zh.chooseIndustry({
//     industries:[
//         {
//             tagId : 'ind_0102',
//             tagName : '金融业'
//         },
//     ],
// }, function(res){ //{industries:[]}
//      res.industries
// });

function chooseIndustry(config, handlerFunc) {

    // for (var i = 0; i < config.industrys.length; i++) {
    //     config.industrys[i] = {tagId : config.industrys[i]}
    // }

    config['handlerName'] = _createEventName("chooseIndustryEvent");

    _registerHandler(config.handlerName, function (res) {
        handlerFunc(res.param);
    }); //注册回调函数

    return _callHandler('zhhybrid/industry/secondLevel', config); //返回一个promise对象
}

// import {clone} from '../../lib/clone'

// zh.chooseImage({
//     maxCount: Number,
//     "sourceType|1": ['carmera', 'album'], //可选配置  默认二者都有
// },function(res){ //res:{tempFilePath:['', '']}
//
// })


function chooseImage(config, handlerFunc) {

    // if(typeof config === "function" && !handlerFunc){
    //     handlerName = config
    //     config = {}
    // }

    config['handlerName'] = _createEventName("chooseImageEvent");

    _registerHandler(config.handlerName, function (res) {
        handlerFunc(res.param);
    }); //注册回调函数

    return _callHandler('zhhybrid/photo/upload', config); //返回一个promise对象
}

// zh.previewImage({
//     current: {String} url, //可选配置  默认显示第一张
//     "urls": ['url', 'url2'],
//     quality: ['origin', 'high', 'low']  //default low
// },function(res){ //res:{delateUrls:['', '']}
//
// })

function previewImage(config, handlerFunc) {

    if (config.quality && config.quality !== 'low') {
        config.urls = setImageQuality(config.urls, config.quality);
    }

    if (config.quality) delete config.quality;

    config['handlerName'] = _createEventName("previewImageEvent");

    _registerHandler(config.handlerName, function (res) {

        for (var i = 0; i < res.param.deleteUrls.length; i++) {
            res.param.deleteUrls[i] = unpackUrl(res.param.deleteUrls[i]);
        }

        handlerFunc(res.param);
    }); //注册回调函数

    return _callHandler('zhhybrid/photo/preview', config); //返回一个promise对象
}

function setImageQuality(urls, quality) {
    var sign = '';
    switch (quality) {
        case 'origin':
            sign = '_o';
            break;
        case 'high':
            sign = '_l';
            break;
    }
    var arr = [].concat(urls);
    for (var i = 0; i < arr.length; i++) {
        arr[i] = packUrl(arr[i], sign);
    }
    return arr;
}

function packUrl(txt, sign) {
    return txt.replace(/\s?(\w+)(\.jpg|jpeg|png)/i, '$1' + sign + '$2');
}

function unpackUrl(txt) {
    return txt.replace(/\s?(\w+)(_l|_o)(\.jpg|jpeg|png)/i, '$1' + '$3');
}

// zh.showActionSheet({
//     actions: [{
//             name: '删除',
//             /tagId: 'shancchuhaha',
//             type: 'warn', //'primary' 'default' 'warn',
//             msg: '确定要删除嘛',
//             disabled: true,
//             *handlerEvent : function (){
//
//             }
//         }],
//     handlerName: "sadfasdf"
// })

var ActionSheetMap = {};

function showActionSheet(config) {

    config.actions.forEach(function (element) {
        var tagId = element['tagId'] = _createEventName("showActionSheetEvent" + element.name);
        ActionSheetMap[tagId] = element.handlerEvent;
        delete element.handlerEvent;
    });

    config['handlerName'] = _createEventName("showActionSheetEvent");
    _registerHandler(config.handlerName, function (res) {
        var result = res.param;
        ActionSheetMap[result.tagId](result);
    }); //注册回调函数

    return _callHandler('zhhybrid/dialog/actionsheet', config); //返回一个promise对象
}

// zh.onMenuShareWxTimeLine ({
//     title: 'pengyouquan',
//     /desc: 'shaofengsh ge dsb',
//     imgUrl: 'http://fakeimg.pl/10x10',
//     link: 'www.baidu.com',
//     success: function(){
//     }
// })

//  {
//     'wxTimeLine': {
//         title: 'pengyouquan',
//         /desc: 'shaofengsh ge dsb',
//         imgUrl: 'http://fakeimg.pl/10x10',
//         link: 'www.baidu.com',
//     },
//     'wxMessage': {
//         title: 'pengyouquan',
//         /desc: 'shaofengsh ge dsb',
//         imgUrl: 'http://fakeimg.pl/10x10',
//         link: 'www.baidu.com'
//     }
// }


var zh_share_config = {};

function onMenuShareWxTimeLine(config) {
    zh_share_config['wxTimeLine'] = config;
}

function onMenuShareWxMessage(config) {
    zh_share_config['wxMessage'] = config;
}

function onMenuShareFeed(config) {
    // zh_share_config['feed'] = config;
    // zh_share_config['feed']['resourceFrom'] = "正和岛";
}

function onMenuShareShearPlate(config) {
    zh_share_config['shearPlate'] = config;
}

function onMenuShareShearImpress(config) {
    zh_share_config['impress'] = config;
}

function showShareMenu() {
    var config = zh_share_config;
    config['handlerName'] = _createEventName("showShareMenuEvent");

    _registerHandler(config.handlerName, function (res) {
        var currentShare = config[res.tagId];
        switch (res.code) {
            case 200:
                if (currentShare.success) currentShare.success();
                break;
            case 400:
                if (currentShare.cancel) currentShare.cancel();
                break;
        }
        if (currentShare.complete) currentShare.complete();
    }); //注册回调函数
    return _callHandler('zhhybrid/dialog/share', config);
}

function authstep() {
    return _callHandler('zhhybrid/auth/realname');
}

// zh.notifyAuthstep({
//     success: function(){},
//     fail: function(){},
//     complete: function(){},
// });

function notifyAuthstep(callbacks) {
    _registerNotify('zhhybrid/auth/realname', callbacks);
}

function profileGuide() {
    return _callHandler('zhhybrid/guide/userinfo');
}

// zh.profileGuide({
//     success: function(){},
//     fail: function(){},
//     complete: function(){},
// });

function notifyProfileGuide(callbacks) {
    _registerNotify('zhhybrid/guide/userinfo', callbacks);
}

var bcMap = {};

/**
    zh.emitBroadcast("onUpdate", 123, '11')
 */

function emitBroadcast(broadId) {
    var config = {};
    config['sign'] = broadId;

    for (var _len = arguments.length, param = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        param[_key - 1] = arguments[_key];
    }

    config['args'] = param;

    return _callHandler('zhhybrid/Broadcast', config);
}

function onBroadcast(broadId, handlerFunc) {
    bcMap[broadId] = handlerFunc;

    _registerHandler('HybridH5Notification', function (res) {
        bcMap[res.param.sign].apply(this, res.param.args);
    });
}



var api = Object.freeze({
	setNavigationBar: setNavigationBar,
	setNavigationBarTitle: setNavigationBarTitle,
	setNavigationBarFontColor: setNavigationBarFontColor,
	setNavigationBarFontSize: setNavigationBarFontSize,
	setNavigationBarBackgroundColor: setNavigationBarBackgroundColor,
	showTxtRightButton: showTxtRightButton,
	showGraphicalButton: showGraphicalButton,
	navigateTo: navigateTo,
	redirectTo: redirectTo,
	navigateBack: navigateBack,
	redirectBack: redirectBack,
	chooseIndustry: chooseIndustry,
	chooseImage: chooseImage,
	previewImage: previewImage,
	showActionSheet: showActionSheet,
	onMenuShareWxTimeLine: onMenuShareWxTimeLine,
	onMenuShareWxMessage: onMenuShareWxMessage,
	onMenuShareFeed: onMenuShareFeed,
	onMenuShareShearPlate: onMenuShareShearPlate,
	onMenuShareShearImpress: onMenuShareShearImpress,
	showShareMenu: showShareMenu,
	authstep: authstep,
	notifyAuthstep: notifyAuthstep,
	profileGuide: profileGuide,
	notifyProfileGuide: notifyProfileGuide,
	emitBroadcast: emitBroadcast,
	onBroadcast: onBroadcast
});

function ready(handler) {
    handler();
}



var lifecycle = Object.freeze({
	ready: ready
});

var ZHHybrid$1 = _extends({}, api, lifecycle);

return ZHHybrid$1;

})));
