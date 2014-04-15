<?php
class application_models_questiontoanswer extends Zend_Db_Table{
    protected function _setup(){
        $db_config = new Zend_Config_Ini(CONFIG_FILE,'table');
        $this->_name = $db_config->table->hinspan_answerwo->questionTOanswer;
        Zend_Db_Table::setDefaultAdapter(application_common_dbutil::getDb());
        parent::_setup();
    }

    public function getQuestionAnswers($qid){
	$where = 'question_id=' . intval($qid);
	$result =  $this->fetchAll($where);
        if($result){
            return $result->toArray();
        }
        return false;
    }
    
    public function DeleteByQid($qid) {
    	$qid = intval($qid);
        $table = $this->_name;
        $sql = "delete from $table where question_id=$qid";
        return $this->getAdapter()->query($sql);
    }
}
?>
