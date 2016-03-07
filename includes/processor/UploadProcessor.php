<?php
include_once __DIR__ . '/BaseProcessor.php';

class UploadProcessor extends BaseProcessor{
    //verifyAtta
    //-------------------------------------------------------------------
    //验证文件格式及book表相关信息
    public function verifyFile($fileName) {
        if(strripos($fileName,' by ') == false) {
            return array(
                'code' => 1,
                'msg' => '命名格式错误，正确格式为：名字 by 作者.txt'
            );
        }
        $pos_dot = strripos($fileName, '.');
        $pos_by = strripos($fileName,'by');
        $bname = trim(substr($fileName, 0, $pos_by-1));
        $bauthor = trim(substr($fileName, $pos_by+3, $pos_dot-$pos_by-3));

        if($this->container['filedao']->isBookExist($bname, $bauthor)) {
            return array(
                'code' => 2,
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

    //验证zip中的文件
    public function verifyZip($tmpName) {
        $container = $this->container;

        //获取压缩包中所有txt文件
        $files = array();
        if ($zip = zip_open($tmpName)) {
            while ($zip_entry = zip_read($zip)) {
                $fileName = $container['util']->toUtf8(zip_entry_name($zip_entry));
                if(strripos($fileName,'.txt')) {
                    $file = array();
                    $file['book_path'] = $fileName;
                    $file['book_size'] = zip_entry_filesize($zip_entry);
                    $files[] = $file;
                }
            }
            zip_close($zip);

        } else {
            return array('code' => 1, 'msg' => '压缩包无法打开，请重新上传');
        }

        //压缩包中不包含txt文件
        if(empty($files)) {
            return array('code' => 2, 'msg' => '压缩包中不包含txt文件');
        }

        //获取所有可上传和不可上传的文件
        $legal = array();
        $illegal = array();
        foreach($files as $file) {
            $fileInfo = $this->verifyFile(preg_replace('/.*\//', '', $file['book_path']));
            if($fileInfo['code'] == 0) {
                $legal[] = array(
                    'book_name' => $fileInfo['book_name'],
                    'book_author' => $fileInfo['book_author'],
                    'book_path' => $container['path']['temp'] . $file['book_path'], //文件解压到temp下的路径
                    'book_size' => $file['book_size']
                );
            } else {
                $fileInfo['book_path'] = $file['book_path']; //文件解压前在压缩包中的路径
                $illegal[] = $fileInfo;
            }
        }

        if(! empty($illegal)) {
            //压缩包中包含不可上传文件
            return array(
                'code' => 'illegal',
                'msg' => count($illegal) . ' 个文件不可用，请检查：',
                'illegal' => $illegal
            );

        } else {
            //压缩包中文件均可上传
            $container['util']->zipExtract($tmpName, $container['path']['temp']); //将zip解压缩到temp文件夹下

            if(count($legal) === 1) {
                //zip中只有一个txt文件并且可以上传，返回信息与上传txt文件相同
                $result = $legal[0];
                $result['code'] = 0;
                $result['msg'] = '可以上传';
                $result['isBatchUpload'] = false;
                return $result;

            } else {
                return array(
                    'code' => '0',
                    'msg' => '共 ' . count($legal) . ' 个文件可上传：',
                    'isBatchUpload' => true,
                    'legal' => $legal
                );
            }
        }
    }

    //验证上传的附件，返回附件中包含的信息
    function verifyAtta($attachment) {
        $container = $this->container;
        if ($attachment['error'] > 0) {
            $result = array(
                'code' => 99,
                'error' => $attachment["error"],
                'msg' => $attachment["error"] === 1 ? '文件体积不能超过2M, 如果是txt文件，请尝试压缩后上传' : '文件上传失败，请重新上传'
            );
        }  else {
            $attrName = $attachment["name"];
            $attrNameExplode = explode('.', $attrName);
            $attrFormat = end($attrNameExplode);

            if($attrFormat == 'txt') {
                //上传txt文件，验证通过后保存到temp文件夹下，返回单个文件信息，显示单个文件表单
                $fileInfo = $this->verifyFile($attrName);
                if($fileInfo['code'] == 0) {
                    $tempPath = $container['path']['temp'] . $container['filedao']->getFileName($fileInfo);
                    move_uploaded_file($attachment["tmp_name"], $container['util']->toGb($tempPath));

                    $fileInfo['isBatchUpload'] = false;
                    $fileInfo['book_size'] = $attachment["size"];
                    $fileInfo['book_path'] = $tempPath;
                }
                $result = $fileInfo;

            } elseif($attrFormat == 'zip') {
                //上传zip文件，验证通过后保存到temp文件夹下，显示批量上传表单；不通过则返回错误文件信息
                $result = $this->verifyZip($attachment['tmp_name']);

            } else {
                $result = array(
                    'code' => 98,
                    'msg' => '只能上传zip或txt格式的文件'
                );
            }
        }
        return $result;
    }

    //uploadOneBook
    //-------------------------------------------------------------------
    //上传新书，移动文件并插入数据
    public function uploadOneBook($file) {
        $filedao = $this->container['filedao'];
        //移动文件
        if(! $filedao->moveFile($file)) {
            return false;
        }
        //插入记录
        $bookId = $filedao->insertBook($file);
        if(! $bookId) {
            return false;
        }
        return $bookId;
    }

    //batchUpload
    //-------------------------------------------------------------------
    //删除文件夹及文件
    function delDir($dir) {
        //先删除目录下的文件：
        $dh = opendir($dir);
        while ($file = readdir($dh)) {
            if ($file != "." && $file != "..") {
                $fullpath = $dir . "/" . $file;
                if (!is_dir($fullpath)) {
                    unlink($fullpath);
                } else {
                    $this->delDir($fullpath);
                }
            }
        }

        closedir($dh);
        //删除当前文件夹：
        if (rmdir($dir)) {
            return true;
        } else {
            return false;
        }
    }

    //获取需要删除的文件夹路径
    public function getDirInTemp($path) {
        $container = $this->container;
        $pathInTemp = str_replace($container['path']['temp'], '', $path);
        $pathInTempArr = explode('/', $pathInTemp);
        if(count($pathInTempArr) == 1) {
            return '';
        } else {
            $dir = reset($pathInTempArr);
            return $container['path']['temp'] . $dir;
        }
    }

    //批量上传新书，移动文件并插入数据
    public function batchUpload($files) {
        $filedao = $this->container['filedao'];
        foreach($files as $file) {
            //移动文件
            if(! $filedao->moveFile($file)) {
                return false;
            }
            //插入记录
            $bookId = $filedao->insertBook($file);
            if(! $bookId) {
                return false;
            }
        }
        $dirInTemp = $this->getDirInTemp($files[0]['book_path']);
        if($dirInTemp != '') {
            $this->delDir($dirInTemp);
        }
        return true;
    }

}
?>