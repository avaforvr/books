module.exports = {
    "init": function () {
        var config = require('../mod/config');

        $('body').on('click', '.btn-like', function () {
            var btn = $(this),
                bookId = btn.attr('data-book-id'),
                isLiked = btn.hasClass('liked');

            $.ajax({
                type: 'GET',
                url: webData.WEB_ROOT + 'ajax.php',
                data: {'act':'like','bookId':bookId, 'likeVal': (isLiked ? 0 : 1)},
                dataType: 'json',
                "beforeSend": function (r) {
                    btn.prop('disabled', true).children().hide().end().append(config.loading);
                },
                "complete": function (r) {
                    btn.prop('disabled', false).children('img').remove().end().children().show();
                },
                success: function(r){
                    if(r.code === 0) {
                        if(isLiked) {
                            btn.removeClass('liked').children('span').html('喜欢');
                        } else {
                            btn.addClass('liked').children('span').html('取消');
                        }
                    } else if(r.code === 1) {
                        alert(r.msg);
                        var url = location.href;
                        var backUrl = encodeURIComponent(url);
                        window.location.href = webData.WEB_ROOT + 'login.php?back=' + backUrl;
                    }
                }
            });
        });
    }
};