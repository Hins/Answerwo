<?php
class application_common_util {
    /**
     * 获取用户ip
     */
    public static function getIp() {
        if( isset($_SERVER['HTTP_X_FORWARDED_FOR']) ) {
            $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
        }
        elseif( isset($_SERVER['HTTP_CLIENTIP']) ) {
            $ip = $_SERVER['HTTP_CLIENTIP'];
        }
        elseif( isset($_SERVER['REMOTE_ADDR']) ) {
            $ip = $_SERVER['REMOTE_ADDR'];
        }
        elseif( getenv('HTTP_X_FORWARDED_FOR') ) {
            $ip = getenv('HTTP_X_FORWARDED_FOR');
        }
        elseif( getenv('HTTP_CLIENTIP') ) {
            $ip = getenv('HTTP_CLIENTIP');
        }
        elseif( getenv('REMOTE_ADDR') ) {
            $ip = getenv('REMOTE_ADDR');
        }
        else {
            $ip = '127.0.0.1';
        }

        $pos = strpos($ip, ',');
        if( $pos > 0 ) {
            $ip = substr($ip, 0, $pos);
        }

        return trim($ip);
    }

    /**
     * 获取域名中的科目字段
     * @return <type>
     */
    public static function getCurrentSubject(){
        $str = $_SERVER['HTTP_HOST'];
        $domainarr = explode(".", $str);
        if(!empty($domainarr)){
            return $domainarr[0];
        }
        return 'www';
    }

    /**
     * 输出分页
     */
    public static function showpage($urlprefix, $totalpage, $currentpage=1, $start=1, $end=10) {
        $step = 5;
        if($currentpage<1){
            $currentpage = 1;
        }
        if($currentpage>$totalpage){
            $currentpage = $totalpage;
        }
        if($currentpage <= $start){
            $start -= $step;
            $end -= $step;
        }
        if($currentpage >= $end){
            $start += $step;
            $end += $step;
        }
        if($start<1){
            $start = 1;
            $end = 10;
        }
        if($end>$totalpage){
            $start = $totalpage - 10;
            $end = $totalpage;
        }
        $strpage = "";
        $pi = $start;
        while($pi<=$end){
            if($pi==$currentpage){
                $strpage .="<span class='current'>$pi</span>";
            }
            else{
                $strpage .="<a href='" . $urlprefix . "p=$pi&sp=$start&ep=$end'>" . $pi ."</a>";
            }
            $pi++;
        }

        return $strpage;
    }

    /**
     * 封装模板json数据
     * 数组结构：
     * array(
     * 'status'=>1， //0:失败，1：成功
     * ‘result’=>..., //如果成功，为结果数据，如果失败，则为错误号（有些情况可能会附加返回更多的信息）
     * )
     * 比如:
     * array(
     * 'status'=>1,
     * 'result'=>array(....), //结果数组
     * )
     * array(
     * 'status'=>1,
     * 'result'=>1233, //id，或者数量等
     * )
     * array(
     * 'status'=>0,
     * 'result'=>1004, //错误号
     * )
     * array(
     * 'status'=>0,
     * 'result'=>array(
     *     'error_code'=>1005, //错误号
     *     'other' => ... //更多信息
     * )
     * )
     * @param <type> $status
     * @param <type> $result
     * @return <type>
     */
    public static function resultPack($status, $result){
        $ret = array("status"=>$status, "result"=>$result);
        return json_encode($ret);
    }

    /**
     * 按字节截取字符串（保证英文中文等宽）
     * @param <type> $str
     * @param <type> $size 汉字个数(英文字母为了保持与这些汉字同样的宽度，会截取更多的字符)
     */
    public static function substrByByte($str, $size, $suffix=null){
        if($str && strlen($str)>$size*3){
            if($suffix){
                $size--;
            }
            $str = mb_strcut($str, 0, $size*3, 'utf-8');
            if($suffix){
                $str .= $suffix;
            }
        }
        return $str;
    }

    /**
     * 邮箱格式检查
     */
    public static function checkEmailFormat($email){
        return preg_match("/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/i",$email);
    }

    /**
     * 用户名格式检查
     * @param <type> $name
     * @return <type>
     */
    public static function checkUserNameFormat($name){
        return preg_match("/^(?!_|\s\')[A-Za-z0-9_\x80-\xff\s\']+$/i",$name);
    }

