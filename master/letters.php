<?
include_once __DIR__ . '../../includes/global.init.php';

if(! isLogin()) {
	$container['util']->redirect($container['WEB_ROOT'] . "login.php?back=" . $_SERVER['PHP_SELF']);
}

$tplArray['html_main'] = $container['twig']->render('master/letters.html', array());

echo $container['twig']->render('master/c_master_tpl.html', $tplArray);

?>