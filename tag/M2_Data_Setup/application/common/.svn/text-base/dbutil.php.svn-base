<?php
require_once 'Zend/Db.php';
require_once 'Zend/Exception.php';

class application_common_dbutil{
    public static function getDb(){
	try{
            $db_config = new Zend_Config_Ini(CONFIG_FILE,'db');
            $adapter = $db_config->db->hinspan_answerwo->adapter;
            $params = array(
                'host'=>$db_config->db->hinspan_answerwo->params->host,
                'port'=>$db_config->db->hinspan_answerwo->params->port,
                'username'=>$db_config->db->hinspan_answerwo->params->username,
                'password'=>$db_config->db->hinspan_answerwo->params->password ,
                'dbname'=>$db_config->db->hinspan_answerwo->params->dbname,
                );
				
	    $db = Zend_Db::factory ($adapter, $params);
	    if($db){
		$db->query("SET NAMES 'utf8'");
	    }
	    return $db;
        }
        catch(Zend_Exception $e){
            application_common_logutil::fatal($e->getMessage());

        }
    }
}
?>
