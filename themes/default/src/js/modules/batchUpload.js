define(function(require, exports, module) {

	var $ = require('jquery');
	require('../lib/jqueryForm');
	require('../mod/selectWidget');
	
	var showLoading = function(str) {
		$('.main-a').append('<div class="fileList"><img src="' + webData.IMG_PATH + 'loading.gif" width="16" height="16" class="loading">' + str + '</div>');
	};
	
	var hideLoading = function() {
		$('.loading:eq(0)').parent().remove();
	};
	
	var verifyDir = function() {
		$('input[name="book_type"]').parent().selectInit();
		$('.batchOption').hide();
		$('.fileList').remove();

		var dir = $('#dir').val();
		if(! dir) {
			$('#dir').focus();
		} else {
			$.ajax({
				type: 'POST',
				url: webData.WEB_ROOT + 'batchUpload.php',
				dataType: 'json',
				data: {
					'act':'verifyDir', 
					'dir': dir
				},
				beforeSend: function() {
					showLoading('正在验证目录，请稍候...');
				},
				success: function(r){
					hideLoading();
					if(r.code == 0) {
						$('input[name="legalDir"]').val(dir);
						$('.batchOption').show();
						var result = '<div class="fileList bbord">';
						result += '<h3>' + r.msg + '</h3>';
						result += '<table><thead><tr>';
						result += '<td>书名</td><td>作者</td><td>文件路径</td>';
						result += '</tr></thead><tbody>';					
						for(var key in r.legal) {
							var file = r.legal[key];
							result += '<tr>';
							result += '<td>' + file.book_name + '</td>';
							result += '<td>' + file.book_author + '</td>';
							result += '<td>' + file.book_path + '</td>';
							result += '</tr>';
						}
						result += '</tbody></table></div>';
						$('.main-a').append(result);
						return true;
					} else if(r.code == 1) {
						$('.main-a').append('<div class="fileList">' + r.msg + '</div>');
					} else if(r.code == 2) {
						var result = '<div class="fileList bbord">';
						result += '<h3>' + r.msg + '</h3>';
						result += '<table><thead><tr>';
						result += '<td>文件路径</td><td>错误提示</td>';
						result += '</tr></thead><tbody>';					
						for(var key in r.illegal) {
							var file = r.illegal[key];
							result += '<tr>';
							result += '<td>' + file.book_path + '</td>';
							result += '<td>' + file.msg + '</td>';
							result += '</tr>';
						}
						result += '</tbody></table></div>';
						$('.main-a').append(result);
					} else {
						alert('操作失败，请重新执行');
					}
				}
			});
		}
		return false;
	}
	
	$('#btnVerifyDir').click(function() {
		verifyDir();
	});

	$('#buForm').submit(function() {
		var bu = this;
		var dir = $('#dir').val();
		if(!dir || (dir != $('input[name="legalDir"]').val())) {
			verifyDir();
			return false;
		}
		
		var book_type = $('input[name="book_type"]');
		var btags = $('input[name="btags[]"]:checked');
		if(book_type.val() == 0) {
			$('#btypeTip').html('请选择分类').addClass('error');
			book_type.next().mousedown(function() {
				$('#btypeTip').html('').removeClass('error');
			});
			return false;
		}
		if(btags.length > 5) {
			$('#btagsTip').html('标签不能超过5个').addClass('error').show();
			btags.click(function() {
				$('#btagsTip').html('').removeClass('error').hide();
			});
			return false;
		}
		
		var options = {
			type: 'POST',
			url: webData.WEB_ROOT + 'batchUpload.php',
			dataType: 'json',
			beforeSubmit: function() {
				$('input[name="book_type"]').parent().selectInit();
				$('.batchOption').hide();
				$('.fileList').remove();
				showLoading('文件正在上传，请稍候...');
			},
			success: function(r) {
				hideLoading();
				if(r.code == 0) {
					var result = '';
					if(r.illegal.length > 0) {
						result += '<div class="fileList bbord">';
						result += '<h3>' + r.illegal.length + ' 个文件上传失败</h3>';
						result += '<table><thead><tr>';
						result += '<td>书名</td><td>作者</td><td>文件路径</td>';
						result += '</tr></thead><tbody>';					
						for(var key in r.illegal) {
							var file = r.illegal[key];
							result += '<tr>';
							result += '<td>' + file.book_name + '</td>';
							result += '<td>' + file.book_author + '</td>';
							result += '<td>' + file.book_path + '</td>';
							result += '</tr>';
						}
						result += '</tbody></table></div>';
					}
					if(r.legal.length > 0) {
						if(result != '') {
							result += '<div class="fileList bbord" style="border-top:none; margin-top:0">';
						} else {
							result += '<div class="fileList bbord">';
						}
						result += '<h3>' + r.legal.length + ' 个文件上传成功</h3>';
						result += '<table><thead><tr>';
						result += '<td>书名</td><td>作者</td><td>文件路径</td>';
						result += '</tr></thead><tbody>';					
						for(var key in r.legal) {
							var file = r.legal[key];
							result += '<tr>';
							result += '<td>' + file.book_name + '</td>';
							result += '<td>' + file.book_author + '</td>';
							result += '<td>' + file.book_path + '</td>';
							result += '</tr>';
						}
						result += '</tbody></table></div>';
					}
					$('.main-a').append(result);
				} else {
					alert('Something is wrong.');
				}
			}
		};
		$('#buForm').ajaxSubmit(options);
		return false;
	});	
	
});