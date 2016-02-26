$.fn.formCheck = function (items, params) {
	if (!params) {
        params = {};
    }

	params.rules = $.extend({
			'null' : function (obj, checks) {
				return $.trim($(obj).val()).length > 0
			},
			'select' : function (obj, checks) {
				return $(obj).val() != checks.value
			},
			'checked' : function (obj, checks) {
				return obj.checked
			},
			'maxlength' : function (obj, checks) {
				return $.trim($(obj).val()).length <= checks.maxlength
			},
			'minlength' : function (obj, checks) {
				return $.trim($(obj).val()).length >= checks.minlength
			},
			'digitMinlength' : function (obj, checks) {
				return $.trim($(obj).val().replace(/[^0-9]/g, '')).length >= checks.minlength
			},
			'user' : function (obj, checks) {
				return /^[a-zA-Z0-9]{3,10}$/.test($.trim($(obj).val()))
			},
            'password' : function (obj, checks) {
                return /^(?!\d)[a-zA-Z0-9_]{6,16}$/.test($.trim($(obj).val()))
            },
            'rePpassword': function (obj, checks) {
                return $.trim($(obj).val()) == $.trim($(checks.compare).val());
            },
			'email' : function (obj, checks) {
				return /(\,|^)([\w+._]+@\w+\.(\w+\.){0,3}\w{2,4})/.test($(obj).val().replace(/-|\//g, ''))
			},
			'phone' : function (obj, checks) {
				return /^[\d-\s]{1,20}$/.test($(obj).val()) && $.trim($(obj).val()).replace(/[\s]+/g, ' ').length <= checks.maxlength
			},
			'number' : function (obj, checks) {
				return /^[0-9]+$/.test($.trim($(obj).val()))
			}
		}, params.rules);

	var result = true;
	function checkItem(item, checks) {
		for (j in checks) {
			if (params.rules[checks[j].type]) {
                if (params.rules[checks[j].type](item, checks[j])) {
                    if(checks[j].showSuccess) {
                        checks[j].showSuccess();
                    } else if(params.showSuccess) {
                        params.showSuccess($(item), checks[j].errMsg);
                    }
                    continue;
                }
            }
			if (checks[j].showError) {
				checks[j].showError();
				result = false;
				break
			} else if (params.showError) {
				params.showError($(item), checks[j].errMsg);
				result = false;
				break
			} else if (checks[j].errMsg) {
				alert(checks[j].errMsg);
				return false
			}
		};
		return true
	};

	for (i = 0; i < this[0].length; i++) {
		if ($(this[0][i]).attr('name') && $(this[0][i]).attr('name').length == 0 || $(this[0][i]).prop('disabled'))
			continue;
		var checks = items[$(this[0][i]).attr('name')];
		if (!checks)
			continue;
		if (!checkItem(this[0][i], checks))
			return false
	};
	return result
};