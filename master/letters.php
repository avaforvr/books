<?
include_once __DIR__ . '../../includes/init/global.php';
$container['util']->checkLogin();

$tplArray['html_main'] = $container['twig']->render('master/letters.html', array());

echo $container['twig']->render('master/c_master_tpl.html', $tplArray);

?>