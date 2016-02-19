<?php
require_once __DIR__ . '/config.env.php';

// encoding
header("Content-type: text/html; Charset=utf-8");

//timezone
date_default_timezone_set('Asia/Shanghai');

// COOKIE_DOMAIN
defined('COOKIE_DOMAIN') || define('COOKIE_DOMAIN', '.' . SITE_DOMAIN);
defined('COOKIE_EXPIRE') || define('COOKIE_EXPIRE', 2592000); // 60*60*24*30
defined('COOKIE_PATH') || define('COOKIE_PATH', '/');
defined('SESSION_NAME') || define('SESSION_NAME', 'AIRID');
// @ini_set('memory_limit', '16M');
@ini_set('session.cache_expire', 1800);
@ini_set('session.gc_maxlifetime', COOKIE_EXPIRE);
@ini_set('session.cookie_lifetime', COOKIE_EXPIRE);
@ini_set('session.use_trans_sid', 0);
@ini_set('session.use_cookies', 1);
@ini_set('session.auto_start', 0);
@ini_set('session.cookie_domain', COOKIE_DOMAIN);
@ini_set('session.cookie_path', COOKIE_PATH);
defined('SESSION_NAME') && @ini_set('session.name', SESSION_NAME);
session_start();

error_reporting($DEBUG_MODE ? E_ALL : E_ALL & ~E_NOTICE & ~E_STRICT & ~E_DEPRECATED);

//Initializer
require_once __DIR__ . '../../vender/Pimple.php';
$container = new Pimple();

$container['ROOT_PATH'] = str_replace('includes/global.init.php', '', str_replace('\\', '/', __FILE__));
if ($_SERVER['DOCUMENT_ROOT'] != "") {
	$WEB_ROOT = substr(realpath(dirname(__FILE__) . '/../'), strlen(realpath($_SERVER['DOCUMENT_ROOT'])));
	if (trim($WEB_ROOT, '/\\')) {
		$WEB_ROOT = '/' . trim($WEB_ROOT, '/\\') . '/';
	} else {
		$WEB_ROOT = '/';
	}
} else {
	$WEB_ROOT = "/";
}
$container['WEB_ROOT'] = $WEB_ROOT;

require_once __DIR__ . '/Initializer.php';
$baseinit = new Initializer();
$container = $baseinit->initConf($container);
$container = $baseinit->initPath($container);
$container = $baseinit->initTwig($container);
$container = $baseinit->initVars($container);
$container = $baseinit->initBase($container);

//common functions
require_once __DIR__ . '/global.func.php';

//variable for common parts of pages
$tplArray = getTplArray($container);

?>