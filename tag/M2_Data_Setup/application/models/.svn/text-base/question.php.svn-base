<?php
class application_models_question extends Zend_Db_Table{
    protected function _setup(){
        $db_config = new Zend_Config_Ini(CONFIG_FILE,'table');
        $this->_name = $db_config->table->hinspan_answerwo->question;
    	Zend_Db_Table::setDefaultAdapter(application_common_dbutil::getDb());
		parent::_setup();
    }

    public function getQuestionById($qid){
	    $obj = $this->fetchRow('id=' . intval($qid));
        if($obj){
            return $obj->toArray();
        }
        return false;
    }
    
    public function getQuestionByEncryptId($id){
    	$obj = $this->fetchRow('encryptid=' . "'$id'");
    	if($obj){
    		return $obj->toArray();
    	}
    	return false;
    }

    public function getQuestionList($kid, $page=1, $number=10, $orderby='lastmodifyTime', $asc='desc' ){
        try{
            $db = application_common_dbutil::getDb();
	    $select = $db->select();
	    $select->from('questionTOknowledge', 'question_id');
	    $select->where('knowledge_id=?',$kid);
	    $select->order('lastmodifyTime desc');
	    $select->limitPage($page, $number);
	    $sql = $select->__toString();
            $result = $db->query($sql);
            $rows = $result->fetchAll();
            $data = array();
            if($rows){
                foreach($rows as $row){
		    $question_id = $row['question_id'];
                    $question = $this->getQuestion($question_id);
                    if(!$question){
                        continue;
                    }
                    $data[] = $question;
                }
            }
            return $data;
        }
        catch(Zend_Exception $e){
            application_common_logutil::warn($e->getMessage());
            return false;
        }
    }

    /**
     * 获取题目及其关联信息
     * @param <type> $qid
     * @param $arr_field 要输出的信息，可以传入array('answer', 'explains')
     * @return <type>
     */
    public function getQuestion($qid, $arr_field=null){
        $arr_ret_question = array();
        try{            
            //查询题目
            $qid = intval($qid);
            if($arr_field==null || in_array('question', $arr_field)){
                $arr_ret_question['question']  = $this->packQuestion($qid);
            }

            //查询答案
            if($arr_field==null || in_array('answer', $arr_field)){
                $arr_ret_question['answer'] = $this->getQuestionAnswer($qid);
            }

            //查询解释
            if($arr_field==null || in_array('explains', $arr_field)){
                $arr_ret_question['explains'] = $this->getQuestionExplain($qid);
            }

            //来源
            if($arr_field==null || in_array('source', $arr_field)){
                $arr_ret_question['source'] = $this->getQuestionSource($qid);
            }

            return $arr_ret_question;
	}
        catch(Zend_Exception $e){
            application_common_logutil::warn($e->getMessage());
            return false;
        }
    }

    public function packQuestion($qid){
        $arr_question = array();
        $question = $this->getQuestionById($qid);
        $arr_question['obj'] = array();
        $arr_question['ext'] = array();
        if($question){
            $question['type_name'] = $this->getQuestionTypeName($question);
            $question['level_name'] = $this->getQuestionLevelName($question);
            $question['html_content'] = application_common_htmlutil::ubb2html($question['content']);
            $arr_question['obj'] = $question;
        }
        $obj_exinfo = new application_models_questionexinformation();
        $ext = $obj_exinfo->getExProperty($qid);
        if($ext){
            $arr_question['ext'] = $ext;
        }

        return $arr_question;
    }

    public function getQuestionAnswer($qid, $pack=false){
        $arr_ret_question = array();
        $obj_question_answer = new application_models_questiontoanswer();
        $question_answers = $obj_question_answer->getQuestionAnswers($qid);
        if($question_answers){
            $obj_answer = new application_models_answer();
            foreach($question_answers as $qa){
                $aid = $qa['answer_id'];
                if($pack){
                    $answer = $obj_answer->packAnswer($aid);
                }else{
                    $answer = $obj_answer->getAnswer($aid);
                }
                if($answer){
                    $arr_ret_question[] = $answer;
                }
            }
        }
        return $arr_ret_question;
    }

    public function getQuestionPackAnswer($qid){
        return $this->getQuestionAnswer($qid, true);
    }

    public function getQuestionExplain($qid, $pack=false){
        $arr_ret_question = array();
        $obj_question_explain = new application_models_questiontoexplain();
        $question_explains = $obj_question_explain->getQuestionExplains($qid,-1,-1);
        if($question_explains){
            $obj_explain = new application_models_explains();
            foreach($question_explains as $qe){
                $eid = $qe['explain_id'];
                if($pack){
                    $explain = $obj_explain->packExplains($eid);
                }
                else{
                    $explain = $obj_explain->getExplains($eid);
                }
                if($explain){
                    $arr_ret_question[] = $explain;
                }
            }
        }

        return $arr_ret_question;
    }

