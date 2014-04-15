<?php
/*
    Description: back ground operations utils
    Author: Hins Pan
    Date: June 24th, 2012
*/
class UController extends Zend_Controller_Action {
	
	public function addquestionAction()
    {
    	$user = application_common_userutil::getCurUser();
		if($user != false) {
			$this->view->user = $user;
			$obj_user = new application_models_user();
			$arr = $obj_user->getUserByName($user);
			if(intval($arr["role"] != 2)) {
				header("Location: http://www.answerwo.com");
			}
		}
    	if(isset($_POST["content"]) && $_POST["content"] != "") {
    		try {
    			if((isset($_POST["content"]) && application_common_util::inject_check($_POST["content"]))
    				|| (isset($_POST["type"]) && application_common_util::inject_check($_POST["type"]))
    				|| (isset($_POST["level"]) && application_common_util::inject_check($_POST["level"]))
    				|| (isset($_POST["source"]) && application_common_util::inject_check($_POST["source"]))
    				|| (isset($_POST["answer"]) && application_common_util::inject_check($_POST["answer"]))
    				|| (isset($_POST["difficulty"]) && application_common_util::inject_check($_POST["difficulty"]))
    				|| (isset($_POST["answer1"]) && application_common_util::inject_check($_POST["answer1"]))
    				|| (isset($_POST["answer2"]) && application_common_util::inject_check($_POST["answer2"]))
    				|| (isset($_POST["answer3"]) && application_common_util::inject_check($_POST["answer3"]))
    				|| (isset($_POST["answer4"]) && application_common_util::inject_check($_POST["answer4"]))
    				|| (isset($_POST["explain"]) && application_common_util::inject_check($_POST["explain"]))) {
    				return false;
    			}
    			$obj_question = new application_models_question();
    			$obj_answer = new application_models_answer();
    			$obj_questiontoanswer = new application_models_questiontoanswer();
    			
    			if($obj_question->getQuestionByContent($_POST["content"])) {
    				return false;
    			}
    			
    			$arr = array(
    						"createTime" => new Zend_Db_Expr("current_timestamp()"),
							"lastmodifyTime" => new Zend_Db_Expr("current_timestamp()"),
							"creator" => 1,
    						"type" => intval($_POST["type"]),
    						"level" => intval(isset($_POST["level"]) ? intval($_POST["level"]) : "4"),
    						"content" => $_POST["content"],
    						"source" => intval(isset($_POST["source"]) ? intval($_POST["source"]) : "0"),
    						"answer" => isset($_POST["answer"]) ? $_POST["answer"] : "",
    						"difficulty" => intval(isset($_POST["difficulty"]) ? $_POST["difficulty"] : "3"),
    						"encryptid" => application_common_util::SDBMHash($_POST["content"])
    						);
    			$ret = $obj_question->insert($arr);
    			$arr = $obj_question->getQuestionByContent($_POST["content"]);
    			$qid = $arr["id"];
    			
    			$arr = array(
    						$_POST["answer1"],
    						$_POST["answer2"],
    						$_POST["answer3"],
    						$_POST["answer4"]
    						);
    			$i = 1;
    			foreach($arr as $val) {
    				if($val != "") {
	    				$arrs = array (
	    								"createTime" => new Zend_Db_Expr("current_timestamp()"),
	    								"lastmodifyTime" => new Zend_Db_Expr("current_timestamp()"),
	    								"creator" => 1,
	    								"solution_seq" => 1,
	    								"sequence" => $i++,
	    								"content" => $val
	    							);
	    				$ret = $obj_answer->insert($arrs);
	    				$arrs = $obj_answer->getAnswerByContent($val);
	    				$aid = $arrs["id"];
	    				
	    				$arrs = array (
	    								"createTime" => new Zend_Db_Expr("current_timestamp()"),
	    								"lastmodifyTime" => new Zend_Db_Expr("current_timestamp()"),
	    								"creator" => 1,
	    								"question_id" => $qid,
	    								"answer_id" => $aid
	    							);
	    				$ret = $obj_questiontoanswer->insert($arrs);
    				}
    			}
    			
    			if(isset($_POST["explain"]) && $_POST["explain"] != "") {
    				$obj_explain = new application_models_explains();
    				$arrs = array(
    								"createTime" => new Zend_Db_Expr("current_timestamp()"),
    								"lastmodifyTime" => new Zend_Db_Expr("current_timestamp()"),
    								"creator" => 1,
    								"sequence" => 1,
    								"content" => $_POST["explain"]
    							 );
    				$ret = $obj_explain->insert($arrs);
    				$obj_questiontoexplain = new application_models_questiontoexplain();
    				$arr = $obj_explain->getMaxId();
    				$eid = $arr["max"];
    				$arr = array(
    							"createTime" => new Zend_Db_Expr("current_timestamp()"),
    							"lastmodifyTime" => new Zend_Db_Expr("current_timestamp()"),
    							"creator" => 1,
    							"question_id" => $qid,
    							"explain_id" => $eid
    							);
    				$obj_questiontoexplain->insert($arr);
    			}
    		}
    		catch(Zend_Exception $e){
    			echo $e->getMessage()."<br>";
    			return false;
    		}
    	}
    }
    
