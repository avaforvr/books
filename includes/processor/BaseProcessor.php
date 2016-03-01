<?php
abstract class BaseProcessor {
    public $container;

    public function __construct(){
        global $container;
        $this->container = $container;
    }

    public function isActive() {
        return true;
    }
    public function process() {}
    public function render(){}
}
?>
