define(['modules/net/wAjax','swig','anime'],function(wAjax,swig,anime) {
    function Danmaku (options){
        this._init(options);
    }

    Danmaku.prototype._init = function (options){
        this.options = options || {};

        this._initData();

        this._initState();

        this._initFunction();

        this._start();
    }



    Danmaku.prototype._initData = function(){
        var DM = this;
         /** [request 发送请求相关参数]
         * @url {String} 请求地址
         * @data {Object} 请求参数  包含 unionId
         */
        this.request = {
            "url":this.options.request.url || "" ,
            "data":this.options.request.data || {}
        };
        this.stage = $('.tag-danmaku-stage');
        this.selector = '.tag-danmaku-item';
        this.itemSpacing = this.options.itemSpacing || 10;
        this.itemHeight = this.options.itemHeight || 32;
        this.lineNumber = this.options.lineNumber || 2;
        this.rangeX = this.stage.width() *2.2;
        this.durationX = this.options.durationX || 16000;
        this.speedX = this.rangeX / this.durationX * 1000;
        this.settings = {
            targets: this.selector,
            translateY:{
              value : function(el,index){
                 return index % DM.lineNumber * (DM.itemSpacing + DM.itemHeight);
              },
              delay : 1,
              duration: 1
            },
            translateX: {
              value : this.rangeX * -1,
              delay: function(el, index){
                //   var myDelay = ++index > DM.lineNumber ? ($(DM.selector+':nth-child('+(index-1)+')').width() / DM.speedX* 2200 * (Math.floor((index + DM.lineNumber - 1) / DM.lineNumber) - 1) ) : 0;
                  var no = index + 1;
                  var myDelay = 360 / DM.speedX * (Math.floor((no + DM.lineNumber - 1)/DM.lineNumber)-1) * 1300;

                  myDelay += anime.random(-2,2)*2*250;

                  return myDelay;
              },
              duration: function(){
                  return DM.durationX + anime.random(-150,150)*8;
              }
            },
            easing:'linear',
            direction: 'normal',
            loop: false,
        };

        //设置舞台高度
        this.stage.height(this.itemHeight*this.lineNumber + this.itemSpacing*(this.lineNumber-1));
    }

    //data load
    var _danmakuPond = (function(){
        var _arr = [];
        var _index = 0;
        return {
            get : function(index){
                if(index){
                    _index = index;
                }

                if(_index < _arr.length ){
                    console.info("当前获取第 ",_index+1," 批弹幕",_arr);
                    return _arr[_index++];
                }else if(_arr.length > 0){
                    return this.getFrist();
                }else{
                    return false;
                }
            },
            set : function(data){
                _arr.push(data);
            },
            getFrist : function(){
                _index = 0;
                return this.get();
            },
            hasPrestore : function(No){
                var result = false;
                if(No <= _arr.length){
                    result = true;
                }
                return result;
            },
            setIndex : function (index){
                this._index = index;
            }
        }
    })();


    var _load = (function(){
        var $page = 1;
        var $request_over = true;
        var $has_more = true;
        return function(callback){
            if(!$has_more){
                return false;
            };

            var DM = this;

            var afterLoad = function () {
                if(typeof callback == 'function'){
                    callback.apply(DM);
                }
            };

            console.count('danmaku-load-count');
            console.info('load hasPrestore:',$page,DM._danmakuPond.hasPrestore($page));

            //now edit
            if(DM._danmakuPond.hasPrestore($page)){
                DM._danmakuPond.setIndex($page-1);
                $page++;
                afterLoad();
            }else{
                wAjax({
                    url:DM.options.request.url,
                    data:$.extend({},{page:$page},DM.options.request.data),
                    success:function(obj){
                        $has_more = obj.data.hasMore;
                        $page = obj.data.curPage+1;
                        DM._danmakuPond.set(obj.data.resultData);
                        afterLoad();
                    },
                    beforeSend : function(){
                        $request_over = false;
                    },
                    complete : function(){
                        $request_over = true;
                    }
                });
            }
        };
    })();

    var _render = function(source){
        var renderHTML = $(swig.render($('#tag-danmaku-item-tpl').html(),{locals:{source:source}}));
        this.stage.html(renderHTML);
    };
    var _danmakuAction = function(){
        var DM = this;
        this._render(DM._danmakuPond.get());

        var _has_more_settings = $.extend({},this.settings,{
            begin: function(){
                DM._load();
            },
            complete : function(){
                setTimeout(function(){
                    DM._danmakuAction();
                },100);
            }
        });
        anime(_has_more_settings);
    };

    Danmaku.prototype._initFunction = function(){
        this._load = _load;
        this._render = _render;
        this._danmakuAction = _danmakuAction;
    }

    Danmaku.prototype._initState = function(){
        this._danmakuPond = _danmakuPond;
        if( this.options.pond && this.options.pond.resultData.length>0){
            this._danmakuPond.set(this.options.pond.resultData);
        }
    }

    Danmaku.prototype._start = function(){
        var DM = this;

        this._load(DM._danmakuAction);
    };

    return Danmaku;
});


