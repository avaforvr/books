define(function(require, exports, module) {

	var $ = require('jquery');
	var VerifyLogin = require('./mod/VerifyLogin');
	var ve = new VerifyLogin();	
	
	$('input[name="oldpwd"]').blur(function() {
		ve.verifyOldpwd(true);
	});
	
	$('input[name="pwd"]').blur(function() {
		ve.verifyPwd(true);
	});
	
	$('input[name="repwd"]').blur(function() {
		ve.verifyRepwd(true);
	});

	$('#changePwdForm').submit(function() {	
		ve.submitChangePwd();
		return false;
	});	

});