define(function(require, exports, module) {

	var $ = require('jquery');
	
	//js模拟下拉框
	$.fn.selectWidget = function (obj) {
		var $sele = $(this);
		var $text = $(this).children('span');
		var $hidden = $(this).children('input[type="hidden"]');
		var $menu = $(this).children('ul');
		var liHeight = $menu.children('li:eq(1)').outerHeight();
		if ($menu.children('li').length > 10) {
			$menu.height(liHeight * 10 - 1);
		}

		$text.mousedown(function () {
			showMenu();
		});
		
		$menu.find('li').click(function () {
			if ($(this).children('a').length == 0) {
				$text.html($(this).html());
				$hidden.val($(this).index());
			}
			$sele.removeClass('active');
			$(document).unbind('click', hideMenu);
		});

		var showMenu = function () {
			$('.sele').removeClass('active');
			$sele.addClass('active');
			$(document).bind('click', hideMenu);
		};

		var hideMenu = function (e) {
			var src = e ? e.target : e.srcElement;
			do {
				if ($(src).closest('.sele').length > 0)
					return;
				src = src.parentNode;
			} while (src.parentNode)

			$sele.removeClass('active');
			$(document).unbind('click', hideMenu);
		};
	};
	
	//初始化下拉框
	$.fn.selectInit = function (obj) {
		var $sele = $(this);
		var $text = $(this).children('span');
		var $hidden = $(this).children('input[type="hidden"]');
		var initVal = (obj && obj.val) ? obj.val : '0';
		var initStr = (obj && obj.str) ? obj.str : '-';
		$hidden.val(initVal);
		$text.html(initStr);
		$sele.selectWidget();
	};
	
});
