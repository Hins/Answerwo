<?php

class QController extends Zend_Controller_Action {
	
	private function _calculatePercentage($qid,$answer) {
		$obj_record = new application_models_record();
		$pers = $obj_record->getAnswers($qid);
		if($pers == false) {
			$this->view->correctpercentage = 0;
			$this->view->percentageA = 0;
			$this->view->percentageB = 0;
			$this->view->percentageC = 0;
			$this->view->percentageD = 0;
		}
		else {
			$totalper = 0;
			$correctper = 0;
			foreach($pers as $per) {
				$totalper += intval($per["count"]);
				if($per["answer"] == intval($answer)) {
					$correctper = intval($per["count"]);
				}
			}
			foreach($pers as $per) {
				if($per["answer"] == "1") {
					$this->view->percentageA = intval((intval($per["count"]) / $totalper) * 100);
				}
				if($per["answer"] == "2") {
					$this->view->percentageB = intval((intval($per["count"]) / $totalper) * 100);
				}
				if($per["answer"] == "3") {
					$this->view->percentageC = intval((intval($per["count"]) / $totalper) * 100);
				}
				if($per["answer"] == "4") {
					$this->view->percentageD = intval((intval($per["count"]) / $totalper) * 100);
				}
			}
			if(!isset($this->view->percentageA)) {
				$this->view->percentageA = "0";
			}
			if(!isset($this->view->percentageB)) {
				$this->view->percentageB = "0";
			}
			if(!isset($this->view->percentageC)) {
				$this->view->percentageC = "0";
			}
			if(!isset($this->view->percentageD)) {
				$this->view->percentageD = "0";
			}
			$this->view->correctpercentage = intval(($correctper / $totalper) * 100);
		}
	}
	
	private function _addanswer($qid,$uid,$answeroption,$encryptid=NULL) {
		$obj_record = new application_models_record();
		if($encryptid == NULL) {
			$arr = array(
						"createTime" => new Zend_Db_Expr("current_timestamp()"),
    					"question_id" => intval($qid),
    					"user_id" => $uid,
						"answer" => intval($answeroption)
						);
		}
		else {
			$arr = array(
						"createTime" => new Zend_Db_Expr("current_timestamp()"),
    					"question_id" => intval($qid),
    					"user_id" => $uid,
						"answer" => intval($answeroption),
						"encryptid" => $encryptid
						);
		}
		$obj_record->insert($arr);
	}
	
