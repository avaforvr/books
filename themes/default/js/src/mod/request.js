define(function (require, exports, module) {

	function Request() {}
	module.exports = Request;

	Request.prototype.getAll = function () {
		var url = location.search;
		var requests = new Object();
		if (url.indexOf("?") != -1) {
			var str = url.substr(1);
			strs = str.split("&");
			for (var i = 0; i < strs.length; i++) {
				requests[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
			}
		}
		return requests;
	}
	
	Request.prototype.getOne = function (key) {
		var requests = this.getAll();
		return requests[key];
	}
	
	Request.prototype.setOne = function (url, key, val) {
		var url_new = '';
		if(url.indexOf('?' + key + '=') != -1 || url.indexOf('&' + key + '=') != -1) {
			return url;
		} else if (url.indexOf('?') != -1) {
			url_new = url.replace('?', '?' + key + '=' + val + '&');
		} else if(url.indexOf('#') != -1) {
			url_new = url.replace('#', '?' + key + '=' + val + '#');
		} else {
			url_new = url + '?' + key + '=' + val;
		}
		return url_new;
	}

});
