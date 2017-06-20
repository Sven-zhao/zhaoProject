Vue.config.devtools = true;
var app = new Vue({
    el:'.container',
    data:{
        rate: 0,
        unitTime : 5000 /100,
    },
    methods:{
        addRate:function(){
            var self = this;
            var count = function(){
                if(++self.rate < 100){
                    setTimeout(function(){count()},self.unitTime);
                }else{
                    window.location.href = nextHref;
                }
            };
            count();
        }
    },
    mounted:function(){
        this.addRate();
    }
});
