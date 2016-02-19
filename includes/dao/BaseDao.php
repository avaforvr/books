<?php

abstract class BaseDao{
    public $container;

    public function __construct($container){
        $this->container = $container;
    }

    protected function db(){
        return $this->container['db'];
    }
}

?>