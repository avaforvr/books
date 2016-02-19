<?php
class Db {
	var $link_id = NULL;
	var $db_name = '';
	
	function __construct($siteConf) {
		$this->init($siteConf);
	}
	
	function init($siteConf) {
		if($this->link_id) {
            $this->close();
        }
		if(!($this->link_id = mysql_connect($siteConf['db_host'], $siteConf['db_user'], $siteConf['db_pass']))) {
			die('Could not connect: ' . mysql_error());
		}		
		mysql_query("set names 'utf8'");   
		mysql_query("set character_set_client=utf8");   
		mysql_query("set character_set_results=utf8");   
		mysql_select_db($siteConf['db_name'], $this->link_id);
		$this->db_name = $siteConf['db_name'];
	}
	
	function query($sql) {
		return mysql_query($sql, $this->link_id);
	}
	
	function close() {
        return mysql_close($this->link_id);
    }
	
	function fetchAssoc($sql) {
		$arr = array();
		if($res = $this->query($sql)) {
			while($row = mysql_fetch_assoc($res)) {
				$arr = $row;
			}
		}
		return $arr;
	}
	
	function fetchAssocArray($sql) {
		$arr = array();
		if($res = $this->query($sql)) {
			while($row = mysql_fetch_assoc($res)) {
				$arr[] = $row;
			}
		}
		return $arr;
	}
	
	function checkExist($sql) {
		if($res = $this->query($sql)) {
			while($row = mysql_fetch_assoc($res)) {
				if($row[1]) {
					return true;
				}
			}
		}
		return false;
	}
	
	function getCount($sql) {
		if($res = $this->query($sql)) {
			if($row = mysql_fetch_row($res)) {
				$total = $row[0];
			}
		}
		return $total;
	}
	
	function isTableExist($tablename) {
		$sql = "SHOW TABLES FROM " . $this->db_name;
		$res = $this->query($sql);
		if($res) {
			while($row = mysql_fetch_row($res)) {
				if($tablename == $row[0]) {
					return true;
				}
			}
		}
		return false;		
	}
	
}

/*
$db = new Db($db_host, $db_user, $db_pass, $db_name);
$sql = "";
$db->query($sql);
$db->close();
*/
?>