<?
include_once __DIR__ . '/includes/init/global.php';

//{{{ fileList
include_once __DIR__ . '/includes/processor/FileListProcessor.php';
$fileList = new FileListProcessor();
$fileList->process(array('dataKey' => 'index'));
$tplArray['fileList'] = $fileList->render();
//}}}

//{{{ hotSearch
$tplArray['modClass'] = 'hotSearch';
//}}}

echo $container['twig']->render('index.html', $tplArray);

?>