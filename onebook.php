<?
include_once __DIR__ . '/includes/global.init.php';

$bid = isset($_REQUEST['bid']) && $_REQUEST['bid'] ? intval($_REQUEST['bid']) : 0;
if($bid == 0) {
	redirect("index.php");
}

$container['filedao']->setExtra('browse', $bid, 1); //总下载次数+1

//{{{ details
include_once __DIR__ . '/includes/processor/OnebookProcessor.php';
$onebook = new OnebookProcessor();
$tplArray['file'] = $onebook->process(array(
		'container' => $container,
		'bid' => $bid,
	));

echo $container['twig']->render('onebook.html', $tplArray);

?>