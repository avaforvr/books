// JavaScript Document
define(function(require, exports, module) {
	var $ = require('../lib/jquery');
	require('../lib/jqueryForm');

	function Verify() {
		this.name = $('input[name="name"]');
		this.nameTip = $('#nameTip');
		this.email = $('input[name="email"]');
		this.emailTip = $('#emailTip');
		this.pwd = $('input[name="pwd"]');
		this.pwdTip = $('#pwdTip');
		this.repwd = $('input[name="repwd"]');
		this.repwdTip = $('#repwdTip');
	}
	module.exports = Verify;
	
	Verify.prototype.verifyName = function(isAjax) {
		var isAjax = arguments[0] ? arguments[0] : false;
		var name = this.name;
		var nameVal = name.val();
		var nameTip = this.nameTip;
		
		name.focus(function () {
			nameTip.removeClass('error').removeClass('suc').html('由3-10位英文字母或数字组成');
		});
		
		if ((nameVal.length < 3) || (nameVal.length > 10) || (nameVal.search(/^[A-Za-z0-9]+$/g))) {
			nameTip.addClass('error');
			return false;
		}

		if (isAjax) {
			$.ajax({
				type : 'POST',
				url : '../../../login.php',
				dataType : 'text',
				data : {
					act : 'verifyName',
					name : nameVal
				},
				beforeSend : function () {
					nameTip.html('<img src="themes/standard/images/loading.gif" width="16" height="16" class="loading">');
				},
				success : function (r) {
					if (r) {
						nameTip.addClass('error').html('该用户名已被占用');
					} else {
						nameTip.addClass('suc').html('可用');
					}
				}
			});
		}
		return true;
	};
	
	Verify.prototype.verifyEmail = function(isAjax) {
		var isAjax = arguments[0] ? arguments[0] : false;
		var email = this.email;
		var emailVal = email.val();
		var emailTip = this.emailTip;
		var origTip = emailTip.html();
		
		email.focus(function () {
			emailTip.removeClass('error').removeClass('suc').html(origTip);
		});
		
		if (emailVal.search(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/g)) {
			emailTip.addClass('error').html('邮箱格式错误');
			return false;
		}
		if (isAjax) {
			$.ajax({
				type : 'POST',
				url : '../../../login.php',
				dataType : 'text',
				data : {
					act : 'verifyEmail',
					email : emailVal
				},
				beforeSend : function () {
					emailTip.html('<img src="themes/standard/images/loading.gif" width="16" height="16" class="loading">');
				},
				success : function (r) {
					if (r) {
						emailTip.addClass('error').html('该邮箱已被占用');
					} else {
						emailTip.addClass('suc').html('可用');
					}
				}
			});
		}
		return true;
	};
	
	Verify.prototype.verifyPwd = function(isShowRight) {
		var isShowRight = arguments[0] ? arguments[0] : false;
		var pwd = this.pwd;
		var pwdVal = pwd.val();
		var pwdTip = this.pwdTip;

		pwd.focus(function () {
			pwdTip.removeClass('error').removeClass('suc').html('由6-16位下划线、英文字母或数字组成');
		});

		if ((pwdVal.length < 6) || (pwdVal.length > 16) || (pwdVal.search(/^\w+$/g))) {
			pwdTip.addClass('error');
			return false;
		}
		if(isShowRight) {
			pwdTip.addClass('suc').html('可用');
		}
		return true;
	};
	
	Verify.prototype.verifyRepwd = function(isShowRight) {
		var repwd = this.repwd;
		var repwdVal = repwd.val();
		var repwdTip = this.repwdTip;
		
		repwd.focus(function () {
			repwdTip.removeClass('error').removeClass('suc').html('');
		});	
		
		if (! repwdVal) {
			repwdTip.addClass('error').html('密码不能为空');
			return false;
		}
		
		if (repwdVal != $('input[name="pwd"]').val()) {
			repwdTip.addClass('error').html('密码不一致');
			return false;
		}
		if(isShowRight) {
			repwdTip.addClass('suc').html('可用');
		}
		return true;
	};

	Verify.prototype.verifyNameReg = function() {
		var nameVal = this.name.val();
		var nameTip = this.nameTip;
		var vnameVal = $('input[name="vname"]').val();
		if((nameVal == vnameVal) && (vnameVal != '')) {
			nameTip.addClass('suc').html('可用');
			return true;
		}
		if(this.verifyName(true)) {
			$('input[name="vname"]').val(nameVal);
		}
	};
	
	Verify.prototype.verifyEmailReg = function() {
		var emailVal = this.email.val();
		var emailTip = this.emailTip;
		var vemailVal = $('input[name="vemail"]').val();
		if((emailVal == vemailVal) && (vemailVal != '')) {
			emailTip.addClass('suc').html('可用');
			return true;
		}
		if(this.verifyEmail(true)) {
			$('input[name="vemail"]').val(emailVal);
		}
	};
	
	Verify.prototype.verifyNameAndEmail = function() {
		if(this.verifyName() && this.verifyEmail()) {
			var name = this.name;
			var nameVal = this.name.val();
			var nameTip = this.nameTip;		
			var email = this.email;
			var emailVal = this.email.val();
			var emailTip = this.emailTip;
			$.ajax({
				type : 'POST',
				url : '../../../login.php',
				dataType : 'json',
				data : {
					act : 'verifyNameAndEmail',
					name: nameVal,
					email : emailVal
				},
				beforeSend : function () {
					$('.submitTip').html('<img src="themes/standard/images/loading.gif" width="16" height="16" class="loading">');
				},
				success : function (r) {
					$('.submitTip').html('');
					if (r.code == 0) {
						$('#nameTip').addClass('suc').html('正确');
						name.attr('readonly', true)
						$('#emailTip').addClass('suc').html('正确');
						email.attr('readonly', true)
						$('.pwdtr').show();
						$('input[name="act"]').val('findPwd');
					} else if(r.code == 1) {
						emailTip.addClass('error').html('邮箱错误');
					} else {
						nameTip.addClass('error').html('该用户不存在');
					}
				}
			});
			
		}
	};
	
});
