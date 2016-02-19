<?php
include_once __DIR__ . '/BaseProcessor.php';

class FileListProcessor implements BaseProcessor {
	
	public function build_orderby($sortBy) {
		if($sortBy == 1) {
			$orderby = " ORDER BY btime DESC";
		} elseif($sortBy == 2) {
			$orderby = " ORDER BY bsize DESC";
		} elseif($sortBy == 3) {
			$orderby = " ORDER BY beva DESC";
		} else {
			$orderby = "";
		}
		return $orderby;
	}

	public function build_sql_sbfilter($sortBy) {
		$orderby = $this->build_orderby($sortBy);
		
		$ftype = isset($_GET['ftype']) ? $_GET['ftype'] : 0;
		$fstyle = isset($_GET['fstyle']) ? $_GET['fstyle'] : 0;
		$condition = 'WHERE ';
		if($ftype > 0) {
			if(strpos($condition, "=")) {
				$condition .= " AND ";
			}
			$condition .= "btype=" . $ftype;
		}
		if($fstyle > 0) {
			if(strpos($condition, "=")) {
				$condition .= " AND ";
			}
			$condition .= "bstyle=" . $fstyle;
		}
		
		$sqls = array();
		$sqls['getTotal'] = "SELECT count(*) FROM books b " . $condition;
		$sqls['getFiles'] = "SELECT * FROM books " . $condition . $orderby;
		return $sqls;
	}
	
	public function build_sql_sbsearch($sortBy) {
		$orderby = $this->build_orderby($sortBy);
		$sbfield = $_GET['sbfield'];
		$sbkey = $_GET['sbkey'];
		if($sbfield == 0) {
			$field = 'bname';
		}elseif($sbfield == 1) {
			$field = 'bauthor';
		} else {
			$field = 'brole';
		}
		
		$sqls = array();
		$sqls['getTotal'] = "SELECT count(*) FROM books WHERE $field LIKE '%" . $sbkey . "%'";
		$sqls['getFiles'] = "SELECT * FROM books WHERE $field LIKE '%" . $sbkey . "%'" . $orderby;
		return $sqls;
	}
	
	public function build_sql_hsearch($sortBy, $container) {
		$orderby = $this->build_orderby($sortBy);
		
		$filedao = $container['filedao'];
		$searchdao = $container['searchdao'];
		
		$hkeystr = $_GET['hkey'];
		$sid = $searchdao->setRecord($hkeystr);
		
		$cache_file = $searchdao->getCacheFile($sid);
		if(! $cache_file) {
			$attr_tags = $container['vars']['attr_tags'];
			$attr_type = $container['vars']['attr_type'];
			$attr_style = $container['vars']['attr_style'];
			
			$bids = array();
			$hkeys = explode(' ', $hkeystr);
			foreach($hkeys as $hkey) {
				if(in_array($hkey, $attr_tags)) {
					$sql = "SELECT bid FROM tags WHERE " . getKeyByValue($hkey, $attr_tags) . " = 1";
				} elseif(in_array($hkey, $attr_type)) {
					$sql = "SELECT bid FROM books WHERE btype = '" . getKeyByValue($hkey, $attr_type) . "'";
				} elseif(in_array($hkey, $attr_style)) {
					$sql = "SELECT bid FROM books WHERE bstyle = '" . getKeyByValue($hkey, $attr_style) . "'";
				} else {
					$sql = '';
				}
				$bids_key = ($sql != '') ? $filedao->getBids($sql) : array();
				$bids = array_merge($bids, $bids_key);
				
				$sql_like = "SELECT bid FROM books WHERE (bname LIKE '%" . $hkey . "%') OR (bauthor LIKE '%" . $hkey . "%') OR (brole LIKE '%" . $hkey . "%')";
				$bids_like = $filedao->getBids($sql_like);
				$bids = array_merge($bids, $bids_like);
			}
			$cache_file = $searchdao->createCacheFile($sid, $bids);
		}
		$tmpbooks = $searchdao->createTmpBooks($sid, $cache_file);
		
		$sqls = array();
		$sqls['getTotal'] = "SELECT count(*) FROM $tmpbooks";
		$sqls['getBids'] = "SELECT bid FROM $tmpbooks" . $orderby;
		return $sqls;
	}

	public function build_sql_default($sortBy) {
		$orderby = $this->build_orderby($sortBy);
		$sqls = array();
		$sqls['getTotal'] = "SELECT count(*) FROM books WHERE bexist=1";
		$sqls['getFiles'] = "SELECT * FROM books WHERE bexist=1" . $orderby;
		return $sqls;
	}
	
	public function isActive() {
		return true;
	}
	
	public function process($params = array()) {
		foreach ($params as $key => $param) {
            $$key = $param;
        }
		$this->html_listFilter = '';
		$this->html_pageString = '';
		
		$filedao = $container['filedao'];
		
		if($dataKey == 'index') {
			$sql = "SELECT * FROM books WHERE bexist = 1 ORDER BY btime DESC LIMIT 20";
			$this->fileList = $filedao->getFilesBySql($sql);
		}
		if($dataKey == 'browse') {
			switch ($act) {
				case 'sbfilter':
					$sqls = $this->build_sql_sbfilter($sortBy);
					break;
				case 'sbsearch':
					$sqls = $this->build_sql_sbsearch($sortBy);
					break;
				case 'hsearch':
					$sqls = $this->build_sql_hsearch($sortBy, $container);
					break;
				default:
					$sqls = $this->build_sql_default($sortBy, $container);
					break;
			}
			
			//数据库查询游标
			$sqlGetTotal = $sqls['getTotal'];
			$filesTotal = $container['db']->getCount($sqlGetTotal);
			if($filesTotal > $pageSize) {
				$limitoffset = " LIMIT $pageSize OFFSET " . ($page - 1) * $pageSize;
			} else {
				$limitoffset = "";
			}
			
			
			if(! empty($sqls['getBids'])) {
				$sqlGetBids = $sqls['getBids'] . $limitoffset;
				$bids = $filedao->getBids($sqlGetBids);
				$this->fileList = $filedao->getFilesByBids($bids);
			} else {
				$sqlGetFiles = $sqls['getFiles'] . $limitoffset;
				$this->fileList = $filedao->getFilesBySql($getFilesByBids);
			}
			
			$url = $_SERVER['REQUEST_URI'];
			$pageTotal = ($filesTotal == 0) ? 0 : ceil($filesTotal / $pageSize);
			$this->html_pageString = getPageString($page, $url, $filesTotal, $pageSize);			
			$this->html_listFilter = $container['twig']->render("browse/listFilter.html", array(
					'sortByUrl' => remove_param_in_url($url, array('sortby', 'page'), true),
					'sortBy' => $sortBy,
					'filesTotal' => $filesTotal,
					'pageTotal' => $pageTotal,
				));
			
		}
		
	}
	
    public function render($params = array()) {
		foreach ($params as $key => $param) {
            $$key = $param;
        }
		$params['WEB_ROOT'] = $container['WEB_ROOT'];
		$params['html_listFilter'] = $this->html_listFilter;
		$params['html_pageString'] = $this->html_pageString;
		$params['fileList'] = $this->fileList;
		return $container['twig']->render("mod/fileList.html", $params);
	}
}
?>