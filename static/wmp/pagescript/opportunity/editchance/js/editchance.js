;(function(){
    FastClick.attach(document.body);

    Vue.http.options.emulateJSON = true;


    Vue.config.debug = true;

    var isEdit = 'resource' in window && resource != null;
    var Bus = {
        action: 'go',
        transition: {
            go: {
                enterClass: 'animated shot pa fadeInRight',
                leaveClass: 'animated shot pa fadeOutLeft',
            },
            back:{
                enterClass: 'animated shot pa fadeInLeft',
                leaveClass: 'animated shot pa fadeOutRight',
            }
        },
        chanceId: isEdit? resource.category_id : 0,
        title: '',
        content: '',
        tag: '',
        location: '',
        resourceId: '',
        urls: [],
        industries: [],
        days: 0,
        showDialog:upLimit || !complete,
        upLimit : upLimit,
        complete : complete,
        isIdentification : isIdentification,
    }


    var TagView = Vue.extend({
        template: "#tag-temp",
        data: function () {
            return {
                tagList: tagList,
                typeId: null,
                state: {
                    allow: false,
                    condition: 1,
                },
                condition: {
                    num: 1,
                },
                remainCount: remainCount,
            }
        },
        computed: {
            tagChecked: function () {
                return !!this.typeId
            }
        },
        watch: {
            tagChecked: function () {
                this.state.allow = this.tagChecked;
            }
        },
        methods: {
            commit: function () {
                Bus.chanceId = this.typeId;
            },
            getIcon: function(title){
                // return '#icon-'+(id in tagTips ? tagTips[id].style.icon : tagTips[0].style.icon)
                return '#icon-'+(function(){
                    for (var i = 0; i < tagTips.length; i++) {
                        if(tagTips[i].title == title){
                            return tagTips[i].style.icon
                        }
                    }
                    return tagTips[0].style.icon
                })()
            }
        },
        mounted: function(){
            if(Bus.chanceId > 0){
                this.typeId = Bus.chanceId;
                this.state.allow = true;
            }
        },
        beforeRouteEnter: function(to, from, next){
            if(from.name === 'create'){
                Bus.action = 'back'
            }
            next()
        },
        beforeRouteLeave: function( to, from, next){

            if (!this.state.allow) {
                return;
            }

            this.commit();
            next();
        }
    });

    var ImageComponent = Vue.extend({
        template: '#image-temp',
        props:{
            urls: {
                type: Array,
                required: true
            },
            maxCount: {
                default: 9
            },
        },
        computed:{
            count: function(){
                return this.urls.length
            }
        },
        watch: {
            urls: function(val, oldval){
                this.$emit('onchange', val);
            }
        },
        methods: {
            deleteArray: function(sumArr, delArr){
                delArr.forEach(function (element){
                    var index = sumArr.indexOf(element)
                    if(index > -1){
                        sumArr.splice(index, 1);
                    }
                });
            },
            uploadImages: function(){
                var self = this;
                zh.chooseImage({
                    maxCount: this.maxCount - this.urls.length,
                }, function(res) {
                    res.tempFilePath.forEach(function (element){
                        self.urls.push(element);
                    })
                });
            },
            previewImages: function (index){
                var self = this;
                zh.previewImage({
                    current: this.urls[index],
                    urls: this.urls,
                    quality: 'origin',
                },function (res) {
                    self.deleteArray(self.urls, res.deleteUrls);
                })
            }
        }
    });

    var FormCacheID = isEdit? resource.category_id : 0;
    var FormCache = {};
    if(isEdit){
        FormCache.title = resource.title
        FormCache.content = resource.content
        FormCache.urls = resource.images
        FormCache.tag = resource.advantages
        FormCache.location = resource.areaInput
        FormCache.industries = resource.industries
        Bus.resourceId = resource.resource_id
    }

    var FormView = Vue.extend({
        template: '#form-temp',
        data:function(){
            return {
                title : '',
                content: '',
                tag: '',
                location: '',
                days: 30,
                urls:[],
                industries:[],//{tagId: 'sdf', tagName: 'aaaa'}
                tipsDisplay:{
                    title: false,
                    content: false,
                    tag: false,
                    location: false,
                    industries: false,
                },
            }
        },
        watch:{
            "industries.length": function(newval, oldval){
                if(newval > 0)this.tipsDisplay.industries = false;
            }
        },
        components:{
            "ImageComponent": ImageComponent,
        },
        computed:{
            tips:function(){
                var self = this
                var title = (function(){
                    for (var i = 0; i < tagList.length; i++) {
                        if(tagList[i].id == self.$route.params.id){
                            return tagList[i].title
                        }
                    }
                })()
                return (function(){
                    for (var i = 0; i < tagTips.length; i++) {
                        if(tagTips[i].title == title){
                            return tagTips[i].tips
                        }
                    }
                    return tagTips[0].tips
                })()
                // var id = this.$route.params.id;
                // return id in tagTips ? tagTips[id].tips : tagTips[0].tips
            }
        },
        methods:{
            clearCache:function(){
                FormCacheID = undefined;
                FormCache = {};
            },
            resetCache: function (){
                if(isEdit || this.$route.params.id == FormCacheID){

                    for (var variable in FormCache) {
                        this.$data[variable] = FormCache[variable];
                    }
                }
                this.clearCache();
            },
            setCache: function(){
                for (var variable in this.$data) {
                    if(Object.prototype.toString.apply(this.$data[variable])  === '[object Object]'
                        || (typeof this.$data[variable] === "string" && this.$data[variable] === '')
                        || this.$data[variable] === 0){
                        continue;
                    }

                    FormCacheID = this.$route.params.id;
                    FormCache[variable] = this.$data[variable]
                }
            },
            callIndustry: function(){
                var self = this;
                zh.chooseIndustry({
                    industries: this.industries,
                    maxCount: 3,
                },function(res){
                    self.industries = res.industries;
                });
            },
            deleteindustries: function(index){
                this.industries.splice(index, 1);
            },
            commit: function(){
                var pass = true;
                for (var variable in this.$data) {
                    if(Object.prototype.toString.apply(this.$data[variable])  === '[object Object]'
                        || (Object.prototype.toString.apply(this.$data[variable])  === '[object Array]'
                            && this.$data[variable].length > 0
                            || variable === 'urls')
                        || (typeof this.$data[variable] === "string" && this.$data[variable] !== '')
                        || this.$data[variable] > 0){
                        continue;
                    }
                    this.tipsDisplay[variable] = true;
                    if(pass)pass = false;
                }
                if(pass){
                    Bus.title = this.title;
                    Bus.content = this.content;
                    Bus.tag = this.tag;
                    Bus.location = this.location;
                    Bus.days = this.days;
                    Bus.industries = this.industries;
                    Bus.urls = this.urls;
                }
                return pass;
            }
        },
        beforeRouteEnter: function(to, from, next){
            if(from.name === 'success'){
                Bus.action = 'back'
            }
            else if(from.name === 'categorie'){
                Bus.action = 'go'
            }
            next(function(vm){
                vm.resetCache()
            })
        },
        beforeRouteLeave : function(to, from, next){

            if(to.name === 'success' && this.commit()){
                App.fetchData(function(){
                    this.setCache()
                    next()
                }.bind(this))
            }
            else if(to.name !== 'success') {
                this.setCache()
                next()
            }
        }
    });

    var SuccessView = Vue.extend({
        template:"#success-temp",
        methods:{
            link:function(){
                App.link();
            }
        },
        beforeRouteEnter: function(to, from, next){
            Bus.action = 'go'
            next()
        },
        // beforeRouteLeave: function(to, from, next){
        //     /*禁止后退*/
        // },
    });



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
                                        Bus.showDialog = false;
                                        Bus.isIdentification = true;
                                        App.link();
                                    }
                                })
                            }
                        });
                        zh.authstep();
                        break;
                    case 'goEdit':
                        zh.notifyProfileGuide({
                            success: function(){
                                Bus.showDialog = false;
                                Bus.complete = true;
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


    var routes = [
        {path: '/categorie', name:'categorie', component: TagView},
        {path: '/create/:id', name:'create', component:FormView},
        {path: '/success', name:'success', component:SuccessView},
        {path: '/*', redirect: '/categorie'}
    ]


    var router = new VueRouter({
        routes : routes
    })


    var App = new Vue({
        data: Bus,
        computed:{
            DialogTask: function(){
                return this.upLimit ? 'managerData'
                            : !this.complete ? 'goEdit'
                                : !this.isIdentification ? 'goAuth' : ''
            },
        },
        methods:{
            verificationAuth: function(cb){
                var self = this

                Vue.http.get("/wmp/user/"+appConfigId+"/resource/app/detailData/"+self.resourceId)
                .then(function(obj){
                    var result = obj.body
                    try {
                        result = JSON.parse(result)
                    } catch (e) {}

                    cb(result.data.isAuth)
                })
            },
            link:function(){
                this.isIdentification
                    ? (location.href = "/wmp/user/"+appConfigId+"/resource/app/toExpand?resourceId="+this.resourceId)
                    : this.showDialog = true
            },
            formatIndustries: function(arr){
                var industries = [].concat(arr);
                for (var i = 0; i < industries.length; i++) {
                    industries[i] = industries[i].tagId
                }
                return industries;
            },
            fetchData: function (cb) {
                var self = this;

                var data = {
                    categorie: this.chanceId,
                    title : this.title,
                    content: this.content,
                    advantages: this.tag,
                    area: this.location,
                    days: this.days,
                    industries:this.formatIndustries(this.industries).toString(),
                    images:this.urls.toString(),
                };

                if(self.resourceId && self.resourceId != ''){
                    data["id"] = self.resourceId
                }

                Vue.http.post(
                    '/wmp/user/' + appConfigId + '/resource/app/create',
                    data
                    )
                    .then(function (obj) {
                        var result = typeof obj.body === 'string' ? JSON.parse(obj.body):obj.body;
                        if(result.code != 0){
                            alert(result.msg);
                            console.error("[zh-info]create:", result.msg);
                            return ;
                        }
                        self.resourceId = result.data.resourceId

                        if(!isEdit){
                            FormCacheID = self.resourceId
                            FormCache.title = self.title
                            FormCache.content = self.content
                            FormCache.urls = self.urls
                            FormCache.tag = self.advantages
                            FormCache.location = self.location
                            FormCache.industries = self.industries
                            FormCache.resourceId = self.resourceId
                        }

                        isEdit = true;

                        cb()
                    })
            }
        },
        router : router,
    }).$mount('#app');

})();
