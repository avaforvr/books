require('../lib/jqueryForm');

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
            uploadForm.hide();
            return false;
        }
        var options = {
            dataType: 'json',
            success: function(r) {
                attaTip.innerHTML = r.msg;
                if(r.code == 0) {
                    attaTip.className = 'tip suc';
                    $('input[name="bookInfo[book_name]"]').val(r.book_name);
                    $('input[name="bookInfo[book_author]"]').val(r.book_author);
                    $('input[name="bookInfo[bformat]"]').val(r.bformat);
                    $('input[name="bookInfo[book_size]"]').val(r.book_size);
                    $('input[name="bookInfo[bpath]"]').val(r.bpath);
                    uploadForm.show();
                } else {
                    attaTip.className = 'tip error';
                    uploadForm.hide();
                }
            }
        };
        $('#attaForm').ajaxSubmit(options);
    });
};

//提交文件信息表单
var initUploadForm = function () {
    //下拉框
    require('../mod/selectWidget');
    $('.select').each(function () {
        $(this).selectWidget();
    });

    //填写简介后消除空行
    $('textarea[name="bookInfo[book_summary]"]').blur(function() {
        var elem = $(this);
        var str = elem.val().replace(/\n\s*/g, '\n');
        str = str.replace(/\n{2,}/g, '\n');
        elem.val(str);
    });

    //上传和编辑页面表单验证
    $('#uploadForm, #editForm').submit(function() {
        var book_name = $('input[name="bookInfo[book_name]"]');
        var book_author = $('input[name="bookInfo[book_author]"]');
        var book_type = $('input[name="bookInfo[book_type]"]');
        var btags = $('input[name="bookInfo[btags][]"]:checked');
        var bnameTip = document.getElementById('bnameTip');
        var bnameTip = document.getElementById('bnameTip');
        var btypeTip = document.getElementById('btypeTip');
        var btagsTip = document.getElementById('btagsTip');
        var setTip = function(elemTip, isRight, tipText) {
            var tipClass = '';
            if(isRight == 0) {
                tipClass = 'tip error';
            } else if(isRight == 1) {
                tipClass = 'tip suc';
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
    "init": function (key) {
        initAttaForm();
        initUploadForm();
    }
};