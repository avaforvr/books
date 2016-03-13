<?php
use \PDO;

abstract class BaseDao{
    public $container;

    public function __construct($container){
        $this->container = $container;
    }

    public function db(){
        return $this->container['db'];
    }

    public function getOneRow($sql) {
        $stmt = $this->db()->query($sql);
        $stmt->setFetchMode(PDO::FETCH_ASSOC);
        $row = $stmt->fetch();
        return $row;
    }

    public function getAllRows($sql, $mode=PDO::FETCH_ASSOC) {
        $stmt = $this->db()->query($sql);
        $stmt->setFetchMode($mode);
        $rows = $stmt->fetchAll();
        return $rows;
    }

    public function isExist($sql) {
        $stmt = $this->db()->query($sql);
        return $stmt->fetch() ? true : false;
    }

    public function getCount($sql) {
        $stmt = $this->db()->query($sql);
        $stmt->setFetchMode(PDO::FETCH_NUM);
        $count = $stmt->fetch();
        return $count[0];
    }


}

?>