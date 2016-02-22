<?php
$container['ROOT_PATH'] = str_replace('includes/init/path.php', '', str_replace('\\', '/', __FILE__));

if ($_SERVER['DOCUMENT_ROOT'] != "") {
    $WEB_ROOT = substr(realpath(dirname(__FILE__) . '/../../'), strlen(realpath($_SERVER['DOCUMENT_ROOT'])));
    if (trim($WEB_ROOT, '/\\')) {
        $WEB_ROOT = '/' . trim($WEB_ROOT, '/\\') . '/';
    } else {
        $WEB_ROOT = '/';
    }
} else {
    $WEB_ROOT = "/";
}
$container['WEB_ROOT'] = $WEB_ROOT;

?>