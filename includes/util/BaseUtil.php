<?php
abstract class BaseUtil{
    public $container;

    public function __construct($container){
        $this->container = $container;
    }
}

?>