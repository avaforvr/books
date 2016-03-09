require('../lib/jqueryForm');
require('../mod/textarea').init();
require('../lib/formCheck');
var config = require('../mod/config');

var elem = {
    "attaForm": $('#attaForm'),
    "attaInput": $('#attachment'),
    "attaTip": $('#attaTip'),

    "uploadForm": $('#uploadForm'),
    "uploadBtn": $('#uploadBtn'),
    "uploadTip": $('#uploadTip'),
    "uploadTagsTip": $('#uploadTagsTip'),

    "batchForm": $('#batchForm'),
    "batchBtn": $('#batchBtn'),
    "batchTip": $('#batchTip'),
    "batchTagsTip": $('#batchTagsTip'),

    "resultList": $('#resultList'),
    "successResult": $('#uploadSuccess'),
    "failResult": $('#uploadFail')
};

//清空上传附件表单
var cleanAttaForm = function () {
    elem.attaInput.val('');
    elem.attaTip.html('');
};
//清空文件信息表单
var cleanDataForm = function () {
    elem.uploadBtn.prop('disabled', false);
    elem.uploadTip.html('');
    elem.uploadTagsTip.html('');
    elem.uploadForm.hide().get(0).reset();

    elem.batchBtn.prop('disabled', false);
    elem.batchTip.html('');
    elem.batchTagsTip.html('');
    elem.batchForm.hide().get(0).reset();
};
//隐藏上传结果
var cleanResult = function () {
    elem.resultList.hide();
    elem.successResult.hide();
    elem.failResult.hide();
};

var getIllegalHtml = function (msg, files) {
    var str = '<div class="list-a"><hr class="mb4">' +
        '<h3 class="error">' + config.error + ' ' + msg + '</h3>' +
        '<table><thead><tr>' +
        '<th>文件路径</th>' +
        '<th>错误提示</th>' +
        '</tr></thead><tbody>';

    for(var key in files) {
        var file = files[key];
        str += '<tr>' +
            '<td>' + file.book_path + '</td>' +
            '<td>' + file.msg + '</td>' +
            '</tr>';
    }

    str += '</tbody></table></div>';
    return str;
};

var getLegalHtml = function (msg, files) {
    var str = '<div class="list-a"><hr class="mb4">' +
        '<h3 class="success">' + config.success + ' ' + msg + '</h3>' +
        '<table><thead><tr>' +
        '<th>书名</th>' +
        '<th>作者</th>' +
        '<th>文件路径</th>' +
        '</tr></thead><tbody>';

    for(var key in files) {
        var file = files[key];
        str += '<tr>' +
            '<td>' + file.book_name + '</td>' +
            '<td>' + file.book_author + '</td>' +
            '<td>' + file.book_path + '</td>' +
            '</tr>';
    }

    str += '</tbody></table></div>';
    return str;
};

//上传附件
var initAttaForm = function () {
    //点击Choose File按钮回复原始状态
    elem.attaInput.mousedown(function() {
        cleanDataForm();
        cleanResult();
    });

    //选择文件后验证上传到temp目录中
    elem.attaInput.change(function() {
        if(elem.attaInput.val() == '') {
            elem.attaTip.attr('class', 'tip error').html(config.error + '请选择文件');
            cleanDataForm();
            cleanResult();
            return false;
        }
        elem.attaTip.html('');
        var options = {
            dataType: 'json',
            success: function(r) {
                if(r.code == 'illegal') {
                    elem.resultList.html(getIllegalHtml(r.msg, r.illegal)).show();
                } else if(r.code == 0) {
                    if(r.isBatchUpload) {
                        elem.resultList.html(getLegalHtml(r.msg, r.legal)).show();
                        elem.batchForm.show().find('input[name="data[files]"]').val(JSON.stringify(r.legal));
                    } else {
                        for(var key in r) {
                            if(key.indexOf('book_') != -1) {
                                elem.uploadForm.find('input[name="data[' + key + ']"]').val(r[key]);
                            }
                        }
                        elem.attaTip.attr('class', 'tip success').html(config.success + r.msg);
                        elem.uploadForm.show();
                    }

                } else {
                    elem.attaTip.attr('class', 'tip error').html(config.error + r.msg);
                }
            }
        };
        elem.attaForm.ajaxSubmit(options);
    });
};

//单个文件表单
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
                elem.uploadTagsTip.attr('class', 'tip error').html(config.error + '标签不能超过5个');
                return false;
            }
        } else {
            return false;
        }

        var isUploadBook = form.find('input[name="act"]').val() != 'editBook';

        var options = {
            dataType: 'json',
            beforeSubmit: function() {
                elem.uploadTip.html(config.loading);
                elem.uploadBtn.prop('disabled', true);
            },
            success: function(r) {
                if(isUploadBook) {
                    cleanAttaForm();
                    cleanDataForm();
                } else {
                    form.hide();
                }

                if(r.code == 0) {
                    elem.successResult.show();
                } else {
                    elem.failResult.show();
                }
            },
            error: function () {
                if(isUploadBook) {
                    cleanAttaForm();
                    cleanDataForm();
                } else {
                    form.hide();
                }
                elem.failResult.show();
            }
        };
        form.ajaxSubmit(options);

        return false;
    });
};

//多个文件表单
var initBatchForm = function () {
    elem.batchForm.submit(function () {
        var form = $(this);
        if(form.find('input[name="data[files]"]').val().length == 0) {
            elem.batchTip.attr('class', 'tip error').html(config.error + '获取附件信息出现问题，请重新上传');
            return false;
        }
        if(form.find('input[name="data[book_tags][]"]:checked').length > 5) {
            elem.uploadTagsTip.attr('class', 'tip error').html(config.error + '标签不能超过5个');
            return false;
        }

        var options = {
            dataType: 'json',
            beforeSubmit: function() {
                elem.batchTip.html(config.loading);
                elem.batchBtn.prop('disabled', true);
            },
            success: function(r) {
                cleanAttaForm();
                cleanDataForm();
                elem.resultList.hide();

                if(r.code == 0) {
                    elem.successResult.show();
                } else {
                    elem.failResult.show();
                }
            },
            error: function () {
                cleanAttaForm();
                cleanDataForm();
                elem.resultList.hide();
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
        initBatchForm();
    }
};