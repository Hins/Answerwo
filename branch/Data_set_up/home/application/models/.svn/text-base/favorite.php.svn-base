<?php
class application_models_favorite extends Zend_Db_Table {

	protected function _setup() {
		$db_config = new Zend_Config_Ini(CONFIG_FILE,'table');
		$this->_name = $db_config->table->hinspan_answerwo->favorite;
		Zend_Db_Table::setDefaultAdapter(application_common_dbutil::getDb());
		parent::_setup();
	}
	
	public function getByqidanduid($qid,$uid) {
		$db = application_common_dbutil::getDb();
		$select = $db->select();
		$select->from($this->_name, array('id','createTime','lastmodifyTime','question_id','user_id'));
		$select->where("question_id=?", $qid);
		$select->where("user_id=?", $uid);
		$sql = $select->__toString();
		$result = $db->query($sql);
		$result = $result->fetchAll();
		if($result){
			return $result;
		}
		return false;
	}
	
	public function getCountByQid($qid) {
		$db = application_common_dbutil::getDb();
		$select = $db->select();
		$select->from('favorite', array('count'=>new Zend_Db_Expr('COUNT(id)')));
		$select->where('question_id=?',intval($qid));
		$sql = $select->__toString();
		$result = $db->query($sql);
		$rows = $result->fetchAll();
		if($rows) {
			return $rows[0];
		}
		return false;
	}
	
	public function getByuid($uid) {
		$db = application_common_dbutil::getDb();
		$select = $db->select();
		$select->from($this->_name, array('id','createTime','lastmodifyTime','question_id','user_id'));
		$select->where("user_id=?", intval($uid));
		$sql = $select->__toString();
		$result = $db->query($sql);
		$result = $result->fetchAll();
		if($result){
			return $result;
		}
		return false;
	}
	
	public function removeByQidandUid($uid,$qid) {
		$uid = intval($uid);
		$qid = intval($qid);
		$table = $this->_name;
		$sql = "delete from $table where question_id=$qid and user_id=$uid";
		return $this->getAdapter()->query($sql);
	}
	
	public function getAllFavorite() {
		$db = application_common_dbutil::getDb();
		$select = $db->select();
		$select->from('favorite', array('id','createTime','lastmodifyTime','question_id',"user_id"));
		$sql = $select->__toString();
		$result = $db->query($sql);
		$rows = $result->fetchAll();
		if($rows){
			return $rows;
		}
		return false;
	}
	
}
?>