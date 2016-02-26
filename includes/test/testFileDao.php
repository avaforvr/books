<?php
$filedao = $container['filedao'];

/*
echo '<br>-------------------------------------------------<br>';
echo 'insertBook($file)' . '<br>';
$data = array(
    'book_id' => '1',
    'book_name' => '倾然自喜',
    'book_author' => '这碗粥',
    'book_summary' => '简单点说\n这是一个腿脚不太利索的男人爱上一个脑子不太好使的女人的故事\n复杂点说\n这是一个完全没有涉及穿越、重生、宅斗、商战的纯狗血爱情故事\n再复杂点\n这是一个嚣张的伪轮椅男从一个冷美人手里抢老婆的激励奋斗故事',
    'book_size' => '416',
    'book_type' => '1',
    'book_style' => '1',
    'book_exist' => '1',
    'book_original_site' => 'http://www.loulantxt.com/read.php?tid=674336&keyword=%C7%E3%C8%BB%D7%D4%CF%B2',
    'book_uploader' => '1',
    'book_upload_time' => '2016-02-26 16:15:14',
);

$r = $filedao->insertBook($data);
var_dump($r);
*/

echo '<br>-------------------------------------------------<br>';
echo 'insertTag($bookId, $tags)' . '<br>';
$tags = array('t1', 't3', 't5');
$filedao->insertTag(2, $tags);

echo '<br>-------------------------------------------------<br>';
die;

?>