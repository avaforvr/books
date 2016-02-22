<?php
// COOKIE_DOMAIN
defined('COOKIE_DOMAIN') || define('COOKIE_DOMAIN', '.' . $siteConf['SITE_DOMAIN']);
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

?>