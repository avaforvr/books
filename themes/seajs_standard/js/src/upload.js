define(function(require, exports, modulselectWidgete) {

	var $ = require('./lib/jquery');
	
	//点击Choose File按钮回复原始状态
	$('#attachment').mousedown(function() {
		$('.sucDone, .failDone').hide();
	});
	
	//选择文件后验证上传到temp目录中
	var VerifyAtta = require('./mod/verifyAtta');
	$('#attachment').change(function() {
		var va = new VerifyAtta();
		va.verify();
	});
	
	//下拉框
	require('./mod/selectWidget');
	$('.sele').each(function () {
		$(this).selectWidget();
	});
	
	//填写简介后消除空行
	$('textarea[name="bsummary"]').blur(function() {
		var elem = $(this);
		var str = elem.val().replace(/\n\s*/g, '\n');
		str = str.replace(/\n{2,}/g, '\n');		
		elem.val(str);
	});	
	
	//上传和编辑页面表单验证
	var FormCheck = require('./mod/formCheck');		
	$('#uploadForm, #editForm').submit(function() {
		if(! FormCheck.checkFileForm()) {
			return false;
		}
	});
});