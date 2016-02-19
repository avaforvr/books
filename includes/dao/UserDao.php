<?php
include_once __DIR__ . '/BaseDao.php';

class UserDao extends BaseDao{
	
	public function getUserByUid($uid) {
		$db = $this->db();
		//$sql = "SELECT * FROM users WHERE uid='$uid' LIMIT 1";
		$sql = "SELECT * FROM users WHERE uid=$uid LIMIT 1";
		$user = $db->fetchAssoc($sql);
		return $user;
	}
	
	public function getUserByUname($uname) {
		$db = $this->db();
		$sql = "SELECT * FROM users WHERE uname='" . $uname . "' LIMIT 1";
		$user = $db->fetchAssoc($sql);
		return $user;
	}
	
	public function getUserByUemail($uemail) {
		$db = $this->db();
		$sql = "SELECT * FROM users WHERE uemail='" . $uemail . "' LIMIT 1";
		$user = $db->fetchAssoc($sql);
		return $user;
	}
	
	public function insertUser($user) {
		$regMoney = 5; //注册时获取的财富
		$regCtbt = 1; //注册时获取的贡献值
		
		$db = $this->db();
		$sql = "INSERT INTO users(uname, uemail, upwd, uexist, uregtime, umoney, uctbt, ulasttime) VALUES(
			'" . $user['name'] . "',
			'" . $user['email'] . "',
			'" . $user['pwd'] . "',
			'1',
			'" . date('Y-m-d H:i:s') . "',
			'" . $regMoney . "',
			'" . $regCtbt . "',
			'" . date('Y-m-d H:i:s') . "')";
		if($db->query($sql)) {
			$uid = mysql_insert_id();
			$_SESSION['user'] = $this->getUserByUid($uid);
			return true;
		} else {
			return false;
		}
	}
	
	function setPwd($upwd, $uid) {
		$db = $this->db();
		$sql = "UPDATE users SET upwd='$upwd' WHERE uid='$uid'";
		return ($db->query($sql)) ? true : false;
	}
	
	function setMoneyAndCtbt($uid, $addMoney, $addCtbt) {
		$db = $this->db();
		$user = $this->getUserByUid($uid);
		if(! empty($user)) {
			$umoney = $user['umoney'] + $addMoney;
			$uctbt = $user['uctbt'] + $addCtbt;
			$sql = "UPDATE users SET 
				umoney='$umoney',
				uctbt='$uctbt'	
				WHERE uid=" . $uid;
			$db->query($sql);
		}
	}
	
	function doLogin($user) {
		$db = $this->db();
		$_SESSION['user'] = $user;
		$uid = $user['uid'];
		$now = date('Y-m-d H:i:s');
		if($now - $user['ulasttime'] > 86400) {
			$userdao->setMoneyAndCtbt($uid, 1, 1); //每天登录第一次，财富+1，贡献+1
		}
		$sql = "UPDATE users SET ulasttime='". date('Y-m-d H:i:s') ."' WHERE uid=$uid";
		$db->query($sql);
	}
	
	public function verifyUname($uname) {
		$db = $this->db();
		$sql = "SELECT 1 FROM users WHERE uname = '" . $uname . "' LIMIT 1";
		$isExist = $db->checkExist($sql);
		return $isExist;
	}
	
	public function verifyUemail($uemail) {
		$db = $this->db();
		$sql = "SELECT 1 FROM users WHERE uemail = '" . $uemail . "' LIMIT 1";
		$isExist = $db->checkExist($sql);
		return $isExist;
	}

}
?>