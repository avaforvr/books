<?
include_once __DIR__ . '/includes/global.init.php';

$bid = isset($_REQUEST['bid']) && $_REQUEST['bid'] ? intval($_REQUEST['bid']) : 0;
if($bid == 0) {
	redirect("index.php");
}

if(! isLogin()) {
	redirect($container['WEB_ROOT'] . "login.php?back=" . $_SERVER['PHP_SELF']);
}

$file = $container['filedao']->getFileByBid($bid);
$filePath = $container['ROOT_PATH'] . $file['bpath'];
$fileName = basename($filePath);

if(file_exists(toGb($filePath))) {
	
	$uid = $_SESSION['user']['uid'];
	$container['userdao']->setMoneyAndCtbt($uid, -1, 0); //下载，财富-1，贡献+0
	$container['filedao']->setExtra('down', $bid, 1); //总下载次数+1
	$container['miscdao']->setRecord('down', $bid, $uid); //记录

	header("Content-type: text/plain");
	
	$userAgent = $_SERVER["HTTP_USER_AGENT"];
	if (preg_match("/MSIE/", $userAgent)) {
		header('Content-Disposition: attachment; filename="' . toGb($fileName) . '"');  
	} else if (preg_match("/Firefox/", $userAgent)) {  
		header('Content-Disposition: attachment; filename="' . $fileName . '"');
	} else {  
		header("Content-Disposition: attachment; filename=" . $fileName);
	}

	readfile(toGb($filePath));
	
} else {
	die();
}

?>