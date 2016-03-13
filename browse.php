<?
include_once __DIR__ . '/includes/init/global.php';

//{{{ 类型、文风筛选
$tplArray['attr_type'] = $container['vars']['attr_type'];
$tplArray['attr_style'] = $container['vars']['attr_style'];
//}}}

//{{{ fileList
$act = isset($_REQUEST['act']) && $_REQUEST['act'] ? $_REQUEST['act'] : '';
include_once __DIR__ . '/includes/processor/FileListProcessor.php';
$fileList = new FileListProcessor();
$fileList->process(array(
		'dataKey' => 'browse',
		'act' => $act,
		'page' => isset($_REQUEST['page']) && $_REQUEST['page'] ? $_REQUEST['page'] : '1',
		'sortBy' => isset($_REQUEST['sortby']) && $_REQUEST['sortby'] ? $_REQUEST['sortby'] : '1',
		'pageSize' => 20,
	));
$tplArray['fileList'] = $fileList->render(array(
		'listClass' => 'list-d',
	));
//}}}

echo $container['twig']->render('browse.html', $tplArray);

?>