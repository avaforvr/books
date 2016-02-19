define(function(require, exports, module) {

	var $ = require('../lib/jquery');
	require('../lib/jqueryForm');
	require('../mod/selectWidget');
	
	function Batch() {}	
	module.exports = Batch;
	
	Batch.prototype.showLoading = function(str) {
		$('.main_form').append('<div class="fileList"><img src="themes/standard/images/loading.gif" width="16" height="16" class="loading">' + str + '</div>');	
	};
	
	Batch.prototype.hideLoading = function() {
		$('img.loading').parent().remove();
	};
	
	Batch.prototype.verifyDir = function() {
		var bu = this;
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
				url: '../../../batchUpload.php',
				dataType: 'json',
				data: {
					'act':'verifyDir', 
					'dir': dir
				},
				beforeSend: function() {
					bu.showLoading('正在验证目录，请稍候...');
				},
				success: function(r){
					bu.hideLoading();
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
	
	Batch.prototype.doBatchUpload = function() {
		var bu = this;
		var dir = $('#dir').val();
		if(!dir || (dir != $('input[name="legalDir"]').val())) {
			bu.verifyDir();
			return false;
		}	
		
		var btype = $('input[name="btype"]');
		var btags = $('input[name="btags[]"]:checked');
		if(btype.val() == 0) {
			$('#btypeTip').html('请选择分类').addClass('error').show();
			btype.next().mousedown(function() {
				$('#btypeTip').html('').removeClass('error').hide();
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
			url: '../../../batchUpload.php',
			dataType: 'json',
			beforeSubmit: function() {
				$('input[name="btype"]').parent().selectInit();	
				$('.batchOption').hide();
				$('.fileList').remove();
				bu.showLoading('文件正在上传，请稍候...');
			},
			success: function(r) {
				bu.hideLoading();
				if(r.code == 0) {
					var result = '';
					if(r.illegal.length > 0) {
						result += '<div class="fileList bbord">';
						result += '<h3>' + r.illegal.length + ' 个文件上传失败</h3>';
						result += '<table><thead><tr>';
						result += '<td>书名</td><td>作者</td><td>格式</td><td>文件路径</td>';
						result += '</tr></thead><tbody>';					
						for(var key in r.illegal) {
							var file = r.illegal[key];
							result += '<tr>';
							result += '<td>' + file.bname + '</td>';
							result += '<td>' + file.bauthor + '</td>';
							result += '<td>' + file.bformat + '</td>';
							result += '<td>' + file.bpath + '</td>';
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
					}
					$('.main_form').append(result);
				} else {
					alert('error');
				}
			}
		};
		$('#buForm').ajaxSubmit(options);
		return false;
	};
	

});