<?
include_once __DIR__ . '/includes/init/global.php';
$util->checkLogin($container);

include_once __DIR__ . '/includes/processor/UploadProcessor.php';
$upload = new UploadProcessor();

$act = isset($_REQUEST['act']) && $_REQUEST['act'] ? $_REQUEST['act'] : '';
switch ($act) {
	case 'verifyAtta':
		$result = $upload->process(array(
				'container' => $container,
				'act' => $act,
				'attachment' => $_FILES["attachment"],
			));
		echo json_encode($result);
		break;

	case 'uploadNewBook':
        $data = $util->trimArray($_POST['data']);
        $bookId = $upload->process(array(
				'container' => $container,
				'act' => $act,
				'file' => $data,
			));

        if($bookId) {
            $result = array('code'=>0, 'msg'=>'上传成功', 'book_id'=>$bookId);
        } else {
            $result = array('code'=>1, 'msg'=>'上传失败，请重新上传');
        }

        echo json_encode($result);
		break;

	default:
        echo $container['twig']->render('upload.html', array(
            'attr_type' => $container['vars']['attr_type'],
            'attr_style' => $container['vars']['attr_style'],
            'attr_tags' => $container['vars']['attr_tags']
        ));
		break;
}
?>