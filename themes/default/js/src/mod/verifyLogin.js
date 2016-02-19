// JavaScript Document
define(function(require, exports, module) {
	var $ = require('jquery');
	require('../lib/jqueryForm');
	
	var Request = require('./request');
	var request = new Request();

	function VerifyLogin() {
		this.name = $('input[name="name"]');
		this.nameTip = $('#nameTip')[0];
		this.email = $('input[name="email"]');
		this.emailTip = $('#emailTip')[0];
		this.pwd = $('input[name="pwd"]');
		this.pwdTip = $('#pwdTip')[0];
		this.repwd = $('input[name="repwd"]');
		this.repwdTip = $('#repwdTip')[0];
		this.oldpwd = $('input[name="oldpwd"]');
		this.oldpwdTip = $('#oldpwdTip')[0];
		
	}
	module.exports = VerifyLogin;
	
	VerifyLogin.prototype.setTip = function(elemTip, isRight, tipText) {
		var tipClass = '';
		if(isRight == 0) {
			tipClass = 'tip error';
		} else if(isRight == 1) {
			tipClass = 'tip suc';
		} else {
			tipClass = 'tip';
		}
		
		elemTip.className = tipClass;
		elemTip.innerHTML = tipText;
	}
	
	VerifyLogin.prototype.verifyName = function() {
		var me = this,
			name = me.name,
			nameTip = me.nameTip,
			nameVal = name.val();

		name.focus(function () {
			me.setTip(nameTip, 2, '由3-10位英文字母或数字组成');
		});
		
		if ((nameVal.length < 3) || (nameVal.length > 10) || (nameVal.search(/^[A-Za-z0-9]+$/g))) {
			me.setTip(nameTip, 0, '由3-10位英文字母或数字组成');
			return false;
		}
		return true;
	};
	
	VerifyLogin.prototype.verifyNameAjax = function() {
		var me = this,
			name = me.name,
			nameTip = me.nameTip,
			nameVal = name.val();
		if(! me.verifyName()) {
			return false;
		}
		
		$.ajax({
			type : 'POST',
			url : webData.WEB_ROOT + 'login.php',
			dataType : 'text',
			data : {
				act : 'verifyName',
				name : nameVal
			},
			beforeSend : function () {
				nameTip.innerHTML = '<img src="' + webData.IMG_PATH + 'loading.gif" width="16" height="16" class="loading">';
			},
			success : function (r) {
				if (r == '1') {
					me.setTip(nameTip, 0, '该用户名已被占用');
				} else {
					me.setTip(nameTip, 1, '可用');
				}
			}
		});
		return false;
	};
	
	VerifyLogin.prototype.verifyPwd = function(isShowRight) {
		var isShowRight = arguments[0] ? arguments[0] : false;
		var me = this,
			pwd = me.pwd,
			pwdTip = me.pwdTip,
			pwdVal = pwd.val();

		pwd.focus(function () {
			me.setTip(pwdTip, 2, '由6-16位下划线、英文字母或数字组成');
		});

		if ((pwdVal.length < 6) || (pwdVal.length > 16) || (pwdVal.search(/^\w+$/g))) {
			me.setTip(pwdTip, 0, '由6-16位下划线、英文字母或数字组成');
			return false;
		}
		if(isShowRight) {
			me.setTip(pwdTip, 1, '可用');
		}
		return true;
	};
	
	VerifyLogin.prototype.verifyRepwd = function(isShowRight) {
		var isShowRight = arguments[0] ? arguments[0] : false;
		var me = this,
			repwd = me.repwd,
			repwdTip = me.repwdTip,
			repwdVal = repwd.val();
		
		repwd.focus(function () {
			me.setTip(repwdTip, 2, '');
		});	
		
		if (! repwdVal) {
			me.setTip(repwdTip, 0, '密码不能为空');
			return false;
		}
		
		if (repwdVal != $('input[name="pwd"]').val()) {
			me.setTip(repwdTip, 0, '密码不一致');
			return false;
		}
		if(isShowRight) {
			me.setTip(repwdTip, 1, '可用');
		}
		return true;
	};
	
	VerifyLogin.prototype.verifyOldpwd = function(isShowRight) {
		var me = this,
			oldpwd = me.oldpwd,
			oldpwdTip = me.oldpwdTip,
			oldpwdVal = oldpwd.val();

		oldpwd.focus(function () {
			me.setTip(oldpwdTip, 2, '由6-16位下划线、英文字母或数字组成');
		});

		if ((oldpwdVal.length < 6) || (oldpwdVal.length > 16) || (oldpwdVal.search(/^\w+$/g))) {
			me.setTip(oldpwdTip, 0, '由6-16位下划线、英文字母或数字组成');
			return false;
		}
		
		var isShowRight = arguments[0] ? arguments[0] : false;		
		if(isShowRight) {
			me.setTip(oldpwdTip, 1, '可用');
		}
		return true;
	};
	
	VerifyLogin.prototype.verifyEmail = function() {
		var me = this,
			email = me.email,
			emailTip = me.emailTip,
			emailVal = email.val();

		email.focus(function () {
			me.setTip(emailTip, 2, '通过邮箱，网站将不定期发放福利；找回密码');
		});
		
		if (emailVal.search(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/g)) {
			me.setTip(emailTip, 0, '邮箱格式错误');
			return false;
		}
		return true;
	};
	
	VerifyLogin.prototype.verifyEmailAjax = function() {
		var me = this,
			email = me.email,
			emailTip = me.emailTip,
			emailVal = email.val();
		if(! me.verifyEmail()) {
			return false;
		}
		
		$.ajax({
			type : 'POST',
			url : webData.WEB_ROOT + 'login.php',
			dataType : 'text',
			data : {
				act : 'verifyEmail',
				email : emailVal
			},
			beforeSend : function () {
				emailTip.innerHTML = '<img src="' + webData.IMG_PATH + 'loading.gif" width="16" height="16" class="loading">';
			},
			success : function (r) {
				if (r == '1') {
					me.setTip(emailTip, 0, '该邮箱已被占用');
				} else {
					me.setTip(emailTip, 1, '可用');
				}
			}
		});
		return false;
	};
	
	VerifyLogin.prototype.verifyNameAndEmail = function() {
		var me = this;
		if(me.verifyName() && me.verifyEmail()) {
			var name = this.name,
				nameVal = this.name.val(),
				nameTip = this.nameTip,
				email = this.email,
				emailVal = this.email.val(),
				emailTip = this.emailTip,
				submitTip = $('#submitTip')[0];
			$.ajax({
				type : 'POST',
				url : webData.WEB_ROOT + 'login.php',
				dataType : 'json',
				data : {
					act : 'verifyNameAndEmail',
					name: nameVal,
					email : emailVal
				},
				beforeSend : function () {
					submitTip.innerHTML = '<img src="' + webData.IMG_PATH + 'loading.gif" width="16" height="16" class="loading">';
				},
				success : function (r) {
					me.setTip(submitTip, 2, '');
					if (r.code == 0) {
						me.setTip(nameTip, 1, '正确');
						name.prop('readonly', true)
						me.setTip(emailTip, 1, '正确');
						email.prop('readonly', true)
						$('.pwdtr').show();
						$('input[name="act"]').val('verifyFindPwd');
						$('input[name="uid"]').val(r.uid);
					} else if(r.code == 1) {
						me.setTip(nameTip, 0, '该用户不存在');
					} else if(r.code == 2) {
						me.setTip(emailTip, 0, '邮箱错误');
					}
				}
			});
			
		}
	};
	
	VerifyLogin.prototype.submitLogin = function() {
		var me = this;
		if(me.verifyName() && me.verifyPwd()) {
			var backUrl = request.getOne('back') ? request.getOne('back') : webData.WEB_ROOT;
			var submitTip = $('#submitTip')[0],
				nameTip = me.nameTip,
				pwdTip = me.pwdTip,
				submitBtn = $('input[type="submit"]');
			var options = {
				type: 'POST',
				url: webData.WEB_ROOT + 'login.php?back=' + backUrl,
				dataType: 'json',
				beforeSubmit: function() {
					submitTip.innerHTML = '<img src="' + webData.IMG_PATH + 'loading.gif" width="16" height="16" class="loading">';
					submitBtn.prop('disabled', true);
				},
				success: function(r) {
					me.setTip(submitTip, 2, '');
					if(r.code == 0) {
						me.setTip(submitTip, 1, '登陆成功');
						location.href = r.back;
					} else if(r.code == 1) {
						me.setTip(nameTip, 0, '该用户不存在');
					} else if(r.code == 2) {
						me.setTip(pwdTip, 0, '密码错误');
					} else {
						me.setTip(submitTip, 0, '登陆失败，请重新登陆');
					}
					submitBtn.prop('disabled', false);
				}
			};
			$('#loginForm').ajaxSubmit(options);
			$(':input').focus(function() {
				me.setTip(submitTip, 2, '');
			});
		}	
	};
	
	VerifyLogin.prototype.submitRegister = function() {
		var me = this;
		if(me.verifyName() && me.verifyEmail() && me.verifyPwd() && me.verifyRepwd()) {
			var backUrl = request.getOne('back') ? request.getOne('back') : webData.WEB_ROOT;
			
			var submitTip = $('#submitTip')[0],
				submitBtn = $('input[type="submit"]');
			var options = {
				type: 'POST',
				url: webData.WEB_ROOT + 'login.php?back=' + backUrl,
				dataType: 'json',
				beforeSubmit: function() {
					submitTip.innerHTML = '<img src="' + webData.IMG_PATH + 'loading.gif" width="16" height="16" class="loading">';
					submitBtn.prop('disabled', true);
				},
				success: function(r) {
					if(r.code == 0) {
						me.setTip(submitTip, 1, '注册成功');
						location.href = r.back;
					} else if(r.code == 1) {
						me.setTip(me.nameTip, 0, '该用户名已被占用');
					} else if(r.code == 2) {
						me.setTip(me.emailTip, 0, '该邮箱已被占用');
					} else if(r.code == 3) {
						me.setTip(me.repwdTip, 0, '密码不一致');
					} else {
						me.setTip(submitTip, 0, '注册失败，请重新填写');
						submitBtn.prop('disabled', false);
					}
				}
			};
			$('#regForm').ajaxSubmit(options);
			
			$(':input').focus(function() {
				me.setTip(submitTip, 2, '');
			});
		}	
	};
	
	VerifyLogin.prototype.submitForgetPwd = function() {
		var me = this;
		if(me.verifyPwd() && me.verifyRepwd()) {
			var backUrl = request.getOne('back') ? request.getOne('back') : webData.WEB_ROOT;
			var submitTip = $('#submitTip')[0],
				submitBtn = $('input[type="submit"]');
			var options = {
				type: 'POST',
				url: webData.WEB_ROOT + 'login.php',
				dataType: 'text',
				beforeSubmit: function() {
					submitTip.innerHTML = '<img src="' + webData.IMG_PATH + 'loading.gif" width="16" height="16" class="loading">';
					submitBtn.prop('disabled', true);
				},
				success: function(r) {
					if(r == '1') {
						me.setTip(submitTip, 1, '密码设置成功');
						location.href = webData.WEB_ROOT + 'login.php?back=' + backUrl;
					} else {
						me.setTip(submitTip, 0, '设置失败，请重新提交');
						submitBtn.prop('disabled', false);
					}
				}
			};
			$(':input').focus(function() {
				me.setTip(submitTip, 0, '');
			});
			$('#findPwdForm').ajaxSubmit(options);
		}
	};
	
	VerifyLogin.prototype.submitChangePwd = function() {
		var me = this;
		if(me.verifyOldpwd() && me.verifyPwd() && me.verifyRepwd()) {
			var submitTip = $('#submitTip')[0],
				submitBtn = $('input[type="submit"]');
			var options = {
				type: 'POST',
				url: webData.WEB_ROOT + 'user/changePwd.php',
				dataType: 'json',
				beforeSubmit: function() {
					submitTip.innerHTML = '<img src="' + webData.IMG_PATH + 'loading.gif" width="16" height="16" class="loading">';
					submitBtn.prop('disabled', true);
				},
				success: function(r) {
					me.setTip(submitTip, 2, '');
					if(r.code == 0) {
						me.setTip(submitTip, 1, '密码修改成功');
						//密码修改成功后清空表单数据
						me.oldpwd.val('');
						me.pwd.val('');
						me.repwd.val('');
						me.setTip(me.oldpwdTip, 2, '');
						me.setTip(me.pwdTip, 2, '');
						me.setTip(me.repwdTip, 2, '');
					} else if(r.code == 1) {
						me.setTip(oldpwdTip, 0, '旧密码错误');
					} else {
						me.setTip(submitTip, 0, '密码修改失败，请重新提交');
					}
					submitBtn.prop('disabled', false);
				}
			};
			$(':input').focus(function() {
				$('#submitTip').removeClass('error').removeClass('suc').html('');
			});
			$('#changePwdForm').ajaxSubmit(options);
		}
	};
	
	
});
