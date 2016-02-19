<?
include_once __DIR__ . '/includes/global.init.php';

if(! isLogin()) {
	redirect($container['WEB_ROOT'] . "login.php?back=" . $_SERVER['PHP_SELF']);
}

$act = isset($_REQUEST['act']) && $_REQUEST['act'] ? $_REQUEST['act'] : '';

//{{{ Upload Processor
include_once __DIR__ . '/includes/processor/UploadProcessor.php';
$uploador = new UploadProcessor();
//}}}

switch ($act) {
	case 'verifyDir':
		$result = $uploador->process(array(
				'container' => $container,
				'act' => $act,
				'dir' => $_POST['dir'],
			));
		echo json_encode($result);
		die();
		break;
	case 'batchUpload':
		$result = $uploador->process(array(
				'container' => $container,
				'act' => $act,
				'dir' => $_POST['dir'],
				'btype' => $_POST['btype'],
				'btags' => isset($_POST['btags']) ? $_POST['btags'] : array(),
			));
		echo json_encode($result);
		die();
		break;
	default:
		break;
}

$tplArray['attr_type'] = $container['vars']['attr_type'];
$tplArray['attr_tags'] = $container['vars']['attr_tags'];

echo $container['twig']->render('batchUpload.html', $tplArray);
?>