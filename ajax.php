<?
include_once __DIR__ . '/includes/global.init.php';

$act = isset($_REQUEST['act']) && $_REQUEST['act'] ? $_REQUEST['act'] : '';

switch ($act) {
	case 'setEva':
		$result = array('code' => 0, 'msg' => '');
		
		if(! isLogin()) {
			$result['code'] = 1;
			$result['msg'] = 'Please login first.';
		} else {
			$uid = $_SESSION['user']['uid'];
			$bid = $_POST['bid'];
			$record_result = $container['miscdao']->setRecord('eva', $bid, $uid); //更新misc记录
			$container['filedao']->setExtra('eva', $bid, $record_result); //好评总数更新
			if($record_result){
				$container['userdao']->setMoneyAndCtbt($uid, 0, 1); //好评，财富+0，贡献+1，取消好评不加财富
				$result['msg'] = 'Success plus.';
				$result['isplus'] = 1;
			} else {
				$result['msg'] = 'Success reduce.';
				$result['isplus'] = 0;
			}
		}
		
		echo json_encode($result);
		die();
		break;
	case 'delFile':
		$bid = $_POST['bid'];
		$result = $container['filedao']->setExist($bid, 0);
		echo $result ? 1 : 0;
		break;
	default:
		break;
}

?>