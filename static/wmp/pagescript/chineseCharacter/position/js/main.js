Vue.config.devtools = true;

Vue.use(VueResource);
Vue.http.options.emulateJSON = true;

var ResultView = Vue.extend({
    template: '#result-temp',
    props:['maxChar','showTime','charId','totalCount'],
    data:function(){
        return {
            currentTime : 0,
            timeOffset : new Date().getTimezoneOffset()*1000,
            audioControl : {},
            played : false,
        }
    },
    watch:{
        currentTime:function(){
            var self = this;
            setTimeout(function(){
                self.currentTime = new Date();
            },1000);
        },
        fixTime:function(n, o){
            if(this.timeEnd || this.played){
                return ;
            }
            this.joinAudio();
            this.played = true;
        }
    },
    computed:{
        showTimeDateObj:function(){
            var d = this.showTime.toString().indexOf('-') > -1 ?this.showTime.replace(/\-/g,'/'):this.showTime;
            return new Date(d);
        },
        fixTime:function(){
            var r = this.showTime == "" ? this.currentTime : this.showTimeDateObj;
            return Math.floor((new Date(r)-new Date(this.currentTime))/1000);
        },
        timeEnd:function(){
            return this.fixTime <= 0;
        }
    },
    methods:{
        showChar:function(){
            var fixTime = this.showTime();
        },
        setCurrentTime:function(){
            this.currentTime = new Date().getTime();
        },
        stoplink:function(location){
            if(!App.isScreen){
                window.location.href = location;
            }
        },
        joinAudio:function(){
            if(!App.isScreen){
                return ;
            }
            this.audioControl = document.querySelector('#resultAudio');
            this.audioControl.src = this.audioControl.dataset.src;
            // this.audioControl.load();
            // setTimeout(function(){
            //     this.audioControl.play();
            //     var duration = this.audioControl.duration;
            //     var playtime = this.fixTime;
            //     console.warn(duration,playtime,2);
            //     this.audioControl.currentTime = duration-playtime-2;
            // }.bind(this),500);
            this.audioControl.play();
        }
    },
    mounted:function(){
        if(App){
            App.fetchResult();
        }

        this.setCurrentTime();
    },
    beforeRouteLeave:function(to, from, next){
        if(this.audioControl.pause){
            this.audioControl.pause();
        }
        next();
    }
});

var CascadeView = Vue.extend({
    template:'#cascade-temp',
    data:function(){
        return {
            charList : [],
            audioControl:{},
        }
    },
    props:['cl','userAvatar'],
    directives:{
        loaded:{
            componentUpdated: function(el){
                /**
                 * componentUpdated 增加每个dom 都会调用
                 * 根据汉字 数量 为条件 做节流
                 */
                var count = document.querySelectorAll('.cascade-grid').length;
                if(el.dataset.gridCount == count){
                    return ;
                }
                el.dataset.gridCount = count;

                /**
                 * 为外部容器 添加可视高度
                 */


                var wrapper = document.querySelector('.wrapper');
                var container = document.querySelector('.cascade-container');

                var col = document.body.clientHeight > container.clientWidth ? 4 : 9;
                var row = count % col == 0 ? count / col : (count / col) + 1;
                var cellHeight = parseInt(document.querySelector('.cascade-grid-placeholder').clientHeight);
                var nullHeight = document.body.clientHeight > container.clientWidth ? 2*cellHeight : 2*cellHeight;

                container.style.overflow = "hidden";
                container.style.height = (row * cellHeight + nullHeight) + "px";

                /**
                 * 判断 当前在最后一屏内 增量时 自动滚至底部
                 */
                var diffHeight = container.clientHeight - wrapper.scrollTop;
                var clientHeight = document.body.clientHeight;
                if(diffHeight > clientHeight*2){
                    return ;
                }

                /**
                 * 自动滚至底部动画
                 */
                var frameNumber = 1000/60;//帧数
                var time = 1200;//耗时
                var nt = time/frameNumber;//单位时间内次数
                var increment = diffHeight / nt;//每帧的增量

                var i = nt;

                var timer = setInterval(function(){
                    wrapper.scrollTop += increment;
                    if(--i === 0){
                        window.clearInterval(timer);
                    }
                },frameNumber);


            }
        },
    },
    watch:{
        cl:function(n,o){
            if(o.length === n.length){
                return ;
            }
            this.setCharList(n);
        }
    },
    methods:{
        setCharList:function(newList){
            var self = this;
            var i = this.charList.length ? this.charList.length : 0;
            this.charList = newList;
            var enlist = function(){
                setTimeout(function(){
                    self.$set(self.charList[i],'isShow',true);
                    if(self.charList.length-1 > i++){
                        enlist();
                    }else{
                        enlist = null;
                    }
                },150);
            };
            enlist();
        },
        stoplink:function(location){
            if(!App.isScreen){
                window.location.href = location;
            }
        },
        joinAudio:function(){
            if(!App.isScreen){
                return ;
            }
            this.audioControl = document.querySelector('#cascadeAudio');
            this.audioControl.src = this.audioControl.dataset.src;
            this.audioControl.play();
        }
    },
    mounted:function(){
        if(App){
            App.pollingData();
        }

        if(this.cl.length > this.charList.length){
            this.setCharList(this.cl);
        }
    },
    beforeRouteEnter:function(to, from, next){
        next(function(vm){
            vm.joinAudio();
        });
    },
    beforeRouteLeave:function(to, from, next){
        if(this.audioControl.pause){
            this.audioControl.pause();
        }
        next();
    }
});

