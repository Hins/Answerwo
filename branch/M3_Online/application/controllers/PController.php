<?php

class PController extends Zend_Controller_Action {

	public function profileAction() {
		application_common_util::Log();
    	if(isset($_GET["user"]) && $_GET["user"] != "" && !application_common_util::inject_check($_GET["user"])) {
    		if(application_common_userutil::getCurUser() != $_GET["user"]) {
    			$this->view->curuser = application_common_userutil::getCurUser();
    		}
    		else {
			    $this->view->curuser = $_GET["user"];
    		}
			
			//get favorite;
			$obj_favorite = new application_models_favorite();
			$obj_user = new application_models_user();
			$obj_question = new application_models_question();
			$obj_questiontoexplain = new application_models_questiontoexplain();
			$obj_discuss = new application_models_discuss();
			$uids = $obj_user->getUserByName(application_common_userutil::getCurUser());
			$uid = $uids["id"];
			$arr = array();	
			$qids = $obj_favorite->getByuid($uid);
			
			$arrfavorite = array();
			if($qids != false) {
				foreach($qids as $qid) {
					array_push($arrfavorite,$obj_question->getQuestionById($qid["question_id"]));
				}
				$i = 0;
				foreach($arrfavorite as $val) {
					$arrfavorite[$i]["link"] = "http://www.answerwo.com/q/detail?encryptid=".$val["encryptid"];
					if(intval($val["source"]) / 100 > 1000) {
						$arrfavorite[$i]["year"] = intval($val["source"]) / 100;
						$arrfavorite[$i]["month"] = intval($val["source"]) % 100;
					}
					else {
						$arrfavorite[$i]["year"] = intval($val["source"]);
					}
					$arrfavorite[$i]["question"] = $arrfavorite[$i]["content"];
					$arrfavorite[$i]["difficulty"] = application_common_util::RevDifficultyMap($val["difficulty"]);
					$explaincount = $obj_questiontoexplain->getCountByQid($val["id"]);
					$arrfavorite[$i]["explaincount"] = $explaincount["count"];
					$discusscount = $obj_discuss->getCountByQid($val["id"]);
					$arrfavorite[$i]["discusscount"] = $discusscount["count"];
					$favoritecount = $obj_favorite->getCountByQid($val["id"]);
					$arrfavorite[$i]["favoritecount"] = $favoritecount["count"];
					$arrfavorite[$i]["type"] = "favorite";
					$date = new Zend_Date($qids[$i]["createTime"],'yyyy-MM-dd HH:mm:ss');
					$date->add('13:00:00', Zend_Date::TIMES);
					$arrfavorite[$i]["createTime"] = $date->toString('yyyy-MM-dd HH:mm:ss');
					$arr[$arrfavorite[$i]["createTime"]] = $arrfavorite[$i];
					$i++;
				}
			}
			//get explain;
			$arrexplain = $obj_questiontoexplain->getQuestionbyCreator($uid);
			$obj_explain = new application_models_explains();
			if($arrexplain) {
				$i = 0;
				foreach($arrexplain as $val) {
					$arrs = $obj_question->getQuestionById($val["question_id"]);
					if(intval($arrs["source"]) / 100 > 1000) {
						$arrexplain[$i]["year"] = intval($arrs["source"]) / 100;
						$arrexplain[$i]["month"] = intval($arrs["source"]) % 100;
					}
					else {
						$arrexplain[$i]["year"] = intval($arrs["source"]);
					}
					$arrexplain[$i]["difficulty"] = application_common_util::RevDifficultyMap($arrs["difficulty"]);
					$arrexplain[$i]["question"] = $arrs["content"];
					$arrexplain[$i]["link"] = "http://www.answerwo.com/q/detail?encryptid=".$arrs["encryptid"];
					
					$explaincount = $obj_questiontoexplain->getCountByQid($val["question_id"]);
					$arrexplain[$i]["explaincount"] = $explaincount["count"];
					$discusscount = $obj_discuss->getCountByQid($val["question_id"]);
					$arrexplain[$i]["discusscount"] = $discusscount["count"];
					$favoritecount = $obj_favorite->getCountByQid($val["question_id"]);
					$arrexplain[$i]["favoritecount"] = $favoritecount["count"];
						
					$arrs = $obj_explain->getExplainsById($val["explain_id"]);
					$arrexplain[$i]["content"] = $arrs["content"];
					$arrexplain[$i]["type"] = "explain";
					
					$explain_date = new Zend_Date($val["createTime"],'yyyy-MM-dd HH:mm:ss');
					$explain_date->add('13:00:00', Zend_Date::TIMES);
					$arrexplain[$i]["createTime"] = $explain_date->toString('yyyy-MM-dd HH:mm:ss');
					$arr[$arrexplain[$i]["createTime"]] = $arrexplain[$i];
					$i++;
				}
			}
			//get discuss;
			$arrdiscuss = $obj_discuss->getAllDiscussByuid($uid);
			if($arrdiscuss) {
				$i = 0;
				foreach($arrdiscuss as $val) {
					$arrs = $obj_question->getQuestionById($val["question_id"]);
					if(intval($arrs["source"]) / 100 > 1000) {
						$arrdiscuss[$i]["year"] = intval($arrs["source"]) / 100;
						$arrdiscuss[$i]["month"] = intval($arrs["source"]) % 100;
					}
					else {
						$arrdiscuss[$i]["year"] = intval($arrs["source"]);
					}
					$arrdiscuss[$i]["difficulty"] = application_common_util::RevDifficultyMap($arrs["difficulty"]);
					$arrdiscuss[$i]["question"] = $arrs["content"];
					$arrdiscuss[$i]["link"] = "http://www.answerwo.com/q/detail?encryptid=".$arrs["encryptid"];
					$arrdiscuss[$i]["type"] = "discuss";
					$explaincount = $obj_questiontoexplain->getCountByQid($val["question_id"]);
					$arrdiscuss[$i]["explaincount"] = $explaincount["count"];
					$discusscount = $obj_discuss->getCountByQid($val["question_id"]);
					$arrdiscuss[$i]["discusscount"] = $discusscount["count"];
					$favoritecount = $obj_favorite->getCountByQid($val["question_id"]);
					$arrdiscuss[$i]["favoritecount"] = $favoritecount["count"];
					$date = new Zend_Date($val["createTime"],'yyyy-MM-dd HH:mm:ss');
					$date->add('13:00:00', Zend_Date::TIMES);
					$arrdiscuss[$i]["createTime"] = $date->toString('yyyy-MM-dd HH:mm:ss');
					$arr[$arrdiscuss[$i]["createTime"]] = $arrdiscuss[$i];
					$i++;
				}
			}
			//question record;
			$obj_record = new application_models_record();
			$arrrecord = $obj_record->getAnswersByUid($uid);
			if($arrrecord) {
				$i = 0;
				foreach($arrrecord as $val) {
					$arrs = $obj_question->getQuestionById($val["question_id"]);
					if(intval($arrs["source"]) / 100 > 1000) {
						$arrrecord[$i]["year"] = intval($arrs["source"]) / 100;
						$arrrecord[$i]["month"] = intval($arrs["source"]) % 100;
					}
					else {
						$arrrecord[$i]["year"] = intval($arrs["source"]);
					}
					
					$arrrecord[$i]["difficulty"] = application_common_util::RevDifficultyMap($arrs["difficulty"]);
					$arrrecord[$i]["question"] = $arrs["content"];
					$arrrecord[$i]["link"] = "http://www.answerwo.com/q/detail?encryptid=".$arrs["encryptid"];
					$arrrecord[$i]["correctanswer"] = $arrs["answer"];
					$arrrecord[$i]["type"] = "record";
					$explaincount = $obj_questiontoexplain->getCountByQid($val["question_id"]);
					$arrrecord[$i]["explaincount"] = $explaincount["count"];
					$discusscount = $obj_discuss->getCountByQid($val["question_id"]);
					$arrrecord[$i]["discusscount"] = $discusscount["count"];
					$favoritecount = $obj_favorite->getCountByQid($val["question_id"]);
					$arrrecord[$i]["favoritecount"] = $favoritecount["count"];
					$date = new Zend_Date($val["createTime"],'yyyy-MM-dd HH:mm:ss');
					$date->add('13:00:00', Zend_Date::TIMES);
					$arrrecord[$i]["createTime"] = $date->toString('yyyy-MM-dd HH:mm:ss');
					$arr[$arrrecord[$i]["createTime"]] = $arrrecord[$i];
					$i++;
				}
				$this->view->questions = Zend_Json::encode($arr);
				$this->view->total = count($arr);
			}
			
			krsort($arr);
			$this->view->questions = Zend_Json::encode($arr);
			
    	}
    	else {
    		return false;
    	}
    }
    
