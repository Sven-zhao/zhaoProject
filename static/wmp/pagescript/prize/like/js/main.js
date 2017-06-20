require([
    'common/vue/2.1.3/vue.min',
    'common/vue-resource/1.0.3/vue-resource',
    'pagescript/prize/base/js/wxshare'
], function(Vue, VueResource) {
    Vue.config.devtools = true;


    Vue.use(VueResource);
    Vue.http.options.emulateJSON = true;

    var BoardView = Vue.extend({
        template:"#borad-temp",
        props:['choice','user','title','islike','pre','next','current','amount'],
        methods:{
            prePage:function(){
                App.prePageAction();
            },
            nextPage:function(){
                App.nextPageAction();
            },
            likeThisPrize:function(){
                if(App.currentPrize.userChoice.isLike){
                    return false;
                }
                App.currentPrize.userChoice.isLike = true;
                App.currentPrize.userChoice.likeCount++;
                var _this = this;
                Vue.http.post(
                    '/wmp/user/'+appConfigId+'/prize/ajax/praise/'+this.choice.id,
                    {"id":this.choice.choice.id}
                )
                .then(function(obj){
                    console.log("liked!");
                });
            },
        },
        computed: {
            showLikeCount:function(){
                return parseInt(this.choice.likeCount) > 99999 ? "10万+" : this.choice.likeCount;
            },
            // current:function(){
            //     return App.index+1;
            // },
            // amount:function(){
            //     return App.storage.length;
            // }
        }
    });
    Vue.component('board-view',BoardView);

    var App = new Vue({
        data:{
            currentView:BoardView,
            storage:prizeList,
            index:0,
            transition:"slide-left",
            loading:false,
            hasMore:true,
            lazyTime:350,
        },
        computed:{
            currentPrize:function(){
                return this.storage[this.index];
            },
            hasPreStorage:function(){
                return this.storage.length > 0 && this.index > 0;
            },
            hasNextStorage:function(){
                return this.storage.length > 0 && this.index >= this.storage.length-1;
            },
        },
        watch:{
            index:function(to,from){
                this.loadPrize(to, from);
            }
        },
        methods:{
            prePageAction:function(){
                if(this.index>0)this.index--;
            },
            nextPageAction:function(){
                if(this.index<this.storage.length-1)this.index++;
            },
            loadPrize:function(to,from){
                this.loading = true;
                this.transition = to < from ? 'slide-right' : 'slide-left';
                setTimeout(function(context){
                    context.loading = false;
                },this.lazyTime,this);
            },
        },
        mounted:function(){

        }
    }).$mount('#app');
});
