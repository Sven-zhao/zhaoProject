require([
    'jquery'
], function ($) {
    var timer = setInterval(function () {

        $.getJSON('/wmp/user/' + appConfigId + '/trust/app/check/userbind?uid=' + uid, function (data) {
            if (data.code == 1) {
                window.clearInterval(timer);
                window.location.reload(true);
            }
        });
    }, 5000);
});