    public function favoriteAction() {
    	application_common_util::Log();
    	if(isset($_GET["user"]) && $_GET["user"] != "" && !application_common_util::inject_check($_GET["user"])) {
    		if(application_common_userutil::getCurUser() != $_GET["user"]) {
    			$this->view->curuser = application_common_userutil::getCurUser();
    		}
    		else {
			    $this->view->curuser = $_GET["user"];
    		}
			$obj_favorite = new application_models_favorite();
			$obj_user = new application_models_user();
			$obj_question = new application_models_question();
			$obj_questiontoexplain = new application_models_questiontoexplain();
			$obj_discuss = new application_models_discuss();
			$uids = $obj_user->getUserByName(application_common_userutil::getCurUser());
			$uid = $uids["id"];
			
			if(isset($_GET["removeid"]) && $_GET["removeid"] != "" && !application_common_util::inject_check($_GET["removeid"])) {
				$obj_favorite->removeByQidandUid($uid,$_GET["removeid"]);
			}
			
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
					$date = new Zend_Date($arr[$i]["createTime"],'Y-m-d H:m:s');
					$date->add('13:00:00', Zend_Date::TIMES);
					$arr[$i]["createTime"] = $date->toString('Y-m-d H:s:m');
					$i++;
				}
				$this->view->questions = Zend_Json::encode($arr);
				$this->view->total = count($arr);
			}
			else {
				$this->view->total = "0";
			}
		}
		else {
			$this->view->total = "0";
		}
    }
    
    public function questionAction() {
    	application_common_util::Log();
    	if(isset($_GET["user"]) && $_GET["user"] != "" && !application_common_util::inject_check($_GET["user"])) {
    		if(application_common_userutil::getCurUser() != $_GET["user"]) {
    			$this->view->curuser = application_common_userutil::getCurUser();
    		}
    		else {
			    $this->view->curuser = $_GET["user"];
    		}
			$obj_user = new application_models_user();
			$uids = $obj_user->getUserByName(application_common_userutil::getCurUser());
			$uid = $uids["id"];
			$obj_record = new application_models_record();
			$arr = $obj_record->getAnswersByUid($uid);
			$obj_question = new application_models_question();
			if($arr) {
				$i = 0;
				foreach($arr as $val) {
					$arrs = $obj_question->getQuestionById($val["question_id"]);
					$arr[$i]["source"] = $arrs["source"];
					$arr[$i]["difficulty"] = application_common_util::RevDifficultyMap($arrs["difficulty"]);
					$arr[$i]["question"] = $arrs["content"];
					$arr[$i]["link"] = "http://www.answerwo.com/q/detail?encryptid=".$arrs["encryptid"];
					$arr[$i]["correctanswer"] = $arrs["answer"];
					$date = new Zend_Date($arr[$i]["createTime"],'Y-m-d H:m:s');
					$date->add('13:00:00', Zend_Date::TIMES);
					$arr[$i]["createTime"] = $date->toString('Y-m-d H:s:m');
					$i++;
				}
				$this->view->questions = Zend_Json::encode($arr);
				$this->view->total = count($arr);
			}
			else {
				$this->view->total = "0";
			}
    	}
    }
    
    public function explainAction() {
    	application_common_util::Log();
    	if(isset($_GET["user"]) && $_GET["user"] != "" && !application_common_util::inject_check($_GET["user"])) {
    		if(application_common_userutil::getCurUser() != $_GET["user"]) {
    			$this->view->curuser = application_common_userutil::getCurUser();
    		}
    		else {
			    $this->view->curuser = $_GET["user"];
    		}
			$obj_user = new application_models_user();
			$uids = $obj_user->getUserByName(application_common_userutil::getCurUser());
			$uid = $uids["id"];
			$obj_questiontoexplain = new application_models_questiontoexplain();
			$arr = $obj_questiontoexplain->getQuestionbyCreator($uid);
			$obj_question = new application_models_question();
			$obj_explain = new application_models_explains();
			if($arr) {
				$i = 0;
				foreach($arr as $val) {
					$arrs = $obj_question->getQuestionById($val["question_id"]);
					$arr[$i]["source"] = $arrs["source"];
					$arr[$i]["difficulty"] = application_common_util::RevDifficultyMap($arrs["difficulty"]);
					$arr[$i]["question"] = $arrs["content"];
					$arr[$i]["link"] = "http://www.answerwo.com/q/detail?encryptid=".$arrs["encryptid"];
					
					$arrs = $obj_explain->getExplainsById($val["explain_id"]);
					$arr[$i]["content"] = $arrs["content"];
					$date = new Zend_Date($arr[$i]["createTime"],'Y-m-d H:m:s');
					$date->add('13:00:00', Zend_Date::TIMES);
					$arr[$i]["createTime"] = $date->toString('Y-m-d H:s:m');
					$i++;
				}
				$this->view->questions = Zend_Json::encode($arr);
				$this->view->total = count($arr);
			}
			else {
				$this->view->total = "0";
			}
    	}
    }
    
    public function discussAction() {
    	application_common_util::Log();
    	if(isset($_GET["user"]) && $_GET["user"] != "" && !application_common_util::inject_check($_GET["user"])) {
    		if(application_common_userutil::getCurUser() != $_GET["user"]) {
    			$this->view->curuser = application_common_userutil::getCurUser();
    		}
    		else {
			    $this->view->curuser = $_GET["user"];
    		}
			$obj_user = new application_models_user();
			$uids = $obj_user->getUserByName(application_common_userutil::getCurUser());
			$uid = $uids["id"];
			$obj_discuss = new application_models_discuss();
			$arr = $obj_discuss->getAllDiscussByuid($uid);
			$obj_question = new application_models_question();
			if($arr) {
				$i = 0;
				foreach($arr as $val) {
					$arrs = $obj_question->getQuestionById($val["question_id"]);
					$arr[$i]["source"] = $arrs["source"];
					$arr[$i]["difficulty"] = application_common_util::RevDifficultyMap($arrs["difficulty"]);
					$arr[$i]["question"] = $arrs["content"];
					$arr[$i]["link"] = "http://www.answerwo.com/q/detail?encryptid=".$arrs["encryptid"];
					$date = new Zend_Date($arr[$i]["createTime"],'Y-m-d H:m:s');
					$date->add('13:00:00', Zend_Date::TIMES);
					$arr[$i]["createTime"] = $date->toString('Y-m-d H:s:m');
					$i++;
				}
				$this->view->questions = Zend_Json::encode($arr);
				$this->view->total = count($arr);
			}
			else {
				$this->view->total = "0";
			}
    	}
    }
    
    public function practiceAction() {
    	application_common_util::Log();
    	if(isset($_GET["user"]) && $_GET["user"] != "" && !application_common_util::inject_check($_GET["user"])) {
    		if(application_common_userutil::getCurUser() != $_GET["user"]) {
    			$this->view->curuser = application_common_userutil::getCurUser();
    		}
    		else {
			    $this->view->curuser = $_GET["user"];
    		}
    		$obj_user = new application_models_user();
			$uids = $obj_user->getUserByName(application_common_userutil::getCurUser());
			$uid = $uids["id"];
			
			$obj_record = new application_models_record();
			$encryptids = $obj_record->getDistinctPractice($uid);
			$this->view->count = count($encryptids);
			$i = 0;
			foreach($encryptids as $encryptid) {
				$date = new Zend_Date($encryptid["createTime"],'Y-m-d H:m:s');
				$date->add('13:00:00', Zend_Date::TIMES);
				$encryptids[$i]["createTime"] = $date->toString('Y-m-d H:s:m');
				$encryptids[$i]["link"] = "http://www.answerwo.com/p/practiceset?encryptid=".$encryptid["encryptid"];
				$i++;
			}
			$this->view->result = Zend_Json::encode($encryptids);
    	}
    }
    
    public function practicesetAction() {
    	application_common_util::Log();
    	if(isset($_GET["encryptid"]) && $_GET["encryptid"] != "" && !application_common_util::inject_check($_GET["encryptid"])) {
    		$curuser = application_common_userutil::getCurUser(); 
    		if($curuser == false) {
    			return false;
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
    		
    		$obj_user = new application_models_user();
    		$obj_question = new application_models_question();
			$uids = $obj_user->getUserByName($curuser);
			$uid = $uids["id"];
			
			$obj_record = new application_models_record();
			$questions = $obj_record->getRecordByUidandEid($uid,$_GET["encryptid"]);
			$this->view->total = count($questions);
			$correct = 0;
			$i = 0;
			$realquestions = array();
			foreach($questions as $question) {
				$arr = $obj_question->getQuestionById($question["question_id"]);
				$arr["link"] = "http://www.answerwo.com/q/detail?encryptid=".$arr["encryptid"];
				$arr["useranswer"] = $question["answer"];
				if($arr["useranswer"] == $arr["answer"]) {
					$correct++;
				}
				array_push($realquestions,$arr);
				$i++;
			}
			$this->view->questions = Zend_Json::encode($realquestions);
			$this->view->correct = $correct;
			$this->view->wrong = count($questions) - $correct;
			$this->view->correction = intval(($correct/count($questions)) * 100); 
			
    	}
    }
    
    public function passwordAction() {
    	application_common_util::Log();
    	if(isset($_GET["user"]) && $_GET["user"] != "" && !application_common_util::inject_check($_GET["user"])) {
    		if(application_common_userutil::getCurUser() != $_GET["user"]) {
    			$this->view->curuser = application_common_userutil::getCurUser();
    		}
    		else {
			    $this->view->curuser = $_GET["user"];
    		}
			
			if(isset($_POST["password"]) && $_POST["password"] != "") {
				if(isset($_POST["password"]) && isset($_POST["repassword"])
					&& strlen($_POST["password"]) >= 6 && strlen($_POST["password"]) <= 16
					&& $_POST["password"] == $_POST["repassword"]) {
						$obj_user = new application_models_user();
						$obj_user->updateUserPasswordByName($_GET["user"],$_POST["password"]);
						$this->view->information = "您的密码修改成功！";
					}
				else {
					$this->view->information = "对不起，您的密码修改失败！";
				}
			}
    	}
    }
}