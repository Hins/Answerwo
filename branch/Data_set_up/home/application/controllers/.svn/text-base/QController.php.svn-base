<?php

class QController extends Zend_Controller_Action {
	
	public function detailAction() {
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
					$curuser_id = 1;
				}
				
				$this->view->encryptid = $_GET["encryptid"];
				$obj_question = new application_models_question();
				$arr = $obj_question->getQuestionByEncryptId($_GET["encryptid"]);
				if(!empty($arr)) {
					$this->view->content = $arr["content"];
					$len = strlen($arr["content"]);
					$this->view->category = application_common_util::RevKnowMap($arr["category"]);
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
					if($arr["type"] != "7" && $arr["category"] != "3") {
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
					}
					//add explain;
					if(isset($_GET["explainButton"])
						&& isset($_GET["explaincontent"])
						&& !application_common_util::inject_check($_GET["explaincontent"])
						&& $_GET["explaincontent"] != "") {
						$explain_obj = new application_models_explains();
						$explaincontent = application_common_util::str_check($_GET["explaincontent"]);
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
						$cnt = "";
						$obj_explain = new application_models_explains();
						$i = 1;
						foreach($explainids as $explainid) {
							$explain = $obj_explain->getExplainsById($explainid["explain_id"]);
							$cnt .= ("第".$i."种解析：".$explain["content"]."<br>");
							$i++;
						}
						$this->view->explain = $cnt;
					}
					
					//add discuss;
					$obj_discuss = new application_models_discuss();
					if(isset($_GET["discussButton"])
						&& isset($_GET["discusscontent"])
						&& !application_common_util::inject_check($_GET["discusscontent"])
						&& $_GET["discusscontent"] != "") {
						$discuss = application_common_util::str_check($_GET["discusscontent"]);
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
							$arrs[$i]["user_id"] = $user["name"];
							$i++;
						}
						$this->view->discuss = Zend_Json::encode($arrs); 
					}
					
					$obj_favorite = new application_models_favorite();
					$fids = $obj_favorite->getCountByQid($arr["id"]);
					$this->view->savecount = $fids["count"];
					//add favorite
					if(isset($_GET["favorite"]) && $_GET["favorite"] == "1") {	
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
			
			if(isset($_GET["query"]) && $_GET["query"] != "") {
				$this->view->query = $_GET["query"];
				
				//sql filter;
				if(application_common_util::inject_check($_GET["query"])
					|| (isset($_GET["page"]) && application_common_util::inject_check($_GET["page"]))) {
					return false;
				}
								
				$query = application_common_util::str_check($_GET["query"]);
				$obj_question = new application_models_question();
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
				$obj_favorite = new application_models_favorite();
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
				
				//add favorite
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
			}
		}
		catch (Zend_Exception $e) {
			$this->view->errorinfo = "Caught exception: " . get_class($e) . "\n";
			$this->view->errorinfo = "Message: " . $e->getMessage() . "\n";
		}
	}
	
	public function listAction() {
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
		
		if(isset($_GET["query"])) {
			try {
				if(application_common_util::inject_check($_GET["query"])
					|| (isset($_GET["source"]) && application_common_util::inject_check($_GET["source"]))
					|| (isset($_GET["type"]) && application_common_util::inject_check($_GET["type"]))
					|| (isset($_GET["category"]) && application_common_util::inject_check($_GET["category"]))
					|| (isset($_GET["level"]) && application_common_util::inject_check($_GET["level"]))
					|| (isset($_GET["difficulty"]) && application_common_util::inject_check($_GET["difficulty"]))) {
					return false;
				}
				
				$this->view->query = $_GET["query"];
				$this->view->source = $_GET["source"];
				$this->view->type = $_GET["type"];
				$this->view->category = $_GET["category"];
				$this->view->level = $_GET["level"];
				$this->view->difficulty = $_GET["difficulty"];
				
				$obj_question = new application_models_question();
				$arr = $obj_question->retrieve(
												isset($_GET["query"]) ? $_GET["query"] : "",
												"",
												"",
												isset($_GET["source"]) ? $_GET["source"] : "",
												isset($_GET["type"]) ? $_GET["type"] : "",
												isset($_GET["category"]) ? $_GET["category"] : "",
												isset($_GET["level"]) ? $_GET["level"] : "",
												isset($_GET["difficulty"]) ? $_GET["difficulty"] : "");
				$count = count($arr);
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
				
				
				$arr = $obj_question->retrieveWithNumber(
														isset($_GET["query"]) ? $_GET["query"] : "",
														"",
														"",
														isset($_GET["source"]) ? $_GET["source"] : "",
														isset($_GET["type"]) ? $_GET["type"] : "",
														isset($_GET["category"]) ? $_GET["category"] : "",
														isset($_GET["level"]) ? $_GET["level"] : "",
														isset($_GET["difficulty"]) ? $_GET["difficulty"] : "",
														$page,
														10);
				$this->view->total = $count;
				if($arr != false) {
					$i = 0;
					$obj_questiontoexplain = new application_models_questiontoexplain();
					$obj_discuss = new application_models_discuss();
					$obj_favorite = new application_models_favorite();
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
						$pagecontext = "<a href=\"http://www.answerwo.com/q/list?query=".$_GET['query']."&source=".$_GET['source']."&type=".application_common_util::TypeMap($_GET['type'])."&difficulty=".application_common_util::DifficultyMap($_GET['difficulty'])."&level=".$_GET["level"]."&category=".application_common_util::KnowMap($_GET["category"])."&page=".($i+$page)."\">".($i+$page)."</a> ";
						$this->view->pagination .= $pagecontext;
					}
					if($page < $pagenumber) {
						$this->view->lastpaflag = 1;
						$this->view->lastpagination = "<a href=\"http://www.answerwo.com/q/list?query=".$_GET['query']."&source=".$_GET['source']."&type=".application_common_util::TypeMap($_GET['type'])."&difficulty=".application_common_util::DifficultyMap($_GET['difficulty'])."&level=".$_GET["level"]."&category=".application_common_util::KnowMap($_GET["category"])."&page=".$pagenumber."\">".$pagenumber."</a>";
					}
					$this->view->questions = Zend_Json::encode($arr);
				}
				
				//add favorite
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
			}
			catch(Zend_Exception $e){
				echo $e->getMessage()."<br>";
				return false;
			}
		}
	}
	
	public function myfavoriteAction() {
		if(isset($_GET["user"]) && $_GET["user"] != "" && !application_common_util::inject_check($_GET["user"])) {
			$this->view->curuser = $_GET["user"];
			$obj_favorite = new application_models_favorite();
			$obj_user = new application_models_user();
			$obj_question = new application_models_question();
			$obj_questiontoexplain = new application_models_questiontoexplain();
			$obj_discuss = new application_models_discuss();
			$uids = $obj_user->getUserByName($_GET["user"]);
			$uid = $uids["id"];
			$qids = $obj_favorite->getByuid($uid);
			$arr = array();
			if($qids != false) {
				foreach($qids as $qid) {
					array_push($arr,$obj_question->getQuestionById($qid["question_id"]));
				}
				$i = 0;
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
				$this->view->questions = Zend_Json::encode($arr);
				$this->view->total = count($arr);
			}
			else {
				$this->view->total = "0";
			}
			
			if(isset($_GET["removeid"]) && $_GET["removeid"] != "" && !application_common_util::inject_check($_GET["removeid"])) {
				$obj_favorite->removeByQidandUid($uid,$_GET["removeid"]);
			}
		}
		else {
			$this->view->total = "0";
		}
	}
}
?>