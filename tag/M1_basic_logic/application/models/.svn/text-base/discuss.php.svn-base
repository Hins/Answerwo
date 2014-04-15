<?php
class application_models_discuss extends Zend_Db_Table {
	
	protected function _setup() {
		$db_config = new Zend_Config_Ini(CONFIG_FILE,'table');
		$this->_name = $db_config->table->hinspan_answerwo->discuss;
		Zend_Db_Table::setDefaultAdapter(application_common_dbutil::getDb());
		parent::_setup();
	}
	
	public function getAllDiscuss() {
		$db = application_common_dbutil::getDb();
		$select = $db->select();
		$select->from('discuss', array('id','createTime','lastmodifyTime','question_id',"user_id","father","content"));
		$sql = $select->__toString();
		$result = $db->query($sql);
		$rows = $result->fetchAll();
		if($rows){
			return $rows;
		}
		return false;
	}
	
	public function getPaginationDiscuss($page,$count) {
    	$db = application_common_dbutil::getDb();
	    $select = $db->select();
	    $select->from('discuss', array('id','createTime','lastmodifyTime','question_id',"user_id","father","content"));
	    $select->limitPage($page, $count);
	    $sql = $select->__toString();
        $result = $db->query($sql);
        $rows = $result->fetchAll();
        if($rows) {
        	return $rows;
        }
        return false;
    }
    
    public function getIdbySequence($sequence,$qid) {
    	$db = application_common_dbutil::getDb();
	    $select = $db->select();
	    $select->from('discuss', 'id');
	    $select->where('question_id=?',intval($qid));
	    $select->order('lastmodifyTime asc');
	    $select->limitPage($sequence, 1);
	    $sql = $select->__toString();
        $result = $db->query($sql);
        $rows = $result->fetchAll();
        if($rows){
        	if($rows[0]) {
        		return $rows[0];
        	}
        }
        return false;
    }
    
    public function getAllDiscussByqid($qid) {
    	$db = application_common_dbutil::getDb();
    	$select = $db->select();
    	$select->from('discuss', array('id','createTime','user_id','content'));
    	$select->where('question_id=?',intval($qid));
    	$select->order('createTime asc');
    	$sql = $select->__toString();
    	$result = $db->query($sql);
    	$rows = $result->fetchAll();
    	if($rows){
    		return $rows;
    	}
    	return false;
    }
    
    public function getCountByQid($qid) {
    	$db = application_common_dbutil::getDb();
    	$select = $db->select();
    	$select->from('discuss', array('count'=>new Zend_Db_Expr('COUNT(id)')));
    	$select->where('question_id=?',intval($qid));
    	$sql = $select->__toString();
    	$result = $db->query($sql);
    	$rows = $result->fetchAll();
    	if($rows) {
    		return $rows[0];
    	}
    	return false;
    }
}
?>