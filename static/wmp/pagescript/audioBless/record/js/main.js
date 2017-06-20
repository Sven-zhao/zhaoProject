/**
 *   为Vue注入ajax模块
 */
Vue.use(VueResource);
Vue.http.options.emulateJSON = true;

Vue.use(infiniteScroll);

var recordComponent = Vue.extend({
    template:'#record-btn-temp',
    data:function(){
        return {
            access:true,
            holddown:false,
            uploadVoice:false,
            uploading:false,
            localId:0,
            serverId:0,
            touchPosition:{
                startPageY:0,
                movePageY:0,
                stopPageY:0,
            },
            diffPageY:80,
            touchstartTime:null,
            recordTime:0,
            totalTime:28,
            timer:null,
        }
    },
    watch:{
        hasVoice:function(){
            this.$emit("showshare",this.hasVoice);
        },
        ready:function(){
            if(!this.ready){
                return ;
            }
            if(this.initAudioId && this.initAudioId!=""){
                this.serverId = this.initAudioId;
                this.downloadVoice(this.serverId);
            }else{
                this.accessRecord();
            }

            this.onVoiceRecordEnd();
        },
        recordTime:function(n, o){
            if(n === 0){
                return;
            }else if (n === this.totalTime) {
                this.stopRecord();
                return ;
            }

            var self = this;
            this.timer = setTimeout(function(){
                self.recordTime++;
            },1000);
        }
    },
    computed:{
        hasVoice:function(){
            return this.localId !== 0;
        },
        touchout:function(){
            return this.touchPosition.movePageY > 0
                ? this.touchPosition.movePageY < this.touchPosition.startPageY - this.diffPageY
                : false;
        }
    },
    props:['initAudioId','ready'],
    methods: {
        accessRecord:function(){
            var self = this;
            var accessId;
            wx.startRecord({
                success:function(){
                    self.access = true;
                },
                cancel:function(){
                    self.access = false;
                },
            });
            setTimeout(function(){
                wx.stopRecord({
                    localId:accessId,
                })
            },1500);
        },
        keydown:function(){
            this.holddown = true;
        },
        keyup:function(){
            this.holddown = false;
        },
        reset:function(){
            this.stopVoice();
            this.localId = 0;
            this.serverId = 0;
        },
        stopVoice:function(){
            if(!this.holddown){
                return ;
            }
            wx.stopVoice({
                localId:this.localId,
            });
            this.keyup();
        },
        playVoice:function(){
            if(!this.hasVoice || this.holddown){
                return ;
            }

            this.keydown();
            wx.playVoice({
                localId: this.localId
            });

            var self = this;
            wx.onVoicePlayEnd({
                success:function(res){
                    self.keyup();
                }
            })
        },
        resetState:function(){
            clearTimeout(this.timer);
            this.recordTime = 0;

            var object = this.touchPosition;
            for (var variable in object) {
                if (object.hasOwnProperty(variable)) {
                    object[variable] = 0;
                }
            }
        },
        logTouchPageY:function(e,taget){
            this.touchPosition[taget] = e.changedTouches[0].pageY;
        },
        cancelRecord:function(e){
            this.logTouchPageY(e, 'movePageY');
        },
        startRecord:function(e){
            if(this.holddown){
                return ;
            }
            if(typeof this.touchstartTime === "object"
                && new Date() - this.touchstartTime < 1000){
                return ;
            }

            var self = this ;

            wx.startRecord({
                success:function(){
                    self.resetState();

                    self.logTouchPageY(e, 'startPageY');

                    self.keydown();

                    self.recordTime++;
                }
            });

            this.touchstartTime = new Date();
        },
        onVoiceRecordEnd : function(){
            var self = this;
            wx.onVoiceRecordEnd({
                complete: function (res) {
                    var localId = res.localId;
                    self.localId = res.localId;
                    self.keyup();
                    self.uploaVoice();
                }
            });
        },
        stopRecord:function(e){
            if(!this.holddown){
                return ;
            }
            var outOneSecond = new Date() - this.touchstartTime > 1000;
            var delay = outOneSecond ? 0 : 1000;

            if(e){
                this.logTouchPageY(e, 'stopPageY');
            }

            var self = this;
            setTimeout(function(){
                wx.stopRecord({
                    success: function (res) {
                        self.keyup();

                        if(self.touchout){
                            return ;
                        }
                        else if(!outOneSecond){
                            alert("语音过短！");
                            return ;
                        }

                        self.localId = res.localId;

                        setTimeout(function(){
                            self.uploaVoice();
                        },0);
                    }
                });
            },delay);

        },
        pushData:function(){
            this.$emit("pushdata",this.serverId)
        },
        downloadVoice: function(serverId){
            var self = this;
            wx.downloadVoice({
                serverId:serverId,
                success:function(res){
                    self.localId = res.localId;
                }
            });
        },
        uploaVoice: function(){
            var self = this;

            self.uploading = true;
            wx.uploadVoice({
                localId:self.localId,
                isShowProgressTips:1,
                success:function(res){
                    self.serverId = res.serverId;
                    self.pushData();
                }
            });
        },
    },
    directives:{
        play:{
            update:function(el, binding){
                if(binding.value){
                    play();
                }else{
                    reset();
                }
                function play(){
                    var b2 = el.children[1];
                    var b3 = el.children[2];
                    b2.style.opacity = 0;
                    b3.style.opacity = 0;

                    var queue = el.children;
                    var _index = 0;
                    var sign = false;
                    window.playingAnimate = setInterval(function(){
                        if(sign){
                            queue[--_index].style.opacity = 0;
                        }else{
                            queue[_index++].style.opacity = 1;
                        }
                        if(_index === queue.length || _index === 0){
                            sign = !sign
                        }
                    },200);
                }
                function reset(){
                    window.clearInterval(window.playingAnimate);
                    for (var i = 0; i < el.children.length; i++) {
                        el.children[i].style.opacity = 1;
                    }
                }
            }
        }
    },
    mounted:function(){

    }
});
Vue.component('record-btn',recordComponent);

