<?
include_once __DIR__ . '../../includes/init/global.php';
$container['util']->checkLogin();

$filedao = $container['filedao'];

$act = isset($_REQUEST['act']) && $_REQUEST['act'] ? $_REQUEST['act'] : '';
switch ($act) {
	case 'pass':
		$bid = $_POST['book_id'];
		$result = $filedao->setExist($bid, 1);
		if($result) {
			$file = $filedao->getBooksByBookId($bid);
			$container['userdao']->setMoneyAndCtbt($file['user_id'], 2, 1); //上传一本新书，财富+2，贡献+1
		}
		echo $result ? 1 : 0;
		die;
	case 'repeat':
		$bid = $_POST['book_id'];
		$file = $filedao->getBooksByBookId($bid);
		$container['userdao']->setMoneyAndCtbt($file['user_id'], 0, 1); //上传一本新书，财富+0，贡献+1
		$result = $filedao->delFileByBookId($bid);
		echo $result ? 1 : 0;
		die;
	default:
		$boxList = array();
		$sql = "SELECT book_author FROM `book` WHERE book_status=2 GROUP BY book_author";
		$db = $container['db'];
		$rows = $db->fetchAssocArray($sql);
		foreach($rows as $key => $row) {
			$boxList[$key]['pending'] = array();
			$boxList[$key]['exist'] = array();
			$bauthor = $row['book_author'];
			$box_files_sql = "SELECT book_id, book_name, book_author, book_status FROM book WHERE book_author='$bauthor' ORDER BY book_upload_time DESC";
			$box_files = $db->fetchAssocArray($box_files_sql);
			foreach($box_files as $file) {
				if($file['book_status'] == 2) {
					$boxList[$key]['pending'][] = $file;
				} else {
					$boxList[$key]['exist'][] = $file;
				}
			}
		}

		$tplArray['html_main'] = $container['twig']->render('master/pending.html', array(
			'boxList' => $boxList,
			'total' => count($boxList),
			'WEB_ROOT' => $container['WEB_ROOT'],
		));
		break;
}

$tplArray['data_key'] = 'pending';

echo $container['twig']->render('master/c_master_tpl.html', $tplArray);

?>