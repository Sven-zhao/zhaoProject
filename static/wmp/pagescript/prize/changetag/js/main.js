require([
    'common/vue/2.1.3/vue.min',
    'common/vue-resource/1.0.3/vue-resource',
    //'common/jquery-plugins/fastclick',
    'pagescript/prize/base/js/wxshare',
], function (Vue, VueResource, FastClick) {
    'use strict';

    //FastClick.attach(document.body);

    /**
     *   为Vue注入ajax模块
     */
    Vue.use(VueResource);
    Vue.http.options.emulateJSON = true;
    var TagView = Vue.extend({
        template: "#tag-temp",
        data: function () {
            return {
                tagList: tagList,
                checkedTags: [],
                state: {
                    allow: false,
                    condition: 5,
                },
                condition: {
                    num: 5,
                }
            }
        },
        computed: {
            tagCount: function () {
                return this.checkedTags.length
                    ? this.checkedTags.length
                    : 0;
            },
            tips: function () {
                return this.state.allow
                    ? '开始颁奖'
                    : '至少选' + this.state.condition + '项';
            }
        },
        watch: {
            tagCount: function () {
                this.state.allow = this.tagCount >= this.state.condition;
            }
        },
        methods: {
            commit: function () {
                if (!this.state.allow) {
                    return;
                }
                Vue.http.post(
                    './question/submit',
                    {
                        prizeType: 0,
                        data: JSON.stringify(this.checkedTags)
                    }
                    )
                    .then(function (obj) {
                        console.log(obj);
                        var result = JSON.parse(obj.body);
                        window.location.href = result.data.url;
                    });
            }
        },
        // mounted:function(){
        //     var _this = this;
        //     Vue.http.get('./tag')
        //     .then(function(obj){
        //         console.log(obj);
        //         var result = JSON.parse(obj.body);
        //         _this.tagList = result.data.resultData;
        //     });
        // }
    });

    Vue.component("TagView", TagView);

    /**
     * Vue init
     * @type {VueConfig}
     */
    var App = new Vue({}).$mount('#app');
});