    public function getQuestionPackExplain($qid){
        return $this->getQuestionExplain($qid,true);
    }

    public function getQuestionKnowledge($qid){
        $data = array();
        $obj_qtk = new application_models_questiontoknowledge();
        $qks = $obj_qtk->getQuestionKnowleges($qid);
        if($qks){
            $obj_knowledge = new application_models_knowledge();
            foreach($qks as $qk){
                $kid = $qk['knowledge_id'];
                $k = $obj_knowledge->getKnowledgeById($kid);
                if($k){
                    $data[] = $k;
                }
            }
        }

        return $data;
    }

    public function getQuestionSource($qid){
        $arr_ret_question = array();
        $obj_qts = new application_models_questiontosource();
        $qss = $obj_qts->getQuestionSources($qid);
        if($qss){
            $obj_source = new application_models_source();
            foreach($qss as $qs){
                $sid = $qs['source_id'];
                $s = $obj_source->getSourceById($sid);
                if($s){
                    $arr_ret_question[] = $s;
                }
            }
        }

        return $arr_ret_question;
    }
    
    /**
     * Get all questions' contents and ids information;
     * @return an array representing ids and contents;
     */
    public function getAllQuestionContent() {
    	try{
            $db = application_common_dbutil::getDb();
            $select = $db->select();
            $select->from('question', array('id','content'));
            $sql = $select->__toString();
            $result = $db->query($sql);
            $rows = $result->fetchAll();
            if($rows){
                return $rows;
            }
            return false;
    	}
    	catch(Zend_Exception $e){
            application_common_logutil::warn($e->getMessage());
            return false;
        }
    }
    
    /**
     * Get questions' content by id;
     * @param <type> $qid
     * @return a string representing question's content;
     */
	public function getQuestionContentById($qid){
		try {
    		$row = $this->getQuestionById($qid);
    		return $row['content'];
		}
		catch(Zend_Exception $e){
            application_common_logutil::warn($e->getMessage());
            return false;
        }
    }

    public function getQuestionTypeName($q){
        if(is_int($q)){
            $q = $this->getQuestionById(intval($q));
        }
        if(is_array($q)){
            $type = isset($q['typename'])?$q['typename']:'';
        }
        $map = application_common_subjectutil::getQuestionTypeId2Name(SUBJECT);
        if($map){
            return $map[$type];
        }
        return false;
    }

    public function getQuestionLevelName($q){
        if(is_int($q)){
            $q = $this->getQuestionById(intval($q));
        }
        if(is_array($q)){
            $type = isset($q['level'])?$q['level']:'';
        }
        return "难度$type";
    }

    public function increaseCount($qid, $field, $num){
        $qid = intval($qid);
        $field = strval($field);
        $num = intval($num);
        $table = $this->_name;
        $sql = "update $table set $field=$field + $num where id=$qid";
        return $this->getAdapter()->query($sql);
    }
    
