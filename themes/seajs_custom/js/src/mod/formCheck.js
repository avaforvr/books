//表单验证
define(function(require, exports, module) {

	var $ = require('$');
	
	module.exports.checkKeyForm = function() {
		var sbkey = $('input[name="sbkey"]').val();
		if(sbkey == '请输入关键字' || sbkey == ' ') {
			alert('请输入关键字');
			return false;
		}
		return true;
	};
	
	module.exports.checkFilterForm = function() {
		var isTrue = false;
		$('#filterForm .sele input[type="hidden"]').each(function(index, element) {
			if($(element).val() != 0) {
				isTrue = true;
			}
		});
		if(isTrue) {
			return true;
		} else {
			alert('请选择筛选条件');
			return false;
		}		
	};
	
	//upload and edit file
	module.exports.checkFileForm = function() {
		var bname = $('input[name="bname"]');
		var bauthor = $('input[name="bauthor"]');
		var btype = $('input[name="btype"]');
		var btags = $('input[name="btags[]"]:checked');
		if(! bname.val()) {
			$('#bnameTip').html('请填写书名').addClass('error').show();
			bname.focus(function() {
				$('#bnameTip').html('').removeClass('error').hide();
			})
			return false;
		}
		if(! bauthor.val()) {
			$('#bauthorTip').html('请填写作者').addClass('error').show();
			bauthor.focus(function() {
				$('#bauthorTip').html('').removeClass('error').hide();
			});
			return false;
		}
		if(btype.val() == 0) {
			$('#btypeTip').html('请选择分类').addClass('error').show();
			btype.next().mousedown(function() {
				$('#btypeTip').html('').removeClass('error').hide();
			});
			return false;
		}
		if(btags.length > 5) {
			$('#btagsTip').html('标签不能超过5个').addClass('error').show();
			btags.click(function() {
				$('#btagsTip').html('').removeClass('error').hide();
			});
			return false;
		}		
		return true;
	};
	
});
