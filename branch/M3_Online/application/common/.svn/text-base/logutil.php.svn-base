<?php
class application_common_logutil{
    private static function getLogger(){
        $time = date('m-d H:i:s', time());
        $ip = application_common_util::getIp();
        $trace = debug_backtrace();
        $depth = 1;
        $file = basename($trace[$depth]['file']);
        $line = $trace[$depth]['line'];
        $uri = isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : '';
        $format = "[$time] [%priorityName%] [$ip] [$file:$line] [$uri] [%message%]" . PHP_EOL;
        $formatter = new Zend_Log_Formatter_Simple($format);
        $writer = new Zend_Log_Writer_Stream(LOG_FILE);
        $writer->setFormatter($formatter);
        $logger = new Zend_Log($writer);
        return $logger;
    }

    private static function free($logger){
        $logger = null;
    }

    public static function debug($message){
        $logger = self::getLogger();
        $logger->log($message, Zend_Log::DEBUG);
        self::free($logger);
    }

    public static function info($message){
        $logger = self::getLogger();
        $logger->log($message, Zend_Log::INFO);
        self::free($logger);
    }

    public static function warn($message){
        $logger = self::getLogger();
        $logger->log($message, Zend_Log::WARN);
        self::free($logger);
    }

    public static function fatal($message){
        $logger = self::getLogger();
        $logger->log($message, Zend_Log::EMERG);
        self::free($logger);
    }
}
?>
