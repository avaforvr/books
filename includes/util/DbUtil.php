<?php
include_once __DIR__ . '/BaseUtil.php';

class DbUtil extends BaseUtil {
    protected function db() {
        return $this->container['db'];
    }

    public function isTableExist($tablename) {
        $sql = "SHOW TABLES FROM " . $this->container['siteConf']['db_name'];
        $stmt = $this->db()->query($sql);
        $stmt->setFetchMode(PDO::FETCH_NUM);
        $rows = $stmt->fetchAll();
        if(! empty($rows)) {
            foreach($rows as $key=>$row) {
                if($tablename == $row[0]) {
                    return true;
                }
            }
        }
        return false;
    }
}
?>