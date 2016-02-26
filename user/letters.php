<?
include_once __DIR__ . '../../includes/init/global.php';
$util->checkLogin($container);
echo $container['twig']->render('user/letters.html');
?>