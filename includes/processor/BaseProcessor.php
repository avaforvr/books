<?php

interface BaseProcessor {
    public function isActive();
    public function process($params = array());
    public function render($params = array());
}
?>
