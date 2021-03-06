<?php
class Initializer{
	public function initConf($container){
		$container['siteConf'] = function($c){
			include $c['ROOT_PATH'].'includes/init/siteConf.php';
            return $siteConf;
        };
        return $container;
    }
	
	public function initPath($container){
		$container['path'] = function($c){
			$paths = array();
			$paths['tpl'] = $c['ROOT_PATH'] . 'themes/' . $c['siteConf']['theme'] . '/app/';
			$paths['caches'] = $c['ROOT_PATH'] . 'caches/';
			$paths['files'] = 'E:/books/files/';
			$paths['temp'] = 'E:/books/temp/';
			$public_path = $c['WEB_ROOT'] . 'themes/' . $c['siteConf']['theme'];
			$paths['css'] = $public_path . '/css/';
			$paths['js'] = $public_path . '/js/';
			$paths['img'] = $public_path . '/images/';
            return $paths;
        };
        return $container;
    }
	
	public function initBase($container){
		$container['db'] = function($c){
			include $c['ROOT_PATH'].'includes/init/Mysql.php';
            return MySQL::init($c['siteConf']);
        };
        $container['configdao'] = function($c){
            include $c['ROOT_PATH'].'includes/dao/ConfigDao.php';
            return new ConfigDao($c);
        };
        $container['vars'] = function($c){
            $configdao = $c['configdao'];
            return $configdao->getVars();
        };
		$container['filedao'] = function($c){
			include $c['ROOT_PATH'].'includes/dao/FileDao.php';
            return new FileDao($c);
        };
		$container['userdao'] = function($c){
			include $c['ROOT_PATH'].'includes/dao/UserDao.php';
            return new UserDao($c);
        };
		$container['miscdao'] = function($c){
			include $c['ROOT_PATH'].'includes/dao/MiscDao.php';
            return new MiscDao($c);
        };
		$container['searchdao'] = function($c){
			include $c['ROOT_PATH'].'includes/dao/SearchDao.php';
            return new SearchDao($c);
        };
        return $container;
    }

    public function initUtil($container){
        $container['util'] = function($c){
            include $c['ROOT_PATH'].'includes/util/Util.php';
            return new Util($c);
        };
        $container['dbutil'] = function($c){
            include $c['ROOT_PATH'].'includes/util/DbUtil.php';
            return new DbUtil($c);
        };
        $container['user'] = function($c){
            return isset($_SESSION['user']) && !empty($_SESSION['user']) ? $_SESSION['user'] : false;
        };
        return $container;
    }

    public function initTwig($container){
        $container['twig'] = function($c){
            include $c['ROOT_PATH'] . 'vendor/Twig/lib/Twig/Autoloader.php';
            Twig_Autoloader::register();
            $loader = new Twig_Loader_Filesystem($c['path']['tpl']);
            $twig = new Twig_Environment($loader, array(
                'cache' => false
            ));

            //Global Variables
            $globals = array(
                'WEB_ROOT' => $c['WEB_ROOT'],
                'CSS_PATH' => $c['path']['css'],
                'JS_PATH' => $c['path']['js'],
                'IMG_PATH' => $c['path']['img'],
                'REQUEST_URI' => urlencode($_SERVER['REQUEST_URI']),
                'VERSION' => substr((strtotime(date('Y-m-d H:i:s')) - strtotime('2014-04-01 00:00:00')), -6)
            );
            if($c['user']) {
                $globals['user_name'] = $c['user']['user_name'];
            }

            foreach($globals as $key => $value) {
                $twig->addGlobal($key, $value);
            }

            return $twig;
        };
        return $container;
    }
}

?>