var jdListComponent = Vue.extend({
    template:"#jd-list-temp",
    data: function(){
        return {
            commentList: [],
            busy: false,
            hasMore:true,
            totalCount:0,
            pageNo:1,
            userCount:0,
        }
    },
    methods: {
        close:function(){
            this.$emit('closelist');
        },
        linkView: function(haveBless,openId){
            if(haveBless){
                return "/wmp/user/"+appConfigId+"/audiobless/view/"+openId
            }
            return "javascript:;"
        },
        fetchData: function() {
            if (!this.hasMore) {
                return;
            }
            var self = this;
            self.busy = true;

            Vue.http.get("/wmp/user/" + appConfigId + "/audiobless/loadEgg?page="+this.pageNo)
                .then(function(obj){
                    var result = JSON.parse(obj.body);

                    if(result.code === -1){
                        alert(result.msg);
                        return;
                    }
                    self.commentList = [].concat(self.commentList,result.data.list);
                    self.totalCount = result.data.userCount;
                    self.pageNo = result.data.page +1;
                    self.hasMore = result.data.haveMore;
                    self.busy = false;
                    console.log("list fetchData over");
                });
        }
    },
    created: function() {
        this.fetchData();
    },
});
Vue.component("jd-list",jdListComponent);

var maskComponent = Vue.extend({
    template:"#mask-temp",
    data:function(){
        return {
            switch:false,
        }
    },
    methods:{
        closelist: function(){
            console.log("closelist");
            this.$emit("close");
        },
    }
});
Vue.component("mask-view",maskComponent);

var shareBoardComponent = Vue.extend({
    template:"#share-board-box-temp",
});
Vue.component('share-board-box',shareBoardComponent);

var app = new Vue({
    el:'.container',
    data:{
        jjImgs:jjImgs,
        jjType:initTemplateId?initTemplateId:1,
        jjTypeChanging:false,
        transitioning:false,
        recorded:false,
        share:false,
        showMask:false,
        maskSlotList:{
            list:"jd-list",
            share:"share-board-box",
        },
        maskSlotName:"",
        alljdCount:alljdCount,
        myjdCount:myjdCount,
        initAudioId:initAudioId?initAudioId:0,
        wxReady:false,
    },
    computed:{
        currentjjtype:function(){
            return this.jjImgs[this.jjType-1]
        }
    },
    methods:{
        showList:function(){
            if(this.myjdCount === 0){
                return ;
            }
            this.maskSlotName = this.maskSlotList.list;
            this.toggleShowMask();
        },
        showShareBox:function(){
            this.maskSlotName = this.maskSlotList.share;
            this.toggleShowMask();
        },
        toggleShowMask:function(){
            this.showMask = !this.showMask;
        },
        changejjType:function(){
            var self = this;

            self.jjTypeChanging = true;

            if(self.jjType < self.jjImgs.length){
                self.jjType++;
            }else{
                self.jjType = 1;
            }

            self.pushServer();

            var handler = function(){
                self.jjTypeChanging = false;
            }
            setTimeout(function(){handler()},250);
        },

        showShare:function(hasVoice){
            this.share = hasVoice;
            if(hasVoice && wx){
                wx.showOptionMenu();
            }else if (wx){
                wx.hideOptionMenu();
            }
        },
        pushServer: function(audioId){
            var data = {
                templeteId : this.jjType,
            };
            if(audioId){
                data.audioId = audioId;
            }
            Vue.http.post("/wmp/user/"+appConfigId+"/audiobless/postBless",data)
                .then(function(obj){
                    var result = obj.body;
                    console.info("pushData over");
                });
        },
    },
    mounted:function(){
        if(openList){
            this.showList();
        }
    }
});
