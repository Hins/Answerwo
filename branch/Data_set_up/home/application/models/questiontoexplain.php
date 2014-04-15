<?php
class application_models_questiontoexplain extends Zend_Db_Table{
    protected function _setup(){
        $db_config = new Zend_Config_Ini(CONFIG_FILE,'table');
        $this->_name = $db_config->table->hinspan_answerwo->questionTOexplain;
        Zend_Db_Table::setDefaultAdapter(application_common_dbutil::getDb());
        parent::_setup();
    }
    
    public function getQuestionExplains($qid){
        $qid = intval($qid);
        $db = $this->getAdapter();
        $where = $db->quoteInto('question_id = ?', $qid);
        $result = $this->fetchAll($where);
        if($result){
        	$result = $result->toArray();
        	if(!empty($result)) {
        		$result = $result[0];
        		return $result;
        	}
        }
        return false;      
    }
    
    public function getQuestionbyExplainId($eid) {
    	$eid = intval($eid);
        $db = $this->getAdapter();
        $where = $db->quoteInto('explain_id = ?', $eid);
        $result = $this->fetchAll($where);
        if($result){
        	$result = $result->toArray();
        	if(!empty($result)) {
        		$result = $result[0];
        		return $result;
        	}
        }
        return false; 
    }
    
	public function getQuestionExplains2($qid){
        $qid = intval($qid);
        $db = $this->getAdapter();
        $where = $db->quoteInto('question_id = ?', $qid);
        $result = $this->fetchAll($where);
        if($result){
        	$result = $result->toArray();
        	if(!empty($result)) {
        		return $result;
        	}
        }
        return false;      
    }

    public function insert(array $fields){
        $ret = parent::insert($fields);
        if($ret){
            $obj_question = new application_models_question();
            $qid = intval($fields['question_id']);
            $obj_question->increaseCount($qid, 'explain_count', 1);
        }
        return $ret;
    }
    
    public function DeleteByQid($qid) {
    	$qid = intval($qid);
        $table = $this->_name;
        $sql = "delete from $table where question_id=$qid";
        return $this->getAdapter()->query($sql);
    }
    
    public function getCountByQid($qid) {
    	$db = application_common_dbutil::getDb();
    	$select = $db->select();
    	$select->from('questionTOexplain', array('count'=>new Zend_Db_Expr('COUNT(explain_id)')));
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
