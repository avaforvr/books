<?
include_once __DIR__ . '/includes/global.init.php';

$errorInfo = '';
echo Zandy_Template::outString('error.html', $siteConf['tplDir'], $siteConf['cacheDir']);

?>