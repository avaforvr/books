<?php
include_once __DIR__ . '/BaseUtil.php';

class Util extends BaseUtil {
    //调试代码
    //-------------------------------------------------------------------
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

    //页面跳转
    //-------------------------------------------------------------------
    function redirect($url, $isDie = true) {
        if (strpos($url, 'error.php') !== false) {
            $url .= '&url=' . urlencode($_SERVER['REQUEST_URI']);
        }
        header("location: $url");
        if ($isDie) {
            die();
        }
    }

    function checkLogin($backUrl='') {
        $container = $this->container;
        if (!$container['user']) {
            if($backUrl == '') {
                $this->redirect($container['WEB_ROOT'] . "login.php?back=" . $_SERVER['REQUEST_URI']);
            } else {
                $this->redirect($container['WEB_ROOT'] . "login.php?back=" . $backUrl);
            }
        }
    }

    //Encoding
    //-------------------------------------------------------------------
    function toUtf8($str) {
        try {
            $encode = mb_detect_encoding($str, array('ASCII', 'GB2312', 'GBK', 'UTF-8'));
            $str = iconv($encode, 'utf-8//IGNORE', $str);
            $str = str_replace('・', '·', $str);
            $str = str_replace('―', '—', $str);
            return $str;
        } catch (Exception $e) {
            var_dump($e);
        }
    }

    function toGb($str) {
        $str = iconv('UTF-8', 'gbk//IGNORE', $str);
        return $str;
    }

    function arrToUtf8($arr) {
        foreach ($arr as $key => $value) {
            if (is_array($value)) {
                $arr[$key] = arrToUtf8($value);
            } else {
                $arr[$key] = toUtf8($value);
            }
        }
        return $arr;
    }

    /* TODO: 没用到

     * $str 原始中文字符串
     * $encoding 原始字符串的编码，默认GBK
     * $prefix 编码后的前缀，默认"&#"
     * $postfix 编码后的后缀，默认";"

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

     * $str Unicode编码后的字符串
     * $decoding 原始字符串的编码，默认GBK
     * $prefix 编码字符串的前缀，默认"&#"
     * $postfix 编码字符串的后缀，默认";"

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
     */

    //字符串及数值转换
    //file size to [M, K, B]
    function transSize($size) {
        if ($size >= 1024 * 1024) {
            return number_format($size / (1024 * 1024), 1) . ' M';
        } else if ($size >= 1024) {
            return round($size / 1024) . ' K';
        } else {
            return $size . ' B';
        }
    }

    //数组转换成sql需要的组合
    function getSqlFields($arr) {
        $fields = array();
        foreach($arr as $field) {
            $fields[] = "`" . $field . "`";
        }
        return join(',', $fields);
    }
    function getSqlValues($arr) {
        $values = array();
        foreach($arr as $value) {
            $values[] = "'" . addslashes($value) . "'";
        }
        return join(',', $values);
    }

    //数组操作
    //-------------------------------------------------------------------
    function trimArray($arr) {
        foreach ($arr as $key => $value) {
            if (is_array($value)) {
                $arr[$key] = $this->trimArray($value);
            } else {
                $arr[$key] = trim($value);
            }
        }
        return $arr;
    }

    //get key according to value
    function getKeyByValue($str, $arr) {
        foreach ($arr as $key => $value) {
            if ($str == $value) {
                return $key;
            }
        }
    }

    //数组扁平化，获取最低端的字符串组成的数组
    function flatArray($arr) {
        $flat = array();
        foreach ($arr as $value) {
            if (is_array($value)) {
                $flatSub = $this->flatArray($value);
            } else {
                $flat[] = $value;
            }
            if(! empty($flatSub)) {
                foreach($flatSub as $flatSubValue){
                    $flat[] = $flatSubValue;
                }
            }
        }
        return $flat;
    }

    //文件操作
    //-------------------------------------------------------------------
    //文件解压缩
    function zipExtract($zipPath, $extractTo) {
        include $this->container['ROOT_PATH'] . 'vendor/pclzip/pclzip.lib.php';
        $archive = new PclZip($zipPath);
        if ($archive->extract(PCLZIP_OPT_PATH, $extractTo,
                PCLZIP_OPT_REMOVE_PATH, 'install/release') == 0
        ) {
            die("Error : " . $archive->errorInfo(true));
        }
    }

    //其它
    //-------------------------------------------------------------------
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
            $pkey = (string)$pkey;
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

    //生成翻页代码
    function getPager($currentPage, $url, $filesTotal, $pageSize) {
        $baseUrl = $this->remove_param_in_url($url, array('page'), true) . 'page=';
        $firstPageUrl = $this->remove_param_in_url($url, array('page'), false);

        if ($filesTotal > $pageSize) {
            $pageTotal = ceil($filesTotal / $pageSize);
            return $this->container['twig']->render("mod/pager.html", array(
                'baseUrl' => $baseUrl,
                'firstPageUrl' => $firstPageUrl,
                'pageTotal' => $pageTotal,
                'currentPage' => $currentPage,
            ));
        } else {
            return '';
        }
    }

}

?>