	public function detailAction() {
		application_common_util::Log();
		$ip = application_common_util::getIp();
    	application_common_FrontDoor::Check($ip);
		if(application_common_FrontDoor::Filter($ip)) {
			header('Location: http://www.answerwo.com/s/robot');
		}
		//modify some content;
		if(isset($_POST["encryptid"])) {
			try {
				//sql filter;
				if(application_common_util::inject_check($_POST["encryptid"])) {
					return false;
				}
		
				//get current user information;
				$curuser = application_common_userutil::getCurUser();
				if($curuser != false) {
					$this->view->curuser = $curuser;
				}
				elseif(isset($_POST["username"])) {
					if(application_common_util::inject_check($_POST["username"]) || (isset($_POST["password"]) && application_common_util::inject_check($_POST["password"]))) {
						return false;
					}
					$name = application_common_util::str_check($_POST["username"]);
					$password = application_common_util::str_check($_POST["password"]);
					if(($row=application_common_userutil::getUserByNameOrEmail($name,$password)) != false) {
						application_common_userutil::setLoginCookie($row["name"], ((isset($_POST["autologin"]) && $_POST["autologin"] == 1) ? application_common_constant::COOKIE_USER_AUTO_LOGIN_EXPIRE_SECONDS : application_common_constant::COOKIE_USER_UNIQUE_EXPIRE_SECONDS));
						$this->view->curuser = $name;
						$curuser = $name;
					}
					else {
						$this->view->logininformation = "用户名和密码不一致!";
						return false;
					}
				}
				
				//get current user id;
				$obj_questionTOexplain = new application_models_questiontoexplain();
				$obj_user = new application_models_user();
				if($curuser != false) {
					$arr = $obj_user->getUserByName($curuser);
					$curuser_id = intval($arr["id"]);
				}
				else {
					$curuser_id = 0;
				}
		
				$this->view->encryptid = $_POST["encryptid"];
				$obj_question = new application_models_question();
				$arr = $obj_question->getQuestionByEncryptId($_POST["encryptid"]);
				if(!empty($arr)) {
		
					//Add user answer;
					if(isset($_POST["answeroption"])) {
						$this->_addanswer($arr["id"],$curuser_id,$_POST["answeroption"]);
					}
		
					$this->view->content = $arr["content"];
					$len = strlen($arr["content"]);
					$this->view->difficulty = $arr["difficulty"];
					$this->view->diff = application_common_util::DifficultyMap($arr["difficulty"]);
					$this->view->level = $arr["level"];
					$this->view->type = application_common_util::RevTypeMap($arr["type"]);
					$this->view->answer = $arr["answer"];
					//source;
					$this->view->year = intval($arr["source"]);
					if(intval(intval($arr["source"])/100) > 1000) {
						$this->view->year = intval(intval($arr["source"])/100);
						$this->view->month = intval(intval($arr["source"])%100);
					}
					//createTime;
					$date = new Zend_Date($arr["createTime"]);
					$this->view->createYear = $date->get(Zend_Date::YEAR);
					$this->view->createMonth = $date->get(Zend_Date::MONTH);
					$this->view->createDay = $date->get(Zend_Date::DAY);
					//creator;
					$arru = $obj_user->getUserById($arr["creator"]);
					$this->view->creator = $arru["name"];
					
					//calculate percentage;
					$this->_calculatePercentage($arr["id"],$arr["answer"]);
					
					//answers;
					$this->view->answerflag = 1;
					$obj_questionTOanswer = new application_models_questiontoanswer();
					$answerids = $obj_questionTOanswer->getQuestionAnswers($arr["id"]);
					$obj_answer = new application_models_answer();
					$i = 1;
					foreach($answerids as $val) {
						$arra = $obj_answer->getAnswerById($val["answer_id"]);
						$name = "answer$i";
						$this->view->$name = $arra["content"];
						$i++;
					}
					
					//add explain;
					if(isset($_POST["explainButton"])
							&& isset($_POST["explaincontent"])
							&& !application_common_util::inject_check($_POST["explaincontent"])
							&& $_POST["explaincontent"] != "") {
						$explain_obj = new application_models_explains();
						$explaincontent = application_common_util::str_check($_POST["explaincontent"]);
						$arrs = array(
								"createTime" => new Zend_Db_Expr("current_timestamp()"),
								"lastmodifyTime" => new Zend_Db_Expr("current_timestamp()"),
								"creator" => $curuser_id,
								"sequence" => 1,
								"content" => $explaincontent
						);
						$explain_obj->insert($arrs);
						$maxid = $explain_obj->getMaxId();
						if($maxid != false) {
							$arrs = array(
									"createTime" => new Zend_Db_Expr("current_timestamp()"),
									"lastmodifyTime" => new Zend_Db_Expr("current_timestamp()"),
									"creator" => $curuser_id,
									"question_id" => intval($arr["id"]),
									"explain_id" => intval($maxid["max"])
							);
							try {
								$obj_questionTOexplain->insert($arrs);  //an unsolved issue;
							}
							catch(Zend_Exception $e){
		
							}
						}
					}
					//read explain;
					$explainids = $obj_questionTOexplain->getQuestionExplains2($arr["id"]);
					if(!empty($explainids)) {
						$obj_explain = new application_models_explains();
						$explain_arr = array();
						foreach($explainids as $explainid) {
							$explain = $obj_explain->getExplainsById($explainid["explain_id"]);
							$date = new Zend_Date($explain["createTime"],'yyyy-MM-dd HH:mm:ss');
							$date->add('13:00:00', Zend_Date::TIMES);
							$explain["createTime"] = $date->toString('yyyy-MM-dd HH:mm:ss');
							$user_arr = $obj_user->getUserById($explain["creator"]);
							if($user_arr == false) {
								$explain["creator"] = "游客";
							}
							else {
								$explain["creator"] = $user_arr["name"];
							}
							array_push($explain_arr,$explain);
						}
						$this->view->explain = Zend_Json::encode($explain_arr);
					}
		
					//add discuss;
					$obj_discuss = new application_models_discuss();
					if(isset($_POST["discussButton"])
							&& isset($_POST["discusscontent"])
							&& !application_common_util::inject_check($_POST["discusscontent"])
							&& $_POST["discusscontent"] != "") {
						$discuss = application_common_util::str_check($_POST["discusscontent"]);
						if(strpos($discuss,"回复",0) === 0) {
							$end = strpos($discuss,"楼",0);
							$number = substr($discuss,2,$end-2);
							$ids = $obj_discuss->getIdbySequence($number,$arr["id"]);
							$father = $ids["id"];
						}
						else {
							$father = 0;
						}
						$arrs = array(
								"createTime" => new Zend_Db_Expr("current_timestamp()"),
								"lastmodifyTime" => new Zend_Db_Expr("current_timestamp()"),
								"question_id" => intval($arr["id"]),
								"user_id" => $curuser_id,
								"father" => $father,
								"content" => $discuss
						);
						$obj_discuss->insert($arrs);
					}
					//read discuss;
					$arrs = $obj_discuss->getAllDiscussByqid($arr["id"]);
					if($arrs != false) {
						$i = 0;
						foreach($arrs as $val) {
							$user = $obj_user->getUserById($val["user_id"]);
							if($user == false) {
								$arrs[$i]["user_id"] = "游客";
							}
							else {
								$arrs[$i]["user_id"] = $user["name"];
							}
							$date = new Zend_Date($arrs[$i]["createTime"],'yyyy-MM-dd HH:mm:ss');
							$date->add('13:00:00', Zend_Date::TIMES);
							$arrs[$i]["createTime"] = $date->toString('yyyy-MM-dd HH:mm:ss');
							$i++;
						}
						$this->view->discuss = Zend_Json::encode($arrs);
					}
		
					$obj_favorite = new application_models_favorite();
					$fids = $obj_favorite->getCountByQid($arr["id"]);
					$this->view->savecount = $fids["count"];
					//add favorite
					if(isset($_POST["favorite"]) && $_POST["favorite"] == "1") {
						$arrf = $obj_favorite->getByqidanduid(intval($arr["id"]),$curuser_id);
						if($arrf == false) {
							$arrs = array(
									"createTime" => new Zend_Db_Expr("current_timestamp()"),
									"lastmodifyTime" => new Zend_Db_Expr("current_timestamp()"),
									"question_id" => intval($arr["id"]),
									"user_id" => $curuser_id,
							);
							$obj_favorite->insert($arrs);
							$this->view->favoritesuccess = 1;
						}
					}
					return true;
				}
				else {
					$this->view->information = "对不起，没有这道题";
					return false;
				}
			}
			catch(Zend_Exception $e){
				echo $e->getMessage()."<br>";
				return false;
			}
		}
		//display question detail;
		if(isset($_GET["encryptid"])) {
			try {
				//sql filter;
				if(application_common_util::inject_check($_GET["encryptid"])) {
					return false;
				}
				
				//get current user information;
				$curuser = application_common_userutil::getCurUser();
				if($curuser != false) {
					$this->view->curuser = $curuser;
				}
				
				//get current user id;
				$obj_questionTOexplain = new application_models_questiontoexplain();
				$obj_user = new application_models_user();
				if($curuser != false) {
					$arr = $obj_user->getUserByName($curuser);
					$curuser_id = intval($arr["id"]);
				}
				else {
					$curuser_id = 0;
				}
				
				$this->view->encryptid = $_GET["encryptid"];
				$obj_question = new application_models_question();
				$arr = $obj_question->getQuestionByEncryptId($_GET["encryptid"]);
				if(!empty($arr)) {
					$this->_calculatePercentage($arr["id"],$arr["answer"]);
					
					$this->view->content = $arr["content"];
					$len = strlen($arr["content"]);
					$this->view->difficulty = $arr["difficulty"];
					$this->view->diff = application_common_util::DifficultyMap($arr["difficulty"]);
					$this->view->level = $arr["level"];
					$this->view->type = application_common_util::RevTypeMap($arr["type"]);
					$this->view->answer = $arr["answer"];
					//source;
					$this->view->year = intval($arr["source"]);
					if(intval(intval($arr["source"])/100) > 1000) {
						$this->view->year = intval(intval($arr["source"])/100);
						$this->view->month = intval(intval($arr["source"])%100);
					}
					//createTime;
					$date = new Zend_Date($arr["createTime"]);
					$this->view->createYear = $date->get(Zend_Date::YEAR);
					$this->view->createMonth = $date->get(Zend_Date::MONTH);
					$this->view->createDay = $date->get(Zend_Date::DAY);
					//creator;
					$arru = $obj_user->getUserById($arr["creator"]);
					$this->view->creator = $arru["name"];
					//answers;
					$this->view->answerflag = 1;
					$obj_questionTOanswer = new application_models_questiontoanswer();
					$answerids = $obj_questionTOanswer->getQuestionAnswers($arr["id"]);
					$obj_answer = new application_models_answer();
					$i = 1;
					foreach($answerids as $val) {
						$arra = $obj_answer->getAnswerById($val["answer_id"]);
						$name = "answer$i";
						$this->view->$name = $arra["content"];
						$i++;
					}
					//read explain;
					$explainids = $obj_questionTOexplain->getQuestionExplains2($arr["id"]);
					if(!empty($explainids)) {
						$obj_explain = new application_models_explains();
						$explain_arr = array();
						foreach($explainids as $explainid) {
							$explain = $obj_explain->getExplainsById($explainid["explain_id"]);
							$date = new Zend_Date($explain["createTime"],'yyyy-MM-dd HH:mm:ss');
							$date->add('13:00:00', Zend_Date::TIMES);
							$explain["createTime"] = $date->toString('yyyy-MM-dd HH:mm:ss');
							$user_arr = $obj_user->getUserById($explain["creator"]);
							if($user_arr == false) {
								$explain["creator"] = "游客";
							}
							else {
								$explain["creator"] = $user_arr["name"];
							}
							array_push($explain_arr,$explain);
						}
						$this->view->explain = Zend_Json::encode($explain_arr);
					}
					//read discuss;
					$obj_discuss = new application_models_discuss();
					$arrs = $obj_discuss->getAllDiscussByqid($arr["id"]);
					if($arrs != false) {
						$i = 0;
						foreach($arrs as $val) {
							$user = $obj_user->getUserById($val["user_id"]);
							if($user == false) {
								$arrs[$i]["user_id"] = "游客";
							}
							else {
								$arrs[$i]["user_id"] = $user["name"];
							}
							$date = new Zend_Date($arrs[$i]["createTime"],'yyyy-MM-dd HH:mm:ss');
							$date->add('13:00:00', Zend_Date::TIMES);
							$arrs[$i]["createTime"] = $date->toString('yyyy-MM-dd HH:mm:ss');
							$i++;
						}
						$this->view->discuss = Zend_Json::encode($arrs); 
					}
					
					$obj_favorite = new application_models_favorite();
					$fids = $obj_favorite->getCountByQid($arr["id"]);
					$this->view->savecount = $fids["count"];
					//user login;
					if(isset($_POST["username"])) {
						if(application_common_util::inject_check($_POST["username"]) || (isset($_POST["password"]) && application_common_util::inject_check($_POST["password"]))) {
							return false;
						}
						$name = application_common_util::str_check($_POST["username"]);
						$password = application_common_util::str_check($_POST["password"]);
						if(($row=application_common_userutil::getUserByNameOrEmail($name,$password)) != false) {
							application_common_userutil::setLoginCookie($row["name"], ((isset($_POST["autologin"]) && $_POST["autologin"] == 1) ? application_common_constant::COOKIE_USER_AUTO_LOGIN_EXPIRE_SECONDS : application_common_constant::COOKIE_USER_UNIQUE_EXPIRE_SECONDS));
							$this->view->curuser = $name;
							$curuser = $name;
						}
						else {
							$this->view->logininformation = "用户名和密码不一致!";
							return false;
						}
					}
					//user register;
					if(isset($_POST["nickname"])) {
						if(application_common_util::inject_check($_POST["nickname"]) 
							|| (isset($_POST["password"]) && application_common_util::inject_check($_POST["password"]))
							|| (isset($_POST["repassword"]) && application_common_util::inject_check($_POST["repassword"]))
							|| (isset($_POST["email"]) && application_common_util::inject_check($_POST["email"]))) {
							return false;
						}
						$name = application_common_util::str_check($_POST["nickname"]);
						$password = application_common_util::str_check($_POST["password"]);
						$repassword = application_common_util::str_check($_POST["repassword"]);
						$email = application_common_util::str_check($_POST["email"]);
						
						if(strlen($name) < 6 || strlen($name) > 16) {
							$this->view->registerinformation = "用户名长度不符合规范";
							return false;
						}
						if(strlen($password) < 6 || strlen($password) > 16) {
							$this->view->registerinformation = "密码长度不符合规范";
							return false;
						}
						if($password != $repassword) {
							$this->view->registerinformation = "密码不一致";
							return false;
						}
						if(!ereg("^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+",$email)) {
							$this->view->registerinformation = "邮箱格式不正确";
							return false;
						}
						if(application_common_userutil::getUserByNameAndEmail($name,$email)) {
							$this->view->registerinformation = "对不起，用户名或邮箱已有人注册";
							return false;
						}
						$arr = array(
    							"name" => $name,
    							"password" => new Zend_Db_Expr("md5('".$password."')"),
    							"email" => $email,
    							"role" => 1
    							);
    					$obj_user->insert($arr);
    					application_common_userutil::setLoginCookie($name, application_common_constant::COOKIE_USER_UNIQUE_EXPIRE_SECONDS);
    					$this->view->curuser = $name;
					}
				}
				else {
					$this->view->information = "对不起，没有这道题";
					return false;
				}
			}
			catch(Zend_Exception $e){
				echo $e->getMessage()."<br>";
				return false;
			}
		}
	}
	
