define(function(require, exports, module) {

	var $ = require('$');
	require('../lib/jqueryForm');
	
	function VerifyAtta() {}	
	module.exports = VerifyAtta;
	
	VerifyAtta.prototype.verify = function() {
		if($('#attachment').val() == '') {
			$('#attaInfo').removeClass('suc').addClass('error').html('请选择文件').show();
			$('#uploadForm table').hide();
			return false;
		}
		var options = {
			type: 'POST',
			url: '../../../upload.php',
			dataType: 'json',
			success: function(r) {
				if(r.code == 0) {
					$('#attaInfo').removeClass('error').addClass('suc').html(r.msg).show();
					$('input[name="bname"]').val(r.bname);
					$('input[name="bauthor"]').val(r.bauthor);
					$('input[name="bformat"]').val(r.bformat);
					$('input[name="bsize"]').val(r.bsize);
					$('input[name="bpath"]').val(r.bpath);
					$('#uploadForm table').show();
				} else {
					$('#attaInfo').removeClass('suc').addClass('error').html(r.msg).show();
					$('#uploadForm table').hide();
				}
			}
		};
		$('#attaForm').ajaxSubmit(options);
	};

});