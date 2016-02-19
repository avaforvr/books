define(function(require, exports, module) {

	var $ = require('$');
	
	function VerifyDir(dir) {
		this.dir = dir;
	}
	module.exports = VerifyDir;
	
	VerifyDir.prototype.verify = function() {
		$('input[name="btype"]').parent().selectInit();	
		$('.batchOption').hide();
		$('.fileList').remove();

		var dir = $('#dir').val();
		if(! dir) {
			$('#dir').focus();
			return false;
		} else {
			$.ajax({
				type: 'POST',
				url: WEB_ROOT + 'batchUpload.php',
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
						result += '<td>书名</td><td>作者</td><td>格式</td><td>文件路径</td>';
						result += '</tr></thead><tbody>';					
						for(var key in r.legal) {
							var file = r.legal[key];
							result += '<tr>';
							result += '<td>' + file.bname + '</td>';
							result += '<td>' + file.bauthor + '</td>';
							result += '<td>' + file.bformat + '</td>';
							result += '<td>' + file.bpath + '</td>';
							result += '</tr>';
						}
						result += '</tbody></table></div>';
						$('.main_form').append(result);
						return true;
					} else if(r.code == 1) {
						$('.main_form').append('<div class="fileList">' + r.msg + '</div>');
					} else if(r.code == 2) {
						var result = '<div class="fileList bbord">';
						result += '<h3>' + r.msg + '</h3>';
						result += '<table><thead><tr>';
						result += '<td>文件路径</td><td>错误提示</td>';
						result += '</tr></thead><tbody>';					
						for(var key in r.illegal) {
							var file = r.illegal[key];
							result += '<tr>';
							result += '<td>' + file.bpath + '</td>';
							result += '<td>' + file.msg + '</td>';
							result += '</tr>';
						}
						result += '</tbody></table></div>';
						$('.main_form').append(result);
					} else {
						alert('操作失败，请重新执行');
					}
				}
			});
			return false;
		}
	};
	

});