    public function editquestionAction()
    {
    	$user = application_common_userutil::getCurUser();
		if($user != false) {
			$this->view->user = $user;
			$obj_user = new application_models_user();
			$arr = $obj_user->getUserByName($user);
			if(intval($arr["role"] != 2)) {
				header("Location: http://www.answerwo.com");
			}
		}
    	if(isset($_POST["search"]) && $_POST["search"] != "") {
    		try {
    			if(isset($_POST["search"]) && application_common_util::inject_check($_POST["search"])) {
    				return false;
    			}
    			$obj_question = new application_models_question();
    			$obj_answer = new application_models_answer();
    			$obj_questiontoanswer = new application_models_questiontoanswer();
    			$obj_questiontoexplain = new application_models_questiontoexplain();
    			$obj_explains = new application_models_explains();
    			 
    			$arr = $obj_question->getQuestionBySimContent($_POST["search"]);
    			if($arr == false) {
    				return false;
    			}
    			$this->view->id = $arr["id"];
    			$this->view->content = $arr["content"];
    			$this->view->answer = $arr["answer"];
    			$this->view->level = $arr["level"];
    			$this->view->source = $arr["source"];
    			$this->view->type = $arr["type"];
    			$this->difficulty = $arr["difficulty"];
    			 
    			$qid = $arr["id"];
    			$arr = $obj_questiontoanswer->getQuestionAnswers($qid);
    			if(!empty($arr)) {
    				$i = 1;
    				foreach($arr as $val) {
    					$arrs = $obj_answer->getAnswerById($val["answer_id"]);
    					if(!empty($arrs)) {
    						$answer = "answer".$i++;
    						$this->view->$answer = $arrs["content"];
    					}
    				}
    			}
    			 
    			$arr = $obj_questiontoexplain->getQuestionExplains($qid);
    			$arrs = $obj_explains->getExplainsById($arr["explain_id"]);
    			if(!empty($arrs)) {
    				$this->view->explain = $arrs["content"];
    			}
    		}
    		catch(Zend_Exception $e){
    			echo $e->getMessage()."<br>";
    			return false;
    		}
    	}
    	 
    	if(isset($_POST["id"]) && $_POST["id"] != "") {
    		try {
    			if((isset($_POST["content"]) && application_common_util::inject_check($_POST["content"]))
    				|| (isset($_POST["answer"]) && application_common_util::inject_check($_POST["answer"]))
    				|| (isset($_POST["id"]) && application_common_util::inject_check($_POST["id"]))
    				|| (isset($_POST["level"]) && application_common_util::inject_check($_POST["level"]))
    				|| (isset($_POST["source"]) && application_common_util::inject_check($_POST["source"]))
    				|| (isset($_POST["type"]) && application_common_util::inject_check($_POST["type"]))
    				|| (isset($_POST["difficulty"]) && application_common_util::inject_check($_POST["difficulty"]))
    				|| (isset($_POST["answer1"]) && application_common_util::inject_check($_POST["answer1"]))
    				|| (isset($_POST["answer2"]) && application_common_util::inject_check($_POST["answer2"]))
    				|| (isset($_POST["answer3"]) && application_common_util::inject_check($_POST["answer3"]))
    				|| (isset($_POST["answer4"]) && application_common_util::inject_check($_POST["answer4"]))
    				|| (isset($_POST["explain"]) && application_common_util::inject_check($_POST["explain"]))) {
    				
    			}
    			$qid = $_POST["id"];
    			$obj_question = new application_models_question();
    			$obj_answer = new application_models_answer();
    			$obj_questiontoanswer = new application_models_questiontoanswer();
    			$obj_questiontoexplain = new application_models_questiontoexplain();
    			$obj_explains = new application_models_explains();
    			 
    			$arr = $obj_question->getQuestionById($qid);
    			if($arr == false) {
    				return false;
    			}
    			if($arr["content"] != $_POST["content"]) {
    				$obj_question->UpdateContent($qid,$_POST["content"]);
    			}
    			if($arr["answer"] != $_POST["answer"]) {
    				$obj_question->UpdateAnswer($qid,$_POST["answer"]);
    			}
    			if($arr["level"] != $_POST["level"]) {
    				$obj_question->UpdataLevel($qid,$_POST["level"]);
    			}
    			if($arr["source"] != $_POST["source"]) {
    				$obj_question->UpdateSource($qid,$_POST["source"]);
    			}
    			if($arr["type"] != $_POST["type"]) {
    				$obj_question->UpdateType($qid,$_POST["type"]);
    			}
    			if($arr["difficulty"] != (isset($_POST["difficulty"]) ? $_POST["difficulty"] : "3")) {
    				$obj_question->UpdateDifficulty($qid,$_POST["difficulty"]);
    			}
    			 
    			$arr = $obj_questiontoanswer->getQuestionAnswers($qid);
    			if(!empty($arr)) {
    				$i = 1;
    				foreach($arr as $val) {
    					$arrs = $obj_answer->getAnswerById($val["answer_id"]);
    					if(!empty($arrs)) {
    						$answer = "answer".$i++;
    						if($arrs["content"] != $_POST[$answer]) {
    							$obj_answer->UpdateContent($arrs["id"],$_POST[$answer]);
    						}
    					}
    				}
    			}
    			else {
    				for($i = 1; $i <= 4; $i++) {
    					$answer = "answer".$i;
    					if(isset($_POST[$answer]) && $_POST[$answer] != "") {
    						$arr = array (
    								"createTime" => new Zend_Db_Expr("current_timestamp()"),
    								"lastmodifyTime" => new Zend_Db_Expr("current_timestamp()"),
    								"creator" => 1,
    								"solution_seq" => 1,
    								"sequence" => $i,
    								"content" => $_POST[$answer]
    						);
    						$obj_answer->insert($arr);
    						$arr = $obj_answer->getAnswerByContent($_POST[$answer]);
    						$aid = $arr["id"];
    
    						$arr = array (
    								"createTime" => new Zend_Db_Expr("current_timestamp()"),
    								"lastmodifyTime" => new Zend_Db_Expr("current_timestamp()"),
    								"creator" => 1,
    								"question_id" => $qid,
    								"answer_id" => $aid
    						);
    						$obj_questiontoanswer->insert($arr);
    					}
    				}
    			}
    			 
    			$arr = $obj_questiontoexplain->getQuestionExplains($qid);
    			if(!empty($arr)) {
    				$arrs = $obj_explains->getExplainsById($arr["explain_id"]);
    			}
    			if(!empty($arr)) {
    				if(!empty($arrs) && $arrs["content"] != $_POST["explain"]) {
    					$obj_explains->UpdateContent($arr["explain_id"],$_POST["explain"]);
    				}
    				else if(isset($_POST["explain"]) && $_POST["explain"] != "") {
	    				$arr = array (
	    						"createTime" => new Zend_Db_Expr("current_timestamp()"),
	    						"lastmodifyTime" => new Zend_Db_Expr("current_timestamp()"),
	    						"creator" => 1,
	    						"sequence" => 1,
	    						"content" => $_POST["explain"]
	    				);
	    				$obj_explains->insert($arr);
	    				$arr = $obj_explains->getExplainByName($_POST["explain"]);
	    				$eid = $arr["id"];
	    				$arr = array (
	    						"createTime" => new Zend_Db_Expr("current_timestamp()"),
	    						"lastmodifyTime" => new Zend_Db_Expr("current_timestamp()"),
	    						"creator" => 1,
	    						"question_id" => $qid,
	    						"explain_id" => $eid
	    				);
	    				$obj_questiontoexplain->insert($arr);
    				}
    			}
    		}
    		catch(Zend_Exception $e){
    			echo $e->getMessage()."<br>";
    			return false;
    		}
    	}
    }
    
