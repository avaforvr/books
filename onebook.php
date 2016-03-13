<?
include_once __DIR__ . '/includes/init/global.php';
$util = $container['util'];
$bookId = isset($_REQUEST['book_id']) && $_REQUEST['book_id'] ? intval($_REQUEST['book_id']) : 0;
if($bookId == 0) {
    $util->redirect("index.php");
}

$fileDao = $container['filedao'];
$file = $fileDao->getShowBook($bookId);

if(! empty($file) && $file['book_status'] != 0) {
    $content = $util->toUtf8(file_get_contents($file['book_path']));
    $lines = explode("\r\n", $content);
    $filePreview = '';
    foreach($lines as $key => $line) {
        if($key == 29) {
            $filePreview = $filePreview . '<p>' . $line . '...' . '</p>';
        } else if($key < 29) {
            $filePreview = $filePreview . '<p>' . $line . '</p>';
        } else {
            break;
        }
    }
    $file['filePreview'] = $filePreview;
}

echo $container['twig']->render('onebook.html', array('file'=>$file));

?>