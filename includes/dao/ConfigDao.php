<?php
include_once __DIR__ . '/BaseDao.php';

class ConfigDao extends BaseDao{
	public function getVars() {
        $vars = array();
        $sql = "SELECT * FROM config";
        $rows = $this->getAllRows($sql);

        foreach($rows as $row) {
            $config_value = json_decode($row['config_value']);
            foreach($config_value as $item) {
                $vars[$row['config_name']][$item->id] = $item->value;
            }
        }
        return $vars;
	}
}
?>