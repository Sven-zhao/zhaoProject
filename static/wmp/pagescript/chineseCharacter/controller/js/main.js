Vue.config.devtools=true;
Vue.use(VueResource);
Vue.http.options.emulateJSON = true;
new Vue({
    data:{
        isEnd:null,
    },
    methods:{
        fetchControlState:function(){
            var self = this;
            Vue.http.get("/wmp/user/"+appConfigId+"/figures/yearChar/remoteControl")
            .then(function(obj){
                var result = JSON.parse(obj.body);
                self.isEnd = result.data.endHeart;
            });
        },
        controlAction:function(state){
            var self = this;
            var data = {
                "isEndHeart" : state,
            };
            Vue.http.post("/wmp/user/"+appConfigId+"/figures/yearChar/remoteControl",data)
            .then(function(obj){
                var result = JSON.parse(obj.body);
                if(result.code == 0){
                    self.isEnd = !!state;
                }
            });
        }
    },
    mounted:function(){
        this.fetchControlState();
    }
}).$mount('#controller');
