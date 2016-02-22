<?
include_once __DIR__ . '/includes/init/global.php';

if(! isLogin()) {
	$container['util']->redirect($container['WEB_ROOT'] . "login.php?back=" . $_SERVER['PHP_SELF']);
}

$bid = isset($_REQUEST['bid']) && $_REQUEST['bid'] ? intval($_REQUEST['bid']) : 0;
if($bid == 0) {
	$container['util']->redirect("index.php");
}

$act = isset($_REQUEST['act']) && $_REQUEST['act'] ? $_REQUEST['act'] : '';

switch ($act) {
	case 'editInfo':
		$file = $_POST['bookInfo'];
		$file['bname'] = trim($file['bname']);
		$file['bauthor'] = trim($file['bauthor']);
		$file['bsummary'] = trim($file['bsummary']);
		$file['brole'] = trim($file['brole']);
		$file['borig'] = trim($file['borig']);
		$isok = $container['filedao']->setFileByBid($file['bid'], $file);
		if($isok) {
			$container['util']->redirect('onebook.php?bid='. $bid);
		} else {
			$container['util']->redirect('editbook.php?bid=' . $bid);
		}
		break;
	default:
		$file = $container['filedao']->getFileByBid($bid);
	
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