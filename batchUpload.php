<?
include_once __DIR__ . '/includes/init/global.php';
$util->checkLogin($container);

include_once __DIR__ . '/includes/processor/UploadProcessor.php';
$upload = new UploadProcessor();

$tplArray = array(
    'attr_type' => $container['vars']['attr_type'],
    'attr_style' => $container['vars']['attr_style'],
    'attr_tags' => $container['vars']['attr_tags']
);

$act = isset($_REQUEST['act']) && $_REQUEST['act'] ? $_REQUEST['act'] : '';
switch ($act) {
	case 'verifyDir':
        if(empty($_POST['dir'])) {
            break;
        }
        $dir = $_POST['dir'];
		$result = $upload->process(array(
				'act' => $act,
				'dir' => $dir,
			));
        $tplArray['dir'] = $dir;
        $tplArray['result'] = $result;
		break;

	case 'batchUpload':
		$result = $upload->process(array(
				'act' => $act,
				'dir' => $_POST['dir'],
				'book_type' => $_POST['book_type'],
				'btags' => isset($_POST['btags']) ? $_POST['btags'] : array(),
			));
		echo json_encode($result);
        die();
		break;
	default:

		break;
}
echo $container['twig']->render('batchUpload.html', $tplArray);
?>