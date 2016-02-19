<?
include_once __DIR__ . '../../includes/global.init.php';

if(! isLogin()) {
	redirect($container['WEB_ROOT'] . "login.php?back=" . $_SERVER['PHP_SELF']);
}

$filedao = $container['filedao'];

$act = isset($_REQUEST['act']) && $_REQUEST['act'] ? $_REQUEST['act'] : '';
switch ($act) {
	case 'pass':
		$bid = $_POST['bid'];
		$result = $filedao->setExist($bid, 1);
		if($result) {
			$file = $filedao->getBooksByBid($bid);
			$container['userdao']->setMoneyAndCtbt($file['uid'], 2, 1); //上传一本新书，财富+2，贡献+1
		}
		echo $result ? 1 : 0;
		die;
	case 'repeat':
		$bid = $_POST['bid'];
		$file = $filedao->getBooksByBid($bid);
		$container['userdao']->setMoneyAndCtbt($file['uid'], 0, 1); //上传一本新书，财富+0，贡献+1
		$result = $filedao->delFileByBid($bid);
		echo $result ? 1 : 0;
		die;
	default:
		$boxList = array();
		$sql = "SELECT bauthor FROM `books` WHERE bexist=2 GROUP BY bauthor";
		$db = $container['db'];
		$rows = $db->fetchAssocArray($sql);
		foreach($rows as $key => $row) {
			$boxList[$key]['pending'] = array();
			$boxList[$key]['exist'] = array();
			$bauthor = $row['bauthor'];
			$box_files_sql = "SELECT bid, bname, bauthor, bexist FROM books WHERE bauthor='$bauthor' ORDER BY btime DESC";
			$box_files = $db->fetchAssocArray($box_files_sql);
			foreach($box_files as $file) {
				if($file['bexist'] == 2) {
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