    public function deletequestionAction()
    {
    	$user = application_common_userutil::getCurUser();
		if($user != false) {
			$this->view->user = $user;
			$obj_user = new application_models_user();
			$arr = $obj_user->getUserByName($user);
			if(intval($arr["role"] != 2)) {
				header("Location: http://www.answerwo.com");
			}
		}
    	if(isset($_GET["search"]) && $_GET["search"] != "") {
    		try {
    			 if(isset($_GET["search"]) && application_common_util::inject_check($_GET["search"])) {
    			 	return false;
    			 }
    			$obj_question = new application_models_question();
    			$obj_answer = new application_models_answer();
    			$obj_questiontoanswer = new application_models_questiontoanswer();
    			$obj_questiontoexplain = new application_models_questiontoexplain();
    			$obj_explains = new application_models_explains();
    			 
    			$arr = $obj_question->getQuestionBySimContent($_GET["search"]);
    			if($arr == false) {
    				echo $this->_NORECORD;
    				return false;
    			}
    			$this->view->id = $arr["id"];
    			$this->view->content = $arr["content"];
    			$this->view->answer = $arr["answer"];
    			$this->view->level = $arr["level"];
    			$this->view->source = $arr["source"];
    			$this->view->type = $arr["type"];
    			$this->view->difficulty = $arr["difficulty"];
    			 
    			$qid = $arr["id"];
    			$arr = $obj_questiontoanswer->getQuestionAnswers($qid);
    			if(!empty($arr)) {
    				$i = 1;
    				foreach($arr as $val) {
    					$arrs = $obj_answer->getAnswerById($val["answer_id"]);
    					if(!empty($arrs)) {
    						$answer = "answer".$i++;
    						$this->view->$answer = $arrs["content"];
    					}
    				}
    			}
    			 
    			$arr = $obj_questiontoexplain->getQuestionExplains($qid);
    			$arrs = $obj_explains->getExplainsById($arr["explain_id"]);
    			if(!empty($arrs)) {
    				$this->view->explain = $arrs["content"];
    			}
    		}
    		catch(Zend_Exception $e){
    			echo $e->getMessage()."<br>";
    			return false;
    		}
    	}
    	 
    	if(isset($_GET["id"]) && $_GET["id"] != "") {
    		try {
    			$qid = $_GET["id"];
    			$obj_question = new application_models_question();
    			$obj_answer = new application_models_answer();
    			$obj_questiontoanswer = new application_models_questiontoanswer();
    			$obj_questiontoexplain = new application_models_questiontoexplain();
    			$obj_explains = new application_models_explains();
    			 
    			$obj_question->DeleteQuestionById($qid);
    			$arr = $obj_questiontoanswer->getQuestionAnswers($qid);
    			foreach($arr as $val) {
    				$obj_answer->DeleteAnswerById($val);
    			}
    			$obj_questiontoanswer->DeleteByQid($qid);
    			$arr = $obj_questiontoexplain->getQuestionExplains($qid);
    			foreach($arr as $val) {
    				$obj_explains->DeleteExplainById($val);
    			}
    			$obj_questiontoexplain->DeleteByQid($qid);
    		}
    		catch(Zend_Exception $e){
    			echo $e->getMessage()."<br>";
    			return false;
    		}
    	}
    }
    
