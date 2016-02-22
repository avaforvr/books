module.exports = {
    "init": function () {
        var ve = require('../mod/VerifyLogin');

        $('input[name="name"]').blur(function() {
            ve.verifyName();
        });

        $('input[name="pwd"]').blur(function() {
            ve.verifyPwd();
        });

        $('#loginForm').submit(function() {
            ve.submitLogin();
            return false;
        });
    }
};