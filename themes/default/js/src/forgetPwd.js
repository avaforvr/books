define(function(require, exports, module) {

	var $ = require('jquery');
	var VerifyLogin = require('./mod/VerifyLogin');
	var ve = new VerifyLogin();	
	
	$('input[name="name"]').blur(function() {
		ve.verifyName();
	});
	
	$('input[name="email"]').blur(function() {
		ve.verifyEmail();
	});
	
	$('input[name="pwd"]').blur(function() {
		ve.verifyPwd(true);
	});
	
	$('input[name="repwd"]').blur(function() {
		ve.verifyRepwd(true);
	});

	$('#findPwdForm').submit(function() {	
		if($('#findPwdForm input[name="act"]').val() == '' || $('#findPwdForm input[name="pwd"]').closest('tr').is(':hidden')) {
			ve.verifyNameAndEmail();
		} else {
			ve.submitForgetPwd();
		}
		return false;
	});	

});