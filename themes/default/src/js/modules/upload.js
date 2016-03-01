require('../lib/jqueryForm');
require('../mod/textarea').init();

var elem = {
    "attaForm": $('#attaForm'),
    "uploadForm": $('#uploadForm'),
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
            attaTip.attr('class', 'tip error').html('请选择文件');
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
                    attaTip.attr('class', 'tip success').html(r.msg);
                    elem.uploadForm.show();
                } else {
                    attaTip.attr('class', 'tip error').html(r.msg);
                    elem.uploadForm.hide();
                }
            }
        };
        $('#attaForm').ajaxSubmit(options);
    });
};

//提交文件信息表单
var initUploadForm = function () {
     //上传和编辑页面表单验证
    $('#uploadForm, #editForm').submit(function() {
        var book_type = $('input[name="data[book_type]"]');
        var btags = $('input[name="data[btags][]"]:checked');
        var btypeTip = document.getElementById('btypeTip');
        var btagsTip = document.getElementById('btagsTip');
        var setTip = function(elemTip, isRight, tipText) {
            var tipClass = '';
            if(isRight == 0) {
                tipClass = 'tip error';
            } else if(isRight == 1) {
                tipClass = 'tip success';
            } else {
                tipClass = 'tip';
            }

            elemTip.className = tipClass;
            elemTip.innerHTML = tipText;
        }

        if(! book_name.val()) {
            setTip(bnameTip, 0, '请填写书名');
            book_name.focus(function() {
                setTip(bnameTip, 2, '');
            })
            return false;
        }
        if(! book_author.val()) {
            setTip(bauthorTip, 0, '请填写作者');
            book_author.focus(function() {
                setTip(bauthorTip, 2, '');
            });
            return false;
        }
        if(book_type.val() == 0) {
            setTip(btypeTip, 0, '请选择分类');
            book_type.next().mousedown(function() {
                setTip(btypeTip, 2, '');
            });
            return false;
        }
        if(btags.length > 5) {
            setTip(btagsTip, 0, '标签不能超过5个');
            btags.click(function() {
                setTip(btagsTip, 2, '');
            });
            return false;
        }
        return true;
    });
};



module.exports = {
    "init": function () {
        initAttaForm();
        initUploadForm();
    }
};