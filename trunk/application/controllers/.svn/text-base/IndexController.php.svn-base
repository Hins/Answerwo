<?php

require_once 'Zend/Controller/Action.php';
require_once 'Zend/Http/Cookie.php';

class IndexController extends Zend_Controller_Action 
{
    public function indexAction()
    {
    	application_common_util::Log();
    	$ip = application_common_util::getIp();
    	application_common_FrontDoor::Check($ip);
    	application_common_FrontDoor::Filter($ip);
    }
}

?>
