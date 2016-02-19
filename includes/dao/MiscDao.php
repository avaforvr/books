<?php
include_once __DIR__ . '/BaseDao.php';

class MiscDao extends BaseDao{

	public function setRecord($key, $bid, $uid) {
		$db = $this->db();
		$sql = "SELECT * FROM `misc` WHERE bid=$bid AND uid=$uid LIMIT 1";
		$row = $db->fetchAssoc($sql);
		if(empty($row)) {
			$sql = "INSERT INTO misc(bid, uid) VALUES($bid, $uid);";
			$db->query($sql);
			$mid = mysql_insert_id();
			$row['meva'] = 0;
			$row['mdown'] = 0;
		} else {
			$mid = $row['mid'];
		}
		
		if($key == 'down') {
			$sql = "UPDATE `misc` SET mdown=1, mdowntime='" . date('Y-m-d H:i:s') . "' WHERE mid=$mid";
			$result = 1;
		} else if($key == 'eva') {
			if($row['meva']) {
				if($row['mdown']) {
					$sql = "UPDATE `misc` SET meva=0, mevatime='" . date('Y-m-d H:i:s') . "' WHERE mid=$mid";
					$result = 0;
				} else {
					$sql = "DELETE FROM `misc` WHERE mid=$mid";
					$result = 0;
				}
			} else {
				$sql = "UPDATE `misc` SET meva=1, mevatime='" . date('Y-m-d H:i:s') . "' WHERE mid=$mid";
				$result = 1;
			}
		}
		$db->query($sql);
		return $result; //操作结果是加1还是减1
	}

}
?>