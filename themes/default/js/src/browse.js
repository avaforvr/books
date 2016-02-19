define(function(require, exports, module) {

	var $ = require('jquery');
	
	require('./mod/fileList');
	
	//下拉框
	require('./mod/selectWidget');
	$('.sele').each(function () {
		$(this).selectWidget();
	});

	$('#filterForm').submit(function() {
		if($('input[name="ftype"]').val() == 0 && $('input[name="fstyle"]').val() == 0) {
			alert('请选择筛选条件');
			return false;
		}
		return true;
	});
	
	$('#keyForm').submit(function() {
		var sbkey = $('input[name="sbkey"]').val();
		if(! sbkey) {
			alert('请输入关键字');
			return false;
		}
		return true;
	});

});