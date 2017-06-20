require([
    'common/vue/2.1.3/vue.min',
    'common/vue-router/2.0.2/vue-router',
    'common/vue-resource/1.0.3/vue-resource',
    'common/swiper/3.4.0/js/swiper.min',
    'wxapi'
], function (Vue, VueRouter, VueResource, Swiper, wx) {

    Vue.config.devtools = true;

    /**
     *   为Vue注入ajax模块
     */
    Vue.use(VueResource);
    Vue.http.options.emulateJSON = true;

    /**
     * 颁奖page
     */
    var AwardView = Vue.extend({
        template: '#award-temp',
        props: ['current', 'amount', 'title', 'info', 'cl', 'type'],
        methods: {
            route: function (path) {
                router.push(path);
            },
        },
        mounted: function () {
            var _this = this;
            setTimeout(function () {
                var swiper = new Swiper('.condidate-swiper', {
                    slidesPerView: 'auto',
                    centeredSlides: true,
                    paginationClickable: true,
                    // spaceBetween: 20,
                    initialSlide: 1,
                    slideActiveClass: 'current',
                    autoplay: 2500,
                    // loop:true,
                    // loopedSlides:(_this.cl.length + 1),
                });
            }, 450);
        },
    });

    var CommentView = Vue.extend({
        template: "#comment-temp",
        data: function () {
            return {
                "myRemarkInput": null,
                "textareaFocus": false,
            }
        },
        props: ['cl', 'title', 'current', 'amount'],
        computed: {
            choice: function () {
                return this.cl[this.$route.params.cIndex];
            },
            formValid: function () {
                if (this.myRemarkInput.length > 100) {
                    return false;
                }
                return true;
            },
            showTextareaTips: function () {
                return this.textareaFocus && this.myRemarkInput.length < 30;
            }
        },
        beforeRouteEnter: function (to, from, next) {
            next(function (vm) {
                App.myRemark = "";
                vm.myRemarkInput = App.myRemark;
            });
        },
        beforeRouteLeave: function (to, from, next) {
            if (to.name == "award") {
                this.myRemarkInput = null;
            } else {
                App.setMyRemarkAction(this.myRemarkInput);
            }
            next();
        },
    });

    var BoardView = Vue.extend({
        template: "#board-temp",
        props: ['mr', 'cl', 'title', 'info', 'current', 'amount', 'nominator', 'user'],
        methods: {
            commitRemark: function () {
                App.fetchData(this.choice.choice.id ? this.choice.choice.id : this.choice.choice);
            }
        },
        computed: {
            choice: function () {
                var c = {};
                if (parseInt(this.$route.params.cIndex) > -1) {
                    c = this.cl[this.$route.params.cIndex];
                } else {
                    c.choice = this.nominator;
                    c.recommendUserName = this.user.userName;
                }
                return c;
            }
        },
        watch: {
            choice: function () {
                if (!this.nominator || !('choice' in this.nominator)) {
                    router.push("/award");
                }
            }
        },
        // beforeRouteEnter: function(to,from,next){
        //     next(function(vm){
        //         var c = {};
        //         if(parseInt(vm.$route.params.cIndex) > -1){
        //             c = vm.cl[vm.$route.params.cIndex];
        //         }else{
        //             c.choice = vm.nominator;
        //             c.recommendUserName = vm.user.userName;
        //         }
        //         vm.choice = c;
        //     });
        // },
    });

    var Nominate = Vue.extend({
        template: '#nominate-temp',
        data: function () {
            return {
                name: "",
                company: "",
                position: "",
                defaultAvatar: "",
                comment: "",
                textareaFocus: false,
                defaultAvatar: [
                    "http://impic.zhisland.com/impic/T1SyYTB_Av1RXrhCrK.jpg",
                    "http://impic.zhisland.com/impic/T1SyYTB_Av1RXrhCrK.jpg",
                    "http://impic.zhisland.com/impic/T1SyYTB_Av1RXrhCrK.jpg",
                    "http://impic.zhisland.com/impic/T1SyYTB_Av1RXrhCrK.jpg",
                    "http://impic.zhisland.com/impic/T1SyYTB_Av1RXrhCrK.jpg"
                ],
                titleOption: [
                    "颁奖给谁?",
                    "颁奖给哪家企业？",
                    "颁奖给哪款产品？",
                    "颁奖给哪件正和岛大事？",
                    "颁奖给哪部读物？"
                ],
                tipsOption: [//0人物1公司2产品3事件4图书
                    [
                        {
                            model: 'name',
                            placeholder: '获奖人姓名',
                        },
                        {
                            model: 'company',
                            placeholder: '他的公司名称'
                        },
                        {
                            model: 'position',
                            placeholder: '他的现任职务'
                        },
                    ],
                    [
                        {
                            model: 'name',
                            placeholder: '获奖企业名称'
                        },
                        {
                            model: 'company',
                            placeholder: '该企业所属的行业'
                        },
                    ],
                    [
                        {
                            model: 'name',
                            placeholder: '获奖产品名称'
                        },
                        {
                            model: 'company',
                            placeholder: '该产品所属的企业名称'
                        },
                    ],
                    [
                        {
                            model: 'name',
                            placeholder: '简述岛内大事的名称'
                        },
                    ],
                    [
                        {
                            model: 'name',
                            placeholder: '获奖的读物名称'
                        },
                    ],
                ]
            }
        },
        props: ['type', 'user', 'title', 'current', 'amount'],
        watch: {
            name: function (o, n) {
                if (n.length >= 30) {
                    this.name = n.substring(0, n.length - 1);
                }
            },
            company: function (o, n) {
                if (n.length >= 30) {
                    this.company = n.substring(0, n.length - 1);
                }
            },
            position: function (o, n) {
                if (n.length >= 30) {
                    this.position = n.substring(0, n.length - 1);
                }
            },
            comment: function (o, n) {
                if (n.length >= 100) {
                    this.comment = n.substring(0, n.length - 1);
                }
            }
        },
        computed: {
            formInputList: function () {
                return this.tipsOption[this.type];
            },
            formTitle: function () {
                return this.titleOption[this.type];
            },
            formValid: function () {
                for (var i = 0; i < this.formInputList.length; i++) {
                    if (this[this.formInputList[i].model].length === 0) {
                        return false;
                    }
                }
                if (this.comment.length === 0 || this.comment.length > 100) {
                    return false;
                }
                return true;
            },
            showTextareaTips: function () {
                return this.textareaFocus && this.comment.length < 30;
            }
        },
        methods: {
            temporaryStorage: function () {
                var person = {
                    "name": this.name,
                    "company": this.company,
                    "position": this.position,
                    "comment": this.comment,
                    "imageUrl": this.defaultAvatar[this.type],
                    "type": this.type,
                };
                App.setNominatorAction(person);
                App.setMyRemarkAction(this.myRemarkInput);
            },
            nominateSubmit: function () {
                if (!this.formValid) {
                    return;
                }
                router.push({name: 'board', params: {cIndex: -1}});
            }
        },
        beforeRouteLeave: function (to, from, next) {
            this.temporaryStorage();
            next();
        },

    });

    /**
     * vue-router init
     */
    Vue.use(VueRouter);

    var routes = [
        {path: '/nominate', name: 'nominate', component: Nominate},
        {path: '/board/:cIndex', name: "board", component: BoardView},
        {path: '/comment/:cIndex', name: "comment", component: CommentView},
        {path: '/award', name: "award", component: AwardView},
        {path: '/*', redirect: '/award'},
        // {path:'*',component:AwardView}
    ];

    var router = new VueRouter({
        mode: 'history',
        scrollBehavior: function () {
            return ({y: 0})
        },
        base: __dirname,
        routes: routes,
    });


    var App = new Vue({
        router: router,
        data: {
            "current": 0,
            "amount": 0,
            "user": {},
            "title": "",
            "info": "",
            "choiceList": [],
            "myRemark": "",
            "nominator": {},
            hasMore: false,
            isLogin: false,
            registUrl: "",
            type: 0,
            relationId: 0,
        },
        watch: {
            $route: function () {
                wx.hideOptionMenu();//pages阻止分享
            }
        },
        methods: {
            setMyRemarkAction: function (newVar) {
                this.myRemark = newVar;
            },
            setNominatorAction: function (newVar) {
                this.nominator = newVar;
            },
            fetchData: function (params) {
                var _this = this;
                var Data = {};
                Data.prizeType = prizeType;
                if (typeof params === 'object') {
                    Data.isSys = 0;
                    Data.userChoiceId = _this.relationId;
                    Data.data = JSON.stringify(_this.nominator);
                }
                else if (typeof params == 'string' || typeof params == 'number') {
                    Data.isSys = 1;
                    Data.userChoiceId = _this.relationId;
                    Data.choiceId = params;
                    Data.myRemark = _this.myRemark;
                }
                console.info("commit:", Data);
                Vue.http.post('/wmp/user/' + appConfigId + '/prize/answerSubmit', Data)
                    .then(function (obj) {
                        console.log(obj);
                        var result = JSON.parse(obj.body);

                        if (result.code === 1) {
                            window.location.href = result.data.url;
                            return false;
                        } else if (result.code === -1) {
                            // router.push('go(-1)');
                            alert(result.msg);
                            return;
                        }

                        _this.registUrl = result.data.registUrl;
                        _this.hasMore = result.data.hasMore;
                        _this.isLogin = result.data.isLogin;
                        _this.current = result.data.curPage;
                        _this.amount = result.data.total;
                        _this.title = result.data.prizeBase.title;
                        _this.info = result.data.prizeBase.info;
                        _this.choiceList = result.data.choiceList;
                        _this.user = result.data.userTo;
                        _this.type = result.data.prizeBase.type;
                        _this.relationId = result.data.relationId;
                        _this.myRemark = "";
                        _this.nominator = null;

                        console.log("fetch over");
                        if (params != undefined) {
                            _this.initialDataSkip();
                        }
                    });
            },
            initialDataSkip: function () {
                router.push('/award');
            }
        },
        created: function () {
            this.fetchData();
        }
    }).$mount('#app');
});
