<?php
include_once __DIR__ . '/BaseDao.php';

class UserDao extends BaseDao{

    //通过 user_id 获取 user数组
	public function getUserByUid($userId) {
        $sql = "SELECT * FROM user WHERE user_id=$userId LIMIT 1";
        $user = $this->getOneRow($sql);
		return $user;
	}

    //通过 user_name 获取 user数组
	public function getUserByUname($userName) {
		$sql = "SELECT * FROM user WHERE user_name='" . $userName . "' LIMIT 1";
        $user = $this->getOneRow($sql);
        return $user;
	}

    //通过 user_email 获取 user数组
	public function getUserByUemail($userEmail) {
        $sql = "SELECT * FROM user WHERE user_email='" . $userEmail . "' LIMIT 1";
        $user = $this->getOneRow($sql);
        return $user;
	}

    //插入一条记录
	public function insertUser($user) {
		$regMoney = 5; //注册时获取的财富
		$regCtbt = 1; //注册时获取的贡献值
		
		$db = $this->db();
        $sql = "INSERT INTO user(user_name, user_email, user_pwd, user_exist, user_register_time, user_money, user_contribute, user_last_time) VALUES(?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $db->prepare($sql);
        $param = array(
            $user['user_name'],
            $user['user_email'],
            $user['user_pwd'],
            1,
            date('Y-m-d H:i:s'),
            $regMoney,
            $regCtbt,
            date('Y-m-d H:i:s')
        );

        if($stmt->execute($param)) {
            $userId = $db->lastInsertId();
			$_SESSION['user'] = $this->getUserByUid($userId);
			return true;
        } else {
			return false;
		}
	}

    //更新 user_pwd
    public function setPwd($userPwd, $userId) {
		$sql = "UPDATE user SET user_pwd='$userPwd' WHERE user_id=$userId";
		return $this->db()->exec($sql);
	}

    //更新 user_money 和 user_contribute
    public function setMoneyAndCtbt($userId, $addMoney, $addCtbt) {
		$user = $this->getUserByUid($userId);
        $umoney = $user['user_money'] + $addMoney;
        $uctbt = $user['user_contribute'] + $addCtbt;
        $sql = "UPDATE user SET
				user_money='$umoney',
				user_contribute='$uctbt'
				WHERE user_id=" . $userId;
        $this->db()->exec($sql);
	}

    //登录
    public function doLogin($user) {
		$_SESSION['user'] = $user;
		$userId = $user['user_id'];
		$now = date('Y-m-d H:i:s');
		if($now - $user['user_last_time'] > 86400) {
			$this->setMoneyAndCtbt($userId, 1, 1); //每天登录第一次，财富+1，贡献+1
		}
		$sql = "UPDATE user SET user_last_time='$now' WHERE user_id=$userId";
        $this->db()->exec($sql);
	}

    //验证 user_name 是否存在
	public function verifyUname($userName) {
		$sql = "SELECT 1 FROM user WHERE user_name = '" . $userName . "' LIMIT 1";
        return $this->isExist($sql);
	}

    //验证 user_email 是否存在
	public function verifyUemail($userEmail) {
		$sql = "SELECT 1 FROM user WHERE user_email = '" . $userEmail . "' LIMIT 1";
        return $this->isExist($sql);
	}

}
?>