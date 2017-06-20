Vue.http.options.emulateJSON = true;

var FormView = Vue.extend({
    template: '#form-temp',
    data: function () {
        return {
            location: '',
            industries: [],//{tagId: 'sdf', tagName: 'aaaa'}
            tipsDisplay: {
                location: false,
                industries: false,
            },
        }
    },
    props:['olocation', 'oindustries'],
    watch:{
        "industries.length": function(newval, oldval){
            if(newval > 0)this.tipsDisplay.industries = false;
        }
    },
    methods:{
        onsubmit: function(){

        },
        callIndustry: function () {
            var self = this;
            zh.chooseIndustry({
                industries: this.industries,
                maxCount: 10,
            }, function (res) {
                self.industries = res.industries;
            });
        },
        deleteindustries: function (index) {
            this.industries.splice(index, 1);
        },
        commit: function () {
            var pass = true;
            for (var variable in this.$data) {
                if (Object.prototype.toString.apply(this.$data[variable]) === '[object Object]'
                    || (Object.prototype.toString.apply(this.$data[variable]) === '[object Array]'
                    && this.$data[variable].length > 0
                    || variable === 'urls')
                    || (typeof this.$data[variable] === "string" && this.$data[variable] !== '')
                    || this.$data[variable] > 0) {
                    continue;
                }
                this.tipsDisplay[variable] = true;
                if (pass) pass = false;
            }
            if (pass) {
                App.location = this.location;
                App.industries = this.industries;
                App.fetchData();
            }
            return pass;
        }
    },
    mounted:function(){
        this.location = this.olocation
        this.industries = this.oindustries
    }
});

var Dialog = Vue.extend({
    template:"#dialog-temp",
    props:{
        opened: Boolean,
        closeDisabled: Boolean,
        task: String,
    },
    computed:{
        tips: function(){
            return dialogConfig[this.task];
        }
    },
    methods:{
        onSwitch:function(){
            this.$emit('onswitch');
        },
        linkTo: function(){
            switch (this.task) {
                case 'goAuth':
                    zh.notifyAuthstep({
                        success: function(){
                            App.verificationAuth(function(isAuth){
                                if(isAuth){
                                    App.showDialog = false;
                                    App.isIdentification = true;
                                }
                            })
                        }
                    });
                    zh.authstep();
                    break;
                case 'goEdit':
                    zh.notifyProfileGuide({
                        success: function(){
                            if(App.isIdentification){
                                App.showDialog = false;
                            }
                            App.complete = true;
                        },
                    })
                    zh.profileGuide();
                    break;
                default:
            }
        }
    }
})
Vue.component('zh-dialog', Dialog);



var App = new Vue({
    data:{
        location: edit&&edit.location ? edit.location : '',
        industries: edit&&edit.industries ? edit.industries : [],
        complete: complete,
        isIdentification: isIdentification,
        resourceId: resourceId,
        showDialog: !this.complete || !this.isIdentification,
    },
    computed: {
        DialogTask: function(){
            return !this.complete ? 'goEdit'
                    : !this.isIdentification? 'goAuth' : ''
        },
    },
    components: {
        'FormView': FormView
    },
    methods:{
        verificationAuth: function(cb){
            var self = this

            Vue.http.get("/wmp/user/"+appConfigId+"/resource/app/detailData/"+self.resourceId)
            .then(function(obj){
                var result = obj.body
                try {
                    result = JSON.parse(result)
                } catch (e) {}

                cb(result.data.isAuth)
            })
        },
        formatIndustries: function(arr){
            var industries = [].concat(arr);
            for (var i = 0; i < industries.length; i++) {
                industries[i] = industries[i].tagId
            }
            return industries;
        },
        fetchData: function () {

            var self = this;

            var data = {
                resourceId: resourceId,
                address: this.location,
                industries:this.formatIndustries(this.industries).toString(),
            };
            console.log(data);
            Vue.http.post(
                '/wmp/user/' + appConfigId + '/resource/app/expand',
                data
            )
                .then(function (obj) {
                    var result = JSON.parse(obj.body);
                    if (result.code != 0) {
                        alert(result.msg);
                        console.error("[zh-info]create:", result.msg);
                        return;
                    }
                    if(zh && zh.redirectTo){
                        zh.redirectTo({
                            url: wmpurl + "/wmp/user/" + appConfigId + "/resource/app/expanding?resourceId=" + resourceId
                        });
                    }else{
                        location.href = "/wmp/user/" + appConfigId + "/resource/app/expanding?resourceId=" + resourceId
                    }
                })
        },
        commit: function(){
            this.$refs.form.commit();
        },
    }
}).$mount('#app');
