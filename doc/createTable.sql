-- 书籍信息 book
CREATE TABLE IF NOT EXISTS book(
	book_id int NOT NULL AUTO_INCREMENT,
	PRIMARY KEY(book_id),
	book_name varchar(100) comment '书名',
	book_author varchar(100) comment '作者',
	book_summary text comment '简介',
	book_size int comment '文件体积',
	book_type int(2) comment '类型',
	book_style int(2) comment '文风',
	book_tags varchar(20) comment '标签',
	book_status int(2) comment '文件状态',
	book_original_site varchar(200) comment '原创网址',
	book_uploader varchar(20) comment '上传者的user_id',
	book_upload_time timestamp comment '文件上传的时间'
) DEFAULT CHARSET=utf8;

-- 用户 user
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

-- 用户与书籍的关联 misc
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

-- 搜索 searches
CREATE TABLE IF NOT EXISTS search(
	search_key varchar(50) NOT NULL,
	PRIMARY KEY(search_key),
	search_count int,
	search_last_time timestamp
) DEFAULT CHARSET=utf8;

-- 保存后台配置的信息
CREATE TABLE IF NOT EXISTS config(
	config_name varchar(30) NOT NULL comment '名称',
	PRIMARY KEY(config_name),
	config_value text comment '配置'
) DEFAULT CHARSET=utf8;
INSERT INTO config(config_name, config_value)
VALUES
	('attr_type', '[{"id": 0, "value": "-"},{"id": 1, "value": "言情"},{"id": 2, "value": "耽美"},{"id": 3, "value": "魔法斗气"},{"id": 4, "value": "玄幻武侠"},{"id": 5, "value": "都市异能"},{"id": 6, "value": "种田生活"},{"id": 7, "value": "历史军事"},{"id": 8, "value": "竞技游戏"},{"id": 9, "value": "未来星际"}]'),
	('attr_style', '[{"id": 0, "value": "-"},{"id": 1, "value": "轻松"},{"id": 2, "value": "爆笑"},{"id": 3, "value": "甜文"},{"id": 4, "value": "正剧"},{"id": 5, "value": "微虐"},{"id": 6, "value": "很虐"},{"id": 7, "value": "悲剧"}]'),
	('attr_tags', '[{"id": 1, "value": "同人"},{"id": 2, "value": "穿越重生"},{"id": 3, "value": "异世"},{"id": 4, "value": "未来"},{"id": 5, "value": "末世"},{"id": 6, "value": "清穿"},{"id": 7, "value": "空间"},{"id": 8, "value": "机甲"},{"id": 9, "value": "修真"},{"id": 10, "value": "异能"},{"id": 11, "value": "魔法"},{"id": 12, "value": "种田"},{"id": 13, "value": "明星"},{"id": 14, "value": "高干"},{"id": 15, "value": "生子"},{"id": 16, "value": "反琼瑶"},{"id": 17, "value": "HP"},{"id": 18, "value": "红楼"},{"id": 19, "value": "猎人"},{"id": 20, "value": "火影"},{"id": 21, "value": "死神"},{"id": 22, "value": "网王"},{"id": 23, "value": "武侠"},{"id": 24, "value": "综漫"},{"id": 25, "value": "女尊"},{"id": 26, "value": "NP"}]'),
	('attr_eval', '[{"id": 0, "value": "-"},{"id": 1, "value": "烂文"},{"id": 2, "value": "一般"},{"id": 3, "value": "经典"}]'),
	('attr_status', '[{"id": 0, "value": "待删除"},{"id": 1, "value": "通过"},{"id": 2, "value": "待审核"},{"id": 3, "value": "侵权"}]');
