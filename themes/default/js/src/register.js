define(function(require, exports, module) {

	var $ = require('jquery');
	require('./lib/jqueryForm');
	
	var VerifyLogin = require('./mod/VerifyLogin');
	var ve = new VerifyLogin();	
	
	$('input[name="name"]').blur(function() {
		ve.verifyNameAjax();
	});
	
	$('input[name="email"]').blur(function() {
		ve.verifyEmailAjax();
	});
	
	$('input[name="pwd"]').blur(function() {
		ve.verifyPwd(true);
	});
	
	$('input[name="repwd"]').blur(function() {
		ve.verifyRepwd(true);
	});
	
	$('#regForm').submit(function() {
		ve.submitRegister();
		return false;
	});

});