    public function listquestionAction() {
    	$user = application_common_userutil::getCurUser();
		if($user != false) {
			$this->view->user = $user;
			$obj_user = new application_models_user();
			$arr = $obj_user->getUserByName($user);
			if(intval($arr["role"] != 2)) {
				header("Location: http://www.answerwo.com");
			}
		}
    	if(isset($_GET["page"]) && application_common_util::inject_check($_GET["page"])) {
    		return false;
    	}
    	if(isset($_GET["page"])) {
    		$page = intval($_GET["page"]);
    	}
    	else {
    		$page = 1;
    	}
    	try{
    		$obj_question = new application_models_question();
    		$arr = $obj_question->getAllQuestion();
    		$sum = count($arr);
    		$pagenumber = ($sum%10 ? intval($sum/10)+1 : intval($sum/10));
    		if($page > $pagenumber) {
    			return false;
    		}
    		$arr = $obj_question->getPaginationQuestion($page,10);
    		$len = count($arr);
    		for($i=0;$i<$len;$i++) {
    			$arr[$i]["type"] = application_common_util::RevTypeMap($arr[$i]["type"]);
    		}
    		$this->view->questions = Zend_Json::encode($arr);
    		$arr = $obj_question->getAllQuestion();
    		$sum = count($arr);
    		$this->view->pagenumber = ($sum%10 ? intval($sum/10)+1 : intval($sum/10));
    		$pagination = "";
    		for($i=0;$i<5 && $page+$i <= intval($this->view->pagenumber);$i++) {
    			$subpage = "<a href=\"http://www.answerwo.com/u/listquestion?page=".($page+$i)."\" >".($page+$i)."</a> ";
    			$pagination .= $subpage;
    		}
    		$this->view->pagination = $pagination;
    	}
    	catch(Zend_Exception $e){
    		echo $e->getMessage()."<br>";
    		return false;
    	}
    }
    
