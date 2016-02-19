define(function(require, exports, module) {

	var $ = require('jquery');
	var File = require('./file');
	var file = new File();
	
	//喜欢
	$('.eva').click(function() {
		var bid = parseInt($(this).attr('id').replace('eva_', ''));
		file.setEva(bid);
	});
	
	//删除文件
	$('.btnDelFile').click(function() {
		var me = $(this);
		var bid = parseInt($(this).attr('id').replace('del_', ''));
		var isok = file.delFile(bid, function() {
			me.closest('li').hide('fast');
		});
	});
	
});
