<?
include_once __DIR__ . '/includes/global.init.php';

function createTables($container) {
		
	$db = $container['db'];
	$attr_tags = $container['vars']['attr_tags'];
	
	//书籍信息 books
	$create_books = "CREATE TABLE IF NOT EXISTS books(
		bid int NOT NULL AUTO_INCREMENT,
		PRIMARY KEY(bid),
		bname varchar(100) comment '书名',
		bauthor varchar(100) comment '作者',
		bsummary text comment '简介',
		brole varchar(100) comment '主角',
		bsize int comment '文件体积', 
		btype int(2) comment '类型',
		bstyle int(2) comment '文风',
		bexist boolean comment '文件是否未删除',
		bformat varchar(10) comment '文件格式',
		borig varchar(200) comment '原创网址',
		uid varchar(20) comment '上传者的uid',
		btime timestamp comment '文件上传的时间',
		beva int comment '好评数',
		bdown int comment '下载数',
		bbrowse int comment '浏览数'
		) DEFAULT CHARSET=utf8";
	if(! $db->query($create_books)){
		return 'books (create)';
	}
	
	//书籍标签 tags
	if($db->isTableExist('tags')) {
		$res = $db->query("SHOW COLUMNS FROM tags");
		$existFields = array();
		while($row = mysql_fetch_row($res)) {
			$existFields[] = $row[0];
		}
		foreach($attr_tags as $key=>$tag) {
			if(!in_array($key, $existFields)) {
				$alter_tags = "alter table tags add " . $key . " boolean";
				if(! $db->query($alter_tags)){
					return 'tags (alter)';
				}
			}
		}
	} else {
		$create_tags = "CREATE TABLE IF NOT EXISTS tags(bid int NOT NULL, PRIMARY KEY(bid),";
		foreach($attr_tags as $key=>$tag) {
			if($key != ('t' . count($attr_tags))) {
				$create_tags .= $key . ' boolean,';
			} else {
				$create_tags .= $key . ' boolean) DEFAULT CHARSET=utf8';
			}
		}
		if(! $db->query($create_tags)){
			return 'tags (create)';
		}
	}
	
	//用户表 users （uctbt:贡献、参与度）
	$create_users = "CREATE TABLE IF NOT EXISTS users(
		uid int NOT NULL AUTO_INCREMENT,
		PRIMARY KEY(uid),
		uname varchar(20),
		uemail varchar(100),
		upwd varchar(16),
		uexist boolean,
		uregtime timestamp,
		umoney int comment '财富',
		uctbt int comment '贡献',
		ulasttime timestamp comment '上次登录时间'
		) DEFAULT CHARSET=utf8";
	if(! $db->query($create_users)){
		return 'users (create)';
	}
	
	//用户与书籍的关联 misc
	$create_misc = "CREATE TABLE IF NOT EXISTS misc(
		mid int NOT NULL AUTO_INCREMENT,
		PRIMARY KEY(mid),
		bid int,
		uid int,
		mdown boolean,
		mdowntime timestamp,
		meva boolean,
		mevatime timestamp,
		mbrowse boolean,
		mbrowsetime timestamp
		) DEFAULT CHARSET=utf8";
	if(! $db->query($create_misc)){
		return 'misc (create)';
	}
	
	//搜索 searches
	$create_searches = "CREATE TABLE IF NOT EXISTS searches(
		sid int NOT NULL AUTO_INCREMENT,
		PRIMARY KEY(sid),
		skey varchar(50),
		scount int,
		slasttime timestamp
		) DEFAULT CHARSET=utf8";
	if(! $db->query($create_searches)){
		return 'searches (create)';
	}
	
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