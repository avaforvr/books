<?php
require_once __DIR__ . '/siteConf.php';

//encoding
header("Content-type: text/html; Charset=utf-8");

//timezone
date_default_timezone_set('Asia/Shanghai');

//COOKIE_DOMAIN
require_once __DIR__ . '/cookie.php';

//error report
error_reporting($siteConf['DEBUG_MODE'] ? E_ALL : E_ALL & ~E_NOTICE & ~E_STRICT & ~E_DEPRECATED);

//Initializer
require_once __DIR__ . '../../../vender/Pimple.php';
$container = new Pimple();

require_once __DIR__ . '/path.php';

require_once __DIR__ . '/Initializer.php';
$baseinit = new Initializer();
$container = $baseinit->initConf($container);
$container = $baseinit->initPath($container);
$container = $baseinit->initVars($container);
$container = $baseinit->initBase($container);
$container = $baseinit->initUtil($container);
$container = $baseinit->initTwig($container);

?>