<?php
include_once __DIR__ . '/BaseProcessor.php';

class FileListProcessor extends BaseProcessor {

    public function build_orderby($sortBy) {
        if ($sortBy == 1) {
            $orderby = " ORDER BY book_upload_time DESC";
        } elseif ($sortBy == 2) {
            $orderby = " ORDER BY book_size DESC";
        } else {
            $orderby = "";
        }
        return $orderby;
    }

    public function build_sql_sbfilter($sortBy) {
        $orderby = $this->build_orderby($sortBy);

        $ftype = isset($_GET['type']) ? $_GET['type'] : 0;
        $fstyle = isset($_GET['style']) ? $_GET['style'] : 0;
        $condition = 'WHERE ';
        if ($ftype > 0) {
            if (strpos($condition, "=")) {
                $condition .= " AND ";
            }
            $condition .= "book_type=" . $ftype;
        }
        if ($fstyle > 0) {
            if (strpos($condition, "=")) {
                $condition .= " AND ";
            }
            $condition .= "book_style=" . $fstyle;
        }

        $sqls = array();
        $sqls['getTotal'] = "SELECT count(*) FROM book " . $condition;
        $sqls['getFiles'] = "SELECT * FROM book " . $condition . $orderby;
        return $sqls;
    }

    public function build_sql_sbsearch($sortBy) {
        $orderby = $this->build_orderby($sortBy);
        $sbfield = $_GET['sbfield'];
        $sbkey = $_GET['sbkey'];
        if ($sbfield == 0) {
            $field = 'book_name';
        } elseif ($sbfield == 1) {
            $field = 'book_author';
        } else {
            $field = 'brole';
        }

        $sqls = array();
        $sqls['getTotal'] = "SELECT count(*) FROM book WHERE $field LIKE '%" . $sbkey . "%'";
        $sqls['getFiles'] = "SELECT * FROM book WHERE $field LIKE '%" . $sbkey . "%'" . $orderby;
        return $sqls;
    }

    public function build_sql_hsearch($sortBy) {
        $container = $this->container;
        $orderby = $this->build_orderby($sortBy);

        $filedao = $container['filedao'];
        $searchdao = $container['searchdao'];

        $hkeystr = $_GET['key'];
        $sid = $searchdao->setRecord($hkeystr);

        $cache_file = $searchdao->getCacheFile($sid);
        if (!$cache_file) {
            $attr_sex = $container['vars']['attr_sex'];
            $attr_type = $container['vars']['attr_type'];
            $attr_style = $container['vars']['attr_style'];
            $attr_tags = $container['vars']['attr_tags'];

            $bids = array();
            $hkeys = explode(' ', $hkeystr);
            foreach ($hkeys as $hkey) {
                if (in_array($hkey, $attr_tags)) {
                    $sql = "SELECT book_id FROM tag WHERE " . getKeyByValue($hkey, $attr_tags) . " = 1";
                } elseif (in_array($hkey, $attr_type)) {
                    $sql = "SELECT book_id FROM book WHERE book_type = '" . getKeyByValue($hkey, $attr_type) . "'";
                } elseif (in_array($hkey, $attr_style)) {
                    $sql = "SELECT book_id FROM book WHERE book_style = '" . getKeyByValue($hkey, $attr_style) . "'";
                } else {
                    $sql = '';
                }
                $bids_key = ($sql != '') ? $filedao->getBookIds($sql) : array();
                $bids = array_merge($bids, $bids_key);

                $sql_like = "SELECT book_id FROM book WHERE (book_name LIKE '%" . $hkey . "%') OR (book_author LIKE '%" . $hkey . "%') OR (brole LIKE '%" . $hkey . "%')";
                $bids_like = $filedao->getBookIds($sql_like);
                $bids = array_merge($bids, $bids_like);
            }
            $cache_file = $searchdao->createCacheFile($sid, $bids);
        }
        $tmpbooks = $searchdao->createTmpBooks($sid, $cache_file);

        $sqls = array();
        $sqls['getTotal'] = "SELECT count(*) FROM $tmpbooks";
        $sqls['getBookIds'] = "SELECT book_id FROM $tmpbooks" . $orderby;
        return $sqls;
    }

    public function build_sql_default($sortBy) {
        $orderby = $this->build_orderby($sortBy);
        $sqls = array();
        $sqls['getTotal'] = "SELECT count(*) FROM book WHERE book_status=1";
        $sqls['getFiles'] = "SELECT * FROM book WHERE book_status=1" . $orderby;
        return $sqls;
    }

    public function process($params = array()) {
        $container = $this->container;
        $filedao = $container['filedao'];
        $this->dataKey = $params['dataKey'];
        switch ($params['dataKey']) {
            case 'index':
                $sql = "SELECT * FROM book WHERE book_status = 1 ORDER BY book_upload_time DESC LIMIT 20";
                $this->fileList = $filedao->getShowBooks($sql);
                break;

            case 'browse':
                $this->filter = '';
                $this->pager = '';
                $sortBy = $params['sortBy'];
                switch ($params['act']) {
                    case 'sbfilter':
                        $sqls = $this->build_sql_sbfilter($sortBy);
                        break;
                    case 'sbsearch':
                        $sqls = $this->build_sql_sbsearch($sortBy);
                        break;
                    case 'headerSearch':
                        $sqls = $this->build_sql_hsearch($sortBy);
                        break;
                    default:
                        $sqls = $this->build_sql_default($sortBy);
                        break;
                }

                //数据库查询游标
                $filesTotal = $filedao->getCount($sqls['getTotal']);
                $page = $params['page'];
                $pageSize = $params['pageSize'];
                if ($filesTotal > $pageSize) {
                    $limitOffset = " LIMIT $pageSize OFFSET " . ($page - 1) * $pageSize;
                } else {
                    $limitOffset = "";
                }
                $this->fileList = $filedao->getShowBooks($sqls['getFiles'] . $limitOffset);

                $url = $_SERVER['REQUEST_URI'];
                $util = $container['util'];
                $pageTotal = ($filesTotal == 0) ? 0 : ceil($filesTotal / $pageSize);
                $this->pager = $util->getPager($page, $url, $filesTotal, $pageSize);
                $this->filter = $container['twig']->render("browse/listFilter.html", array(
                    'sortByUrl' => $util->remove_param_in_url($url, array('sortby', 'page'), true),
                    'sortBy' => $sortBy,
                    'filesTotal' => $filesTotal,
                    'pageTotal' => $pageTotal,
                ));
                break;

            default:
                break;
        }
    }

    public function render($params = array()) {
        switch ($this->dataKey) {
            case 'index':
                $params['fileList'] = $this->fileList;
                break;

            case 'browse':
                $params['fileList'] = $this->fileList;
                $params['filter'] = $this->filter;
                $params['pager'] = $this->pager;
                break;

            default:
                break;
        }
        return $this->container['twig']->render("browse/fileList.html", $params);
    }
}

?>