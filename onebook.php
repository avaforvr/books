<?
include_once __DIR__ . '/includes/init/global.php';

$bookId = isset($_REQUEST['book_id']) && $_REQUEST['book_id'] ? intval($_REQUEST['book_id']) : 0;
if($bookId == 0) {
	$util->redirect("index.php");
}

$container['filedao']->setExtra('browse', $bookId, 1); //总下载次数+1

//{{{ details
include_once __DIR__ . '/includes/processor/OnebookProcessor.php';
$onebook = new OnebookProcessor();
$tplArray['file'] = $onebook->process(array(
		'container' => $container,
		'bookId' => $bookId,
	));

echo $container['twig']->render('onebook.html', $tplArray);

?>