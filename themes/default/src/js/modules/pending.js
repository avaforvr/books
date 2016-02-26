define(function(require, exports, module) {
	var $ = require('jquery');
	var File = require('../mod/file');
	var file = new File();
	
	//审核通过
	$('.btn-pass').click(function() {
		var me = $(this);
		var book_id = parseInt(me.closest('dt').attr('id').replace('bid_', ''));
		$.ajax({
			type: 'POST',
			url: webData.WEB_ROOT + 'master/pending.php',
			dataType: 'text',
			data: {'act':'pass','book_id':book_id},
			success: function(r){
				if(parseInt(r) == 1) {
					me.parent().html('审核通过');
				} else {
					alert('操作失败');
				}
			}
		});
	});
	
	//删除重复文件并发出站内信
	$('.btn-delete').click(function() {
		var me = $(this);
		var book_id = parseInt(me.closest('dt').attr('id').replace('bid_', ''));
		$.ajax({
			type: 'POST',
			url: webData.WEB_ROOT + 'master/pending.php',
			dataType: 'text',
			data: {'act':'repeat','book_id':book_id},
			success: function(r){
				if(parseInt(r) == 1) {
					me.parent().html('已删除');
				} else {
					alert('操作失败');
				}
			}
		});
	});

});