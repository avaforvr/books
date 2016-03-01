<?php
include_once __DIR__ . '/BaseProcessor.php';

class UploadProcessor extends BaseProcessor{
	public function insertFile($container, $file) {
		if(! $this->moveFile($container['ROOT_PATH'], $file)) {
			return false;
		}
		$filedao = $container['filedao'];
		if($filedao->isBookExist($file['book_name'], $file['book_author'])) {
			return false;
		}
		$bid = $filedao->insertBook($file);
		if(! $bid) {
			return false;
		}
		if(isset($file['btags']) && ! empty($file['btags'])) {
			$filedao->insertTag($bid, $file['btags']);
		}
		return $bid;
	}
	
	public function moveFile($ROOT_PATH, $file) {
		$oldPath = $file['book_path'];
		$newFolder = $ROOT_PATH . 'files/' . $file['book_author'];
		$newPath = $newFolder . '/' . $file['book_name'] . ' by ' . $file['book_author'] . '.txt';

		$oldPath = toGb($oldPath);
		$newFolder = toGb($newFolder);
		$newPath = toGb($newPath);
		
		if(! file_exists($newFolder)) {
			if(! mkdir($newFolder, 0777, true)) {
				return false;
			}
		}
		if(! file_exists($newPath)) {
			if(copy($oldPath, $newPath)) {
				if(strpos($oldPath, '/temp/')) {
					unlink($oldPath);
				}
			} else {
				return false;
			}
		}
		return true;
	}
	
	//get all paths in the directory
	public function get_paths($path, &$paths) {
		if(is_dir($path)) {
			$dir = opendir($path);
			while(($file = readdir($dir)) !== false) {
				if($file != "." && $file != ".." && $file != "..") {
					$this->get_paths($path . "\\" . $file, $paths);
				}
			}
			closedir($dir);
		}
		if(is_file($path)) {
			if(strripos($path, '~$')) {
				echo 'temporary file: ' . $path;
			} else {
				$paths[] = $path;
			}		
		}
	}
	
	public function pathToUtf8($path) {
		$path = toUtf8($path);
		if(! file_exists(toGb($path))) {
			$epath = urlencode($path);
			$epath = str_replace('%E3%83%BB', '%C2%B7', $epath);
			$path = urldecode($epath);
			$path = str_replace('――', '——', $path);
		}
		return $path;
	}

	//get the infomation of each file
	public function get_files($filedao, $path) {
		$paths =  array();
		$this->get_paths($path, $paths);
		$files = array();
		foreach($paths as $path) {	
			$path = $this->pathToUtf8($path);
			$path_arr = explode('\\', $path);
			$wholename = end($path_arr);
			$file = $this->verifyFile($filedao, $wholename);
			if($file['code'] == 0) {
				$file['book_size'] = filesize(toGb($path));
			}
			$file['book_path'] = $path;
			$files[] = $file;
		}
		return $files;
	}

    //验证文件格式及book表相关信息
    public function verifyFile($wholename) {
        $wholenameArr = explode('.', $wholename);
        $bformat = end($wholenameArr);
        if($bformat != 'txt') {
            return array(
                'code' => 1,
                'msg' => '只能上传txt格式的文件'
            );
        }
        if(strripos($wholename,' by ') == false) {
            return array(
                'code' => 2,
                'msg' => '命名格式错误，正确格式为：名字 by 作者.txt'
            );
        }
        $pos_dot = strripos($wholename, '.');
        $pos_by = strripos($wholename,'by');
        $bname = trim(substr($wholename, 0, $pos_by-1));
        $bauthor = trim(substr($wholename, $pos_by+3, $pos_dot-$pos_by-3));

        if($this->container['filedao']->isBookExist($bname, $bauthor)) {
            return array(
                'code' => 3,
                'msg' => '文件已存在'
            );
        }
        return array(
            'code' => 0,
            'msg' => '可以上传',
            'book_name' => $bname,
            'book_author' => $bauthor
        );
    }

    //返回完整文件名
    function getFileName($file) {
        return $file['book_name'] . ' by ' . $file['book_author'] . '.txt';
    }

    //验证上传的附件，返回附件中包含的信息
    function verifyAtta($attachment) {
        $result = array();
        if ($attachment["error"] > 0) {
            $result = array(
                'code' => 99,
                'msg' => $attachment["error"]
            );
        } else {
            $attaInfo = $this->verifyFile($attachment["name"]);
            if($attaInfo['code'] === 0) {
                $tempPath = $this->container['ROOT_PATH'] . 'temp/' . $this->getFileName($attaInfo);
                move_uploaded_file($attachment["tmp_name"], $this->container['util']->toGb($tempPath));
                $result = array(
                    'code' => 0,
                    'msg' => $attaInfo['msg'],
                    'book_name' => $attaInfo['book_name'],
                    'book_author' => $attaInfo['book_author'],
                    'book_size' => $attachment["size"],
                    'book_path' => $tempPath
                );
            } else {
                $result = array(
                    'code' => $attaInfo['code'],
                    'msg' => $attaInfo['msg']
                );
            }
        }
        return $result;
    }

	public function process($params = array()) {
		foreach ($params as $key => $param) {
            $$key = $param;
        }
		
		switch ($act) {
			case 'verifyAtta': //验证上传的附件，返回附件中包含的信息
                $result = $this->verifyAtta($attachment);
                break;

				break;
			case 'uploadNew': //单本上传
				$bid = $this->insertFile($container, $file);
				if($bid) {
					$result = $bid;
				} else {
					$result = false;
				}
				break;
			case 'verifyDir': //验证批量上传的目录
				$result = array(
					'code' => 0,
					'msg' => '',
					'legal' => array(),
					'illegal' => array(),
				);
				$filesInDir = $this->get_files($container['filedao'], $dir);
				if(empty($filesInDir)) {
					$result['code'] = 1;
					$result['msg'] = '该目录下没有文件';
				} else {
					foreach($filesInDir as $file) {
						if($file['code'] == 0) {
							$result['legal'][] = $file;
						} else {
							$result['illegal'][] = $file;
						}
					}
					if(empty($result['illegal'])) {
						$result['msg'] = '共 ' . count($result['legal']) . ' 个文件可上传，文件列表如下：';
					} else {
						$result['code'] = 2;
						$result['msg'] = '共 ' . count($result['illegal']) . ' 个文件不可用，请检查：';
					}
				}
				break;
			case 'batchUpload': //批量上传
				$result = array(
					'code' => 0,
					'legal' => array(),
					'illegal' => array(),
				);
				$filesInDir = $this->get_files($container['filedao'], $dir);
				foreach($filesInDir as $file) {
					$file['book_type'] = $btype;
					$file['book_summary'] = '';
					$file['brole'] = '';
					$file['book_style'] = 0;
					$file['book_original_site'] = '';
					$file['btags'] = $btags;
					$bid = $this->insertFile($container, $file);
					if($bid) {
						$result['legal'][] = $file;
					} else {
						$result['illegal'][] = $file;
					}
				}
				if(empty($result['legal']) && empty($result['illegal'])) {
					$result['code'] = 1;
				}
				
				break;
			default:
				break;
		}
		return $result;
	}
}
?>