    public function searchquestionAction() {
    	$user = application_common_userutil::getCurUser();
		if($user != false) {
			$this->view->user = $user;
			$obj_user = new application_models_user();
			$arr = $obj_user->getUserByName($user);
			if(intval($arr["role"] != 2)) {
				header("Location: http://www.answerwo.com");
			}
		}
    	if(isset($_GET["content"])) {
    		try {
    			if(application_common_util::inject_check($_GET["content"])) {
    				return false;
    			}
    			$obj_question = new application_models_question();
    			$arr = $obj_question->retrieve($_GET["content"],$_GET["createTime"],$_GET["lastmodifyTime"],$_GET["source"],$_GET["type"],$_GET["level"],$_GET["difficulty"]);
    			$this->view->questions = Zend_Json::encode($arr);
    		}
    		catch(Zend_Exception $e){
    			echo $e->getMessage()."<br>";
    			return false;
    		}
    	}
    }
    
    public function discussAction() {
    	$user = application_common_userutil::getCurUser();
		if($user != false) {
			$this->view->user = $user;
			$obj_user = new application_models_user();
			$arr = $obj_user->getUserByName($user);
			if(intval($arr["role"] != 2)) {
				header("Location: http://www.answerwo.com");
			}
		}
    	if(isset($_GET["page"]) && application_common_util::inject_check($_GET["page"])) {
    		return false;
    	}
    	if(isset($_GET["page"])) {
    		$page = intval($_GET["page"]);
    	}
    	else {
    		$page = 1;
    	}
    	try{
    		$obj_discuss = new application_models_discuss();
    		$arr = $obj_discuss->getAllDiscuss();
    		$sum = count($arr);
    		$pagenumber = ($sum%10 ? intval($sum/10)+1 : intval($sum/10));
    		if($page > $pagenumber) {
    			return false;
    		}
    		$arr = $obj_discuss->getPaginationDiscuss($page,10);
    		$this->view->discuss = Zend_Json::encode($arr);
    		$arr = $obj_discuss->getAllDiscuss();
    		$sum = count($arr);
    		$this->view->pagenumber = ($sum%10 ? intval($sum/10)+1 : intval($sum/10));
    		$pagination = "";
    		for($i=0;$i<5 && $page+$i <= intval($this->view->pagenumber);$i++) {
    			$subpage = "<a href=\"http://www.answerwo.com/u/discuss?page=".($page+$i)."\" >".($page+$i)."</a> ";
    			$pagination .= $subpage;
    		}
    		$this->view->pagination = $pagination;
    	}
    	catch(Zend_Exception $e){
    		echo $e->getMessage()."<br>";
    		return false;
    	}
    }
    
