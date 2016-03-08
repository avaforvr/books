<?
include_once __DIR__ . '../../includes/init/global.php';
$util->checkLogin();
echo $container['twig']->render('user/advices.html');
?>