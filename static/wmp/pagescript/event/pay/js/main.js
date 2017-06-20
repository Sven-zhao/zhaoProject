require(['jquery','wxapi','modules/net/wAjax'],function($,wx,wAjax){	
	wx.config($.extend({
        debug: false,
        jsApiList: ['chooseWXPay']
    },WXCONFIG));   
    wx.ready(function(){
        wx.hideOptionMenu();
    });

//pay
var payConfig;
function getWXPayConfig() {
    /*
    if (localStorage.getItem("pay2015." + UID) == "true") {
        window.location.href = "/op/nyf/paycallback";
        return;
    }
    */

    wAjax({
        url: '/wmp/user/'+appConfigId+'/activity/'+aid+'/payConfig?t='+new Date().getTime(),
        type: "get",
        success: function(result) {
            payConfig = result.data;
            // payConfig need to be a json object.
            payConfig.success = function(res) {
                //localStorage.setItem("pay2015." + UID, "true");
                wAjax({
                    url: '/wmp/user/'+appConfigId+'/activity/'+aid+'/pay?t='+new Date().getTime(),
                    type: "get",
                    data:{},
                    success: function(rs) {
//                    	if(toPay=='1') {
//                    		window.location.href = '/wmp/user/'+appConfigId+'/activity/'+aid+'/detail?t='+new Date().getTime();
//                    	}else {
                    		window.location.href = '/wmp/user/'+appConfigId+'/activity/'+aid+'/sign/suc?'+new Date().getTime();
//                    	}
                    }
                });
            };
            //接口调用失败时
            payConfig.fail = function(){

            };
            //用户点击取消时的回调函数
            payConfig.cancel = function(){

            }
            
        }
    });
}

getWXPayConfig();
$("#pay_btn1,#pay_btn2").on('click',function(e) {
	wAjax({
        url: '/wmp/user/'+appConfigId+'/activity/'+aid+'/checkpay?t='+new Date().getTime(),
        type: "get",
        data:{},
        success: function(rs) {
        	if (payConfig) {
        		wx.chooseWXPay(payConfig);
        	}
        }
    });
});

});