var HomeView = Vue.extend({
    template:"<span></span>",
    props:['endHeart'],
    watch:{
        endHeart:function(n,o){
            console.info("home watch endHeart change");
            App.redirection();
        }
    },
    mounted:function(){
        console.log("home mounted" , this.endHeart);
        if(App)App.redirection();
    }
});

/**
 * vue-router init
 */
Vue.use(VueRouter);

var routes = [
    {
        path:'/cascade',
        name:"cascade",
        component:CascadeView,
    },
    {
        path:'/result',
        name:"result",
        component:ResultView,
    },
    {path:"/home",name:'home',component:HomeView},
    // {path:'/*',redirect:'/'},
    // {path:'*',component:CascadeView}
];
var router = new VueRouter({
    mode: 'history',
    scrollBehavior: function(){
        return ({y: 0})
    },
    base: __dirname,
    routes:routes,
});


var App = new Vue({
    router:router,
    data:{
        userAvatar:"",
        charList:[],
        sign:1,
        endHeart:null,
        maxChar:"",
        showTime:"",
        charId:"",
        totalCount:"",
    },
    watch:{
        endHeart:function(n,o){
            // this.redirection();
            router.replace('/home');
        }
    },
    computed:{
        isScreen:function(){
            return document.querySelector('.wrapper').clientWidth > 1200
        }
    },
    methods:{
        fetchData:function(){
            console.info("fetchData");
            var self = this;

            Vue.http.get("/wmp/user/"+appConfigId+"/figures/yearChar/polyList?freq="+this.sign)
            .then(function(obj){
                var result = JSON.parse(obj.body);

                if(result.code == 1){
                    return ;
                }

                self.endHeart = result.data.endHeart;
                /**
                 * 确保 观测到endHeart变动后 先触发视图更新 在赋值
                 * 保证视图props触发
                 */
                setTimeout(function(){
                    if(result.data.userAvatar.length > 0){
                        self.userAvatar = result.data.userAvatar;
                    }
                    self.charList = self.charList.concat(result.data.charList);
                    if(result.data.charList.length>0){
                        self.sign = result.data.charList[result.data.charList.length-1].id;
                    }

                },0);

            });
        },
        fetchResult:function(){
            console.info("fetchResult");
            var self = this;
            Vue.http.post("/wmp/user/"+appConfigId+"/figures/yearChar/maxYearChar")
            .then(function(obj){
                var result = JSON.parse(obj.body);

                self.maxChar = result.data.yearChar;
                // self.showTime = result.data.showTime;
                self.charId = result.data.id;
                self.totalCount = result.data.totaCount;

                var now = new Date();
                if(new Date(result.data.showTime.replace(/\-/g,'/')) > new Date()){
                    self.showTime = new Date(now.getFullYear(),now.getMonth(),now.getDate(),now.getHours(),now.getMinutes(),now.getSeconds()+10);
                }else{
                    self.showTime = result.data.showTime;
                }

                console.log(self.showTime);
                console.log("maxChar Over");
            })
        },
        pollingData:function(){
            if(this.enHeart){
                return ;
            }
            var self = this;
            setTimeout(function(){
                self.fetchData();
                self.pollingData();
            },3000);
        },
        redirection:function(){
            console.log("redirection",this.endHeart);
            if(this.endHeart){
                console.log("route result");
                router.replace("/result")
            }else{
                console.log("route cascade");
                router.replace("/cascade")
            }
        },
    },
    mounted:function(){
        console.log("App mounted");
        this.fetchData();
    }
}).$mount('.wrapper');
