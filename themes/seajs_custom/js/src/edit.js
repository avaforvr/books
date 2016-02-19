define(function(require, exports, module) {

	var $ = require('$');
	
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
	$('#editForm').submit(function() {
		if(! FormCheck.checkFileForm()) {
			return false;
		}
	});
});