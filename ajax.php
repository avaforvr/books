<?
include_once __DIR__ . '/includes/init/global.php';

$act = isset($_REQUEST['act']) && $_REQUEST['act'] ? $_REQUEST['act'] : '';

switch ($act) {
	case 'like':
		if(! $container['user']) {
            $result = array('code' => 1, 'msg' => '为了更好的用户体验，请登录网站~');
		} else {

            $bookId = $_GET['bookId'];
            $likeVal = $_GET['likeVal'];
            $userId = $container['user']['user_id'];
            $record_result = $container['miscdao']->setMisc($bookId, 'misc_like' , $likeVal);; //更新misc记录
            if($likeVal === 1) {
                $container['userdao']->setMoneyAndCtbt($userId, 0, 1); //好评，财富+0，贡献+1，取消好评不加财富
            }
            $result = array('code' => 0, 'msg' => '操作成功');
		}
		
		echo json_encode($result);
		break;

	default:
		break;
}

?>