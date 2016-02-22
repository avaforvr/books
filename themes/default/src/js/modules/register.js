module.exports = {
    "init": function () {
        var ve = require('../mod/VerifyLogin');

        $('input[name="name"]').blur(function() {
            ve.verifyNameAjax();
        });

        $('input[name="email"]').blur(function() {
            ve.verifyEmailAjax();
        });

        $('input[name="pwd"]').blur(function() {
            ve.verifyPwd(true);
        });

        $('input[name="repwd"]').blur(function() {
            ve.verifyRepwd(true);
        });

        $('#regForm').submit(function() {
            ve.submitRegister();
            return false;
        });
    }
};