	public function searchAction() {
		application_common_util::Log();
		$ip = application_common_util::getIp();
    	application_common_FrontDoor::Check($ip);
		if(application_common_FrontDoor::Filter($ip)) {
			header('Location: http://www.answerwo.com/s/robot');
		}
		try {
			//get current user information;
			$curuser = application_common_userutil::getCurUser();
			if($curuser != false) {
				$this->view->curuser = $curuser;
			}
			
			//get current user id;
			$obj_questionTOexplain = new application_models_questiontoexplain();
			$obj_user = new application_models_user();
			if($curuser != false) {
				$arr = $obj_user->getUserByName($curuser);
				$curuser_id = intval($arr["id"]);
			}
			else {
				$curuser_id = 1;
			}
			
			//get most visited questions
			$obj_question = new application_models_question();
			$arr = $obj_question->getRecentVisitedQuestions(5);
			$i = 0;
			foreach($arr as $val) {
				$arr[$i]["link"] = "http://www.answerwo.com/q/detail?encryptid=".$val["encryptid"];
				$i++;
			}
			$this->view->record = Zend_Json::encode($arr);
			
			if(isset($_GET["query"]) && $_GET["query"] != "") {
				$this->view->query = $_GET["query"];
				
				$obj_favorite = new application_models_favorite();
				//add favorite
				if(isset($_GET["questionid"]) && $_GET["questionid"] != "") {
					$this->view->questionid = $_GET["questionid"];
					$arrf = $obj_favorite->getByqidanduid(intval($_GET["questionid"]),$curuser_id);
					if($arrf == false) {
						$arrs = array(
									"createTime" => new Zend_Db_Expr("current_timestamp()"),
									"lastmodifyTime" => new Zend_Db_Expr("current_timestamp()"),
									"question_id" => intval($_GET["questionid"]),
									"user_id" => $curuser_id,
									);
						$obj_favorite->insert($arrs);
						$this->view->favoritesuccess = 1;
					}
				}
				
				//sql filter;
				if(application_common_util::inject_check($_GET["query"])
					|| (isset($_GET["page"]) && application_common_util::inject_check($_GET["page"]))) {
					return false;
				}
								
				$query = application_common_util::str_check($_GET["query"]);
				$arr = $obj_question->getQuestionBySimContent2($query);
				$count = count($arr);
				$this->view->count = $count;
				$pagenumber = ($count%10 ? intval($count/10)+1 : intval($count/10));
				$this->view->totalpage = $pagenumber;
				
				if(isset($_GET["page"])) {
					$page = intval($_GET["page"]);
				}
				else {
					$page = 1;
				}
				if($page > $pagenumber) {
					return false;
				}
				$this->view->curpage = intval($page);
				
				$arr = $obj_question->getQuestionBySimContentWithPage($_GET['query'],$page,10);
				$i = 0;
				$obj_questiontoexplain = new application_models_questiontoexplain();
				$obj_discuss = new application_models_discuss();
				
				foreach($arr as $val) {
					$arr[$i]["link"] = "http://www.answerwo.com/q/detail?encryptid=".$val["encryptid"];
					if(intval($val["source"]) / 100 > 1000) {
						$arr[$i]["year"] = intval($val["source"]) / 100;
						$arr[$i]["month"] = intval($val["source"]) % 100;
					}
					else {
						$arr[$i]["year"] = intval($val["source"]);
					}
					$arr[$i]["difficulty"] = application_common_util::RevDifficultyMap($val["difficulty"]);
					$explaincount = $obj_questiontoexplain->getCountByQid($val["id"]);
					$arr[$i]["explaincount"] = $explaincount["count"];
					$discusscount = $obj_discuss->getCountByQid($val["id"]);
					$arr[$i]["discusscount"] = $discusscount["count"];
					$favoritecount = $obj_favorite->getCountByQid($val["id"]);
					$arr[$i]["favoritecount"] = $favoritecount["count"];
					$i++;
				}
				for($i=0;$i+$page < $pagenumber && $i < 10; $i++) {
					$pagecontext = "<a href=\"http://www.answerwo.com/q/search?query=".$_GET['query']."&page=".($i+$page)."\">".($i+$page)."</a> ";
					$this->view->pagination .= $pagecontext;
				}
				
				$this->view->lastpagination = "<a href=\"http://www.answerwo.com/q/search?query=".$_GET['query']."&page=".$pagenumber."\">".$pagenumber."</a>";
				$this->view->result = Zend_Json::encode($arr);
			}
			if(isset($_POST["username"])) {
				if(application_common_util::inject_check($_POST["username"]) || (isset($_POST["password"]) && application_common_util::inject_check($_POST["password"]))) {
					return false;
				}
				$name = application_common_util::str_check($_POST["username"]);
				$password = application_common_util::str_check($_POST["password"]);
				if(($row=application_common_userutil::getUserByNameOrEmail($name,$password)) != false) {
					application_common_userutil::setLoginCookie($row["name"], ((isset($_POST["autologin"]) && $_POST["autologin"] == 1) ? application_common_constant::COOKIE_USER_AUTO_LOGIN_EXPIRE_SECONDS : application_common_constant::COOKIE_USER_UNIQUE_EXPIRE_SECONDS));
					$this->view->curuser = $name;
					$curuser = $name;
				}
				else {
					$this->view->logininformation = "用户名和密码不一致!";
					return false;
				}
			}
			
			//user register;
			if(isset($_POST["nickname"])) {
				if(application_common_util::inject_check($_POST["nickname"]) 
					|| (isset($_POST["password"]) && application_common_util::inject_check($_POST["password"]))
					|| (isset($_POST["repassword"]) && application_common_util::inject_check($_POST["repassword"]))
					|| (isset($_POST["email"]) && application_common_util::inject_check($_POST["email"]))) {
					return false;
				}
				$name = application_common_util::str_check($_POST["nickname"]);
				$password = application_common_util::str_check($_POST["password"]);
				$repassword = application_common_util::str_check($_POST["repassword"]);
				$email = application_common_util::str_check($_POST["email"]);
				
				if(strlen($name) < 6 || strlen($name) > 16) {
					$this->view->registerinformation = "用户名长度不符合规范";
					return false;
				}
				if(strlen($password) < 6 || strlen($password) > 16) {
					$this->view->registerinformation = "密码长度不符合规范";
					return false;
				}
				if($password != $repassword) {
					$this->view->registerinformation = "密码不一致";
					return false;
				}
				if(!ereg("^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+",$email)) {
					$this->view->registerinformation = "邮箱格式不正确";
					return false;
				}
				if(application_common_userutil::getUserByNameAndEmail($name,$email)) {
					$this->view->registerinformation = "对不起，用户名或邮箱已有人注册";
					return false;
				}
				$arr = array(
    							"name" => $name,
    							"password" => new Zend_Db_Expr("md5('".$password."')"),
    							"email" => $email,
    							"role" => 1
    						);
    			$obj_user->insert($arr);
    			application_common_userutil::setLoginCookie($name, application_common_constant::COOKIE_USER_UNIQUE_EXPIRE_SECONDS);
    			$this->view->curuser = $name;
			}
		}
		catch (Zend_Exception $e) {
			$this->view->errorinfo = "Caught exception: " . get_class($e) . "\n";
			$this->view->errorinfo = "Message: " . $e->getMessage() . "\n";
		}
	}
	