    /**
     * 为清除浏览器缓存生成一个url参数后缀
     * @return <type>
     */
    public static function flushBrowserCache(){
        return "_" .time();
    }

    /**
     * 通过科目域名获取科目id
     * @param <type> $str
     * @return <type>
     */
    public static function getSubjectIdFromDomain($str){
        $config = new Zend_Config_Ini(CONFIG_FILE,'subject');
        return intval($config->subject->domain2id->$str);
    }

    public static function getSubjectNameFromDomain($str){
        $config = new Zend_Config_Ini(CONFIG_FILE,'subject');
        return $config->subject->domain2name->$str;
    }

    /**
     * 得到短日期
     * @param <type> $date
     * @return <type>
     */
    public static function shortChineseDate($timestamp){
        $timestamp = intval($timestamp);
        return date('Y年n月j日',$timestamp);
    }

    /**
     * 得到标准格式长日期
     * @param <type> $timestamp
     * @return <type>
     */
    public static function standarDateTime($timestamp){
        if(is_string($timestamp)){
            $timestamp = strtotime($timestamp);
        }
        return date('Y-m-d H:i:s', $timestamp);
    }

    /**
     * 标准格式的当前时间
     * @return <type>
     */
    public static function now(){
        return date('Y-m-d H:i:s');
    }

    /**
     * 格式化时间
     * @param <type> $datetime
     * @return <type>
     */
    public static function timeFormat($datetime){
        $current = time();
        $timestamp = strtotime($datetime);
        $distance = $current - $timestamp;
        $minute = 60;
        $hour = 3600;
        $day = 3600 *24;
        $result = self::shortChineseDate($timestamp);
        if($distance<$minute){
            $result = $distance . "秒钟前";
        }
        else if($distance<$hour/2){
            $result = intval($distance/$minute) . "分钟前";
        }
        else if($distance<$hour){
            $result = "半小时前";
        }
        else if($distance<$day){
            $result = intval($distance/$hour) . "小时前";
        }
        else if($distance<$day*7){
            $result = intval($distance/$day) . "天前";
        }
        return $result;
    }
	
	public static function RevTypeMap($num)
	{
		$num = intval($num);
		switch($num) {
			case 1:
				return "词汇";
			case 2:
				return "文法";
			case 3:
				return "阅读";
			case 4:
				return "原文";
			case 5:
				return "作文";
			case 6:
				return "听力";
			default:
				return "";
		}
	}
	
	public static function TypeMap($str)
	{
		switch($str) {
			case "词汇":
				return 1;
			case "文法":
				return 2;
			case "阅读":
				return 3;
			case "原文":
				return 4;
			case "作文":
				return 5;
			case "听力":
				return 6;
			default:
				return "";
		}
	}
	
	public static function RevDifficultyMap($num)
	{
		$num = intval($num);
		switch($num) {
			case 1:
				return "很难";
			case 2:
				return "难";
			case 3:
				return "普通";
			case 4:
				return "简单";
			case 5:
				return "很简单";
			default:
				return "";
		}
	}
	
	public static function DifficultyMap($str)
	{
		switch($str) {
			case "很难":
				return 1;
			case "难":
				return 2;
			case "普通":
				return 3;
			case "简单":
				return 4;
			case "很简单":
				return 5;
			default:
				return "";
		}
	}
	
	public static function GetLevel($source)
	{
		if(($start = stripos($source,"-")) !== false) {
			return intval(substr($source,$start+1));
		}
		return $this->_default_level;
	}
	
	public static function GetSource($source)
	{
		if(($start = stripos($source,"-")) !== false) {
			return substr($source,0,$start);
		}
		return $this->_default_source;
	}
	
	public static function SDBMHash($str) {
		$hash = 0;
		$md5str = md5($str);
		$len = strlen($md5str);
		for($i = 0; $i < $len; $i++) {
			$hash = intval($md5str[$i]) + ($hash << 6) + ($hash << 16) - $hash;
		}
		return md5($hash);
	}
	
	public static function inject_check($sql_str)
	{
     	return preg_match("/(select|insert|update|delete|\'|\*|union|into|load_file|outfile)/i", $sql_str);    // 进行过滤
 	}
 	
 	public static function str_check($str)
	{    
 		if(!get_magic_quotes_gpc()) { // 判断magic_quotes_gpc是否打开
      		$str=addslashes($str);    // 进行过滤    
 		}  
 		return $str;
	}
}
?>