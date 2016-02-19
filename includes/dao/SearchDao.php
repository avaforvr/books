<?php
include_once __DIR__ . '/BaseDao.php';

class SearchDao extends BaseDao{

	public function getRecordBySkey($skey) {
		$db = $this->db();
		$sql = "SELECT * FROM searches WHERE skey='$skey' LIMIT 1";
		$record = $db->fetchAssoc($sql);
		return $record;
	}

	public function setRecord($skey) {
		$db = $this->db();
		$record = $this->getRecordBySkey($skey);
		if(empty($record)) {
			$sql = "INSERT INTO searches(skey, scount, slasttime) VALUES('$skey', 1, '" . date('Y-m-d H:i:s') . "')";
			$db->query($sql);
			$sid = mysql_insert_id();
		} else {
			$sql = "UPDATE searches SET 
					scount=scount+1,
					slasttime='" . date('Y-m-d H:i:s') . "' 
					WHERE skey='$skey'";
			$db->query($sql);
			$sid = $record['sid'];
		}
		return $sid;
	}
	
	public function getCacheFile($sid) {
		$container = $this->container;
		$file_path = $container['path']['caches'] . 'searches/sid_' . $sid . '.json';
		if(file_exists($file_path)) {
			return $file_path;
		} else {
			return false;
		}
	}
	
	public function createCacheFile($sid, $bids) {
		$db = $this->db();
		$container = $this->container;
		$file_path = $container['path']['caches'] . 'searches/sid_' . $sid . '.json';
		
		//$filedao = $container['filedao'];
		$file_cont = array();
		foreach($bids as $bid) {
			$sql = "SELECT bid,bsize,beva,btime FROM books WHERE bid = $bid LIMIT 1";
			$row = $db->fetchAssoc($sql);
			$file_cont[] = json_encode($row);
		}
		$file_cont = json_encode($file_cont);
		file_put_contents($file_path, $file_cont);
		return $file_path;
	}
	
	public function createTmpBooks($sid, $cache_file) {
		$db = $this->db();
		$tmpbooks = 'tmp_books_' . $sid;
		
		//删除临时表
		$drop_sql = 'DROP TABLE $tmpbooks';
		$db->query($drop_sql);
		
		//创建临时表
		$create_sql = "CREATE TEMPORARY TABLE IF NOT EXISTS $tmpbooks(
						bid int NOT NULL,
						PRIMARY KEY(bid),
						bsize int, 
						beva int,
						btime timestamp
						)";
		$db->query($create_sql);
		
		//插入数据
		$file_cont = file_get_contents($cache_file);
		$file_cont = json_decode($file_cont, true);
		foreach($file_cont as $row) {
			$row = json_decode($row, true);
			$insert_sql = "INSERT INTO $tmpbooks(bid, bsize, beva, btime) VALUES(
				" . $row['bid'] . ",
				" . $row['bsize'] . ",
				" . $row['beva'] . ",
				'" . $row['btime'] . "')";
			$db->query($insert_sql);
		}
		return $tmpbooks;
	}
}
?>