<?php
class application_models_answer extends Zend_Db_Table{
    protected function _setup(){
        $db_config = new Zend_Config_Ini(CONFIG_FILE,'table');
        $this->_name = $db_config->table->hinspan_answerwo->answer;
        Zend_Db_Table::setDefaultAdapter(application_common_dbutil::getDb());
        parent::_setup();
    }

    public function getAnswerById($aid){
	$result = $this->fetchRow('id=' . intval($aid));
        if($result){
            return $result->toArray();
        }
        return false;
    }
    
    public function getAnswer($aid){
        $arr_answer = array();
        $a = $this->getAnswerById($aid);
        if($a){
            $arr_answer['obj'] = $a;
        }
        $obj_exinfo = new application_models_answerexinformation();
        $e = $obj_exinfo->getExProperty($aid);
        if($e){
            $arr_answer['ext'] = $e;
        }
        return $arr_answer;
    }

    public function packAnswer($aid){
        $arr_answer = array();
        $a = $this->getAnswerById($aid);
        if($a){
            $a['html_content'] = application_common_htmlutil::ubb2html($a['content']);
            $arr_answer['obj'] = $a;
        }
        $obj_exinfo = new application_models_answerexinformation();
        $e = $obj_exinfo->getExProperty($aid);
        if($e){
            $arr_answer['ext'] = $e;
        }
        return $arr_answer;
    }
    
    public function getAnswerByContent($cnt) {
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
    
    public function UpdateContent($id,$cnt) {
    	$aid = intval($id);
        $table = $this->_name;
        $sql = "update $table set content='$cnt' where id=$aid";
        return $this->getAdapter()->query($sql);
    }
    
    public function DeleteAnswerById($id) {
    	$aid = intval($id);
        $table = $this->_name;
        $sql = "delete from $table where id=$aid";
        return $this->getAdapter()->query($sql);
    }
}
?>
