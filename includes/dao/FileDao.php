<?php
include_once __DIR__ . '/BaseDao.php';

class FileDao extends BaseDao{
/*
	public function handleFile($file) {
		$file['book_size'] = transSize($file['book_size']);
		$file['book_path'] = 'files/' . $file['book_author'] . '/' . $file['book_name'] . ' by ' . $file['book_author'] . '.txt';
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

	public function delTagByBookId($bookId) {
		$db = $this->db();
		$sql = "DELETE FROM tag WHERE book_id=$bookId";
		return $db->query($sql);
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
	

*/
    //--------------------------------
    //将book_tags转换成字符串
    public function tagsToString($tags) {
        return is_array($tags) ? join('|', $tags) : $tags;
    }

    //插入一条 book 记录
    public function insertBook($file) {
        if(empty($file['book_name']) or empty($file['book_author'])) {
            return false;
        }

        $db = $this->db();

        //强制覆盖旧的记录及设置默认值
        if(isset($file['book_tags'])) {
            $file['book_tags'] = $this->tagsToString($file['book_tags']); //将book_tags转换成字符串
        }

        //如果该作者存在，则上传文件需要审批
        $sql = "SELECT 1 FROM `book` WHERE book_author='" . $file['book_author'] . "' LIMIT 1;";
        $file['book_status'] = $this->isExist($sql) ? 2 : 1;

        $book = array(
            'book_name' => $file['book_name'],
            'book_author' => $file['book_author'],
            'book_summary' => isset($file['book_summary']) ? $file['book_summary'] : '',
            'book_size' => $file['book_size'],
            'book_type' => isset($file['book_type']) ? $file['book_type'] : 0,
            'book_style' => isset($file['book_style']) ? $file['book_style'] : 0,
            'book_tags' => isset($file['book_tags']) ? $file['book_tags'] : '',
            'book_status' => $file['book_status'],
            'book_original_site' => isset($file['book_original_site']) ? $file['book_original_site'] : '',
            'book_uploader' => $_SESSION['user']['user_id'],
            'book_upload_time' => date('Y-m-d H:i:s')
        );

        $bookId = $this->getDeletedBookId();
        if($bookId) {
            $this->delBook($bookId); //删除book_id相关数据
            return $this->updateBook($bookId, $book) ? $bookId : false;
        } else {
            $fields = array();
            $values = array();
            foreach($book as $field =>$value) {
                $fields[] = "`" . $field . "`";
                $values[] = "'" . addslashes($value) . "'";
            }
            $sql = "INSERT INTO book(" . join(',', $fields) . ") VALUES(" . join(',', $values) . ")";
            if($db->exec($sql)) {
                return $db->lastInsertId();
            } else {
                return false;
            }
        }

    }

    //删除 book_id 相关所有数据
    public function delBook($bookId, $isInsertBook=false) {
        //将 book_status 设置为0，等待新纪录覆盖
        if(! $isInsertBook) {
            $this->updateBookStatus($bookId, 0);
        }

        //删除misc中所有相关记录
        $this->container['miscdao']->deleteAllByBookId($bookId);

        //删除txt文件
        $this->delFileOnDisk($bookId);

        return true;
    }

    //删除 txt文件
    public function delFileOnDisk($bookId) {
        $row = $this->getOneBook($bookId);
        if(! empty($row)) {
            $container = $this->container;
            $disk_path = $container['path']['files'] . $row['book_author'] . '/' . $row['book_name'] . ' by ' . $row['book_author'] . '.txt';
            $disk_path = $container['util']->toGb($disk_path);
            if(file_exists($disk_path)) {
                unlink($disk_path);
                return true;
            }
        }
        return false;
    }

    //更新记录
    public function updateBook($bookId, $file) {
        if(isset($file['book_tags'])) {
            $file['book_tags'] = $this->tagsToString($file['book_tags']); //将book_tags转换成字符串
        }

        $set = array();
        foreach($file as $field =>$value) {
            $set[] = "`" . $field . "`='" . addslashes($value) . "'";
        }
        $sql = "UPDATE `book` SET " . join(',', $set) . " WHERE `book_id`=" . $bookId;
        return $this->db()->exec($sql) ? true : false;
    }

    //修改book_status
    public function updateBookStatus($bookId, $status) {
        if(is_array($bookId)) {
            $sql = "UPDATE book SET book_status=$status WHERE book_id IN (" . join(',', $bookId) . ")";
        } else {
            $sql = "UPDATE book SET book_status=$status WHERE book_id=" . $bookId;
        }
        return $this->db()->exec($sql) ? true : false;
    }

    //获取一条废弃记录的book_id (book_status == 0)
    public function getDeletedBookId() {
        $sql = "SELECT book_id FROM `book` WHERE book_status=0;";
        $row = $this->getOneRow($sql);
        return $row ? $row['book_id'] : false;
    }

    //获取一条完整记录
    public function getOneBook($bookId) {
        $sql = "SELECT * FROM `book` WHERE `book_id`=" . $bookId . " LIMIT 1;";
        $row = $this->getOneRow($sql);
        return $row ? $row : array();
    }

    //根据文件名和作者判断是否已存在
    public function isBookExist($bookName, $bookAuthor) {
        $sql = "SELECT 1 FROM book WHERE book_name='" . addslashes($bookName) . "' AND book_author='" . addslashes($bookAuthor) . "' LIMIT 1";
        return $this->isExist($sql);
    }

    //返回完整文件名
    public function getFileName($file) {
        return $file['book_name'] . ' by ' . $file['book_author'] . '.txt';
    }

    //移动文件
    public function moveFile($file) {
        $container = $this->container;
        $util = $container['util'];

        $oldPath = $file['book_path'];
        $newFolder = $container['path']['files'] . $file['book_author'];
        $newPath = $newFolder . '/' . $container['filedao']->getFileName($file);

        $oldPath = $util->toGb($oldPath);
        $newFolder = $util->toGb($newFolder);
        $newPath = $util->toGb($newPath);

        //创建文件夹
        if(! file_exists($newFolder)) {
            if(! mkdir($newFolder, 0777, true)) {
                return false;
            }
        }

        //复制文件
        if(! file_exists($newPath)) {
            if(copy($oldPath, $newPath)) {
                if(strpos($oldPath, '/temp/')) {
                    unlink($oldPath);
                }
            } else {
                echo 'Wrong file: ' . $util->toUtf8($oldPath) . '<br>';
                return false;
            }
        }
        return true;
    }

}
?>