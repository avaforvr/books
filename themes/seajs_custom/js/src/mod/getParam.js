define(function (require, exports, module) {

	module.exports.getParamVal = function (paramName) {
		paramVal = "";
		isFound = false;
		if (window.location.search.indexOf("?") == 0 && window.location.search.indexOf("=") > 1) {
			arrSource = unescape(window.location.search).substring(1, window.location.search.length).split("&");
			i = 0;
			while (i < arrSource.length && !isFound) {
				if (arrSource[i].indexOf("=") > 0) {
					if (arrSource[i].split("=")[0].toLowerCase() == paramName.toLowerCase()) {
						paramVal = arrSource[i].split("=")[1];
						isFound = true;
					}
				}
				i++;
			}
		}
		return paramVal;
	}

});