	public function listAction() {
		application_common_util::Log();
		$ip = application_common_util::getIp();
    	application_common_FrontDoor::Check($ip);
		if(application_common_FrontDoor::Filter($ip)) {
			header('Location: http://www.answerwo.com/s/robot');
		}
		//get current user information;
		$curuser = application_common_userutil::getCurUser();
		if($curuser != false) {
			$this->view->curuser = $curuser;
		}
		
		//get current user id;
		$obj_questionTOexplain = new application_models_questiontoexplain();
		$obj_user = new application_models_user();
		if($curuser != false) {
			$arr = $obj_user->getUserByName($curuser);
			$curuser_id = intval($arr["id"]);
		}
		else {
			$curuser_id = 1;
		}
		
		try {
			$this->view->source = isset($_GET["source"]) ? $_GET["source"] : "0";
			$this->view->type = isset($_GET["type"]) ? $_GET["type"] : "0";
			$this->view->level = isset($_GET["level"]) ? $_GET["level"] : "0";
			$this->view->difficulty = isset($_GET["difficulty"]) ? $_GET["difficulty"] : "0";
			
			//add favorite
			$obj_favorite = new application_models_favorite();
			if(isset($_GET["questionid"]) && $_GET["questionid"] != "") {
				$arrf = $obj_favorite->getByqidanduid(intval($_GET["questionid"]),$curuser_id);
				if($arrf == false) {
					$arrs = array(
							"createTime" => new Zend_Db_Expr("current_timestamp()"),
							"lastmodifyTime" => new Zend_Db_Expr("current_timestamp()"),
							"question_id" => intval($_GET["questionid"]),
							"user_id" => $curuser_id,
					);
					$obj_favorite->insert($arrs);
					$this->view->favoritesuccess = 1;
				}
			}
			
			//get most visited questions
			$obj_question = new application_models_question();
			$arr = $obj_question->getRecentVisitedQuestions(5);
			$i = 0;
			foreach($arr as $val) {
				$arr[$i]["link"] = "http://www.answerwo.com/q/detail?encryptid=".$val["encryptid"];
				$i++;
			}
			$this->view->record = Zend_Json::encode($arr);
			
			$source = isset($_GET["source"]) ? $_GET["source"] : "";
			$type = isset($_GET["type"]) ? $_GET["type"] : "";
			$level = isset($_GET["level"]) ? $_GET["level"] : "";
			$difficulty = isset($_GET["difficulty"]) ? $_GET["difficulty"] : "";
			
			$arr = $obj_question->retrieve(
											$source != "0" ? $source : "",
											$type != "0" ? application_common_util::TypeMap($type) : "",
											$level != "0" ? $level : "",
											$difficulty != "0" ? application_common_util::DifficultyMap($difficulty) : ""
										  );
			if($arr == 0) {
				$count = 0;
			}
			else {
				$count = count($arr);
			}
			$this->view->count = $count;
			$pagenumber = (($count%10) ? (intval($count/10)+1) : (intval($count/10)));
			$this->view->totalpage = $pagenumber;
			
			if(isset($_GET["page"])) {
				$page = intval($_GET["page"]);
			}
			else {
				$page = 1;
			}
			if($page > $pagenumber) {
				return false;
			}
			$this->view->curpage = intval($page);
			
			//get pagination data;
			$arr = $obj_question->retrieveWithNumber(
													$source != "0" ? $source : "",
													$type != "0"  ? application_common_util::TypeMap($type) : "",
													$level != "0" ? $level : "",
													$difficulty != "0" ? application_common_util::DifficultyMap($difficulty) : "",
													$page,
													10
													);
			$this->view->total = $count;
			if($arr != false) {
				$i = 0;
				$obj_questiontoexplain = new application_models_questiontoexplain();
				$obj_discuss = new application_models_discuss();
				foreach($arr as $val) {
					$arr[$i]["link"] = "http://www.answerwo.com/q/detail?encryptid=".$val["encryptid"];
					if(intval($val["source"]) / 100 > 1000) {
						$arr[$i]["year"] = intval($val["source"]) / 100;
						$arr[$i]["month"] = intval($val["source"]) % 100;
					}
					else {
						$arr[$i]["year"] = intval($val["source"]);
					}
					$arr[$i]["difficulty"] = application_common_util::RevDifficultyMap($val["difficulty"]);
					$explaincount = $obj_questiontoexplain->getCountByQid($val["id"]);
					$arr[$i]["explaincount"] = $explaincount["count"];
					$discusscount = $obj_discuss->getCountByQid($val["id"]);
					$arr[$i]["discusscount"] = $discusscount["count"];
					$favoritecount = $obj_favorite->getCountByQid($val["id"]);
					$arr[$i]["favoritecount"] = $favoritecount["count"];
					$i++;
				}
				for($i=0;$i+$page < $pagenumber && $i < 10; $i++) {
					$pagecontext = "<a href=\"http://www.answerwo.com/q/list?&source=".$source."&type=".$type."&difficulty=".$difficulty."&level=".$level."&page=".($i+$page)."\">".($i+$page)."</a> ";
					$this->view->pagination .= $pagecontext;
				}
				if($page < $pagenumber) {
					$this->view->lastpaflag = 1;
					$this->view->lastpagination = "<a href=\"http://www.answerwo.com/q/list?&source=".$source."&type=".$type."&difficulty=".$difficulty."&level=".$level."&page=".$pagenumber."\">".$pagenumber."</a>";
				}
				$this->view->questions = Zend_Json::encode($arr);
			}
			if(isset($_POST["username"])) {
				if(application_common_util::inject_check($_POST["username"]) || (isset($_POST["password"]) && application_common_util::inject_check($_POST["password"]))) {
					return false;
				}
				$name = application_common_util::str_check($_POST["username"]);
				$password = application_common_util::str_check($_POST["password"]);
				if(($row=application_common_userutil::getUserByNameOrEmail($name,$password)) != false) {
					application_common_userutil::setLoginCookie($row["name"], ((isset($_POST["autologin"]) && $_POST["autologin"] == 1) ? application_common_constant::COOKIE_USER_AUTO_LOGIN_EXPIRE_SECONDS : application_common_constant::COOKIE_USER_UNIQUE_EXPIRE_SECONDS));
					$this->view->curuser = $name;
					$curuser = $name;
				}
				else {
					$this->view->logininformation = "用户名和密码不一致!";
					return false;
				}
			}
		//user register;
			if(isset($_POST["nickname"])) {
				if(application_common_util::inject_check($_POST["nickname"]) 
					|| (isset($_POST["password"]) && application_common_util::inject_check($_POST["password"]))
					|| (isset($_POST["repassword"]) && application_common_util::inject_check($_POST["repassword"]))
					|| (isset($_POST["email"]) && application_common_util::inject_check($_POST["email"]))) {
					return false;
				}
				$name = application_common_util::str_check($_POST["nickname"]);
				$password = application_common_util::str_check($_POST["password"]);
				$repassword = application_common_util::str_check($_POST["repassword"]);
				$email = application_common_util::str_check($_POST["email"]);
				
				if(strlen($name) < 6 || strlen($name) > 16) {
					$this->view->registerinformation = "用户名长度不符合规范";
					return false;
				}
				if(strlen($password) < 6 || strlen($password) > 16) {
					$this->view->registerinformation = "密码长度不符合规范";
					return false;
				}
				if($password != $repassword) {
					$this->view->registerinformation = "密码不一致";
					return false;
				}
				if(!ereg("^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+",$email)) {
					$this->view->registerinformation = "邮箱格式不正确";
					return false;
				}
				if(application_common_userutil::getUserByNameAndEmail($name,$email)) {
					$this->view->registerinformation = "对不起，用户名或邮箱已有人注册";
					return false;
				}
				$arr = array(
    							"name" => $name,
    							"password" => new Zend_Db_Expr("md5('".$password."')"),
    							"email" => $email,
    							"role" => 1
    						);
    			$obj_user->insert($arr);
    			application_common_userutil::setLoginCookie($name, application_common_constant::COOKIE_USER_UNIQUE_EXPIRE_SECONDS);
    			$this->view->curuser = $name;
			}
		}
		catch(Zend_Exception $e){
			echo $e->getMessage()."<br>";
			return false;
		}
	}
	
