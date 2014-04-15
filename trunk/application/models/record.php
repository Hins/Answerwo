<?php
class application_models_record extends Zend_Db_Table{
    protected function _setup(){
        $db_config = new Zend_Config_Ini(CONFIG_FILE,'table');
        $this->_name = $db_config->table->hinspan_answerwo->record;
        Zend_Db_Table::setDefaultAdapter(application_common_dbutil::getDb());
        parent::_setup();
    }
    
    public function getAnswers($qid) {
    	$db = application_common_dbutil::getDb();
	    $select = $db->select();
	    $select->from('record', array('count'=>new Zend_Db_Expr('COUNT(id)'),'answer'));
	    $select->where('question_id=?',intval($qid));
	    $select->group('answer');
	    $select->order('answer asc');
	    $sql = $select->__toString();
        $result = $db->query($sql);
        $rows = $result->fetchAll();
        if($rows) {
        	return $rows;
        }
        return false;
    }
    
    public function getAnswersByUid($uid) {
    	$db = application_common_dbutil::getDb();
	    $select = $db->select();
	    $select->from('record', array('createTime','question_id','answer'));
	    $select->where('user_id=?',intval($uid));
	    $select->order('createTime desc');
	    $sql = $select->__toString();
        $result = $db->query($sql);
        $rows = $result->fetchAll();
        if($rows) {
        	return $rows;
        }
        return false;
    }
    
    public function getDistinctPractice($uid) {
    	$db = application_common_dbutil::getDb();
	    $select = $db->select();
	    $select->from('record', array('count'=>new Zend_Db_Expr('COUNT(id)'),'createTime'=>new Zend_Db_Expr('MIN(createTime)'),'encryptid'));
	    $select->where('user_id=?',intval($uid));
	    $select->group('encryptid');
	    $select->order('createTime asc');
	    $sql = $select->__toString();
        $result = $db->query($sql);
        $rows = $result->fetchAll();
        if($rows) {
        	return $rows;
        }
        return false;
    }
    
    public function getRecordByUidandEid($uid,$eid) {
    	$db = application_common_dbutil::getDb();
	    $select = $db->select();
	    $select->from('record', array('question_id','answer'));
	    $select->where('user_id=?',intval($uid));
	    $select->where('encryptid=?',$eid);
	    $sql = $select->__toString();
        $result = $db->query($sql);
        $rows = $result->fetchAll();
        if($rows) {
        	return $rows;
        }
        return false;
    }
}