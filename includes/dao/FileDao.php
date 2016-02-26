<?php
include_once __DIR__ . '/BaseDao.php';

class FileDao extends BaseDao{
	
	public function handleFile($file) {
		$file['book_size'] = transSize($file['book_size']);
		$file['bpath'] = 'files/' . $file['book_author'] . '/' . $file['book_name'] . ' by ' . $file['book_author'] . '.' . $file['bformat'];
		$file['book_summary'] = dataToHtml($file['book_summary']);
		$vars = $this->container['vars'];
		$file['btype_lang'] = $vars['attr_type'][$file['book_type']];
		$file['bstyle_lang'] = $vars['attr_style'][$file['book_style']];
		return $file;
	}
	
	public function getBooksByBookId($bookId) {
		$db = $this->db();
		$sql = "SELECT * FROM book WHERE book_id=$bookId LIMIT 1";
		$file = $db->fetchAssoc($sql);
		return $file;
	}
	
	public function getTagsByBookId($bookId) {
		$db = $this->db();
		$sql = "SELECT * FROM tag WHERE book_id=$bookId LIMIT 1";
		$tags = array();
		$alltags = $db->fetchAssoc($sql);
		if(! empty($alltags)) {
			$attr_tags = $this->container['vars']['attr_tags'];
			foreach($alltags as $key => $value) {
				if($value == 1 && $key != 'book_id') {
					$tags[$key] = $attr_tags[$key];
				}
			}
		}
		return $tags;
	}
	
	public function getMiscByBidUid($bookId, $userId) {
		$db = $this->db();
		$sql = "SELECT `mdown`, `meva`, `mbrowse` FROM `misc` WHERE book_id=$bookId AND user_id=$userId LIMIT 1";
		$misc = $db->fetchAssoc($sql);
		return $misc;
	}
	
	public function getFilesBySql($sql) {
		$db = $this->db();
		$fileList = $db->fetchAssocArray($sql);
		foreach($fileList as $key => $file) {
			$bookId = $file['book_id'];
			$file['btags'] = $this->getTagsByBookId($bookId);
			$file['misc'] = isLogin() ? $this->getMiscByBidUid($bookId, $_SESSION['user']['user_id']) : array();
			$fileList[$key] = $this->handleFile($file);
		}
		return $fileList;
	}
	
	public function getFileByBookId($bookId) {
		$file = $this->getBooksByBookId($bookId);
		$file['btags'] = $this->getTagsByBookId($bookId);
		$file['misc'] = isLogin() ? $this->getMiscByBidUid($bookId, $_SESSION['user']['user_id']) : array();
		$file = $this->handleFile($file);
		return $file;
	}
	
	public function getBookIds($sql) {
		$db = $this->db();
		$bookIds = array();
		$rows = $db->fetchAssocArray($sql);
		foreach($rows as $row) {
			$bookIds[] = $row['book_id'];
		}
		return $bookIds;
	}
	
	public function getFilesByBookIds($bookIds) {
		$fileList = array();
		foreach($bookIds as $bookId) {
			$fileList[] = $this->getFileByBookId($bookId);
		}
		return $fileList;
	}
	
	public function isFileExist($bname, $bauthor) {
		$db = $this->db();
		$sql = "SELECT 1 FROM book WHERE book_name='" . $bname . "' AND book_author='" . $bauthor . "' LIMIT 1";
		return $db->checkExist($sql);
	}

	public function delFileOnDisk($bookId) {
		$file = $this->getBooksByBookId($bookId);
		if(! empty($file)) {
			$container = $this->container;
			$disk_path = $container['ROOT_PATH'] . 'files/' . $file['book_author'] . '/' . $file['book_name'] . ' by ' . $file['book_author'] . '.' . $file['bformat'];
			$disk_path = toGb($disk_path);
			if(file_exists($disk_path)) {
				unlink($disk_path);
				return true;
			}
		}
		return false;
	}
	

	
	public function delTagByBookId($bookId) {
		$db = $this->db();
		$sql = "DELETE FROM tag WHERE book_id=$bookId";
		return $db->query($sql);
	}
	
	public function delFileByBookId($bookId) {
		//删除txt文件
		$del_disk = $this->delFileOnDisk($bookId);
		$del_books = $this->delBooksByBid($bookId);
		$del_tags = $this->delTagByBookId($bookId);
		return ($del_disk && $del_books && $del_extra && $del_tags) ? true : false;
	}
	
