<?
include_once __DIR__ . '/includes/init/global.php';
$util->checkLogin($container);

$act = isset($_REQUEST['act']) && $_REQUEST['act'] ? $_REQUEST['act'] : '';

//测试 filedao
//include_once __DIR__ . '/includes/test/testFileDao.php';

//{{{ Upload Processor
include_once __DIR__ . '/includes/processor/UploadProcessor.php';
$upload = new UploadProcessor();
//}}}

switch ($act) {
	case 'verifyAtta':
		$result = $upload->process(array(
				'container' => $container,
				'act' => $act,
				'attachment' => $_FILES["attachment"],
			));
		echo json_encode($result);
		die();
		break;
	case 'uploadNew':
		$file = $_POST['bookInfo'];
		$file['book_name'] = trim($file['book_name']);
		$file['book_author'] = trim($file['book_author']);
		$file['book_summary'] = trim($file['book_summary']);
		$file['brole'] = trim($file['brole']);
		$file['book_original_site'] = trim($file['book_original_site']);
		$bid = $upload->process(array(
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

echo $container['twig']->render('upload.html', array(
    'attr_type' => $container['vars']['attr_type'],
    'attr_style' => $container['vars']['attr_style'],
    'attr_tags' => $container['vars']['attr_tags']
));

?>