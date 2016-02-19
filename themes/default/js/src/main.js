define(function(require, exports, modulselectWidgete) {
	
	var $ = require('jquery');
	
	//to determine which code to take effect
	var data_key = $('body').attr('data-key') ? $('body').attr('data-key') : '';
	
	// common
	// --------------------------------------------------
	
	// index
	// --------------------------------------------------
	if(data_key == 'index') {
		require('./index');
	}
	
	// browse
	// --------------------------------------------------
	if(data_key == 'browse') {
		require('./browse');
	}
	
	// upload
	// --------------------------------------------------
	if(data_key == 'upload') {
		require('./upload');
	}
	
	// batchUpload
	// --------------------------------------------------
	if(data_key == 'batchUpload') {
		require('./batchUpload');
	}
	
	// login
	// --------------------------------------------------
	if(data_key == 'login') {
		require('./login');
	}
	
	// register
	// --------------------------------------------------
	if(data_key == 'register') {
		require('./register');
	}
	
	// forgetPwd
	// --------------------------------------------------
	if(data_key == 'forgetPwd') {
		require('./forgetPwd');
	}
	
	// changePwd
	// --------------------------------------------------
	if(data_key == 'changePwd') {
		require('./changePwd');
	}
	
	// pending
	// --------------------------------------------------
	if(data_key == 'pending') {
		require('./pending');
	}

});