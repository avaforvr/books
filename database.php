<?
include_once __DIR__ . '/includes/init/global.php';

function createTables($container) {
    $db = $container['db'];
    $dbutil = $container['dbutil'];
	$attr_tags = $container['vars']['attr_tags'];

	//书籍信息 book
    $create_book = <<<____SQL
        CREATE TABLE IF NOT EXISTS book(
            book_id int NOT NULL AUTO_INCREMENT,
            PRIMARY KEY(book_id),
            book_name varchar(100) comment '书名',
            book_author varchar(100) comment '作者',
            book_summary text comment '简介',
            book_size int comment '文件体积',
            book_type int(2) comment '类型',
            book_style int(2) comment '文风',
            book_exist boolean comment '文件是否未删除',
            book_original_site varchar(200) comment '原创网址',
            book_uploader varchar(20) comment '上传者的user_id',
            book_upload_time timestamp comment '文件上传的时间'
        ) DEFAULT CHARSET=utf8;
____SQL;
    $db->exec($create_book);

	//书籍标签 tag
	if($dbutil->isTableExist('tag')) {
//		$res = $db->exec("SHOW COLUMNS FROM tag");
//		$existFields = array();
//		while($row = mysql_fetch_row($res)) {
//			$existFields[] = $row[0];
//		}
//		foreach($attr_tags as $key=>$tag) {
//			if(!in_array($key, $existFields)) {
//				$alter_tags = "alter table tag add " . $key . " boolean";
//				if(! $db->exec($alter_tags)){
//					return 'tag (alter)';
//				}
//			}
//		}
	} else {
		$create_tag = "CREATE TABLE IF NOT EXISTS tag(book_id int NOT NULL, PRIMARY KEY(book_id),";
		foreach($attr_tags as $key=>$tag) {
			if($key != ('t' . count($attr_tags))) {
				$create_tag .= $key . ' boolean,';
			} else {
				$create_tag .= $key . ' boolean) DEFAULT CHARSET=utf8';
			}
		}
        $db->exec($create_tag);
	}

	//用户表 user （uctbt:贡献、参与度）
    $create_user = <<<____SQL
        CREATE TABLE IF NOT EXISTS user(
            user_id int NOT NULL AUTO_INCREMENT,
            PRIMARY KEY(user_id),
            user_name varchar(20),
            user_email varchar(100),
            user_pwd varchar(16),
            user_exist boolean,
            user_register_time timestamp,
            user_money int comment '财富',
            user_contribute int comment '贡献',
            user_last_time timestamp comment '上次登录时间'
        ) DEFAULT CHARSET=utf8;
____SQL;
    $db->exec($create_user);

	//用户与书籍的关联 misc
	$create_misc = <<<____SQL
        CREATE TABLE IF NOT EXISTS misc(
            misc_id int NOT NULL AUTO_INCREMENT,
            PRIMARY KEY(misc_id),
            book_id int,
            user_id int,
            misc_down boolean,
            misc_down_time timestamp,
            misc_eva boolean,
            misc_eva_time timestamp,
            misc_browse boolean,
            misc_browse_time timestamp
        ) DEFAULT CHARSET=utf8;
____SQL;
    $db->exec($create_misc);

	//搜索 searches
	$create_searches = <<<____SQL
        CREATE TABLE IF NOT EXISTS search(
		search_id int NOT NULL AUTO_INCREMENT,
		PRIMARY KEY(search_id),
		search_key varchar(50),
		search_count int,
		search_last_time timestamp
		) DEFAULT CHARSET=utf8;
____SQL;
    $db->exec($create_searches);

	return true;
}

$initResult = createTables($container);

if($initResult === true) {
	$tplArray['html_result'] = '<div class="sucDone tac doneMt">&radic; 网站初始化成功</div>';
} else {
	$tplArray['html_result'] = '<div class="failDone tac doneMt">&times; 网站初始化失败: ' + $initResult + '</div>';
}

echo $container['twig']->render('result.html', $tplArray);

?>