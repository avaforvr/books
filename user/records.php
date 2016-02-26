<?
include_once __DIR__ . '../../includes/init/global.php';
$util->checkLogin($container);

//include_once __DIR__ . '../../includes/file.func.php';
$userId = $_SESSION['user']['user_id'];
$filedao = $container['filedao'];
$act = isset($_REQUEST['act']) && $_REQUEST['act'] ? $_REQUEST['act'] : '';
$acts = array(
	'upload' => '上传',
	'download' => '下载',
	'favorable' => '好评',
);

switch ($act) {
	case 'upload':
		$sql = "SELECT book_id FROM book WHERE user_id=$userId ORDER BY book_upload_time DESC";
		break;
	case 'download':
		$sql = "SELECT book_id FROM misc WHERE mdown=1 AND user_id=$userId ORDER BY mid DESC";
		break;
	case 'favorable':
		$sql = "SELECT book_id FROM misc WHERE meva=1 AND user_id=$userId ORDER BY mid DESC";
		break;
	default:
		$util->redirect($container['WEB_ROOT'] . "user/index.php");
		break;
}

$bids = $filedao->getBookIds($sql);
$fileList = $filedao->getFilesByBookIds($bids);

echo $container['twig']->render('user/records.html', array(
    'act_translate' => $acts[$act],
    'fileList' => $fileList,
    'total' => count($fileList),
    'WEB_ROOT' => $container['WEB_ROOT'],
));
?>