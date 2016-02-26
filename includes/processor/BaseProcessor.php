<?php
abstract class BaseProcessor {
    public $container;

    public function __construct($container){
        $this->container = $container;
    }

    public function isActive() {
        return true;
    }
    public function process() {}
    public function render(){}
}
?>
