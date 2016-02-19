define(function(require, exports, module) {

	var $ = require('./lib/jquery');
	var Verify = require('./mod/verify');
	var ve = new Verify();	
	
	$('input[name="name"]').blur(function() {
		ve.verifyNameReg();
	});
	
	$('input[name="email"]').blur(function() {
		ve.verifyEmailReg();
	});
	
	$('input[name="pwd"]').blur(function() {
		ve.verifyPwd(true);
	});
	
	$('input[name="repwd"]').blur(function() {
		ve.verifyRepwd(true);
	});
	
	require('./lib/jqueryForm');
	var gp = require('./mod/getParam');
	var backUrl = gp.getParamVal('back');
	
	$('#regForm').submit(function() {
		if(ve.verifyNameReg() && ve.verifyEmailReg() && ve.verifyPwd() && ve.verifyRepwd()) {
			var options = {
				type: 'POST',
				url: '../../login.php?back=' + backUrl,
				dataType: 'json',
				beforeSubmit: function() {
					$('#submitTip').html('<img src="themes/standard/images/loading.gif" width="16" height="16" class="loading">');
					$('input[type="submit"]').attr('disabled', true);
				},
				success: function(r) {
					if(r.code == 0) {
						$('#submitTip').addClass('suc').html('注册成功');
						location.href = r.back;
					} else {
						$('#submitTip').html('注册失败，请重新填写').addClass('error');
						$('input[type="submit"]').attr('disabled', false);
						$(':input').focus(function() {
							$('#submitTip').removeClass('error').removeClass('suc').html('');
						});
					}
				}
			};
			$('#regForm').ajaxSubmit(options);
		}	
		return false;
	});

});