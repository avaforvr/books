module.exports = {
    "init": function (key) {
        require('../lib/jqueryForm');
        require('../lib/formCheck');
        var config = require('../mod/config');

        var form = $(document.getElementById(key + 'Form')),
            submitTip = form.find('#submitTip'),
            submitBtn = form.find('button[type="submit"]'),
            act = form.find('input[name="act"]');

        var items = {
            "data[user_name]": [
                {type: "user", errMsg: '由3-10位英文字母或数字组成' }
            ],
            "data[user_email]": [
                {type: "email", errMsg: '邮箱格式错误'}
            ],
            "data[oldpwd]": [
                {type: "password", errMsg: '由6-16位下划线、英文字母或数字组成'}
            ],
            "data[user_pwd]": [
                {type: "password", errMsg: '由6-16位下划线、英文字母或数字组成'}
            ],
            "data[repwd]": [
                {type: "password", errMsg: '由6-16位下划线、英文字母或数字组成'},
                {type: "rePpassword", errMsg: '密码不一致', compare: form.find('input[name="data[user_pwd]"]')}
            ]
        };

        var forgetPwdCallback = function (r) {
            if(act.val() == 'verifyNameAndEmail') {
                form.find('.tr-readonly input').prop('readonly', true);
                form.find('.tr-disabled').show().find('input').prop('disabled', false);
                act.val('verifyFindPwd');
                form.find('input[name="data[user_id]"]').val(r.user_id);
            } else {
                location.href = webData.WEB_ROOT + 'login.php?back=' + r.back;
            }
        };

        var changePwdCallback = function (r) {
            submitTip.addClass('success').html(config.success + r.msg);
            form.find('input[type="password"]').val('');
            form.find('input[type="password"]').each(function () {
                $(this).val('');
                var tip = $(this).closest('tr').find('.tip'),
                    tipText = tip.attr('data-tip');
                tip.attr('class', 'tip').html(tipText);
            });
        };

        form.submit(function() {
            submitTip.attr('class', 'tip').html('');

            var isChecked = form.formCheck(items, {
                showSuccess: function (obj, errMsg) {
                    $(obj).closest('tr').find('.tip').attr('class', 'tip success').html(config.success);
                },
                showError: function (obj, errMsg) {
                    $(obj).closest('tr').find('.tip').attr('class', 'tip error').html(config.error + errMsg);
                }
            });

            if(isChecked && key == 'changePwd') {
                var oldpwd = form.find('input[name="data[oldpwd]"]').val();
                var newpwd = form.find('input[name="data[user_pwd]"]').val();

                if(oldpwd == newpwd) {
                    submitTip.addClass('error').html(config.error + '新密码不能与旧密码相同');
                    isChecked = false;
                }
            }

            if(isChecked) {
                var options = {
                    dataType: 'json',
                    beforeSubmit: function() {
                        submitTip.html(config.loading);
                        submitBtn.prop('disabled', true);
                    },
                    success: function(r) {
                        submitTip.html('');
                        submitBtn.prop('disabled', false);
                        if(r.code == 0) {
                            if(key == 'forgetPwd') {
                                forgetPwdCallback(r);
                            } else if(key == 'changePwd') {
                                changePwdCallback(r);
                            } else {
                                //submitTip.addClass('success').html(config.success + r.msg);
                                location.href = r.back;
                            }

                        } else {
                            submitTip.addClass('error').html(config.error + r.msg);
                        }
                    },
                    error: function () {
                        submitTip.addClass('error').html(config.error + config.tryAgain);
                    }
                };
                form.ajaxSubmit(options);
            }
            return false;
        });
    }
};