	public function setBooksByBookId($bookId, $file) {
		$db = $this->db();
		$sql = "UPDATE book SET
			book_name='". addslashes($file['book_name']) ."',
			book_author='". addslashes($file['book_author']) ."',
			book_summary='". addslashes($file['book_summary']) ."',
			brole='". $file['brole'] ."',
			book_type='". $file['book_type'] ."',
			book_style='". $file['book_style'] ."',
			book_original_site='". addslashes($file['book_original_site']) ."'
			WHERE book_id=" . $bookId;
		$isok = $db->query($sql);
		return $isok ? true : false;
	}
	
	public function setTagByBookId($bookId, $file) {
		$db = $this->db();
		$btags = empty($file['btags']) ? array() : $file['btags'];
		$btagsInDb = $this->getTagsByBookId($bookId);
		if(empty($btagsInDb)) {
			if(empty($btags)) {
				$isok = true;
			} else {
				$isok = $this->insertTag($bookId, $btags);
			}
		} else {
			if(empty($btags)) {
				$isok = $this->delTagByBookId($bookId);
			} else {
				$sql = "UPDATE tag SET ";
				$attr_tags = $this->container['vars']['attr_tags'];
				foreach($attr_tags as $key=>$tag) {
					if(in_array($key, $btags)) {
						$sql .= ($key . "=1");
					} else {
						$sql .= ($key . "=0");
					}
					if($key != ('t' . count($attr_tags))) {
						$sql .= ",";
					} else {
						$sql .= " WHERE book_id=" . $bookId;
					}
				}
				$isok = $db->query($sql);
			}
		
		}
		return $isok ? true : false;
	}
	
	public function setFileByBookId($bookId, $file) {
		$isok_books = $this->setBooksByBookId($bookId, $file);
		$isok_tags = $this->setTagByBookId($bookId, $file);
		return ($isok_books && $isok_tags) ? true : false;
	}
	
	public function setExtra($option, $bookId, $value) {
		$db = $this->db();
		$field = 'b' . $option;
		if($field == 'beva' && $value !== 1) {
			$sql_get = "SELECT $field FROM `book` WHERE book_id=$bookId;";
			$row = $db->fetchAssoc($sql_get);
			if($row[$field] > 0) {
				$sql = "UPDATE book SET $field=$field-1 WHERE book_id=$bookId";
			}
		} else {
			$sql = "UPDATE book SET $field=$field+1 WHERE book_id=$bookId";
		}
		if(isset($sql)) {
			$db->query($sql);
		}
	}
	
	public function setExist($bookId, $val) {
		$db = $this->db();
		$sql = "UPDATE book SET book_exist=$val WHERE book_id=$bookId";
		if($db->query($sql)) {
			return true;
		} else {
			return false;
		}
	}

    //--------------------------------
    //插入一条 book 记录
    public function insertBook($file) {
        $db = $this->db();
        $sql = "INSERT INTO book(book_name, book_author, book_summary, book_size, book_type, book_style, book_exist, book_original_site, book_uploader, book_upload_time) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $db->prepare($sql);
        $param = array(
            $file['book_name'],
            $file['book_author'],
            $file['book_summary'],
            $file['book_size'],
            $file['book_type'],
            $file['book_style'],
            1,
            $file['book_original_site'],
            $_SESSION['user']['user_id'],
            date('Y-m-d H:i:s')
        );
        if($stmt->execute($param)) {
            return $db->lastInsertId();
        } else {
            return false;
        }
    }

    //删除一个 book 记录
    public function delBooksByBid($bookId) {
        $db = $this->db();
        $sql = "DELETE FROM book WHERE book_id=$bookId";
        return $db->query($sql);
    }

    //插入一条 tag 记录
    public function insertTag($bookId, $tags) {
        $fieldStr = 'book_id';
        $valueStr = $bookId;
        $container = $this->container;
        $updateStr= '';
        foreach($container['vars']['attr_tags'] as $key=>$tag) {
            $fieldStr .= (',' . $key);
            if(in_array($key, $tags)) {
                $valueStr .= ',1';
                $updateStr .= ",`$key` = 1";
            } else {
                $valueStr .= ',0';
                $updateStr .= ",`$key` = 0";
            }
        }
        $updateStr = trim($updateStr,",");
        $sql = "INSERT INTO `tag` ( $fieldStr) VALUES ($valueStr) on duplicate key update $updateStr;";
        $this->db()->exec($sql);
    }
	
}
?>