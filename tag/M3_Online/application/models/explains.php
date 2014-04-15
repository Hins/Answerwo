<?php
class application_models_explains extends Zend_Db_Table{
    protected function _setup(){
        $db_config = new Zend_Config_Ini(CONFIG_FILE,'table');
        $this->_name = $db_config->table->hinspan_answerwo->explains;
        Zend_Db_Table::setDefaultAdapter(application_common_dbutil::getDb());
        parent::_setup();
    }

    public function getExplainsById($eid){
	$result = $this->fetchRow('id=' . intval($eid));
        if($result){
            return $result->toArray();
        }
        return false;
    }
    
    public function getExplainByName($exp) {
    	$db = $this->getAdapter();
        $where = $db->quoteInto('content = ?', $exp);
        $result = $this->fetchAll($where);
    	if($result){
        	$result = $result->toArray();
            if(!empty($result)) {
                return $result[0];
            }
        }
        return false;
    }

    public function getExplains($eid){
        $arr_explains = array();
        $exp = $this->getExplainsById($eid);
        if($exp){
            $arr_explains['obj'] = $exp;
        }
        $obj_exinfo = new application_models_explainexinformation();
        $ext = $obj_exinfo->getExProperty($eid);
        if($ext){
            $arr_explains['ext'] = $ext->toArray();
        }
        return $arr_explains;
    }

    public function packExplains($eid){
        $arr_explains = array();
        $exp = $this->getExplainsById($eid);
        if($exp){
            $exp['html_content'] = application_common_htmlutil::ubb2html($exp['content']);
            $arr_explains['obj'] = $exp;
        }
        $obj_exinfo = new application_models_explainexinformation();
        $ext = $obj_exinfo->getExProperty($eid);
        if($ext){
            $arr_explains['ext'] = $ext;
        }
        return $arr_explains;
    }
    
    public function UpdateContent($id,$cnt) {
    	$eid = intval($id);
        $table = $this->_name;
        $sql = "update $table set content='$cnt' where id=$eid";
        return $this->getAdapter()->query($sql);
    }
    
    public function DeleteExplainById($id) {
    	$eid = intval($id);
        $table = $this->_name;
        $sql = "delete from $table where id=$eid";
        return $this->getAdapter()->query($sql);
    }
    
    public function getMaxId() {
    	$db = application_common_dbutil::getDb();
	    $select = $db->select();
	    $select->from('explains', array('max'=>new Zend_Db_Expr('MAX(id)')));
	    $sql = $select->__toString();
        $result = $db->query($sql);
        $rows = $result->fetchAll();
        if($rows) {
        	return $rows[0];
        }
        return false;
    }
    
	public function getAllExplains() {
		$db = application_common_dbutil::getDb();
		$select = $db->select();
		$select->from('explains', array('id','createTime','lastmodifyTime','creator','content'));
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
