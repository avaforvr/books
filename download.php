<?
include_once __DIR__ . '/includes/init/global.php';
$container['util']->checkLogin();

$bid = isset($_REQUEST['book_id']) && $_REQUEST['book_id'] ? intval($_REQUEST['book_id']) : 0;
if($bid == 0) {
	$util->redirect("index.php");
}

$file = $container['filedao']->getOneBook($bid);
$filePath = $container['ROOT_PATH'] . $file['book_path'];
$fileName = basename($filePath);

if(file_exists(toGb($filePath))) {
	
	$userId = $_SESSION['user']['user_id'];
	$container['userdao']->setMoneyAndCtbt($userId, -1, 0); //下载，财富-1，贡献+0
	$container['filedao']->setExtra('down', $bid, 1); //总下载次数+1
	$container['miscdao']->setRecord('down', $bid, $userId); //记录

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