    public function useraddAction() {
    	$user = application_common_userutil::getCurUser();
		if($user != false) {
			$this->view->user = $user;
			$obj_user = new application_models_user();
			$arr = $obj_user->getUserByName($user);
			if(intval($arr["role"] != 2)) {
				header("Location: http://www.answerwo.com");
			}
		}
    	if(isset($_POST["nickname"])) {
    		try{
    			if((isset($_POST["nickname"]) && application_common_util::inject_check($_POST["nickname"]))
    				|| (isset($_POST["password"]) && application_common_util::inject_check($_POST["password"]))
    				|| (isset($_POST["email"]) && application_common_util::inject_check($_POST["email"]))
    				|| (isset($_POST["role"]) && application_common_util::inject_check($_POST["role"]))) {
    				return false;
    			}
    			
    			$obj_user = new application_models_user();
    			$arr = $obj_user->getUserByName($_POST["nickname"]);
    			if($arr != false) {
    				$this->view->info = "对不起，您的昵称已被他人注册，请重新选择昵称";
    				return false;
    			}
    			$arr = $obj_user->getUserByEmail($_POST["email"]);
    			if($arr != false) {
    				$this->view->info = "对不起，您的邮箱已被他人注册，请重新选择邮箱";
    				return false;
    			}
    			$arr = array(
    						"name" => $_POST["nickname"],
    						"password" => new Zend_Db_Expr("md5('".$_POST["password"]."')"),
    						"email" => $_POST["email"],
    						"role" => $_POST["role"]
    						);
    			$obj_user->insert($arr);
    		}
    		catch(Zend_Exception $e){
    			echo $e->getMessage()."<br>";
    			return false;
    		}
    	}
    }
    
    public function userdeleteAction() {
    	$user = application_common_userutil::getCurUser();
		if($user != false) {
			$this->view->user = $user;
			$obj_user = new application_models_user();
			$arr = $obj_user->getUserByName($user);
			if(intval($arr["role"] != 2)) {
				header("Location: http://www.answerwo.com");
			}
		}
    	//delete;
    	if(isset($_POST["nickname"]) && $_POST["nickname"] != "") {
    		if(application_common_util::inject_check($_POST["nickname"])) {
    			return false;
    		}
    		
    		$obj_user = new application_models_user();
    		$arr = $obj_user->getUserByName($_POST["nickname"]);
    		if(!empty($arr)) {
    			$obj_user->DeleteUserByName($_POST["nickname"]);
    		}
    	}
    	//Search
    	else if(isset($_POST["search"])){
    		if(application_common_util::inject_check($_POST["search"])) {
    			return false;
    		}
    		
    		$obj_user = new application_models_user();
    		$arr = $obj_user->getUserByName($_POST["search"]);
    		if(!empty($arr)) {
    			$this->view->nickname = $arr["name"];
    			$this->view->email = $arr["email"];
    			$this->view->role = ($arr["role"] == "2" ? "管理员": "普通用户");
    		}
    		else {
    			return false;
    		}
    	}	
    }
    
