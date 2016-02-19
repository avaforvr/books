define(function(require, exports, modulselectWidgete) {

	var $ = require('jquery');
	require('./lib/jqueryForm');
	
//{{{ Choose File
	var attaElem = $('#attachment');
	
	//点击Choose File按钮回复原始状态
	attaElem.mousedown(function() {
		$('.sucDone, .failDone').hide();
	});
	
	//选择文件后验证上传到temp目录中
	attaElem.change(function() {
		var attaTip = document.getElementById('attaInfo');
		var bookInfoTable = $('#uploadForm table');
		if(attaElem.val() == '') {
			attaTip.className = 'tip error';
			attaTip.innerHTML = '请选择文件';
			bookInfoTable.hide();
			return false;
		}
		var options = {
			type: 'POST',
			url: '../../../upload.php',
			dataType: 'json',
			success: function(r) {
				attaTip.innerHTML = r.msg;
				if(r.code == 0) {
					attaTip.className = 'tip suc';
					$('input[name="bookInfo[bname]"]').val(r.bname);
					$('input[name="bookInfo[bauthor]"]').val(r.bauthor);
					$('input[name="bookInfo[bformat]"]').val(r.bformat);
					$('input[name="bookInfo[bsize]"]').val(r.bsize);
					$('input[name="bookInfo[bpath]"]').val(r.bpath);
					bookInfoTable.show();
				} else {
					attaTip.className = 'tip error';
					bookInfoTable.hide();
				}
			}
		};
		$('#attaForm').ajaxSubmit(options);
	});
	
//}}}
	
	//下拉框
	require('./mod/selectWidget');
	$('.sele').each(function () {
		$(this).selectWidget();
	});
	
	//填写简介后消除空行
	$('textarea[name="bookInfo[bsummary]"]').blur(function() {
		var elem = $(this);
		var str = elem.val().replace(/\n\s*/g, '\n');
		str = str.replace(/\n{2,}/g, '\n');		
		elem.val(str);
	});	
	
	//上传和编辑页面表单验证
	$('#uploadForm, #editForm').submit(function() {
		var bname = $('input[name="bookInfo[bname]"]');
		var bauthor = $('input[name="bookInfo[bauthor]"]');
		var btype = $('input[name="bookInfo[btype]"]');
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
		
		if(! bname.val()) {
			setTip(bnameTip, 0, '请填写书名');
			bname.focus(function() {
				setTip(bnameTip, 2, '');
			})
			return false;
		}
		if(! bauthor.val()) {
			setTip(bauthorTip, 0, '请填写作者');
			bauthor.focus(function() {
				setTip(bauthorTip, 2, '');
			});
			return false;
		}
		if(btype.val() == 0) {
			setTip(btypeTip, 0, '请选择分类');
			btype.next().mousedown(function() {
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
});