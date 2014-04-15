<?php
error_reporting(E_ALL|E_STRICT);
ini_set('display_errors', 1);
date_default_timezone_set('PRC');

$oldIncludePath = get_include_path();
$newIncludePath = implode(
    PATH_SEPARATOR, 
    array(
	realpath('.'),
	realpath('./application/'),
	realpath('/home/hinspan/lib/Zend/library'),
        $oldIncludePath,
    )
);

set_include_path($newIncludePath);

require_once 'Zend/Loader/Autoloader.php';
$loader = Zend_Loader_Autoloader::getInstance();
$loader->registerNamespace('application_');

Zend_Loader::loadClass('Zend_Config_Ini');
Zend_Loader::loadClass('Zend_Registry');

require_once './application/common/init.php';

$router = new Zend_Controller_Router_Rewrite();
$frontController = Zend_Controller_Front::getInstance();
$frontController->setRouter($router);
$frontController->throwExceptions(true);
$frontController->setControllerDirectory('./application/controllers');
$frontController->setParam('useDefaultControllerAlways', true);
Zend_Session::start();
// run!
try {
	$frontController->dispatch();
}
catch(Exception $e) {
	header("Location: http://www.answerwo.com/s/error");
}
