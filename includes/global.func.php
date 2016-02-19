<?php
function p() {
	$argvs = func_get_args();
	echo "<div style=\"text-align: left;\">\r\n";
	foreach ($argvs as $v) {
		echo "<xmp>";
		print_r($v);
		echo "</xmp>\r\n";
	}
	echo "\r\n</div>\r\n";
}

function redirect($url, $die = true) {
	if(strpos($url, 'error.php') !== false) {
		$url .= '&url=' . urlencode($_SERVER['REQUEST_URI']);
	}
	header("location: $url");
	if($die)
		die();
}

//encoding
function toUtf8($str) {
	try{
		$encode = mb_detect_encoding($str, array('ASCII','GB2312','GBK','UTF-8')); 
		$str = iconv($encode,'utf-8//IGNORE', $str);
		return $str;
	} catch(Exception $e) {
		var_dump($e);
	}
}
function arrToUtf8($arr) {
	foreach($arr as $key => $value) {
		if(is_array($value)) {
			$arr[$key] = arrToUtf8($value);
		} else {
			$arr[$key] = toUtf8($value);
		}
	}
	return $arr;
}

function toGb($str) {
	$str = iconv('UTF-8','gbk//IGNORE', $str);
	return $str;
}

/**
 * $str 原始中文字符串
 * $encoding 原始字符串的编码，默认GBK
 * $prefix 编码后的前缀，默认"&#"
 * $postfix 编码后的后缀，默认";"
 */
function unicode_encode($str, $encoding = 'utf-8', $prefix = '&#', $postfix = ';') {
    $str = iconv($encoding, 'UCS-2', $str);
    $arrstr = str_split($str, 2);
    $unistr = '';
    for($i = 0, $len = count($arrstr); $i < $len; $i++) {
        $dec = hexdec(bin2hex($arrstr[$i]));
        $unistr .= $prefix . $dec . $postfix;
    } 
    return $unistr;
} 
 
/**
 * $str Unicode编码后的字符串
 * $decoding 原始字符串的编码，默认GBK
 * $prefix 编码字符串的前缀，默认"&#"
 * $postfix 编码字符串的后缀，默认";"
 */
function unicode_decode($unistr, $encoding = 'GBK', $prefix = '&#', $postfix = ';') {
    $arruni = explode($prefix, $unistr);
    $unistr = '';
    for($i = 1, $len = count($arruni); $i < $len; $i++) {
        if (strlen($postfix) > 0) {
            $arruni[$i] = substr($arruni[$i], 0, strlen($arruni[$i]) - strlen($postfix));
        } 
        $temp = intval($arruni[$i]);
        $unistr .= ($temp < 256) ? chr(0) . chr($temp) : chr($temp / 256) . chr($temp % 256);
    } 
    return iconv('UCS-2', $encoding, $unistr);
}

function arrToJson($arr) {
	//$arr = arrToUtf8($arr);
	return json_encode($arr);
}

//file size to [M, K, B]
function transSize($size){ 
	if($size >= 1024*1024) {
		return number_format($size/(1024*1024), 1) . ' M';
	} else if($size >= 1024) {
		return round($size/1024) . ' K';
	} else {
		return $size . ' B';
	}
}

//show summary with line feeds
function dataToHtml($str){ 
	$newStr = str_replace("\r\n", "<br>", $str);
	return $newStr;
}

//get key according to value
function getKeyByValue($str, $arr){
	foreach($arr as $key => $value) {
		if($str == $value) {
			return $key;
		}
	}
}

//删除url中的参数
function remove_param_in_url($url, $pkey, $append = false) {
	if (is_array($pkey)) {
		foreach ($pkey as $v) {
			$preg = '/[\?|&](' . preg_quote($v, '/') . '=([^&=]*))/';
			$m = null;
			preg_match_all($preg, $url, $m);
			if (isset($m[1]) && is_array($m[1])) {
				foreach ($m[1] as $v) {
					$url = str_replace($v, "", $url);
				}
			}
			$url = str_replace(array(
				"?&", 
				"&&"
			), array(
				"?", 
				"&"
			), $url);
			$r = rtrim($url, ' &?');
			if ($append) {
				if (strpos($r, '?') === false)
					$r .= '?';
				if (substr($r, -1) != '?' && substr($r, -1) != '&')
					$r .= '&';
			}
		}
	} else {
		$pkey = (string) $pkey;
		$preg = '/[\?|&](' . preg_quote($pkey, '/') . '=([^&=]*))/';
		$m = null;
		preg_match_all($preg, $url, $m);
		if (isset($m[1]) && is_array($m[1])) {
			foreach ($m[1] as $v) {
				$url = str_replace($v, "", $url);
			}
		}
		$url = str_replace(array(
			"?&", 
			"&&"
		), array(
			"?", 
			"&"
		), $url);
		$r = rtrim($url, ' &?');
		if ($append) {
			if (strpos($r, '?') === false)
				$r .= '?';
			if (substr($r, -1) != '?' && substr($r, -1) != '&')
				$r .= '&';
		}
	}
	return $r;
}

function getPageString($page, $url, $filesTotal, $pageSize) {
	$pageString = '';
	
	$url = remove_param_in_url($_SERVER['REQUEST_URI'], array('page'), true) . 'page=';

	if($filesTotal > $pageSize) {
		$pageTotal = ceil($filesTotal / $pageSize);
		if($page != 1) {
			$pageString .= '<a class="pre" href="' . $url . ($page - 1) . '">' . '上一页' . '</a>';
		}
		$pageString .= '<div class="sele"><span>' . $page . '</span><ul>';
		for($i = 1; $i <= $pageTotal; $i ++) {
			$pageString .= '<li><a href="' . $url . $i . '">' . $i . '</a></li>';
		}
		$pageString .= '</ul></div>';
		if($page != $pageTotal) {
			$pageString .= '<a class="next" href="' . $url . ($page + 1) . '">' . '下一页' . '</a>';
		}
	}
	$pageString = '<div class="pages">' . $pageString . '</div>';
	return $pageString;
}

function isLogin() {
	if(isset($_SESSION['user']) && !empty($_SESSION['user']) && $_SESSION['user']['uid'] > 0) {
		return true;
	} else {
		return false;
	}
}

function getTplArray($container) {
	$tplArray = array(
			'WEB_ROOT' => $container['WEB_ROOT'],
			'CSS_PATH' => $container['path']['css'],
			'JS_PATH' => $container['path']['js'],
			'IMG_PATH' => $container['path']['img'],
			'DEBUG_MODE' => $container['siteConf']['DEBUG_MODE'],
			'REQUEST_URI' => urlencode($_SERVER['REQUEST_URI']),
			'last_v' => $container['siteConf']['last_v'],
		);

	if(isLogin()) {
		$tplArray['is_login'] = true;
		$tplArray['user_name'] = $_SESSION['user']['uname'];
	} else {
		$tplArray['is_login'] = false;
	}
	
	return $tplArray;
}

?>