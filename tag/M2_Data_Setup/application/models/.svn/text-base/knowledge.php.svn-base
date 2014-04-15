<?php
class application_models_knowledge extends Zend_Db_Table{
    protected function _setup(){
        $db_config = new Zend_Config_Ini(CONFIG_FILE,'table');
        $this->_name = $db_config->table->hinspan_answerwo->knowledge;
        Zend_Db_Table::setDefaultAdapter(application_common_dbutil::getDb());
        parent::_setup();
    }

    public function getKnowledgeById($eid){
	$result = $this->fetchRow('id=' . intval($eid));
        if($result){
            return $result->toArray();
        }
        return false;
    }

    public function getKnowledgeByName($name){
        $db = $this->getAdapter();
        $where = $db->quoteInto('content = ?', $name);
        $result = $this->fetchAll($where);
        if($result){
            return $result->toArray();
        }
        return false;
    }
    
    public function getKnowledgeMap(){
	try{
            $rows = $this->fetchAll();
	    $map = array();
	    if($rows){
		foreach($rows as $row){
		    $map[$row->id] = $row->toArray();
		}
	    }
	    return $map;
        }
        catch(Zend_Exception $e){
            application_common_logutil::warn($e->getMessage());
            return false;
        }
    }

    public function statSubjectKnowledgeFromDB(){
        $all = $this->getKnowledgeMap();
        $obj_qindex = new application_models_questionindex();
        $kqcount = $obj_qindex->statSubjectKnowledgeQuestionCount();
        $result = array();
        foreach($all as $key => $item){
            $row = $item;
            $subject = $row['subject'];
            while($row['parent']>0 && $row['parent']!=$row['id']){
                $row_count = isset($kqcount[$subject][$row['id']])?
                        $kqcount[$subject][$row['id']]['count']:0;
                if(!isset($all[$row['id']]['count'])){
                    $all[$row['id']]['count'] = $row_count;
                }
                $all[$row['parent']]['children'][$row['id']] = $all[$row['id']];
                $row = $all[$row['parent']];
            }
            $result[$subject][$row['id']] = $all[$row['id']];
        }
        return $result;
    }

    public function statSubjectKnowledge(){
        $cache = new application_common_filecache();
        return $cache->tryCache(
                application_common_constant::CACHE_KEY_SUBJECT_KNOWLEDGE_FAMILY_QUESTION_COUNT,
                __CLASS__, __FUNCTION__ . "FromDB");
    }
    
    public function getAllKnowledges() {
    	$result = $this->fetchAll();
        if($result){
            return $result->toArray();
        }
        return false;
    }


    public function traceBackAllParent($lastKid){
        $map = $this->getKnowledgeMap();
        if(!$map){
            return false;
        }
        $k = $map[$lastKid];
        if(!$k){
            return false;
        }
        $arr = array();
        $arr[] = $k;
        while($k['parent']>0){
            $k = $map[$k['parent']];
            $arr[] = $k;
        }
        //return array_reverse($arr);
        return $arr;
    }
}
?>
