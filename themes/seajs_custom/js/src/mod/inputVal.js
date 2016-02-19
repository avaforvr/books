//输入框友好提示
define(function(require, exports, module) {

	var $ = require('$');
	
	function InputVal(container, tip) {
		 this.container = $(container);
		 this.tip = tip;
		 this.initClass = 'ini';
	}
	module.exports = InputVal;
	
	InputVal.prototype.init = function() {
		var container = this.container;
		var tip = this.tip;
		var initClass = this.initClass;
		
		if (container.val() == tip) {
			container.addClass(initClass);
		}
		container.focus(function () {
			container.removeClass(initClass);
			if (container.val() == tip) {
				container.val('');
			}
		});
		container.blur(function () {
			if (container.val() == '') {
				container.addClass(initClass).val(tip);
			}
		});
	}
	
});
