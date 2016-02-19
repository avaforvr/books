define(function(require, exports, module) {

	var $ = require('../lib/jquery');
	
	//js模拟下拉框
	$.fn.selectWidget = function (obj) {
		var $sele = $(this);
		var $text = $(this).children('span');
		var $hidden = $(this).children('input[type="hidden"]');
		var $menu = $(this).children('ul');
		if ($menu.children('li').length > 10) {
			$menu.height(250);
		}

		$text.mousedown(function () {
			showMenu();
		});
		
		$menu.find('li').click(function () {
			if ($(this).children('a').length == 0) {
				$text.html($(this).html());
				$hidden.val($(this).index());
			}
			$menu.hide();
			$sele.css('z-index', '0');
			$(document).unbind('click', hideMenu);
		});

		var showMenu = function () {
			$('.sele').css('z-index', '0').find('ul').hide();
			$sele.css('z-index', '1');
			$menu.show();
			$(document).bind('click', hideMenu);
		};

		var hideMenu = function (e) {
			var src = e ? e.target : e.srcElement;
			do {
				if ($(src).closest('.sele').length > 0)
					return;
				src = src.parentNode;
			} while (src.parentNode)

			$menu.hide();
			$sele.css('z-index', '0');
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
