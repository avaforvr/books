<?
include_once __DIR__ . '/includes/init/global.php';

if(! isLogin()) {
	$util->redirect($container['WEB_ROOT'] . "login.php?back=" . $_SERVER['PHP_SELF']);
}

$bid = isset($_REQUEST['book_id']) && $_REQUEST['book_id'] ? intval($_REQUEST['book_id']) : 0;
if($bid == 0) {
	$util->redirect("index.php");
}

$act = isset($_REQUEST['act']) && $_REQUEST['act'] ? $_REQUEST['act'] : '';

switch ($act) {
	case 'editInfo':
		$file = $_POST['bookInfo'];
		$file['book_name'] = trim($file['book_name']);
		$file['book_author'] = trim($file['book_author']);
		$file['book_summary'] = trim($file['book_summary']);
		$file['brole'] = trim($file['brole']);
		$file['book_original_site'] = trim($file['book_original_site']);
		$isok = $container['filedao']->setFileByBookId($file['book_id'], $file);
		if($isok) {
			$util->redirect('onebook.php?book_id='. $bid);
		} else {
			$util->redirect('editbook.php?book_id=' . $bid);
		}
		break;
	default:
		$file = $container['filedao']->getFileByBookId($bid);
	
		$tags_with_state = array();
		$attr_tags = $container['vars']['attr_tags'];
		foreach($attr_tags as $key=>$tag) {
			$tags_with_state[$key]['text'] = $tag;
			$tags_with_state[$key]['checked'] = empty($file['btags'][$key]) ? '' : ' checked';
		}
		
		$tplArray['file'] = $file;
		$tplArray['tags_with_state'] = $tags_with_state;
		break;
}

$tplArray['attr_type'] = $container['vars']['attr_type'];
$tplArray['attr_style'] = $container['vars']['attr_style'];
$tplArray['attr_tags'] = $container['vars']['attr_tags'];

echo $container['twig']->render('editbook.html', $tplArray);

?>