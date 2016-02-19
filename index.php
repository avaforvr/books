<?
include_once __DIR__ . '/includes/global.init.php';

//{{{ fileList
include_once __DIR__ . '/includes/processor/FileListProcessor.php';
$fileList = new FileListProcessor();
$fileList->process(array(
		'container' => $container,
		'dataKey' => 'index',
	));
$tplArray['html_fileList'] = $fileList->render(array(
		'container' => $container,
		'extendClass' => ' separated',
	));
//}}}

//{{{ hotSearch
$tplArray['modClass'] = 'hotSearch';
//}}}

echo $container['twig']->render('index.html', $tplArray);

?>