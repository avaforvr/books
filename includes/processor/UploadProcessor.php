<?php
include_once __DIR__ . '/BaseProcessor.php';

class UploadProcessor extends BaseProcessor{
    //verifyAtta
    //-------------------------------------------------------------------
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
                    'book' => array(
                        'book_name' => $attaInfo['book_name'],
                        'book_author' => $attaInfo['book_author'],
                        'book_size' => $attachment["size"],
                        'book_path' => $tempPath
                    )
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

    //uploadNewBook
    //-------------------------------------------------------------------
    //移动文件
    public function moveFile($file) {
        $container = $this->container;
        $util = $container['util'];

        $oldPath = $file['book_path'];
        $newFolder = $container['ROOT_PATH'] . 'files/' . $file['book_author'];
        $newPath = $newFolder . '/' . $this->getFileName($file);

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
                return false;
            }
        }
        return true;
    }

    //上传新书，移动文件并插入数据
    public function uploadNewBook($file) {
        $filedao = $this->container['filedao'];
        //检查记录是否已存在
        if($filedao->isBookExist($file['book_name'], $file['book_author'])) {
            return false;
        }
        //移动文件
        if(! $this->moveFile($file)) {
            return false;
        }
        //插入记录
        $bookId = $filedao->insertBook($file);
        if(! $bookId) {
            return false;
        }
        return $bookId;
    }

    //verifyDir
    //-------------------------------------------------------------------
	//获取硬盘目录中的文件路径
	public function getPathsOnDisk($path, &$paths) {
		if(is_dir($path)) {
			$dir = opendir($path);
			while(($file = readdir($dir)) !== false) {
				if($file != "." && $file != ".." && $file != "..") {
					$this->getPathsOnDisk($path . "\\" . $file, $paths);
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

    //文件路径转为utf8编码
	public function pathToUtf8($path) {
        $util = $this->container['util'];
		$path = $util->toUtf8($path);
		if(! file_exists($util->toGb($path))) {
			$epath = urlencode($path);
			$epath = str_replace('%E3%83%BB', '%C2%B7', $epath);
			$path = urldecode($epath);
			$path = str_replace('――', '——', $path);
		}
		return $path;
	}

	//获取硬盘目录中的文件信息
	public function getFilesOnDisk($path) {
        $util = $this->container['util'];
		$paths =  array();
		$this->getPathsOnDisk($path, $paths);
		$files = array();
		foreach($paths as $path) {
			$path = $this->pathToUtf8($path);
			$path_arr = explode('\\', $path);
			$wholename = end($path_arr);
			$file = $this->verifyFile($wholename);
			if($file['code'] == 0) {
				$file['book_size'] = filesize($util->toGb($path));
			}
			$file['book_path'] = $path;
			$files[] = $file;
		}
		return $files;
	}

    //验证目录下的文件是否可以上传
    public function verifyDir($dir) {
        $result = array(
            'code' => 0,
            'msg' => '',
            'legal' => array(),
            'illegal' => array(),
        );
        $filesInDir = $this->getFilesOnDisk($dir);

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

        return $result;
    }

    //batchUpload
    //-------------------------------------------------------------------

    //process
    //-------------------------------------------------------------------
    public function process($params = array()) {
		switch ($params['act']) {
			case 'verifyAtta': //验证上传的附件，返回附件中包含的信息
                $result = $this->verifyAtta($params['attachment']);
				break;

			case 'uploadNewBook': //单本上传
                $result = $this->uploadNewBook($params['file']); //返回bookId
				break;

			case 'verifyDir': //验证批量上传的目录
                $result = $this->verifyDir($params['dir']);
				break;

			case 'batchUpload': //批量上传
//				$result = array(
//					'code' => 0,
//					'legal' => array(),
//					'illegal' => array(),
//				);
//				$filesInDir = $this->getFilesOnDisk($this->container['filedao'], $dir);
//				foreach($filesInDir as $file) {
//					$file['book_type'] = $btype;
//					$file['book_summary'] = '';
//					$file['brole'] = '';
//					$file['book_style'] = 0;
//					$file['book_original_site'] = '';
//					$file['btags'] = $btags;
//					$bid = $this->uploadNewBook($file);
//					if($bid) {
//						$result['legal'][] = $file;
//					} else {
//						$result['illegal'][] = $file;
//					}
//				}
//				if(empty($result['legal']) && empty($result['illegal'])) {
//					$result['code'] = 1;
//				}
				
				break;
			default:
				break;
		}

		return $result;
	}
}
?>