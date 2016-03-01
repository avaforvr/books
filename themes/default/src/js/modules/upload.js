require('../lib/jqueryForm');
require('../mod/textarea').init();
require('../lib/formCheck');
var config = require('../mod/config');

var elem = {
    "attaForm": $('#attaForm'),
    "uploadForm": $('#uploadForm'),
    "editForm": $('#editForm'),
    "sucDone": $('.sucDone'),
    "failDone": $('.failDone'),
};

//上传附件
var initAttaForm = function () {
    var attaElem = $('#attachment'),
        attaTip = $('#attaTip');

    //点击Choose File按钮回复原始状态
    attaElem.mousedown(function() {
        elem.sucDone.hide();
        elem.failDone.hide();
    });

    //选择文件后验证上传到temp目录中
    attaElem.change(function() {
        if(attaElem.val() == '') {
            attaTip.attr('class', 'tip error').html(config.error + '请选择文件');
            elem.uploadForm.hide();
            return false;
        }
        var options = {
            dataType: 'json',
            success: function(r) {
                attaTip.innerHTML = r.msg;
                if(r.code == 0) {
                    elem.uploadForm.find('input[name="data[book_name]"]').val(r.book_name);
                    elem.uploadForm.find('input[name="data[book_author]"]').val(r.book_author);
                    elem.uploadForm.find('input[name="data[book_size]"]').val(r.book_size);
                    elem.uploadForm.find('input[name="data[book_path]"]').val(r.book_path);
                    attaTip.attr('class', 'tip success').html(config.success + r.msg);
                    elem.uploadForm.show();
                } else {
                    attaTip.attr('class', 'tip error').html(config.error + r.msg);
                    elem.uploadForm.hide();
                }
            }
        };
        $('#attaForm').ajaxSubmit(options);
    });
};

//提交文件信息表单
var initUploadForm = function () {
    var form = elem.uploadForm.length ? elem.uploadForm : elem.editForm,
        submitTip = form.find('#submitTip'),
        submitBtn = form.find('button[type="submit"]');

    var items = {
        "data[book_name]": [
            {type: "null", errMsg: '请刷新后重新上传' }
        ],
        "data[book_author]": [
            {type: "null", errMsg: '请刷新后重新上传'}
        ],
        "data[book_type]": [
            {type: "select", value: 0, errMsg: '请选择分类'}
        ],
        "check_book_tags": [
            {type: "book_tags", errMsg: '标签不能超过5个'}
        ]
    };

    form.submit(function() {
        var isChecked = form.formCheck(items, {
            showSuccess: function (obj, errMsg) {
                if(obj.attr('name') != 'check_book_tags') {
                    $(obj).closest('tr').find('.tip').attr('class', 'tip success').html(config.success);
                }
            },
            showError: function (obj, errMsg) {
                if(obj.attr('name') == 'check_book_tags') {
                    $('#bookTagsTip').attr('class', 'tip error').html(config.error + errMsg);
                } else {
                    $(obj).closest('tr').find('.tip').attr('class', 'tip error').html(config.error + errMsg);
                }
            },
            rules : {'book_tags': function (obj, checks) {
                return form.find('input[name="check_book_tags[]"]:checked').length <= 5;
            }}
        });

        if(isChecked) {
            submitTip.html(config.loading);
            submitBtn.prop('disabled', true);
        }

        return isChecked;
    });
};



module.exports = {
    "init": function () {
        initAttaForm();
        initUploadForm();
    }
};