<?php
class application_models_questiontoknowledge extends Zend_Db_Table{
    protected function _setup(){
        $db_config = new Zend_Config_Ini(CONFIG_FILE,'table');
        $this->_name = $db_config->table->hinspan_answerwo->questionTOknowledge;
        Zend_Db_Table::setDefaultAdapter(application_common_dbutil::getDb());
        parent::_setup();
    }

    public function getQuestionKnowleges($qid){
	$where = 'question_id=' . intval($qid);
	$result =  $this->fetchAll($where);
        if($result){
            return $result->toArray();
        }
        return false;
    }

    public function getKnowledgeStat(){
        try{
	    $db = $this->getAdapter();
	    $sql = "select knowledge_id,count(*) as c from questionTOknowledge group by knowledge_id";
	    $result = $db->query($sql);
            $rows = $result->fetchAll();
	    $data = array();
	    if($rows){
                $obj_knowledge = new application_models_knowledge();
		$knowledge_map = $obj_knowledge->getKnowledgeMap();
                foreach($rows as $row){
		    if(!isset($knowledge_map[$row['knowledge_id']])){
		    	continue;
		    }
		    $obj_knowledge = $knowledge_map[$row['knowledge_id']];
                    $arr_knowledge['id'] = $obj_knowledge->id;
                    $arr_knowledge['createTime'] = $obj_knowledge->createTime;
                    $arr_knowledge['lastmodifyTime'] = $obj_knowledge->lastmodifyTime;
                    $arr_knowledge['creator'] = $obj_knowledge->creator;
                    $arr_knowledge['content'] = $obj_knowledge->content;
                    $arr_knowledge['parent_id'] = $obj_knowledge->parent_id;
		    $arr_knowledge['question_count'] = $row['c'];
		    $data[] = $arr_knowledge;
		}
	    }
            return $data;
	}
	catch(Zend_Exception $e){
            application_common_logutil::warn($e->getMessage());
            return false;
        }
    }
}
?>