    public function usereditAction() {
    	$user = application_common_userutil::getCurUser();
		if($user != false) {
			$this->view->user = $user;
			$obj_user = new application_models_user();
			$arr = $obj_user->getUserByName($user);
			if(intval($arr["role"] != 2)) {
				header("Location: http://www.answerwo.com");
			}
		}
    	//Update;
    	if(isset($_POST["nickname"]) && $_POST["nickname"] != "") {
    		if((isset($_POST["nickname"]) && application_common_util::inject_check($_POST["nickname"]))
    			|| (isset($_POST["email"]) && application_common_util::inject_check($_POST["email"]))
    			|| (isset($_POST["role"]) && application_common_util::inject_check($_POST["role"]))) {
    			return false;
    		}
    		
    		$obj_user = new application_models_user();
    		$arr = $obj_user->getUserByName($_POST["nickname"]);
    		if(!empty($arr)) {
    			if(isset($_POST["email"]) && $_POST["email"] != "") {
    				$obj_user->UpdateUserEmail($_POST["nickname"],$_POST["email"]);
    			}
    			if(isset($_POST["role"]) && $_POST["role"] != "") {
    				$role = ($_POST["role"] == "管理员" ? 2 : 1);
    				$obj_user->UpdateUserRole($_POST["nickname"],$role);
    			}
    		}
    	}
    	//Search
    	else if(isset($_POST["search"])){
    		if(application_common_util::inject_check($_POST["search"])) {
    			return false;
    		}
    		$obj_user = new application_models_user();
    		$arr = $obj_user->getUserByName($_POST["search"]);
    		if(!empty($arr)) {
    			$this->view->nickname = $arr["name"];
    			$this->view->email = $arr["email"];
    			$this->view->role = ($arr["role"] == "2" ? "管理员" : "普通用户");
    		}
    		else {
    			return false;
    		}
    	}
    }
    
    public function userlistAction() {
    	$user = application_common_userutil::getCurUser();
		if($user != false) {
			$this->view->user = $user;
			$obj_user = new application_models_user();
			$arr = $obj_user->getUserByName($user);
			if(intval($arr["role"] != 2)) {
				header("Location: http://www.answerwo.com");
			}
		}
    	if(isset($_GET["page"]) && application_common_util::inject_check($_GET["page"])) {
    		return false;
    	}
    	
   	 	if(isset($_GET["page"])) {
    		$page = intval($_GET["page"]);
    	}
    	else {
    		$page = 1;
    	}
    	try{
    		$obj_user = new application_models_user();
    		$arr = $obj_user->getAllUser();
    		$sum = count($arr);
    		$pagenumber = ($sum%10 ? intval($sum/10)+1 : intval($sum/10));
    		if($page > $pagenumber) {
    			return false;
    		}
    		$arr = $obj_user->getPaginationUser($page,10);
    		$this->view->users = Zend_Json::encode($arr);
    		$arr = $obj_user->getAllUser();
    		$sum = count($arr);
    		$this->view->pagenumber = ($sum%10 ? intval($sum/10)+1 : intval($sum/10));
    		$pagination = "";
    		for($i=0;$i<5 && $page+$i <= intval($this->view->pagenumber);$i++) {
    			$subpage = "<a href=\"http://www.answerwo.com/u/userlist?page=".($page+$i)."\" >".($page+$i)."</a> ";
    			$pagination .= $subpage;
    		}
    		$this->view->pagination = $pagination;
    	}
    	catch(Zend_Exception $e){
    		echo $e->getMessage()."<br>";
    		return false;
    	}
    }
    
    //external functions
    public function registerAction() {
    	if(isset($_POST["nickname"]) && $_POST["nickname"] != "") {
    		try {
    			if((isset($_POST["nickname"]) && application_common_util::inject_check($_POST["nickname"]))
    				|| (isset($_POST["password"]) && application_common_util::inject_check($_POST["password"]))
    				|| (isset($_POST["email"]) && application_common_util::inject_check($_POST["email"]))) {
    				return false;
    			}
    			$nickname = application_common_util::str_check($_POST["nickname"]);
    			$password = application_common_util::str_check($_POST["password"]);
    			$email = application_common_util::str_check($_POST["email"]);
    			if(!application_common_userutil::getUserByNameAndEmail($nickname,$email)) {
    				$obj_user = new application_models_user();
    				$arr = array(
    							"name" => $nickname,
    							"password" => new Zend_Db_Expr("md5('".$password."')"),
    							"email" => $email,
    							"role" => 1
    							);
    				$obj_user->insert($arr);
    				application_common_userutil::setLoginCookie($nickname, application_common_constant::COOKIE_USER_UNIQUE_EXPIRE_SECONDS);
    				echo "<meta http-equiv=\"refresh\" content=\"1;url=http://www.answerwo.com/s/successregister\">";
    			}
    			else {
    				$this->view->err_information = "对不起，您的信息和其他用户重复，请重新填写！";
    				return false;
    			}
    		}
    		catch(Zend_Exception $e){
    			echo $e->getMessage()."<br>";
    			return false;
    		}
    	}
    }
    
