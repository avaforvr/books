<?
include_once __DIR__ . '/includes/init/global.php';
$util = $container['util'];
$util->checkLogin();

$bookId = isset($_REQUEST['book_id']) && $_REQUEST['book_id'] ? intval($_REQUEST['book_id']) : 0;
if($bookId == 0) {
	$util->redirect("user/records.php?act=upload");
}

$act = isset($_REQUEST['act']) && $_REQUEST['act'] ? $_REQUEST['act'] : '';

switch ($act) {
	case 'editBook':
        $data = $util->trimArray($_POST['data']);
		$isSuccess = $container['filedao']->updateBook($data['book_id'], $data);
        echo json_encode($isSuccess ? array('code'=>0) : array('code'=>1));
		break;

	default:
		$file = $container['filedao']->getOneBook($bookId);

        echo $container['twig']->render('editbook.html', array(
            'attr_type' => $container['vars']['attr_type'],
            'attr_style' => $container['vars']['attr_style'],
            'attr_tags' => $container['vars']['attr_tags'],
            'file' => $file
        ));
		break;
}
?>