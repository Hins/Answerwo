<?php
class application_models_user extends Zend_Db_Table {
    protected function _setup() {
        $db_config = new Zend_Config_Ini(CONFIG_FILE,'table');
        $this->_name = $db_config->table->hinspan_answerwo->user;
        Zend_Db_Table::setDefaultAdapter(application_common_dbutil::getDb());
        parent::_setup();
    }
    public function getUserById($id) {
        $db = $this->getAdapter();
        $where = $db->quoteInto('id = ?', $id);
        $result = $this->fetchAll($where);
        if($result) {
            $result = $result->toArray();
            if(!empty($result)) {
                return $result[0];
            }
        }
        return false;
    }

    public function getUserByName($name) {
        $db = $this->getAdapter();
        $where = $db->quoteInto('name = ?', $name);
        $result = $this->fetchAll($where);
        if($result) {
            $result = $result->toArray();
            if(!empty($result)) {
                return $result[0];
            }
        }
        return false;
    }

    public function getUserByEmail($email) {
        $db = $this->getAdapter();
        $where = $db->quoteInto('email = ?', $email);
        $result = $this->fetchAll($where);
        if($result) {
            $result = $result->toArray();
            if(!empty($result)) {
                return $result[0];
            }
        }
        return false;
    }

    public function getUserByNameAndPassword($name,$password) {
        $db = $this->getAdapter();
        $where = $db->quoteInto('name = ?',$name).$db->quoteInto('and password = ?',md5($password));

        $result = $this->fetchAll($where);
        if($result) {
            $result = $result->toArray();
            if(!empty($result)) {
                $result = $result[0];
                return $result;
            }
        }
        return false;
    }

    public function getUserByEmailAndPassword($email,$password) {
        $db = $this->getAdapter();
        $where = $db->quoteInto('email = ?',$email).$db->quoteInto('and password = ?',md5($password));

        $result = $this->fetchAll($where);
        if($result) {
            $result = $result->toArray();
            if(!empty($result)) {
                return $result[0];
            }
        }
        return false;
    }

    public function updateUserPasswordByName($name,$password) {
        $db = $this->getAdapter();
        $arr = array("password" => new Zend_Db_Expr("md5('".$password."')"));
        $where = $db->quoteInto('name = ?', $name);
        return $this->update($arr, $where);
    }

    public function updateUserActivateByName($name) {
        try{
            $db = $this->getAdapter();
            $arr = array("isActivate" => 1,'activate_time'=>date('Y-m-d H:i:s', time()));
            $where = $db->quoteInto('name = ?', $name);
            return $this->update($arr, $where);
        }
        catch(Zend_Exception $e) {
            application_common_logutil::warn($e->getMessage());
        }
    }

    public function getSlaveUserList($page=1, $limit=10){
        return $this->_getUserList("type=" . application_common_constant::REGISTER_USER_TYPE_SLAVE, $page, $limit);
    }

    public function getSlaveUserCount(){
        return $this->_getUserCount("type=" . application_common_constant::REGISTER_USER_TYPE_SLAVE);
    }

    public function getUserList($type=-1, $activate=-1, $order='id desc', $page=1, $limit=10){
        $type = intval($type);
        $activate = intval($activate);
        $page = intval($page);
        $limit = intval($limit);
        $db = application_common_dbutil::getDb();
        $select = $db->select();
        $select->from($this->_name, '*');
        if($type>-1){
            $select->where("type=?", $type);
        }
        if($activate>-1){
            $select->where("isActivate=?", $activate);
        }
        if(trim($order)!=''){
            $select->order($order);
        }
        $select->limitPage($page, $limit);
        $sql = $select->__toString();
        $result = $db->query($sql);
        return $result->fetchAll();
    }

    public function getUserCount($type=-1, $activate=-1){
        $type = intval($type);
        $activate = intval($activate);
        $db = application_common_dbutil::getDb();
        $select = $db->select();
        $select->from($this->_name, 'count(id) as c');
        if($type>-1){
            $select->where("type=?", $type);
        }
        if($activate>-1){
            $select->where("isActivate=?", $activate);
        }
        $sql = $select->__toString();
        $result = $db->query($sql);
        $result = $result->fetchAll();
        if($result){
            return $result[0]['c'];
        }
        return 0;
    }
    
    private function _getUserList($where, $page=1, $limit=10){
        $db = application_common_dbutil::getDb();
        $select = $db->select();
        $select->from($this->_name, '*');
        $select->where($where);
        $select->order('id desc');
        $select->limitPage($page, $limit);
        $sql = $select->__toString();
        $result = $db->query($sql);
        return $result->fetchAll();
    }

    private function _getUserCount($where){
        $db = application_common_dbutil::getDb();
        $select = $db->select();
        $select->from($this->_name, 'count(id) as c');
        $select->where($where);
        $sql = $select->__toString();
        $result = $db->query($sql);
        $result = $result->fetchAll();
        if($result){
            return $result[0]['c'];
        }
        return 0;
    }

    public function updateUserLoginlogByName($name,$loginlog) {
        $db = $this->getAdapter();
        $arr = array("loginlog" => $loginlog);
        $where = $db->quoteInto('name = ?', $name);
        return $this->update($arr, $where);
    }

    public function updateUserLoginlogByEmail($email,$loginlog) {
        $db = $this->getAdapter();
        $arr = array("loginlog" => $loginlog);
        $where = $db->quoteInto('email = ?', $email);
        return $this->update($arr, $where);
    }
    
    public function UpdateUserEmail($name,$email) {
    	$db = $this->getAdapter();
        $arr = array("email" => $email);
        $where = $db->quoteInto('name = ?', $name);
        return $this->update($arr, $where);
    }
    
	public function UpdateUserRole($name,$role) {
    	$db = $this->getAdapter();
        $arr = array("role" => intval($role));
        $where = $db->quoteInto('name = ?', $name);
        return $this->update($arr, $where);
    }
    
    public function getAllUser() {
    	$db = application_common_dbutil::getDb();
        $select = $db->select();
        $select->from('user', array('id','name','email','role'));
        $sql = $select->__toString();
        $result = $db->query($sql);
        $rows = $result->fetchAll();
        if($rows){
        	return $rows;
        }
        return false;
    }
    
    public function DeleteUserByName($name) {
    	$table = $this->_name;
    	$sql = "delete from $table where name='$name'";
    	return $this->getAdapter()->query($sql);
    }
    
    public function getPaginationUser($page,$count) {
    	$db = application_common_dbutil::getDb();
	    $select = $db->select();
	    $select->from('user', array('id','name','email','role'));
	    $select->limitPage($page, $count);
	    $sql = $select->__toString();
        $result = $db->query($sql);
        $rows = $result->fetchAll();
        if($rows) {
        	return $rows;
        }
        return false;
    }
}
?>