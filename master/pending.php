<?
include_once __DIR__ . '../../includes/init/global.php';
$util = $container['util'];
$util->checkLogin();

$filedao = $container['filedao'];
$userdao = $container['userdao'];

$act = isset($_REQUEST['act']) && $_REQUEST['act'] ? $_REQUEST['act'] : '';
switch ($act) {
	case 'pass':
        $bookIds = $_POST['bookIds'];
		$result = $filedao->updateBookStatus($bookIds, 1);

		if($result) {
            $count = count($bookIds);
            $userdao->setMoneyAndCtbt($container['user']['user_id'], 2*$count, $count); //上传一本新书，财富+2，贡献+1
            echo 1;
		} else {
            echo 0;
        }
		break;

	case 'repeat':
		$bookId = $_POST['bookId'];
        $result = $filedao->delBook($bookId);
        if($result) {
            $userdao->setMoneyAndCtbt($container['user']['user_id'], 0, 1); //上传一本新书，财富+0，贡献+1
            echo 1;
        } else {
            echo 0;
        }
        break;

	default:
        $filedao = $container['filedao'];
		$sql = "SELECT book_author FROM `book` WHERE book_status=2 GROUP BY book_author LIMIT 10";
        $rows = $filedao->getAllRows($sql);
        $list = array();

        if(! empty($rows)) {
            $authors = $util->flatArray($rows);

            $sql = "SELECT book_id, book_name, book_author, book_status FROM book WHERE book_author IN (" . $util->getSqlValues($authors) . ") AND book_status!=0 ORDER BY book_upload_time DESC";
            $box_files = $filedao->getAllRows($sql);


            foreach($authors as $key=>$author) {
                $list[$key]['book_author'] = $author;
                $list[$key]['pending'] = array();
                $list[$key]['exist'] = array();
            }
            foreach($box_files as $file) {
                $key = $util->getKeyByValue($file['book_author'], $authors);
                if($file['book_status'] == 2) {
                    $list[$key]['pending'][] = $file;
                } else {
                    $list[$key]['exist'][] = $file;
                }
            }
        }

        echo $container['twig']->render('master/pending.html', array('list'=>$list));
		break;
}

?>