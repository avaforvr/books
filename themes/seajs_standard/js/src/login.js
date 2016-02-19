define(function(require, exports, module) {

	var $ = require('./lib/jquery');
	var Verify = require('./mod/verify');
	var ve = new Verify();	
	
	$('input[name="name"]').blur(function() {
		ve.verifyName();
	});
	
	$('input[name="pwd"]').blur(function() {
		ve.verifyPwd();
	});
	
	
	require('./lib/jqueryForm');
	var gp = require('./mod/getParam');
	var backUrl = gp.getParamVal('back');
	
	$('#loginForm').submit(function() {
		if(ve.verifyName() && ve.verifyPwd()) {
			var options = {
				type: 'POST',
				url: '../../login.php?back=' + backUrl,
				dataType: 'json',
				beforeSubmit: function() {
					$('#submitTip').html('<img src="themes/standard/images/loading.gif" width="16" height="16" class="loading">');
					$('input[type="submit"]').attr('disabled', true);
				},
				success: function(r) {
					$('#submitTip').removeClass('error').removeClass('suc').html('');
					if(r.code == 0) {
						$('#submitTip').addClass('suc').html('登陆成功');
						location.href = r.back;
					} else if(r.code == 1) {
						$('#nameTip').addClass('error').html('该用户不存在');
					} else {
						$('#pwdTip').addClass('error').html('密码错误');
					}
					$('input[type="submit"]').attr('disabled', false);
					$(':input').focus(function() {
						$('#submitTip').removeClass('error').removeClass('suc').html('');
					});
				}
			};
			$('#loginForm').ajaxSubmit(options);
		}	
		return false;
	});	

});