    public function getQuestionByContent($cnt) {
    	$db = $this->getAdapter();
        $where = $db->quoteInto('content = ?', $cnt);
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
    
    public function getQuestionBySimContent($cnt) {
    	$db = $this->getAdapter();
    	$col = $db->quoteIdentifier('content');
    	$where = $db->quoteInto("$col LIKE ?", "%$cnt%");
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
    
	public function getQuestionBySimContent2($cnt) {
    	$db = $this->getAdapter();
    	$col = $db->quoteIdentifier('content');
    	$where = $db->quoteInto("$col LIKE ?", "%$cnt%");
    	$result = $this->fetchAll($where);
    	if($result){
    		return $result->toArray();
    	}
    	return false;
    }
    
    public function getQuestionBySimContentWithPage($cnt,$page,$number) {
    	$db = $this->getAdapter();
    	
    	$select = $db->select();
    	$select->from('question', array('id','createTime','lastmodifyTime','type','level','content','source','category','answer','difficulty','encryptid'));
    	$select->limitPage($page, $number);
    	
    	if($cnt != ""){
    		$select->where("content like ?", "%$cnt%");
    	}
    	
    	$sql = $select->__toString();
    	$result = $db->query($sql);
        $rows = $result->fetchAll();
    	if($rows){
    		return $rows;
    	}
    	return false;
    }
    
    public function UpdateContent($qid,$cnt) {
    	$qid = intval($qid);
        $table = $this->_name;
        $sql = "update $table set content='$cnt' where id=$qid";
        return $this->getAdapter()->query($sql);
    }
    
    public function UpdateAnswer($qid,$ans) {
    	$qid = intval($qid);
        $table = $this->_name;
        $sql = "update $table set answer='$ans' where id=$qid";
        return $this->getAdapter()->query($sql);
    }
    
    public function UpdataCategory($qid,$category) {
    	$qid = intval($qid);
        $table = $this->_name;
        $sql = "update $table set category=$category where id=$qid";
        return $this->getAdapter()->query($sql);
    }
    
    public function UpdateSource($qid,$source) {
    	$qid = intval($qid);
        $table = $this->_name;
        $sql = "update $table set source=$source where id=$qid";
        return $this->getAdapter()->query($sql);
    }
    
    public function UpdateType($qid,$type) {
    	$qid = intval($qid);
        $table = $this->_name;
        $sql = "update $table set type=$type where id=$qid";
        return $this->getAdapter()->query($sql);
    }
    
    public function UpdataLevel($qid,$level) {
    	$qid = intval($qid);
    	$table = $this->_name;
    	$sql = "update $table set level=$level where id=$qid";
    	return $this->getAdapter()->query($sql);
    }
    
    public function UpdateEncryptid($qid,$encryptid) {
    	$qid = intval($qid);
    	$table = $this->_name;
    	$sql = "update $table set encryptid='$encryptid' where id=$qid";
    	return $this->getAdapter()->query($sql);
    }
    
    public function UpdateDifficulty($qid,$diff) {
    	$qid = intval($qid);
        $table = $this->_name;
        $sql = "update $table set difficulty=$diff where id=$qid";
        return $this->getAdapter()->query($sql);
    }
    
    public function DeleteQuestionById($id) {
    	$qid = intval($id);
        $table = $this->_name;
        $sql = "delete from $table where id=$qid";
        return $this->getAdapter()->query($sql);
    }
    
    public function getAllQuestion() {
    	 $db = application_common_dbutil::getDb();
         $select = $db->select();
         $select->from('question', array('id','createTime','lastmodifyTime','type','level','content','source','category','answer','difficulty'));
         $sql = $select->__toString();
         $result = $db->query($sql);
         $rows = $result->fetchAll();
         if($rows){
         	return $rows;
         }
         return false;
    }
    
    public function getPaginationQuestion($page,$count) {
    	$db = application_common_dbutil::getDb();
	    $select = $db->select();
	    $select->from('question', array('id','createTime','lastmodifyTime','type','level','content','source','category','answer','difficulty'));
	    $select->limitPage($page, $count);
	    $sql = $select->__toString();
        $result = $db->query($sql);
        $rows = $result->fetchAll();
        if($rows) {
        	return $rows;
        }
        return false;
    }
    
    public function retrieve($source,$type,$level,$difficulty) {
        $db = application_common_dbutil::getDb();
        $select = $db->select();
        $select->from($this->_name, array('id','createTime','lastmodifyTime','type','level','content','source','answer','difficulty','encryptid'));
    	if($source != ""){
            $select->where("floor(source/100) = ?", intval($source));
        }
    	if($type != ""){
            $select->where("type=?", intval($type));
        }
    	if($level != ""){
            $select->where("level=?", intval($level));
        }
    	if($difficulty != ""){
            $select->where("difficulty=?", intval($difficulty));
        }
        $sql = $select->__toString();
        $result = $db->query($sql);
       	$result = $result->fetchAll();
        if($result){
            return $result;
        }
        return 0;
    }
    
    public function retrieveWithNumber($source,$type,$level,$difficulty,$page,$number) {
    	$db = application_common_dbutil::getDb();
    	$select = $db->select();
    	$select->from($this->_name, array('id','createTime','lastmodifyTime','type','level','content','source','answer','difficulty','encryptid'));
    	if($source != ""){
    		$select->where("floor(source/100) = ?", intval($source));
    	}
    	if($type != ""){
    		$select->where("type=?", intval($type));
    	}
    	if($level != ""){
    		$select->where("level=?", intval($level));
    	}
    	if($difficulty != ""){
    		$select->where("difficulty=?", intval($difficulty));
    	}
    	$select->limitPage($page, $number);
    	$sql = $select->__toString();
    	$result = $db->query($sql);
    	$result = $result->fetchAll();
    	if($result){
    		return $result;
    	}
    	return false;
    }
    
	public function getRecentVisitedQuestions($num){
        try{
            $db = application_common_dbutil::getDb();
	    	$select = $db->select();
	    	$select->from('record', 'question_id');
	    	$select->order('createTime desc');
	    	$select->limitPage(1, $num);
	    	$select->distinct();
	    	$sql = $select->__toString();
            $result = $db->query($sql);
            $rows = $result->fetchAll();
            $data = array();
            if($rows){
                foreach($rows as $row){
		    		$question_id = $row['question_id'];
                    $question = $this->getQuestionById($question_id);
                    if(!$question){
                        continue;
                    }
                    $data[] = $question;
                }
            }
            else {
	            $data = $this->retrieveWithNumber("","","","",1,$num);
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
