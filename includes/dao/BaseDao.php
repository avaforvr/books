<?php
use \PDO;

abstract class BaseDao{
    public $container;

    public function __construct($container){
        $this->container = $container;
    }

    protected function db(){
        return $this->container['db'];
    }

    protected function getOneRow($sql) {
        $stmt = $this->db()->query($sql);
        $stmt->setFetchMode(PDO::FETCH_ASSOC);
        $row = $stmt->fetch();
        return $row;
    }

    protected function getAllRows($sql) {
        $stmt = $this->db()->query($sql);
        $stmt->setFetchMode(PDO::FETCH_ASSOC);
        $rows = $stmt->fetchAll();
        return $rows;
    }

    protected function isExist($sql) {
        $stmt = $this->db()->query($sql);
        return $stmt->fetch() ? true : false;
    }
}

?>