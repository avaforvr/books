<?php
class Initializer{
	public function initConf($container){
		$container['siteConf'] = function($c){
			include $c['ROOT_PATH'].'includes/config.env.php';
			
			$difftime = strtotime(date('Y-m-d H:i:s')) - strtotime('2014-04-01 00:00:00');
			
			$siteConf = array(
				'db_host' => $db_host,
				'db_name' => $db_name,
				'db_user' => $db_user,
				'db_pass' => $db_pass,
				'theme' => $theme,
				'DEBUG_MODE' => $DEBUG_MODE,
				'last_v' => substr($difftime,-6),
			);
            return $siteConf;
        };
        return $container;
    }
	
	public function initPath($container){
		$container['path'] = function($c){
			$paths = array();
			$paths['tpl'] = $c['ROOT_PATH'] . 'themes/' . $c['siteConf']['theme'] . '/app/';
			$paths['caches'] = $c['ROOT_PATH'] . 'caches/';
			$paths['files'] = $c['ROOT_PATH'] . 'files/';
			$paths['root'] = $c['WEB_ROOT'];
			$public_path = $c['WEB_ROOT'] . 'themes/' . $c['siteConf']['theme'];
			$paths['css'] = $public_path . '/css/';
			$paths['js'] = $public_path . '/js/';
			$paths['img'] = $public_path . '/images/';
            return $paths;
        };
        return $container;
    }
	
	public function initTwig($container){
		$container['twig'] = function($c){
			include $c['ROOT_PATH'] . 'vender/Twig/lib/Twig/Autoloader.php';
			Twig_Autoloader::register();
			$loader = new Twig_Loader_Filesystem($c['path']['tpl']);
			$twig = new Twig_Environment($loader, array(
				'cache' => false
			));
			return $twig;
        };
        return $container;
    }
	
	public function initVars($container){
		$container['vars'] = function($c){
			include $c['ROOT_PATH'].'includes/config.vars.php';
			$vars = array(
				'attr_type' => $attr_type,
				'attr_style' => $attr_style,
				'attr_eval' => $attr_eval,
				'attr_tags' => $attr_tags,
			);
            return $vars;
        };
        return $container;
    }
	
	public function initBase($container){
		$container['db'] = function($c){
			include $c['ROOT_PATH'].'includes/db.class.php';
			return new Db($c['siteConf']);
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
	
	/* 
    public function initBase($container){
        $container['db'] = $container->share(function($c){
            $siteConf = $c['siteConf'];
            return MySQL::init($siteConf);
        });
        return $container;
    }

    public function initServices($container){
		$container['currency'] = $container->share(function($c){
            $dao = new CurrencyDao($c);
            $source = new DbCurrencyService($dao);
            return new CachedCurrencyService($source, $c['cache']);
        });
        return $container;
    }
	*/
}

?>