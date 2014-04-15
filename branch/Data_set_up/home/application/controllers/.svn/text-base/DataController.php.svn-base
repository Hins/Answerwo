<?php
/*
    Description: database operations utils
    Author: Hins Pan
    Date: June 17th, 2012
*/

class DataController extends Zend_Controller_Action 
{
	private $_path = "/home/hinspan/projects/answerwo/data/";
	private $_start = "<span class=\"blue bold\">";
	private $_substart = "<span class=\"red\">";
	private $_subend = "</p>";
	private $_answerstart = "<option>";
	private $_answerend = "</option>";
	private $_answerdelimiter = ",";
	private $_middle = "<br />";
	private $_delimeter = "-";
	private $_default_level = 1;
	private $_default_source = "0";
	private $_READING = 7;
	private $_NORECORD = "查询失败，没有数据！";
	
	private function _KnowMap($string)
	{
		switch($string) {
			case "文法":
				return 1;
			case "文字":
				return 2;
			case "读解":
				return 3;
			case "原文":
				return 4;
			case "作文":
				return 5;
			case "听力":
				return 6;
			default:
				return 0;
		}
	}
	
	private function _RevKnowMap($num)
	{
		switch($num) {
			case 1:
				return "文法";
			case 2:
				return "文字";
			case 3:
				return "读解";
			case 4:
				return "原文";
			case 5:
				return "作文";
			case 6:
				return "听力";
			default:
				return "0";
		}
	}
	
	private function _FilterBlank($string)
	{
		if(($start = stripos($string,"")) !== false) {
			$end = stripos($string,"");
			$substr = susbtr($string,$start,$end-$start+1);
			return str_replace("______",$substr,$string);
		}
		
		return $string;
	}
	
	private function _GetLevel($source)
	{
		if(($start = stripos($source,"-")) !== false) {
			return intval(substr($source,$start+1));
		}
		return $this->_default_level;
	}
	
	private function _GetSource($source)
	{
		if(($start = stripos($source,"-")) !== false) {
			return substr($source,0,$start);
		}
		return $this->_default_source;
	}
	
	private function _trim($string) 
	{
		$len = strlen($string);
		$i = 0;
		while($i < $len && $string[$i] == "　")
			$i++;
		$len--;
		while($len >= 0 && $string[$len] == "　")
			$len--;
		return substr(substr($string,$i),0,$len-$i);
	}
		