	public function practicetestAction() {
		application_common_util::Log();
		$ip = application_common_util::getIp();
    	application_common_FrontDoor::Check($ip);
		if(application_common_FrontDoor::Filter($ip)) {
			header('Location: http://www.answerwo.com/s/robot');
		}
		$curuser = application_common_userutil::getCurUser();
		if($curuser != false) {
			$this->view->curuser = $curuser;
		}
		elseif(isset($_POST["username"])) {
			if(application_common_util::inject_check($_POST["username"]) || (isset($_POST["password"]) && application_common_util::inject_check($_POST["password"]))) {
				return false;
			}
			$name = application_common_util::str_check($_POST["username"]);
			$password = application_common_util::str_check($_POST["password"]);
			if(($row=application_common_userutil::getUserByNameOrEmail($name,$password)) != false) {
				application_common_userutil::setLoginCookie($row["name"], ((isset($_POST["autologin"]) && $_POST["autologin"] == 1) ? application_common_constant::COOKIE_USER_AUTO_LOGIN_EXPIRE_SECONDS : application_common_constant::COOKIE_USER_UNIQUE_EXPIRE_SECONDS));
				$this->view->curuser = $name;
				$curuser = $name;
			}
		}
	}
	
	public function practiceAction() {
		application_common_util::Log();
		/*$ip = application_common_util::getIp();
    	application_common_FrontDoor::Check($ip);
		if(application_common_FrontDoor::Filter($ip)) {
			header('Location: http://www.answerwo.com/s/robot');
		}*/
		//get current user;
		$curuser = application_common_userutil::getCurUser();
		if($curuser != false) {
			$this->view->curuser = $curuser;
			$obj_user = new application_models_user();
			$arr = $obj_user->getUserByName($curuser);
			$curuser = intval($arr["id"]);
		}
		else {
			$curuser = 0;
		}
		//first visit;
		if(isset($_POST["curnum"]) && $_POST["curnum"] == "0") {
			$level = isset($_POST["test_level"]) ? $_POST["test_level"] : 0;
			$type = isset($_POST["test_type"]) ? $_POST["test_type"] : 0;
			$cnt = 0;
			$obj_question = new application_models_question();
			$obj_questionTOanswer = new application_models_questiontoanswer();
			$obj_answer = new application_models_answer();
			
			//generate random 20 questions;
			$cnt = $obj_question->GetQuestionsCount($level,$type);
			$upperbound = intval($cnt["count"]);
			
			$randoms = array();
			list($msec, $sec) = explode(' ', microtime());
			srand((float)$sec);
			for($i = 0; $i <20; $i++) {
				array_push($randoms,application_common_util::GetRandom($upperbound));
			}
			
			//store these questions into memcache;
			$randomquestions = array();
			for($i = 0; $i < 20; $i++) {
				$arr = $obj_question->GetQuestionsByNumber($level,$type,$randoms[$i]);
				$answerids = $obj_questionTOanswer->getQuestionAnswers($arr["id"]);
				foreach($answerids as $answerid) {
					$answer = $obj_answer->getAnswerById($answerid["answer_id"]);
					$index = "answer".$answer["sequence"];
					$arr[$index] = $answer["content"];
				}
				array_push($randomquestions,$arr);
			}
			$serializedArrays = Zend_Json::encode($randomquestions);
			$cacheid = application_common_util::SDBMHash(microtime());
			$this->view->cacheid = $cacheid;
			try {
				application_common_util::SetCache($cacheid,$serializedArrays);
				$this->view->title = $randomquestions[0]["content"];
				$this->view->answer1 = $randomquestions[0]["answer1"];
				$this->view->answer2 = $randomquestions[0]["answer2"];
				$this->view->answer3 = $randomquestions[0]["answer3"];
				$this->view->answer4 = $randomquestions[0]["answer4"];
				$this->view->curnum = 1;
			}
			catch(Zend_Exception $e){
				echo $e->getMessage()."<br>";
				return false;
			}
		}
		//practice;
		elseif(isset($_POST["curnum"])) {
			$curnum = intval($_POST["curnum"]);
			$this->view->cacheid = $_POST["cacheid"];
			//last question, then jump into report page;
			if($curnum == 21) {
				$this->view->hidden = 1;
				return true;
			}
			
			$serializedArrays = application_common_util::GetCache($_POST["cacheid"]);
			$randomquestions = Zend_Json::decode($serializedArrays);
			$this->view->title = $randomquestions[$curnum]["content"];
			$this->view->answer1 = $randomquestions[$curnum]["answer1"];
			$this->view->answer2 = $randomquestions[$curnum]["answer2"];
			$this->view->answer3 = $randomquestions[$curnum]["answer3"];
			$this->view->answer4 = $randomquestions[$curnum]["answer4"];
			$this->view->curnum = ++$curnum;
			
			$answer = $_POST["score"];
			if($curnum == 2) {
				if(isset($_POST["option"])) {
					$answer = intval($_POST["option"]);
				}
				else {
					$answer = 5;
				}
			}
			elseif(!isset($_POST["option"]) && $curnum > 2) {
				$answer = intval($answer)*10 + 5;
			}
			else {
				$answer = intval($answer)*10 + intval($_POST["option"]);
			}
			$this->view->score = $answer;
		}
	}
	
