define(function(require, exports, module) {	

	var $ = require('$');
	var File = require('./mod/file');
	
	//喜欢
	$('.eva').click(function() {
		var liId = $(this).parents('li').attr('id');
		var bid = parseInt(liId.replace('nov_', ''));
		var f = new File(bid);
		f.doLike();
	});
	
	//删除文件
	$('.btnDelFile').click(function() {
		var liId = $(this).parents('li').attr('id');
		var bid = parseInt(liId.replace('nov_', ''));
		var f = new File(bid);
		f.doDelete();
	});
		
});

