(function() {

	wx.config($.extend({
        debug: DEBUG,
        jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage']
    },WXCONFIG));
    wx.ready(function(){
        //朋友圈
        wx.onMenuShareTimeline({
			title:SHARE_TIMELINE_CONFIG.title ? SHARE_TIMELINE_CONFIG.title : SHARE_CONFIG.title ,
            link: SHARE_TIMELINE_CONFIG.link ? SHARE_TIMELINE_CONFIG.link: SHARE_CONFIG.link, // 分享链接
            imgUrl: SHARE_TIMELINE_CONFIG.imgUrl? SHARE_TIMELINE_CONFIG.imgUrl: SHARE_CONFIG.imgUrl, // 分享图标
            success: function () { 
            },
            cancel: function () { 
            }
        });
        //朋友
        wx.onMenuShareAppMessage({
            title: SHARE_CONFIG.title,
            link: SHARE_CONFIG.link, // 分享链接
            imgUrl: SHARE_CONFIG.imgUrl, // 分享图标
            desc: SHARE_CONFIG.desc, // 分享描述
            success: function () {
            },
            cancel: function () {
            }
        });
        wx.showOptionMenu();
    });

    var $load = $('.load-page');
    var imgArr = [
        'images/share.jpg',
        'images/bg.jpg',
        'images/bg_index.jpg',
        'images/bg_tag.jpg',
        'images/2016.png',
        'images/2016_small.png',
        'images/c1.png',
        'images/c2.png',
        'images/c3.png',
        'images/c4.png',
        'images/c5.png',
        'images/chenchunhua.png',
        'images/lichengcai.png',
        'images/pengjianfeng.png',
        'images/qinshuo.png',
        'images/wanglin.png',
        'images/index_font1.png',
        'images/index_font2.png',
        'images/r1.png',
        'images/r2.png',
        'images/rst1.png',
        'images/rst2.png',
        'images/t1.png',
        'images/t2.png',
        'images/t3.png',
        'images/code.png',
        'images/music-0.png',
        'images/music-1.png',
        'images/arr.png',
        'images/arrow_left.png',
        'images/arrow_right.png'
    ];
	imgArr.forEach(function(str,index,arr) {
		arr[index] = staticurl + '/pagescript/chineseCharacter/report/' + str;
	});
    preloadImages(staticurl + '/pagescript/chineseCharacter/report/'+'images/load_bg.jpg', function() {
        $load.css({ 'opacity': 1 });
    });
    preloadImages(imgArr, function() {
        pageInit();
        $load.animate({ 'opacity': 0 }, function() {
            $(this).hide();
        });
    });
    //启动音乐
    music();
})();
//页面初始化
function pageInit() {
    //全局变量
    var interval = null;
    //默认页面处理
    pageDefault();
    //分屏效果
    $('.wp-inner').fullpage({
        duration: 100,
        change: function(e) {
            // 移除动画属性
            var $page = $('.page').eq(e.cur);
            $page.find('.animated').each(function() {
                $(this).removeClass($(this).data('animate')).removeClass('animate1').hide();
            });
            //清理计时器
            interval && clearInterval(interval);
            //显示箭头
            $('.start').show();
        },
        afterChange: function(e) {
            var $page = $('.page').eq(e.cur);
            // 添加动画属性
            $page.find('.normal').each(function() {
                $(this).addClass($(this).data('animate')).show();
            });
            //首屏
            if (e.cur === 0) {
                var $s1 = $page.find('.s1');
                var curr = 0;
                setTimeout(function() {
                    $s1.addClass($s1.data('animate')).show();
                }, 1000)
                interval = setInterval(function() {
                    curr = curr >= 1 ? 0 : curr + 1;
                    $page.find('.q').eq(curr).addClass('fadeIn').show().siblings('.q').removeClass('fadeIn').hide();
                }, 3000)
            }
            //2分屏
            if (e.cur === 1) {
                var curr = 0;
                interval = setInterval(function() {
                    curr++;
                    var $s = $page.find('.animated').eq(curr);
                    $s.addClass($s.data('animate')).show();
                    if (curr >= 7) clearInterval(interval);
                }, 1000)
            }
            //3分屏
            if (e.cur === 2) {
                var curr = 0;
                interval = setInterval(function() {
                    curr = curr >= 2 ? 0 : curr + 1;
                    var $s = $page.find('.tag img').eq(curr);
                    $s.animate({ 'opacity': '1' }).siblings().animate({ 'opacity': '0' });
                }, 3000)
            }
            //4分屏
            if (e.cur === 3) {
                var $flip = $page.find('.flip');
                interval = setInterval(function() {
                    $flip.toggleClass('round');
                }, 3000)
            }
            //10分屏
            if (e.cur === 9) {
                var temArr = [
                    { 'l': '0rem', 'z': 1, 'o': 0.5 },
                    { 'l': '1.65625rem', 'z': 2, 'o': 0.8 },
                    { 'l': '3.484375rem', 'z': 3, 'o': 1 },
                    { 'l': '5.34375rem', 'z': 2, 'o': 0.8 },
                    { 'l': '7.03125rem', 'z': 1, 'o': 0.5 }
                ];
                var $ul = $page.find('ul');
                var $li = $ul.find('li');
                var $info = $page.find('.tag-con'),
                    $number = $page.find('.num');
                interval = setInterval(function() {
                    temArr.unshift(temArr.pop());
                    $ul.animate({ 'opacity': '0' }, function() {
                        for (var i = 0; i < $li.length; i++) {
                            $li.eq(i).css({
                                'z-index': temArr[i].z,
                                'left': temArr[i].l,
                                'opacity': temArr[i].o
                            });
                            if ($li.eq(i).css('z-index') == 3) {
                                $info.text($li.eq(i).data('info'));
                                $number.text($li.eq(i).data('number'));
                            }
                        }
                        $(this).animate({ 'opacity': '1' });
                    });
                }, 4500)
            }
            //11分屏
            if (e.cur === 10) {
                var $con = $page.find('.con');
                var $mover = $page.find('ul');
                var isMoving = !1;
                var curr = 1;
                $mover.css({
                    'transform': 'translateX(-8.4375rem)'
                });
                $con.on('touchstart', function(e) {
                    stop();
                    $con.startX = e.changedTouches[0].pageX;
                    $con.startY = e.changedTouches[0].pageY;
                }).on('touchmove', function(e) {
                    e.preventDefault();
                }).on('touchend', function(e) {
                    var x = e.changedTouches[0].pageX - $con.startX;
                    var y = e.changedTouches[0].pageY - $con.startY;
                    if (Math.abs(x) > Math.abs(y) && !isMoving) {
                        curr = x > 0 ? curr - 1 : curr + 1;
                        moving();
                    }
                });
                auto();
                //自动
                function auto() {
                    interval = setInterval(function() {
                        curr++;
                        moving();
                    }, 3000)
                }
                //停止
                function stop() {
                    clearInterval(interval);
                }
                //移动
                function moving() {
                    isMoving = !0;
                    $mover.animate({ translateX: '-' + curr * 8.4375 + 'rem' }, 600, function() {
                        if (curr == 3) curr = 1;
                        if (curr == 0) curr = 2;
                        $mover.css({
                            'transform': 'translateX(-' + curr * 8.4375 + 'rem)'
                        });
                        isMoving = !1;
                    })
                }
            }
            //12分屏
            if (e.cur === 11) {
                var $mover = $page.find('.maroquee');
                var iTarget = 0;
                var iLimit = 26.5;
                $mover.css({
                    'transform': 'translateY(0rem)'
                });
                setTimeout(function() {
                    interval = setInterval(function() {
                        doMove();
                    }, 30);
                }, 1000);

                function doMove() {
                    iTarget -= 0.05;
                    if (iTarget <= -iLimit) {
                        iTarget = 0;
                    }
                    $mover.css({
                        'transform': 'translateY(' + iTarget + 'rem)'
                    })
                }
            }
            //13分屏
            if (e.cur === 12) {
                $('.start').hide();
                setTimeout(function() {
                    $page.find('.slide').each(function() {
                        $(this).addClass($(this).data('animate')).show();
                    })
                }, 1000)
            }
        }
    });
}
//默认设置
function pageDefault() {
    //显示主体
    $('.wp').css({ 'opacity': 1 });
    //11分屏默认
    var $page11 = $('.page11'),
        $mover11 = $page11.find('ul');
    var $firstClone = $mover11.find('li').first().clone();
    var $lastClone = $mover11.find('li').last().clone();
    $mover11.append($firstClone).prepend($lastClone).css({
        'transform': 'translateX(-8.4375rem)'
    });
    //12分屏默认
    var $page12 = $('.page12'),
        $container12 = $page12.find('.block-container'),
        $mover12 = $page12.find('.maroquee');
    $mover12.append($mover12.html());
}
//音乐控制
function music() {
    var bgAudio = new Audio();
    bgAudio.loadStatus = 'unload';
    bgAudio.loop = true;

    function loadAudio(audio, url, callback) {
        audio.src = url;
        audio.load();
        audio.addEventListener('canplay', function() {
            bgAudio.loadStatus = 'loaded';
            callback();
        });
        audio.addEventListener('loadstart', function() {
            bgAudio.loadStatus = 'loading';
        });
    }

    function playAudio() {
        if (bgAudio.loadStatus === 'unload') {
            loadAudio(bgAudio, staticurl + '/pagescript/chineseCharacter/report/'+'media/bg.mp3', function() {
                playAudio();
            });
            return 1;
        }

        bgAudio.play();
    }

    function stopAudio() {
        bgAudio.pause();
    }
    bgAudio.addEventListener('playing', function(e) {
        $('#music .music-btn').addClass('play rotate');
    });
    bgAudio.addEventListener('pause', function(e) {
        $('#music .music-btn').removeClass('play rotate');
    });

    $('body').one('touchstart', function() {
        playAudio();
        $('#music').on('touchend', function(e) {
            if (bgAudio.paused) {
                playAudio();
                return 0;
            }
            stopAudio();
            return 1;
        });
    });
    window.onload = function() {
        if (bgAudio.loadStatus !== 'unload') {
            return;
        }
        playAudio();
    };
}
//图片预加载
function preloadImages(arr, callback) {
    var arr = typeof arr != "object" ? [arr] : arr;
    var aImages = [],
        iLoadedImages = 0,
        iLoadCount = arr.length;
    for (var i = 0; i < arr.length; i++) {
        aImages[i] = new Image();
        aImages[i].src = arr[i];
        if (aImages[i].complete) {
            iLoadCount--;
            if (iLoadCount === 0) {
                typeof(callback) === 'function' && callback();
                break;
            }
            continue;
        }
        aImages[i].onload = aImages[i].error = function() {
            iLoadedImages++;
            iLoadedImages === iLoadCount && typeof(callback) === 'function' && callback();
        }
    }
}