	public function reportAction() {
		application_common_util::Log();
		//get current user id;
		$curuser = application_common_userutil::getCurUser();
		if($curuser != false) {
			$this->view->curuser = $curuser;
			$obj_user = new application_models_user();
			$arr = $obj_user->getUserByName($curuser);
			$curuser = intval($arr["id"]);
		}
		else {
			$curuser = 0;
		}
		//get most visited questions
		$obj_question = new application_models_question();
		$arr = $obj_question->getRecentVisitedQuestions(5);
		$i = 0;
		foreach($arr as $val) {
			$arr[$i]["link"] = "http://www.answerwo.com/q/detail?encryptid=".$val["encryptid"];
			$i++;
		}
		$this->view->record = Zend_Json::encode($arr);
		
		//get report;
		$serializedArrays = application_common_util::GetCache($_POST["reportcacheid"]);
		$randomquestions = Zend_Json::decode($serializedArrays);
		
		$finalscore = $_POST["finalscore"];
		$score_arr = array();
		$finalscore_tmp = (string)$finalscore;
		for($i = 0; $i < strlen($finalscore_tmp);$i++) {
			array_push($score_arr,$finalscore_tmp[$i]);
		}
		$arr = array();
		$i = 0;
		$correct = 0;
		foreach($score_arr as $answer) {
			$this->_addanswer($randomquestions[$i]["id"],$curuser,$answer,$_POST["reportcacheid"]);
			$randomquestions[$i]["useranswer"] = $answer;
			$temp_arr = $obj_question->getQuestionById($randomquestions[$i]["id"]);
			$randomquestions[$i]["link"] = "http://www.answerwo.com/q/detail?encryptid=".$temp_arr["encryptid"];
			if($randomquestions[$i]["answer"] == $answer) {
				$correct++;
			}
			array_push($arr,$randomquestions[$i]);
			$i++;
		}
		$this->view->questions = Zend_Json::encode($arr);
		$this->view->total = count($arr);
		$this->view->correct = $correct;
		$this->view->wrong = count($arr) - $correct;
		$this->view->correction = intval(($correct/count($arr)) * 100);
	}
}
?>
