<?
include_once __DIR__ . '../../includes/global.init.php';

if(! isLogin()) {
	redirect($container['WEB_ROOT'] . "login.php?back=" . $_SERVER['PHP_SELF']);
}

//include_once __DIR__ . '../../includes/file.func.php';
$uid = $_SESSION['user']['uid'];
$filedao = $container['filedao'];
$act = isset($_REQUEST['act']) && $_REQUEST['act'] ? $_REQUEST['act'] : '';
$acts = array(
	'upload' => '上传',
	'download' => '下载',
	'favorable' => '好评',
);

switch ($act) {
	case 'upload':
		$sql = "SELECT bid FROM books WHERE uid=$uid ORDER BY btime DESC";
		break;
	case 'download':
		$sql = "SELECT bid FROM misc WHERE mdown=1 AND uid=$uid ORDER BY mid DESC";
		break;
	case 'favorable':
		$sql = "SELECT bid FROM misc WHERE meva=1 AND uid=$uid ORDER BY mid DESC";
		break;
	default:
		redirect($container['WEB_ROOT'] . "user/index.php");
		break;
}

$bids = $filedao->getBids($sql);
$fileList = $filedao->getFilesByBids($bids);

$tplArray['html_main'] = $container['twig']->render('user/records.html', array(
	'act_translate' => $acts[$act],
	'fileList' => $fileList,
	'total' => count($fileList),
	'WEB_ROOT' => $container['WEB_ROOT'],
));

echo $container['twig']->render('user/c_user_tpl.html', $tplArray);
?>