Vue.http.options.emulateJSON = true;

try {
    zh.onMenuShareWxTimeLine(SHARE_TIMELINE_CONFIG);
    zh.onMenuShareWxMessage(SHARE_CONFIG);
    zh.onMenuShareFeed(SHARE_CONFIG);
    zh.onMenuShareShearPlate(SHARE_CONFIG);
    zh.onMenuShareShearImpress(SHARE_CONFIG);
} catch (e) {
    console.error("不能正确的分享 请检查!")
}

var tipsbarView = Vue.extend({
    template: '#tipsbar-temp',
    props: ['message', 'opened'],
})
Vue.component('tips-bar', tipsbarView)

var TopbarView = Vue.extend({
    template: '#topbar-temp',
    data:function(){
        return{
            config:{
                rerelease:{
                    title: '此机会已关闭，不再展示',
                    desc: '重新发布，坐等合作伙伴上门',
                    button: '重新发布'
                },
                goEdit: {
                    title: '此机会由于内容质量不高，已被暂停发布',
                    desc: '请及时修改',
                    button: '去修改'
                },
                goExpand: {
                    title: '此机会还没有人发现',
                    desc: '立即推广，坐等合作伙伴上门',
                    button: '立即推广'
                },
            },
            isStopped: isStopped,
            isAdminStopped: isAdminStopped,
            expanding: expanding,
        }
    },
    watch:{
        isStopped: function(){
            App.offline = this.isStopped || this.isAdminStopped
        },
        isAdminStopped: function(){
            App.offline = this.isStopped || this.isAdminStopped
        },
    },
    computed:{
        currentType: function() {
            return this.isAdminStopped? 'goEdit'
                        : this.isStopped? 'rerelease'
                            : !this.expanding? 'goExpand' : ''
        },
        tips: function(){
            return this.config[this.currentType]
        }
    },
    directives: {
        topbar: {
            inserted: function(el){
                setTimeout(function(){
                    el.style.height = el.children[0].clientHeight + 'px';
                }, 100)
            },
            update: function(el, binding, vnode){
                setTimeout(function(){
                    if(binding.value){
                        el.style.height = el.children[0].clientHeight + 'px';
                    }else{
                        el.style.height = 0 + 'px'
                    }
                }, 100)
            }
        }
    },
    methods:{
        btnEvent: function(){
            this[this.currentType]();
        },
        goEdit: function(){
            var url = wmpurl + '/wmp/user/'+appConfigId+'/resource/app/toCreate?id=' + resourceId
            if(zh && zh.navigateTo){
                zh.navigateTo({
                    url: url
                })
            }else{
                location.href = url
            }
        },
        goExpand: function(){
            var url = wmpurl + '/wmp/user/'+appConfigId+'/resource/app/toExpand?resourceId=' + resourceId
            if(zh && zh.navigateTo){
                zh.navigateTo({
                    url: url
                })
            }else{
                location.href = url
            }
        },
        rerelease: function(){
            var self = this;

            if(App.DialogTask != ''){
                return App.showDialog = true
            }

            var data = {
                resourceId: resourceId,
            }
            this.$http.post("/wmp/user/"+appConfigId+"/resource/app/online", data)
            .then(function(obj){
                var result = obj.body
                try {
                    result = JSON.parse(result)
                } catch (e) {}
                if(result.code != 0){
                    return alert(result.msg);
                }

                self.isStopped = false
                App.showDialog = false
                App.showTips("发布成功，展示排名已提升了"+result.data.upOrder+"名");
            })
        },
    }
})

Vue.component("topBar", TopbarView)

var Dialog = Vue.extend({
    template:"#dialog-temp",
    props:{
        opened: Boolean,
        // closeDisabled: Boolean,
        task: String,
    },
    computed:{
        tips: function(){
            return dialogConfig[this.task];
        }
    },
    methods:{
        onSwitch:function(){
            this.$emit('onswitch');
        },
        linkTo: function(){
            var self = this

            switch (this.task) {
                case 'goAuth':
                    zh.notifyAuthstep({
                        success: function(){
                            App.verificationAuth(function(isAuth){
                                if(isAuth){
                                    App.showDialog = false;
                                    App.isIdentification = true;
                                }
                            })
                        }
                    });
                    zh.authstep();
                    break;
                case 'goEdit':
                    zh.notifyProfileGuide({
                        success: function(){
                            App.showDialog = false;
                            App.complete = true;
                        },
                    })
                    zh.profileGuide();
                    break;
                case 'managerData':
                    var url = dialogConfig.managerData.href;
                    if(zh && zh.redirectTo){
                        zh.redirectTo({
                            url: wmpurl + url
                        })
                    }
                    else{
                        location.href = url
                    }
                    break;
                default:
            }
        }
    }
})
Vue.component('zh-dialog', Dialog);

var App = new Vue({
    data:{
        currentTab: currentTab,
        scrollTop:0,
        elementTop:0,
        initTitle:'',
        chanceTitle:'',
        isMy: isMy,
        showDialog: false,
        upLimit : upLimit,
        complete : complete,
        isIdentification : isIdentification,
        tipsSwich: false,
        tipsMessage: '',
        offline: isStopped || isAdminStopped,
    },
    computed:{
        DialogTask: function(){
            return this.upLimit ? 'managerData'
                        : !this.complete ? 'goEdit'
                            : !this.isIdentification ? 'goAuth' : ''
        },
    },
    methods: {
        showTips: function(message){
            this.tipsSwich = true
            this.tipsMessage = message
            setTimeout(function(){
                this.tipsSwich = false
            }.bind(this), 3000)
        },
        showShare: function(){
            zh.showShareMenu();
        },
        linkToSetting: function(){
            zh.ready(function(){
                if(!resourceId)throw Error('缺失 resourceId');
                var url = wmpurl + '/wmp/user/'+appConfigId+'/resource/app/toExpand?resourceId=' + resourceId
                if(zh && zh.navigateTo){
                    zh.navigateTo({
                        url: url
                    })
                }else{
                    location.href = url
                }
            })
        },
        setTitle: function(title){
            if('zh' in window && zh.setNavigationBarTitle){
                zh.ready(function(){
                    zh.setNavigationBarTitle(title)
                })
            }else{
                document.title = title
            }
        },
        onscroll: function(){
            this.scrollTop = this.$el.scrollTop
            if(this.scrollTop > this.elementTop){
                if(this.initTitle === ''){
                    this.initTitle = document.title;
                }
                this.setTitle(this.chanceTitle)
            }else if(this.scrollTop < this.$refs.nav.offsetTop && this.initTitle !== ''){
                this.setTitle(this.initTitle);
            }
        }
    },
    mounted:function(){
        this.elementTop = this.$refs.nav.offsetTop + this.$refs.nav.offsetHeight
        this.chanceTitle = this.$refs.title.innerText
    }
}).$mount('#app')
