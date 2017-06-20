require(['jquery','modules/net/wAjax','wxapi.default.config'],function($,wAjax){

    $.fn.selectStyleAtuoChange = function(){    
        var $selects = $(this);
        $selects.each(function(){
            var $this = $(this); 
            $this.removeClass("select-default");
            if($this.val() == 0) {
                $this.addClass("select-default");
            }
        });     
    };   

    var $province = $('[name="province"]');
    var $city = $('[name="city"]');
    var $submitBtn = $('#submit-btn');

    (function(){
        $("select").selectStyleAtuoChange();
        initCity();
        updateCityAvailable();
    })();

    // function defination
    function updateCityAvailable() {
        if($province.val() == 0) {
            $city.attr('disabled','');
        }
        else {
            $city.removeAttr('disabled');
        }
    }
    function updateCity(data,selectedCity) {
        var $optTpl = $('<option value="0">常驻城市</option>');
        $city.empty().append($optTpl);
        for(var key in data) {
            var $tmp = $optTpl.clone();
            $tmp.attr('value',key);
            $tmp.html(data[key]['value']);
            $city.append($tmp);
        }
        if(selectedCity != "") {
            $city.val(selectedCity);
        }
        $city.selectStyleAtuoChange();
        updateCityAvailable();
        formValidate();
    }

    function formValidate(isSubmit) {
        var isValid = true;
        $('.form input').each(function(){
            var $this = $(this);
            if(isSubmit) {
                $this.val($.trim($this.val())); 
            }
            if($this.val() == "") {
                isValid = false;
                return false;
            }
        });
        if(isValid) {
            if($('.form select.select-default').length > 0) {
                isValid = false;
            }
        }
        if(isValid) {
            $submitBtn.removeAttr('disabled');
        }
        else {
            $submitBtn.attr('disabled','disabled');
        }
        return isValid;
    };

    function initCity() {
        var provinceId = $province.val();
        var selectedCity = $city.data('cityId');
        if(provinceId == '0') {
            updateCity({},'');
            return;
        }
        wAjax({
            url: '/wmp/tool/dict/city?id='+provinceId,
            type: 'get',
            success: function(obj) {
                updateCity(obj['data'],selectedCity);
            }
        });
    }

    // bind the events
    $("select").on("change", function(){
        $(this).selectStyleAtuoChange();
    });

    $province.on('change',function(){
        var $this = $(this);
        var provinceId = $this.val();
        if(provinceId == '0') {
            updateCity({},'');
            return;
        }
        wAjax({
            url: '/wmp/tool/dict/city?id='+provinceId,
            type: 'get',
            success: function(obj) {
                updateCity(obj['data'],'');
            }
        });
    });

    $('select').on('change',function(){
        formValidate(false);
    });
    $('input').on('input',function(){
        formValidate(false);
    })

    $('.container').on('click','#submit-btn:not([disabled])',function(){
        if(formValidate(true)) {
            var postObj = {};
            $('[name]:visible').each(function(){
                var $this = $(this);
                postObj[$this.attr('name')] = $.trim($this.val());
            });
            wAjax({
                url: '/wmp/user/'+appConfigId+'/save/baseinfo?template='+$('#template').val(),
                data: {
                    jsonStr: JSON.stringify(postObj),
                    type: $('[name="type"]').val()
                },
                success: function(obj){
                    var newUrl = obj['data'];
                    var sep = '?';
                    if (newUrl.indexOf('?') > -1) {
                        sep = '&';
                    }
                    var timestamp = Date.parse(new Date());
                    newUrl = newUrl + sep + 'timestamp=' + timestamp;
                    window.location.href = newUrl;
                }
            });
        }
    });

});