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
            holddown:false,
            uploadVoice:false,
            uploading:false,
            playing:false,
            localId:0,
            serverId:0,
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
            }
        },
        holddown:function(){
            this.$emit('pull',this.holddown,this.localId);
        }
    },
    computed:{
        hasVoice:function(){
            return this.localId !== 0;
        }
    },
    props:['initAudioId','ready'],
    methods: {
        keydown:function(){
            this.holddown = true;
        },
        keyup:function(){
            this.holddown = false;
        },
        reset:function(){
            this.localId = 0;
            this.serverId = 0;
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
                    setTimeout(function(){
                        self.keyup();
                    },100);
                }
            })
        },
        startRecord:function(){
            this.keydown();
            wx.startRecord();
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
        stopRecord:function(){
            this.keyup();

            var self = this;
            wx.stopRecord({
                success: function (res) {
                    self.localId = res.localId;

                    self.uploaVoice();
                }
            });
        }
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

            Vue.http.get("/wmp/user/" + appConfigId + "/audiobless/loadEgg?page="+this.pageNo+"&openId="+openId)
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

var addjdComponent = Vue.extend({
    template:"#addjd-temp",
    data:function(){
        return {
            runing:false,
        }
    },
    methods:{
        touchHandler:function(){
            if(this.runing){
                return;
            }

            this.runing = true;

            this.$emit("touchhandler");
        },
        runOver:function(){
            this.runing = false;
        }
    }
});
Vue.component("addjd-btn",addjdComponent);

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

var app = new Vue({
    el:'.container',
    data:{
        jjTypeChanging:false,
        recorded:false,
        initAudioId:0,
        share:false,
        showMask:false,
        alljdCount:alljdCount?alljdCount:0,
        myjdCount:myjdCount?myjdCount:0,
        maskSlotList:{
            list:"jd-list",
        },
        maskSlotName:"",
        initAudioId:initAudioId?initAudioId:0,
        wxReady:false,
        holddown:false,
        localId:0,
    },
    methods:{
        addjdBothCount:function(){
            console.log("addjd count");
            this.alljdCount++;
            this.myjdCount++;
            this.pushData();
        },
        showList:function(){
            if(this.myjdCount === 0){
                return ;
            }
            this.maskSlotName = this.maskSlotList.list;
            this.toggleShowMask();
        },
        toggleShowMask:function(){
            this.showMask = !this.showMask;
        },
        pushData:function(){
            var data = {
                openId : openId,
            };
            Vue.http.post("/wmp/user/"+appConfigId+"/audiobless/sendEgg",data)
            .then(function(obj){
                var result = obj.body;
            });
        },
        pullData:function(holddown, localId){
            this.holddown = holddown;
            this.localId = localId;
        },
        redirectHref:function(href){
            var self = this;
            if(this.holddown){
                wx.stopVoice({
                    localId:self.localId,
                    success:function(){
                        window.location.href = href;
                    }
                });
            }else{
                window.location.href = href;
            }

        }
    },
    mounted:function(){

    }
});
