<?php
use \PDO;
use \PDOException;

class Mysql {
	function __construct($siteConf) {
		$this->init($siteConf);
	}

    public static function init($siteConf) {
        try {
            $dbh = new PDO("mysql:host={$siteConf['db_host']};charset=utf8;dbname={$siteConf['db_name']}",
                $siteConf['db_user'], $siteConf['db_pass']);
            $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            return $dbh;
        } catch (PDOException $e) {
            echo 'Create database connection failed.';
            die;
        }
	}
}
?>