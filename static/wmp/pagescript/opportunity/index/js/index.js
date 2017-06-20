Vue.http.options.emlateJSON = true;

zh.ready(function(){
    zh.showTxtRightButton('发布机会', function (){//handlerFunc 无参数
        zh.navigateTo({
            url: wmpurl + "/wmp/user/" + appConfigId + "/resource/app/pub"
        })
    })
});

var menuItem = Vue.extend({
    template: '#menuItem-temp',
    props: ['ind'],
    methods:{
        toSearch: function(resourceId){
            return "/wmp/user/"+appConfigId+"/resource/app/toSearch"+ (resourceId? "?industrie="+resourceId: '')
        }
    }
});

var menuComponent = Vue.extend({
    template: '#menu-temp',
    data: function(){
        return {
            arr: industryList,
            config: industryConfig,
        }
    },
    methods: {
        setInd: function(target){
            if(Object.prototype.hasOwnProperty.call(this.config, target.id)){
                for (var key in this.config[target.id]) {
                    target[key] = this.config[target.id][key];
                }
            }else{
                target.color = this.config["default"].color
                target.icon = this.config["default"].icon
            }
            return target
        }
    },
    components: {
        "indItem": menuItem
    }
})
Vue.component('menuComponent', menuComponent);

var partnerItem = Vue.extend({
    template: '#partnerItem-temp',
    data: function(){
        return {}
    },
    props:['info'],
    methods:{
        toDetail: function(resourceId){
            return "/wmp/user/"+window.appConfigId+"/resource/app/detail/"+resourceId
        }
    },
    computed: {
        message: function(){
            switch (this.info.eventEnum) {
                case 'RESOURCE_COLLECTED':
                    return '刚刚发现了好机会'
                case 'RESOURCE_PROMOTED':
                    return '正在寻找合作伙伴'
                default:

            }
        }
    }
});

var partnerNotify = Vue.extend({
    template: '#partnerNotify-temp',
    components:{
        item: partnerItem
    },
    data: function(){
        return {
            partners: [],
            currentIndex: 0,
        }
    },
    computed:{
        currentItem: function(){
            if(this.partners.length === 0){
                return ;
            }
            var self = this;

            setTimeout(function(){
                self.currentIndex < self.partners.length - 1
                    ? self.currentIndex++
                    : self.currentIndex = 0
            }, 4000)

            return this.partners[this.currentIndex];
        }
    },
    methods: {
        fetchData: function(){
            var self = this

            var data = {
                count: 30
            }

            this.$http.post('/wmp/user/'+appConfigId+'/resource/app/loadEvent', data)
            .then(function(obj){
                var result = typeof obj.body === 'string'
                            ? JSON.parse(obj.body)
                            : obj.body

                if(result.code != 0){
                    return ;
                }

                self.partners = result.data.list
            })
        }
    },
    created: function(){
        this.fetchData()
    }
})
Vue.component('partnerNotify', partnerNotify);

var App = new Vue({
    data:{},
    components: {
        'swipe': VueSwipe.Swipe,
        'swipe-item': VueSwipe.SwipeItem
      }
}).$mount('#app');
