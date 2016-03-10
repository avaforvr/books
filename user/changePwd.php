<?
include_once __DIR__ . '../../includes/init/global.php';
$util = $container['util'];
$util->checkLogin();

$act = isset($_REQUEST['act']) && $_REQUEST['act'] ? $_REQUEST['act'] : '';

if($act == 'changePwd') {
    $r = array();
    $data = $util->trimArray($_POST['data']);

    if($data['oldpwd'] !== $_SESSION['user']['user_pwd']) {
        $r['code'] = 1;
        $r['msg'] = '旧密码错误，请重新输入';
    } else if($data['oldpwd'] == $data['user_pwd']) {
        $r['code'] = 2;
        $r['msg'] = '新密码不能与旧密码相同';
    } else if($data['repwd'] != $data['user_pwd']) {
        $r['code'] = 3;
        $r['msg'] = '两次输入的新密码不一致';
    } else {
        if($container['userdao']->setPwd($data['user_pwd'], $_SESSION['user']['user_id'])) {
            $r['code'] = 0;
            $r['msg'] = '修改成功';
            $_SESSION['user']['user_pwd'] = $data['user_pwd'];
        } else {
            $r['code'] = 4;
            $r['msg'] = '密码修改失败，请刷新后重试';
        }
    }

    echo json_encode($r);
    die();
}

echo $container['twig']->render('user/changePwd.html');
?>