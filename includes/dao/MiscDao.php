<?php
include_once __DIR__ . '/BaseDao.php';

class MiscDao extends BaseDao{

    public function deleteAllByBookId($bookId) {
        $sql = "DELETE FROM `misc` WHERE `book_id`=" .  $bookId;
        $this->db()->exec($sql);
    }

    //$container['miscdao']->setMisc($bookId, 'misc_down' , 1);
    public function setMisc($bookId, $key, $value=1) {
        $db = $this->db();
        $userId = $this->container['user']['user_id'];

        $sql = "SELECT * FROM `misc` WHERE book_id=" . $bookId . " AND user_id=" . $userId . " LIMIT 1";
        $row = $this->getOneRow($sql);

        if(empty($row)) {
            $sql = "INSERT INTO misc(book_id, user_id, " . $key . ", " . $key . "_time) VALUES(?, ?, ?, ?);";
            $stmt = $db->prepare($sql);
            $stmt->execute(array($bookId, $userId, $value, date('Y-m-d H:i:s')));
        } else {
            $sql = "UPDATE `misc` SET " . $key . "=?,  " . $key . "_time=? WHERE misc_id=?";
            $stmt = $db->prepare($sql);
            $stmt->execute(array($value, date('Y-m-d H:i:s'), $row['misc_id']));
        }
    }

    public function isLiked($bookId) {
        if($this->container['user']) {
            $userId = $this->container['user']['user_id'];
            $sql = "SELECT 1 FROM `misc` WHERE misc_like=1 AND book_id=" . $bookId . " AND user_id=" . $userId . " LIMIT 1";
            return $this->isExist($sql);
        } else {
            return false;
        }
    }
}
?>