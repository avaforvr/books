require('../lib/jqueryForm');
require('../mod/textarea').init();
require('../lib/formCheck');
var config = require('../mod/config');

var elem = {
    "attaForm": $('#attaForm'),
    "attaInput": $('#attachment'),
    "attaTip": $('#attaTip'),

    "uploadForm": $('#uploadForm'),
    "uploadSubmitTip": $('#uploadSubmitTip'),
    "uploadSubmitBtn": $('#uploadSubmitBtn'),
    "bookTagsTip": $('#bookTagsTip'),

    "successResult": $('#uploadSuccess'),
    "failResult": $('#uploadFail')
};

//清空上传附件表单
var cleanAttaForm = function () {
    elem.attaInput.val('');
    elem.attaTip.hide();
};
//清空文件信息表单
var cleanUploadForm = function () {
    elem.uploadSubmitTip.html('');
    elem.uploadSubmitBtn.prop('disabled', false);
    elem.bookTagsTip.html('');
    elem.uploadForm.hide().get(0).reset();
};
//隐藏上传结果
var cleanResult = function () {
    elem.successResult.hide();
    elem.failResult.hide();
};

//上传附件
var initAttaForm = function () {
    //点击Choose File按钮回复原始状态
    elem.attaInput.mousedown(function() {
        cleanUploadForm();
        cleanResult();
    });

    //选择文件后验证上传到temp目录中
    elem.attaInput.change(function() {
        if(elem.attaInput.val() == '') {
            elem.attaTip.attr('class', 'tip error').html(config.error + '请选择文件');
            elem.uploadForm.hide();
            return false;
        }
        var options = {
            dataType: 'json',
            success: function(r) {
                elem.attaTip.innerHTML = r.msg;
                if(r.code == 0) {
                    for(var key in r.book) {
                        console.log('input[name="data[' + key + ']"]');
                        console.log(r.book[key]);
                        elem.uploadForm.find('input[name="data[' + key + ']"]').val(r.book[key]);
                    }

                    elem.attaTip.attr('class', 'tip success').html(config.success + r.msg);

                    elem.uploadForm.show();
                } else {
                    elem.attaTip.attr('class', 'tip error').html(config.error + r.msg);
                    elem.uploadForm.hide();
                }
            }
        };
        elem.attaForm.ajaxSubmit(options);
    });
};

//提交文件信息表单
var initUploadForm = function () {
    var form = elem.uploadForm;

    var items = {
        "data[book_name]": [
            {type: "null", errMsg: '请刷新后重新上传' }
        ],
        "data[book_author]": [
            {type: "null", errMsg: '请刷新后重新上传'}
        ],
        "data[book_type]": [
            {type: "select", value: 0, errMsg: '请选择分类'}
        ]
    };

    form.submit(function() {
        var isChecked = form.formCheck(items, {
            showSuccess: function (obj, errMsg) {
                $(obj).closest('tr').find('.tip').attr('class', 'tip success').html(config.success);
            },
            showError: function (obj, errMsg) {
                $(obj).closest('tr').find('.tip').attr('class', 'tip error').html(config.error + errMsg);
            }
        });
        if(isChecked) {
            if(form.find('input[name="data[book_tags][]"]:checked').length > 5) {
                elem.bookTagsTip.attr('class', 'tip error').html(config.error + '标签不能超过5个');
                return false;
            }
        } else {
            return false;
        }

        var options = {
            dataType: 'json',
            beforeSubmit: function() {
                elem.uploadSubmitTip.html(config.loading);
                elem.uploadSubmitBtn.prop('disabled', true);
            },
            success: function(r) {
                cleanAttaForm();
                cleanUploadForm();

                if(r.code == 0) {
                    elem.successResult.show();
                } else {
                    elem.failResult.show();
                }
            },
            error: function () {
                cleanAttaForm();
                cleanUploadForm();
                elem.failResult.show();
            }
        };
        form.ajaxSubmit(options);

        return false;
    });
};

module.exports = {
    "init": function () {
        initAttaForm();
        initUploadForm();
    }
};