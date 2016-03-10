<?
include_once __DIR__ . '/includes/init/global.php';
$util = $container['util'];
$act = isset($_REQUEST['act']) && $_REQUEST['act'] ? $_REQUEST['act'] : '';
$back = isset($_REQUEST['back']) && $_REQUEST['back'] ? $_REQUEST['back'] : $WEB_ROOT;

if($act != 'logout' && $container['user']) {
    $util->redirect($back);
}

$userdao = $container['userdao'];

switch ($act) {
	case 'verifyLogin':
        $data = $util->trimArray($_POST['data']);
		$user = $userdao->getUserByUname($data['user_name']);
		$r = array('code' => 0, 'msg' =>'');
		if(! $user) {
			$r['code'] = 1;
			$r['msg'] = '该用户不存在';
		} elseif($user['user_pwd'] != $data['user_pwd']) {
			$r['code'] = 2;
			$r['msg'] = '密码错误';
		} else {
			$userdao->doLogin($user);
			$r['msg'] = '登录成功！';
			$r['user'] = $user;
			$r['back'] = $back;
		}
		echo json_encode($r);
		die();
		break;

	case 'pageRegister':
        echo $container['twig']->render('login/register.html', array('back'=>$back));
		break;

	case 'verifyRegister':
		$r = array('code' => 0, 'msg' =>'');
        $data = $util->trimArray($_POST['data']);

		if($userdao->getUserByUname($data['user_name'])) {
			$r['code'] = 1;
			$r['msg'] = '用户名已经注册';
			echo json_encode($r);
			die();
		}

		if($userdao->getUserByUemail($data['user_email'])) {
			$r['code'] = 2;
			$r['msg'] = '邮箱已经注册';
			echo json_encode($r);
			die();
		}

		if($data['user_pwd'] != $data['repwd']) {
			$r['code'] = 3;
			$r['msg'] = '密码不一致';
			echo json_encode($r);
			die();
		}

		if($userdao->insertUser($data)) {
			$r['code'] = 0;
			$r['msg'] = 'Success';
			$r['back'] = $back;
		} else {
			$r['code'] = 4;
			$r['msg'] = '数据库写入失败，请刷新后重试。';
		}
		echo json_encode($r);
        die();
        break;

	case 'pageFindPwd':
        echo $container['twig']->render('login/forgetPwd.html', array('back'=>$back));
		break;

	case 'verifyNameAndEmail':
		$r = array('code' => 0, 'msg' =>'');
        $data = $util->trimArray($_POST['data']);
		$user = $userdao->getUserByUname($data['user_name']);
		if(! $user) {
			$r['code'] = 1;
			$r['msg'] = '用户名不存在';
		} elseif($user['user_email'] != $data['user_email']) {
			$r['code'] = 2;
			$r['msg'] = '邮箱不正确';
		} else {
			$r['msg'] = '用户名存在，邮箱正确';
			$r['user_id'] = $user['user_id'];
		}
		echo json_encode($r);
		die();
		break;

	case 'verifyFindPwd':
        $data = $util->trimArray($_POST['data']);
		$result = $userdao->setPwd($data['user_pwd'], $data['user_id']);
        if($result) {
            $r = array('code' => 0, 'msg' =>'密码设置成功', 'back' => $back);
        } else {
            $r = array('code' => 1, 'msg' =>'密码设置失败，请刷新页面后重试。');
        }
        echo json_encode($r);
		die();
		break;

	case 'logout':
		unset($_SESSION['user']);
		$util->redirect($WEB_ROOT . "login.php?back=$back");
		break;

	default:
        echo $container['twig']->render('login/login.html', array('back'=>$back));
		break;
}

?>