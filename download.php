<?
include_once __DIR__ . '/includes/init/global.php';
$util = $container['util'];
$util->checkLogin($_SERVER['HTTP_REFERER']);

$bookId = isset($_REQUEST['book_id']) && $_REQUEST['book_id'] ? intval($_REQUEST['book_id']) : 0;
if($bookId == 0) {
	$util->redirect("index.php");
}

$file = $container['filedao']->getOneBook($bookId);
$filePath = $file['book_path'];
$fileName = basename($filePath);

if(file_exists($filePath)) {
	
	$userId = $container['user']['user_id'];
	$container['userdao']->setMoneyAndCtbt($userId, -1, 0); //下载，财富-1，贡献+0
	$container['miscdao']->setMisc($bookId, 'misc_down' , 1);; //记录

	header("Content-type: text/plain");
	
	$userAgent = $_SERVER["HTTP_USER_AGENT"];
	if (preg_match("/MSIE/", $userAgent)) {
		header('Content-Disposition: attachment; filename="' . $fileName . '"');
	} else if (preg_match("/Firefox/", $userAgent)) {  
		header('Content-Disposition: attachment; filename="' . $fileName . '"');
	} else {  
		header("Content-Disposition: attachment; filename=" . $util->toUtf8($fileName));
	}

	readfile($filePath);
	
} else {
	die();
}

?>