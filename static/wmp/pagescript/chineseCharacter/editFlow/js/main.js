Vue.config.devtools = true;

/**
 *   为Vue注入ajax模块
 */
Vue.use(VueResource);
Vue.http.options.emulateJSON = true;

var EditView = Vue.extend({
    template:"#edit-temp",
    data:function(){
        return{
            editChar:"",
            isFocus:false,
        }
    },
    watch:{
        editChar:function(n,o){
            if(!n.match(/^[\u4E00-\u9FA5]+$/)){
                this.editChar = "";
            }
        }
    },
    computed:{
        isShowTips:function(){
            return !this.isFocus && this.editChar.length === 0 ;
        },
        valid:function(){
            return this.editChar.length > 0;
        }
    },
    methods:{
        sendChar:function(){
            if(!this.valid){
                return ;
            }
            App.setCharAction(this.editChar);
            router.push('board');
        }
    }
});

var BoardView = Vue.extend({
    template:"#board-temp",
    data:function(){
        return{
          comment:"",
          isFocus:false,
        }
    },
    props:['char'],
    computed:{
        valid:function(){
            return this.comment.length > 0;
        },
    },
    methods:{
        sendComment:function(){
            if(!this.valid){
                return ;
            }
            App.setCommentAction(this.comment);
            setTimeout((App.pushData()),0);
        },
        skip:function(){
            App.pushData();
        }
    }
});

/**
* vue-router init
*/
Vue.use(VueRouter);

var routes = [
    {path:'/edit',name:'edit',component:EditView},
    {path:'/board',name:'board',component:BoardView},
    {path:'/*',redirect:'/edit'},
    // {path:'*',component:BoardView}
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
        char:"",
        comment:"",
    },
    watch:{
        $route:function(){
            wx.hideOptionMenu();//pages阻止分享
        }
    },
    methods:{
        setCharAction:function(newVar){
            this.char = newVar;
        },
        setCommentAction:function(newVar){
            this.Comment = newVar;
        },
        pushData:function(){
            var _this = this;
            var Data = {
                "yearChar": this.char,
                "yearContent": this.Comment
            };

            console.info("commit:",Data);
            Vue.http.post('/wmp/user/' + appConfigId + '/figures/yearChar/save', Data)
            .then(function(obj){
                var result = JSON.parse(obj.body);
                console.log(result);
                if(result.code === 1){
                    window.location.href = result.data.url;
                    return false;
                }else if(result.code === -1){
                    // router.push('go(-1)');
                    alert(result.msg);
                    return;
                }
            });
        }
    },
}).$mount('#app');
