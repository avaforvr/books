module.exports = {
    "init": function () {
        //填写textarea失去焦点消除空行
        $('textarea').blur(function() {
            var elem = $(this);
            var str = elem.val().replace(/\n\s*/g, '\n');
            str = str.replace(/\n{2,}/g, '\n');
            elem.val(str);
        });
    }
};