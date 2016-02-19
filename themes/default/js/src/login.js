define(function(require, exports, module) {

	var $ = require('jquery');
	
	var VerifyLogin = require('./mod/VerifyLogin');
	var ve = new VerifyLogin();	
	
	$('input[name="name"]').blur(function() {
		ve.verifyName();
	});
	
	$('input[name="pwd"]').blur(function() {
		ve.verifyPwd();
	});
	
	$('#loginForm').submit(function() {
		ve.submitLogin();
		return false;
	});	

});