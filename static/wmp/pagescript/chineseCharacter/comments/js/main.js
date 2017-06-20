Vue.config.devtools = true;

Vue.use(VueResource);
Vue.http.options.emulateJSON = true;

Vue.use(infiniteScroll);

var App = new Vue({
    data: {
        commentList: [],
        busy: false,
        hasMore:true,
        pageNo:1,
    },
    methods: {
        fetchData: function() {
            if (!this.hasMore) {
                return;
            }
            var self = this;
            self.busy = true;

            var Data = {
                pageNo:this.pageNo,
            };
            Vue.http.post("/wmp/user/" + appConfigId + "/figures/ajax/getComment/" + yearChar, Data)
            .then(function(obj){
                var result = JSON.parse(obj.body);

                if(result.code === -1){
                    alert(result.msg);
                    return;
                }
                self.commentList = [].concat(self.commentList,result.data.commentList);
                self.pageNo = result.data.pageNo;
                self.hasMore = result.data.hasMore;

                self.busy = false;

                console.log("hahah");
            });
        }
    },
    created: function() {
        this.fetchData();
    },
    mounted: function() {}
}).$mount("#app");