    public function loginAction() {
    	if(isset($_GET["name"]) && $_GET["name"] != "") {
    		try {
    			if((isset($_GET["name"]) && application_common_util::inject_check($_GET["name"]))
    				|| (isset($_GET["password"]) && application_common_util::inject_check($_GET["password"]))) {
    				return false;
    			}
    			$name = application_common_util::str_check($_GET["name"]);
    			$password = application_common_util::str_check($_GET["password"]);
    			if(($row=application_common_userutil::getUserByNameOrEmail($name,$password)) != false) {
    				application_common_userutil::setLoginCookie($row["name"], ((isset($_GET["autologin"]) && $_GET["autologin"] == 1) ? application_common_constant::COOKIE_USER_AUTO_LOGIN_EXPIRE_SECONDS : application_common_constant::COOKIE_USER_UNIQUE_EXPIRE_SECONDS));
    				echo "<meta http-equiv=\"refresh\" content=\"1;url=http://www.answerwo.com/s/successlogin\">";
    			}
    			else {
    				$this->view->err_information = "对不起，您的输入有误，请重新填写！";
    				return false;
    			}
    		}
    		catch(Zend_Exception $e){
    			echo $e->getMessage()."<br>";
    			return false;
    		}	
    	}
    }
    
    public function explainAction() {
    	try {
    		$obj_user = new application_models_user();
	    	$user = application_common_userutil::getCurUser();
			if($user != false) {
				$this->view->user = $user;
				$arr = $obj_user->getUserByName($user);
				if(intval($arr["role"] != 2)) {
					header("Location: http://www.answerwo.com");
				}
			}
    		$obj_explains = new application_models_explains();
    		$obj_questiontoexplain = new application_models_questiontoexplain();
    		$rows = $obj_explains->getAllExplains();
    		if(!empty($rows)) {
	    		$i = 0;
	    		foreach($rows as $row) {
	    			$user = $obj_user->getUserById($row["creator"]);
	    			$rows[$i]["creator"] = $user["name"];
	    			$questiontoexplain = $obj_questiontoexplain->getQuestionbyExplainId($row["id"]);
	    			if($questiontoexplain != false) {
	    				$rows[$i]["question_id"] = $questiontoexplain["question_id"];
	    			}
	    			$i++;
	    		}
	    		$this->view->explain = Zend_Json::encode($rows);
    		}
    	}
    	catch(Zend_Exception $e){
    			echo $e->getMessage()."<br>";
    			return false;
    		}
    }
    
    public function favoriteAction() {
    	try {
    		$obj_user = new application_models_user();
    		$user = application_common_userutil::getCurUser();
			if($user != false) {
				$this->view->user = $user;
				$arr = $obj_user->getUserByName($user);
				if(intval($arr["role"] != 2)) {
					header("Location: http://www.answerwo.com");
				}
			}
    		$obj_favorite = new application_models_favorite();
    		$rows = $obj_favorite->getAllFavorite();
    		if(!empty($rows)) {
    			$i = 0;
    			foreach($rows as $row) {
    				$user = $obj_user->getUserById($row["user_id"]);
    				$rows[$i]["user_id"] = $user["name"];
    				$i++;
    			}
    			$this->view->favorite = Zend_Json::encode($rows);
    		}
    	}
    	catch(Zend_Exception $e){
    		echo $e->getMessage()."<br>";
    		return false;
    	}
    }
}
?>