	private function _ReadFile()
	{
		try {
		for($i = 1; $i <= 500; $i++) {
			if (is_readable($this->_path.$i.".html") == false) {
				continue;
			}
			$fp = fopen($this->_path.$i.".html", "r");
			$subarr = array();
			$answerarr = array();
			while(!feof($fp)) {
				$str = fgets($fp);
				
				//find subjects;
				if(stripos($str,$this->_start,0) !== false) {
					$start = 0;			
					while(($pos = stripos($str,$this->_substart,$start)) !== false) {
						array_push($subarr,
								   substr($str,
								   		  $pos+18,
								   		  stripos($str,$this->_subend,$pos+1)-$pos-18));
						$start = stripos($str,$this->_subend,$start+1)+4;
					}
				} 
				
				//find answers;
				if(($pos = stripos($str,$this->_answerstart,0)) !== false) {
					if(stripos($str,$this->_answerdelimiter,$pos) !== false) {
						$str = substr($str,$pos+8,stripos($str,$this->_answerend,$pos)-$pos-8);		
						$answerarr = explode($this->_answerdelimiter,$str);
						array_pop($answerarr);
					}
				} 
			}
			$j = 0;
			$obj_question = new application_models_question();
			$obj_answer = new application_models_answer(); 
			$obj_questiontoanswer = new application_models_questiontoanswer();
			
			foreach($subarr as $value) {
				$source = substr($value,1,stripos($value,"]",0)-1);
				$question = substr($value,stripos($value,"]",0)+1,stripos($value,$this->_middle,0)-stripos($value,"]",0)-1);
				$question = substr($question,stripos($question,"</span>&nbsp;&nbsp;",0)+strlen("</span>&nbsp;&nbsp;"));

				if($obj_question->getQuestionByContent($question)) {
					continue;
				}
				
				$ans = substr($value,stripos($value,$this->_middle,0)+6);
				if(stripos($ans,"１") !== false) {
					$answers = array(
										rtrim(substr($ans,stripos($ans,"１",0)+strlen("１"),stripos($ans,"２",0)-stripos($ans,"１",0)-strlen("１")),"　"),
										rtrim(substr($ans,stripos($ans,"２",0)+strlen("２"),stripos($ans,"３",0)-stripos($ans,"２",0)-strlen("２")),"　"),
										rtrim(substr($ans,stripos($ans,"３",0)+strlen("３"),stripos($ans,"４",0)-stripos($ans,"３",0)-strlen("３")),"　"),
										rtrim(substr($ans,stripos($ans,"４",0)+strlen("４")),"　")
									);
				}
				if(stripos($ans,"1") !== false) {
					$answers = array(
										rtrim(substr($ans,stripos($ans,"1",0)+strlen("1"),stripos($ans,"2",0)-stripos($ans,"1",0)-strlen("1")),"　"),
										rtrim(substr($ans,stripos($ans,"2",0)+strlen("2"),stripos($ans,"3",0)-stripos($ans,"2",0)-strlen("2")),"　"),
										rtrim(substr($ans,stripos($ans,"3",0)+strlen("3"),stripos($ans,"4",0)-stripos($ans,"3",0)-strlen("3")),"　"),
										rtrim(substr($ans,stripos($ans,"4",0)+strlen("4")),"　")
									);
				}
				$arr = array (
                    "createTime" => new Zend_Db_Expr("current_timestamp()"),
					"lastmodifyTime" => new Zend_Db_Expr("current_timestamp()"),
					"creator" => 1,
					"type" => 1,
					"level" => 0,
					"content" => $question,
					"source" => intval($source),
                    "answer" => $answerarr[$j++]
                 );
                $ret = $obj_question->insert($arr);
                $arr = $obj_question->getQuestionByContent($question);
                $qid = $arr["id"];
                $k = 1;
                foreach($answers as $val) {
                	$arr = array (
                    				"createTime" => new Zend_Db_Expr("current_timestamp()"),
									"lastmodifyTime" => new Zend_Db_Expr("current_timestamp()"),
									"creator" => 1,
									"solution_seq" => 1,
									"sequence" => $k++,
									"content" => $this->_FilterBlank($val)
                 				);
                	$ret = $obj_answer->insert($arr);
                	$arr = $obj_answer->getAnswerByContent($val);
                	$aid = $arr["id"];
                	$arr = array (
                    				"createTime" => new Zend_Db_Expr("current_timestamp()"),
									"lastmodifyTime" => new Zend_Db_Expr("current_timestamp()"),
									"creator" => 1,
									"question_id" => $qid,
									"answer_id" => $aid
                 				);
                 	$ret = $obj_questiontoanswer->insert($arr);
                }
			}
			fclose($fp);
		} 
		}
		catch(Zend_Exception $e){
            echo $e->getMessage()."<br>";
            return false;
        }
	}
    
	public function insertHFdataAction()
    {
        $this->_ReadFile();
    }
    
    public function addAction()
    {
    	if(isset($_POST["content"]) && $_POST["content"] != "") {
    		try {
    			
    			$obj_question = new application_models_question();
    			$obj_answer = new application_models_answer();
    			$obj_questiontoanswer = new application_models_questiontoanswer();
    			
    			if($obj_question->getQuestionByContent($this->_FilterBlank($_POST["content"]))) {
    				return false;
    			}
    			
    			$arr = array(
    						"createTime" => new Zend_Db_Expr("current_timestamp()"),
							"lastmodifyTime" => new Zend_Db_Expr("current_timestamp()"),
							"creator" => 1,
    						"type" => intval($_POST["type"]),
    						"level" => intval(isset($_POST["source"]) ? $this->_GetLevel($_POST["source"]) : "1"),
    						"content" => $this->_FilterBlank($_POST["content"]),
    						"source" => intval(isset($_POST["source"]) ? $this->_GetSource($_POST["source"]) : "0"),
    						"category" => intval(isset($_POST["knowledge"]) ? $this->_KnowMap($_POST["knowledge"]) : "0"),
    						"answer" => isset($_POST["answer"]) ? $_POST["answer"] : "",
    						"difficulty" => intval(isset($_POST["difficulty"]) ? $_POST["difficulty"] : "3")
    						);
    			$ret = $obj_question->insert($arr);
    			if(intval($_POST["type"]) == $this->_READING) {
    				return true;
    			} 
    			$arr = $obj_question->getQuestionByContent($this->_FilterBlank($_POST["content"]));
    			$qid = $arr["id"];
    			
    			$arr = array(
    						$_POST["answer1"],
    						$_POST["answer2"],
    						$_POST["answer3"],
    						$_POST["answer4"]
    						);
    			$i = 1;
    			foreach($arr as $val) {
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
    			}
    		}
    		catch(Zend_Exception $e){
    			echo $e->getMessage()."<br>";
    			return false;
    		}
    	}
    }
    
