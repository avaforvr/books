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
	case 'verifyAtta':
		$result = $uploador->process(array(
				'container' => $container,
				'act' => $act,
				'attachment' => $_FILES["attachment"],
			));
		echo json_encode($result);
		die();
		break;
	case 'uploadNew':
		$file = $_POST['bookInfo'];
		$file['bname'] = trim($file['bname']);
		$file['bauthor'] = trim($file['bauthor']);
		$file['bsummary'] = trim($file['bsummary']);
		$file['brole'] = trim($file['brole']);
		$file['borig'] = trim($file['borig']);
		$bid = $uploador->process(array(
				'container' => $container,
				'act' => $act,
				'file' => $file,
			));
		if(! $bid) {
			$tplArray['html_uploadResult'] = '<div class="failDone tac">&times; 上传失败</div>'; 
		} else {
			$tplArray['html_uploadResult'] = '<div class="sucDone tac">&radic; 上传成功</div>';
		}
		break;
	default:
		break;
}

$tplArray['attr_type'] = $container['vars']['attr_type'];
$tplArray['attr_style'] = $container['vars']['attr_style'];
$tplArray['attr_tags'] = $container['vars']['attr_tags'];

echo $container['twig']->render('upload.html', $tplArray);

?>