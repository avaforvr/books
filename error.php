<?
include_once __DIR__ . '/includes/init/global.php';

$errorInfo = '';
echo Zandy_Template::outString('error.html', $siteConf['tplDir'], $siteConf['cacheDir']);

?>