    public function editAction()
    {
    	if(isset($_GET["search"]) && $_GET["search"] != "") {
    		try {
    			
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
    			$this->view->knowledge = $this->_RevKnowMap($arr["category"]);
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
    	
    	if(isset($_GET["id"]) && $_GET["id"] != "") {
    		try {
    			$qid = $_GET["id"];
    			$obj_question = new application_models_question();
    			$obj_answer = new application_models_answer();
    			$obj_questiontoanswer = new application_models_questiontoanswer();
    			$obj_questiontoexplain = new application_models_questiontoexplain();
    			$obj_explains = new application_models_explains();
    			
    			$arr = $obj_question->getQuestionById($qid);
    			if($arr == false) {
    				echo $this->_NORECORD;
    				return false;
    			}
    			if($arr["content"] != $_GET["content"]) {
    				$obj_question->UpdateContent($qid,$_GET["content"]);
    			}
    			if($arr["answer"] != $_GET["answer"]) {
    				$obj_question->UpdateAnswer($qid,$_GET["answer"]);
    			}
    			if($arr["category"] != $this->_KnowMap($_GET["knowledge"])) {
    				$obj_question->UpdataCategory($qid,$this->_KnowMap($_GET["knowledge"]));
    			}
    			if($arr["source"] != $_GET["source"]) {
    				$obj_question->UpdateSource($qid,$_GET["source"]);
    			}
    			if($arr["type"] != $_GET["type"]) {
    				$obj_question->UpdateType($qid,$_GET["type"]);
    			}
    			if($arr["difficulty"] != (isset($_GET["difficulty"]) ? $_GET["difficulty"] : "3")) {
    				$obj_question->UpdateDifficulty($qid,$_GET["difficulty"]);
    			}
    			
    			$arr = $obj_questiontoanswer->getQuestionAnswers($qid);
    			if(!empty($arr)) {
    				$i = 1;
    				foreach($arr as $val) {
    					$arrs = $obj_answer->getAnswerById($val["answer_id"]);
    					if(!empty($arrs)) {
    						$answer = "answer".$i++;
    						if($arrs["content"] != $_GET[$answer]) {
    							$obj_answer->UpdateContent($arrs["id"],$_GET[$answer]);
    						}
    					}
    				}
    			}
    			else if(intval($_GET["type"]) != 7){
    				for($i = 1; $i <= 4; $i++) {
    					$answer = "answer".$i;
    					if(isset($_GET[$answer]) && $_GET[$answer] != "") {
    						$arr = array (
    									 "createTime" => new Zend_Db_Expr("current_timestamp()"),
    									 "lastmodifyTime" => new Zend_Db_Expr("current_timestamp()"),
    									 "creator" => 1,
    									 "solution_seq" => 1,
    									 "sequence" => $i,
    									 "content" => $_GET[$answer]
    									 );
    						$obj_answer->insert($arr);
    						$arr = $obj_answer->getAnswerByContent($_GET[$answer]);
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
    			$arrs = $obj_explains->getExplainsById($arr["explain_id"]);
    			if(!empty($arr) && !empty($arrs) && $arrs["content"] != $_GET["explain"]) {
    				$obj_explains->UpdateContent($arr["explain_id"],$_GET["explain"]);
    			}
    			else if(isset($_GET["explain"]) && $_GET["explain"] != "") {
    				$arr = array (
    								"createTime" => new Zend_Db_Expr("current_timestamp()"),
    								"lastmodifyTime" => new Zend_Db_Expr("current_timestamp()"),
    								"creator" => 1,
    								"sequence" => 1,
    								"content" => $_GET["explain"]
    							 );
    				$obj_explains->insert($arr);
    				$arr = $obj_explains->getExplainByName($_GET["explain"]);
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
    		catch(Zend_Exception $e){
    			echo $e->getMessage()."<br>";
    			return false;
    		}
    	}
    }
    
	public function deleteAction()
    {
    	if(isset($_GET["search"]) && $_GET["search"] != "") {
    		try {
    			
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
    			$this->view->knowledge = $this->_RevKnowMap($arr["category"]);
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
}

?>