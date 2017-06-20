Vue.config.devtools = true;

var App = new Vue({
    data:{
        showMask:false,
    },
    watch:{
        showMask:function(){
            if(this.showMask){
                document.querySelector('body').className += " share_back";
            }else{
                document.querySelector('body').className = "share";
            }
        }
    }
}).$mount('#app');
