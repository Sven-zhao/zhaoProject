require(['jquery', 'modules/net/wAjax', 'modules/ui/showMsg/js/main', 'common/wx.default.config'], function ($, ajax, showMsg) {
    $('.know-btn').on('click', function () {
        if (isLogin) {
            $('.greeting').fadeOut();
        } else {
            window.location.href = registUrl;
        }
    });
    $('input,textarea').on('input', function () {
        if ($.trim($('input').val()).length > 0 && $.trim($('textarea').val()).length > 0) {
            $('.prize-btn').removeClass('disabled');
        } else {
            $('.prize-btn').addClass('disabled');
        }
    });

    $('body').on('click', '.prize-btn.disabled', function () {
        showMsg({
            msg: "请填写奖项名称和颁奖理由"
        });
    });

    $('body').on('click', '.prize-btn:not(.disabled)', function () {
        ajax({
            url: '/wmp/user/' + appConfigId + '/prize/answerSelf/submit',
            type: 'post',
            data: {
                title: $.trim($('input').val()),
                info: $.trim($('textarea').val()),
                prizeType: prizeType
            },
            success: function (obj) {
                window.location.href = obj['data']['url'];
            }
        });
    });
});
