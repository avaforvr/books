<?
include_once __DIR__ . '/includes/init/global.php';

$act = isset($_REQUEST['act']) && $_REQUEST['act'] ? $_REQUEST['act'] : '';
$back = isset($_REQUEST['back']) && $_REQUEST['back'] ? $_REQUEST['back'] : $WEB_ROOT;

if($act != 'logout' && $container['login']) {
    $container['util']->redirect($back);
}


$tplArray['data_key'] = 'login';
$tplArray['html_page_content'] = $container['twig']->render('login/login.html', array('WEB_ROOT' => $container['WEB_ROOT'], 'back'=> $back));

$userdao = $container['userdao'];

switch ($act) {
	case 'verifyLogin':
		$uname = trim($_POST['name']);
		$upwd = trim($_POST['pwd']);
		$user = $userdao->getUserByUname($uname);
		
		$r = array('code' => 0, 'msg' =>'');
		if(empty($user)) {
			$r['code'] = 1;
			$r['msg'] = 'The user name is inexistence.';
		} elseif($user['upwd'] != $upwd) {
			$r['code'] = 2;
			$r['msg'] = 'The password is wrong.';
		} else {
			$userdao->doLogin($user);
			$r['msg'] = 'Success.';
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
		
		$uname = trim($_POST['name']);
		$user = $userdao->getUserByUname($uname);
		if(! empty($user)) {
			$r['code'] = 1;
			$r['msg'] = 'Your name already exists.';
			echo json_encode($r);
			die();
		}
		
		$uemail = trim($_POST['email']);
		$user = $userdao->getUserByUemail($uemail);
		if(! empty($user)) {
			$r['code'] = 2;
			$r['msg'] = 'Your email already exists.';
			echo json_encode($r);
			die();
		}
		
		$upwd = trim($_POST['pwd']);
		$urepwd = trim($_POST['repwd']);
		if($upwd != $urepwd) {
			$r['code'] = 3;
			$r['msg'] = 'The two passwords you typed do not match.';
			echo json_encode($r);
			die();
		}
		
		$user['name'] = trim($_POST['name']);
		$user['email'] = trim($_POST['email']);
		$user['pwd'] = trim($_POST['pwd']);
		if($userdao->insertUser($user)) {
			$r['code'] = 0;
			$r['msg'] = 'Success';
			$r['back'] = $back;
		} else {
			$r['code'] = 4;
			$r['msg'] = 'Something is wrong.';
		}
		echo json_encode($r);
		die();
		break;
	case 'pageFindPwd':
		$tplArray['html_page_content'] = $container['twig']->render('login/forgetPwd.html', array('WEB_ROOT' => $container['WEB_ROOT'], 'back'=> $back));
		$tplArray['data_key'] = 'forgetPwd';
		break;
	case 'verifyName':
		$uname = trim($_POST['name']);
		$isExist = $userdao->verifyUname($uname);
		echo $isExist ? 1 : 0;
		die();
		break;
	case 'verifyEmail':
		$uemail = trim($_POST['email']);
		$isExist = $userdao->verifyUemail($uemail);
		echo $isExist ? 1 : 0;
		die();
		break;
	case 'verifyNameAndEmail':
		$r = array('code' => 0, 'msg' =>'');
		$uname = trim($_POST['name']);
		$uemail = trim($_POST['email']);		
		$user = $userdao->getUserByUname($uname);
		if(empty($user)) {
			$r['code'] = 1;
			$r['msg'] = '用户名不存在';
		} elseif($user['uemail'] != $uemail) {
			$r['code'] = 2;
			$r['msg'] = '邮箱不正确';
		} else {
			$r['code'] = 0;
			$r['msg'] = '用户名存在，邮箱正确';
			$r['uid'] = $user['uid'];
		}
		echo json_encode($r);
		die();
		break;
	case 'verifyFindPwd':
		$uid = trim($_POST['uid']);
		$upwd = trim($_POST['pwd']);
		$isSuc = $userdao->setPwd($upwd, $uid);
		echo $isSuc ? 1 : 0;
		die();
		break;
	case 'logout':
		unset($_SESSION['user']);
		$container['util']->redirect($WEB_ROOT . "login.php?back=$back");
		break;
	default:
        echo $container['twig']->render('login/login.html', array('back'=>$back));
		break;
}

?>