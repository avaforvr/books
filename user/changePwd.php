<?
include_once __DIR__ . '../../includes/global.init.php';

if(! isLogin()) {
	redirect($container['WEB_ROOT'] . "login.php?back=" . $_SERVER['PHP_SELF']);
}

$act = isset($_REQUEST['act']) && $_REQUEST['act'] ? $_REQUEST['act'] : '';

switch ($act) {
	case 'changePwd':
		$r = array('code' => 0, 'msg' => '');
		$oldpwd = trim($_POST['oldpwd']);
		if($oldpwd !== $_SESSION['user']['upwd']) {
			$r['code'] = 1;
			$r['msg'] = 'The Old Password is wrong.';
		} else {
			$upwd = trim($_POST['pwd']);
			if($container['userdao']->setPwd($upwd, $_SESSION['user']['uid'])) {
				$_SESSION['user']['upwd'] = $upwd;
				$r['code'] = 0;
				$r['msg'] = 'Success.';
			} else {
				$r['code'] = 2;
				$r['msg'] = 'Something is wrong.';
			}
		}
		echo json_encode($r);
		die();
		break;
	default:
		break;
}

$tplArray['data_key'] = 'changePwd';

$tplArray['html_main'] = $container['twig']->render('user/changePwd.html', array());

echo $container['twig']->render('user/c_user_tpl.html', $tplArray);
?>