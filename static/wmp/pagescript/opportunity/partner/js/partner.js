Vue.http.options.emulateJSON = true;

var config = {
    partner : {
        url : "/wmp/user/"+appConfigId+"/resource/app/loadCooperat",
    },
    collect : {
        url : "/wmp/user/"+appConfigId+"/resource/app/loadFavorite",
    },
    visitor : {
        url : "/wmp/user/"+appConfigId+"/resource/app/loadVisit",
    },
}

var partnerComponent = Vue.extend({
    template: '#partner-temp',
    props:['info'],
});

var collectComponent = Vue.extend({
    template: '#collect-temp',
    props:['info'],
});

var visitorComponent = Vue.extend({
    template: '#visitor-temp',
    props:['info'],
});


var App = new Vue({
    data:{
        iterms: [],
        busy:true,
        hasMore:true,
        pageNo:1,
        disatance:10,
        currentType: config[type],
        totalCount: 0,
        guestBrowseCount: 0,
        type: type,
    },
    components:{
        iterm: type === 'partner' ? partnerComponent
                : type === 'collect' ? collectComponent
                    : visitorComponent
    },
    methods:{
        fetchData: function(){
            if(!this.hasMore){
                return;
            }
            var self = this;
            self.busy = true;

            this.$http.post(this.currentType.url, {
                resourceId : resourceId,
                cp : this.pageNo,
                count : this.disatance
            })
            .then(function(obj){
                var result = JSON.parse(obj.body);

                if(result.code === -1){
                    return ;
                }

                self.totalCount = result.data.totalCount;
                self.guestBrowseCount = result.data.guestBrowseCount ? result.data.guestBrowseCount : 0;
                self.iterms = self.iterms.concat(result.data.list);
                self.pageNo++;
                self.hasMore = result.data.haveMore;

                self.busy = false;
            });
        }
    },
    mounted: function() {
        this.fetchData()
    }
}).$mount('#app');
