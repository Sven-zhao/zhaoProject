define(['jquery'],function($){
    var loginModal = (function(){
        var source = '<figure class="mask">'
                    +    '<div class="mask-content">'
                    +        '<section class="empty-box">'
                    +            '<img src="../../../static/wmp/pagescript/trust/record/img/inset-pic.png" class="empty-inset" >'
                    +            '<p class="empty-tips">{{tips}}</p>'
                    +            '<a href="{{btnHref}}" class="empty-link">{{btnText}}</a>'
                    +        '</section>'
                    +    '</div>'
                    +'</figure>';
        var defaultSettings = {
            tips:'登录后，即可查看我的靠谱好友',
            btnText:'登录',
            btnHref:'javascript:;',
        };
        return function(param){
            var lm = {
                tips: param.tips || defaultSettings.tips,
                btnText : param.btnText || defaultSettings.btnText,
                btnHref: param.btnHref || defaultSettings.btnHref
            }
            var html = source;
            $.each(lm,function(key,value){
                html = html.replace(eval('/{{'+key+'}}/'),value);
            });

            $('body').append(html);
            $('body').on('touchend','.mask',function(e){
                $(this).remove();
            });
        }
    })();
    // loginModal(loginModal);
    return loginModal;
});
