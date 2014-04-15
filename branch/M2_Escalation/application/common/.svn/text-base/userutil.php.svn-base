<?php
class application_common_userutil {
	
	/**
     * 设置成登录状态
     * @param <type> $username
     */
    public static function setLoginCookie($username,$expires){
        SetCookie(application_common_constant::COOKIE_USER_NAME, $username,
                  time()+$expires, '/', application_common_constant::COOKIE_DOMAIN);
        SetCookie(application_common_constant::COOKIE_USER_LOGIN_STATUS, 1,
                  time()+$expires, '/', application_common_constant::COOKIE_DOMAIN);
    }
    
	public static function removeLoginCookie() {
    	setcookie(application_common_constant::COOKIE_USER_NAME,NULL);
    	setcookie(application_common_constant::COOKIE_USER_LOGIN_STATUS,NULL);
    }
    
    /**
     * 从Cookie中获得当前用户信息
     */
    public static function getCurUser() {
    	$cookiename = application_common_constant::COOKIE_USER_NAME;
    	if(isset($_COOKIE["$cookiename"])) {
    		return $_COOKIE["$cookiename"];
    	}
    	return false;
    }
    
    /**
     * 根据用户昵称和邮箱信息获取用户记录
     * @param <tyoe> $nickname
     * @param <type> $email
     */
    public static function getUserByNameAndEmail($nickname,$email) {
    	$obj_user = new application_models_user();
    	$row = $obj_user->getUserByName($nickname);
    	if(!empty($row)) {
    		return true;
    	}
    	$row = $obj_user->getUserByEmail($email);
    	if(!empty($row)) {
    		return true;
    	}
    	return false;
    }
    
    /**
     * 根据用户昵称或者邮箱信息获取用户记录
     * @param <type> $name
     * @param <type> $password
     */
    public static function getUserByNameOrEmail($name,$password) {
    	$obj_user = new application_models_user();
    	$row = $obj_user->getUserByNameAndPassword($name,$password);
    	if($row != false) {
    		return $row;
    	}
    	$row = $obj_user->getUserByEmailAndPassword($name,$password);
    	if($row != false) {
    		return $row;
    	}
    	return false;
    }
}