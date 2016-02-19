<?
include_once __DIR__ . '/includes/global.init.php';

//{{{ 类型、文风筛选
$tplArray['attr_type'] = $container['vars']['attr_type'];
$tplArray['attr_style'] = $container['vars']['attr_style'];
//}}}

//{{{ 热门搜索：
$tplArray['modClass'] = 'sbHot';
//}}}

//{{{ fileList
include_once __DIR__ . '/includes/processor/FileListProcessor.php';
$fileList = new FileListProcessor();
$fileList->process(array(
		'container' => $container,
		'dataKey' => 'browse',
		'act' => isset($_REQUEST['act']) && $_REQUEST['act'] ? $_REQUEST['act'] : '',
		'page' => isset($_REQUEST['page']) && $_REQUEST['page'] ? $_REQUEST['page'] : '1',
		'sortBy' => isset($_REQUEST['sortby']) && $_REQUEST['sortby'] ? $_REQUEST['sortby'] : '1',
		'pageSize' => 20,
	));
$tplArray['html_fileList'] = $fileList->render(array(
		'container' => $container,
		'extendClass' => ' listing',
	));
//}}}

echo $container['twig']->render('browse.html', $tplArray);

?>