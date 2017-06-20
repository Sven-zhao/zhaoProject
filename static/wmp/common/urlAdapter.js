(function (global, factory){
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
      (global.adapter = factory())
}(this, (function (require) {
  // 判断浏览器类型
  var agentStr = window.navigator.userAgent.toLowerCase();
  var browserType;
  if (/micromessenger/.test(agentStr)) {
    browserType = 1;
  } else if (/zhisland/.test(agentStr)) {
    browserType = 2;
  }
  
  var holdAndRedirect = function (appConfigId, downloadPageUrl) {
    // user的情况 zhisland://com.zhisland/user/6260668687699673093
    // 所有活动的情况 zhisland://com.zhisland/event
    // 单个活动的情况 zhisland://com.zhisland/event/123456
    // 单个对话的情况 zhisland://com.zhisland/chat/single/6260668687699673093

    // 保证zh是一个对象
    var zh = (typeof require === 'function') ? require('zhsdk') : window.zh;
    // 工具函数process
    var process = function (url, appConfigId, downloadPageUrl) {
      let resultUrl;
      // 是否进入处理流程
      if (/^zhisland:.*/g.test(url)) {
        var path = url.match(/zhisland:\/\/com.zhisland\/(.*)/)[1]
        console.log(path)
        // 如果是user, 类似于 /user/123456
        if (/^user\/\d+/g.test(path)) {
          var uid = path.match(/user\/(\d+)/)[1]
          if (browserType === '1') {
            resultUrl = '/wmp/user/' + appConfigId + '/personal/other/home?uid=' + uid
          } else if (browserType === '2') {
            resultUrl = url
          } else {
            resultUrl = downloadPageUrl + '?uri=' + encodeURI(url)
          }
        } else if (path === 'event') { // 如果是所有活动 /event
          if (browserType === '1') {
            // 微信内
            resultUrl = '/wmp/user/' + appConfigId + '/activity/list'
          } else if (browserType === '2') {
            // app内
            resultUrl = url
          } else {
            // 除了app和微信的其他情况
            resultUrl = downloadPageUrl + '?uri=' + encodeURI(url)
          }
        } else if (/^event\/\d+/g.test(path)) { // 如果是某个活动 类似于 /event/123456
          var eventId = url.match(/event\/(\d+)/)[1]
          if (browserType === '1') {
            resultUrl = '/wmp/user/' + appConfigId + '/activity/' + eventId
          } else if (browserType === '2') {
            resultUrl = url
          } else {
            resultUrl = downloadPageUrl + '?uri=' + encodeURI(url)
          }
        } else if (/^chat\/single\/\d+/g.test(path)) {
          // 如果是单个im对话 zhisland://com.zhisland/chat/single/6260668687699673093
          if (browserType === '2') {
            resultUrl = url
          } else {
            resultUrl = downloadPageUrl + '?uri=' + encodeURI('zhisland://com.zhisland/' + window.location.href)
          }
        }
      }
      window.location.href = resultUrl || url
    }

    // 重新定义对象的各种方法 navigateTo 和 redirectTo
    Object.defineProperty(zh, 'navigateTo', {
      value: function (obj) { process(obj.url, appConfigId, downloadPageUrl) }
      // configurable: false,
      // enumerable: false,
      // writable: false
    })
    Object.defineProperty(zh, 'redirectTo', {
      value: function (obj) {
        process(obj.url, appConfigId, downloadPageUrl)
      }
    })
    // 劫持A标签, disable href， 代理click事件
    window.addEventListener('click', function (event) {
      if (event.target.nodeName === 'A') {
        event.preventDefault()
        process(event.target.href, appConfigId, downloadPageUrl)
      }
    }, false)
  }
  return {
    holdAndRedirect: holdAndRedirect
  };
})));
