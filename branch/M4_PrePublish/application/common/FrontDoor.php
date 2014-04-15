<?php

class application_common_FrontDoor
{
	public static function Check($ip)
	{
		try {
			$ip = "IP".$ip;
			if(isset($_SESSION[$ip]) && $_SESSION[$ip]["flag"] != "1")
			{
				$old_time = $_SESSION[$ip]["createTime"];
				$new_time = time();
				$interval = intval($new_time) - intval($old_time);
				if($_SESSION[$ip]["count"] > 10)
				{
					$_SESSION[$ip]["flag"] = "1";
				}
				else if($interval > 10)
				{
					unset($_SESSION[$ip]);
				}
				else
				{
					$count = $_SESSION[$ip]["count"];
					$count++;
					$_SESSION[$ip]["count"] = $count;
				}
			}
			else if(!isset($_SESSION[$ip]))
			{
				$IpNamespace = new Zend_Session_Namespace($ip,true);
				$cur_time = time();
				$IpNamespace->createTime = $cur_time;//设置值
	       		$IpNamespace->count = 0;
	       		$IpNamespace->flag = "0";
			}
		}
		catch(Zend_Exception $e){
				echo $e->getMessage()."<br>";
		}
	}
	
	public static function Filter($ip)
	{
		$ip = "IP".$ip;
		if(isset($_SESSION[$ip]) && $_SESSION[$ip]["flag"] == "1")
		{
			return true;
		}
		return false;
	}
}

?>