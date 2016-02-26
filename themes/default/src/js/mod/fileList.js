define(function(require, exports, module) {

	var $ = require('jquery');
	var File = require('./file');
	var file = new File();
	
	//喜欢
	$('.eva').click(function() {
		var book_id = parseInt($(this).attr('id').replace('eva_', ''));
		file.setEva(book_id);
	});
	
	//删除文件
	$('.btnDelFile').click(function() {
		var me = $(this);
		var book_id = parseInt($(this).attr('id').replace('del_', ''));
		var isok = file.delFile(book_id, function() {
			me.closest('li').hide('fast');
		});
	});
	
});