// (function(){
//     //anime settings
//     var stage = $('.tag-danmaku-stage');
//     var selector = '.tag-danmaku-item';
//     var itemSpacing = 10;
//     var itemHeight = 32;
//     var lineNumber = 2;
//     var rangeX = stage.width() *2.2;
//     var durationX = 10000;
//     var speedX = rangeX / durationX * 1000;
//     var settings = {
//         targets: selector,
//         translateY:{
//           value : function(el,index){
//              return index % lineNumber == 0 ? 0 : itemHeight + itemSpacing;
//           },
//           delay : 1,
//           duration: 1
//         },
//         translateX: {
//           value : rangeX * -1,
//           delay: function(el, index){
//               var myDelay = ++index > lineNumber ? ($(selector+':nth-child('+(index-lineNumber)+')').width() / speedX* 1800 * (Math.floor((index+1)/2)-1) ) : 0;
//               if (index % lineNumber != 0){
//                   myDelay += 1200;
//               }
//               return myDelay;
//           },
//           duration: function(){
//               return durationX + anime.random(-50,250)*8;
//           }
//         },
//         easing:'linear',
//         direction: 'normal',
//         loop: false,
//     };
//
//     var danmakuPond = (function(){
//         var _arr = [];
//         var _index = 0;
//         return {
//             get : function(index){
//                 if(_arr.length > _index){
//                     console.info("当前获取第 ",_index+1," 批弹幕");
//                     return _arr[_index];
//                 }else if(_arr.length > 0){
//                     this.getFrist();
//                 }else{
//                     return false;
//                 }
//
//             },
//             set : function(data){
//                 _arr.push(data);
//             },
//             getFrist : function(){
//                 _index = 0;
//                 return this.get();
//             },
//         }
//     })();
//
//     var _page = 1;
//     var _request_over = true;
//     var _has_more = true;
//     var load = function(callback){
//         console.count('danmaku-load-count');
//         wAjax({
//             url:'/wmp/user/' + appConfigId + '/trust/ajax/personal/getTags',
//             data:{
//                 page:_page,
//                 unionId:unionId,
//             },
//             success:function(obj){
//                 _has_more = obj.data.hasMore;
//                 _page = obj.data.curPage+1;
//
//                 danmakuPond.set(obj.data.resultData);
//
//                 if(typeof callback == 'function'){
//                     callback();
//                 }
//             },
//             beforeSend : function(){
// 				_request_over = false;
// 			},
//             complete : function(){
//                 _request_over = true;
//             }
//         });
//     };
//
//     var render = function(source){
//         var renderHTML = $(swig.render($('#tag-danmaku-item-tpl').html(),{locals:{source:source}}));
//         stage.html(renderHTML);
//     };
//     var danmakuAction = function(){
//
//         render(danmakuPond.get());
//
//         var _has_more_settings = $.extend({},settings,{
//             begin: function(){
//                 if(_has_more)load();
//             },
//             complete : function(){
//                 setTimeout(function(){
//                     danmakuAction();
//                 },10);
//             }
//         });
//         anime(_has_more_settings);
//     };
//
//     var init = function(){
//         load(danmakuAction);
//     };
//
//     init();
//
// })();
