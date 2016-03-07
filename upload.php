<?
include_once __DIR__ . '/includes/init/global.php';
$util->checkLogin($container);

include_once __DIR__ . '/includes/processor/UploadProcessor.php';
$upload = new UploadProcessor();

$act = isset($_REQUEST['act']) && $_REQUEST['act'] ? $_REQUEST['act'] : '';
switch ($act) {
	case 'verifyAtta':
        $result = $upload->verifyAtta($_FILES["attachment"]);
		echo json_encode($result);
		break;

	case 'uploadOneBook':
        $data = $util->trimArray($_POST['data']);
        $bookId = $upload->uploadOneBook($data);
        if($bookId) {
            $result = array('code'=>0, 'msg'=>'上传成功', 'book_id'=>$bookId);
        } else {
            $result = array('code'=>1, 'msg'=>'上传失败，请重新上传');
        }
        echo json_encode($result);
		break;

    case 'batchUpload':
        $data = $util->trimArray($_POST['data']);
        $files = json_decode($data['files'], TRUE);
        $bookTags = isset($data['book_tags']) ? join('|', $data['book_tags']) : '';
        foreach($files as $key => $file) {
            $files[$key]['book_type'] = $data['book_type'];
            $files[$key]['book_style'] = $data['book_style'];
            if($bookTags != '') {
                $files[$key]['book_tags'] = $bookTags;
            }
        }
        if($upload->batchUpload($files)) {
            $result = array('code'=>0, 'msg'=>'上传成功');
        } else {
            $result = array('code'=>1, 'msg'=>'上传失败');
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