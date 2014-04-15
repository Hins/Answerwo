<?php
/*
    Description: search operations utils
    Author: Hins Pan
    Date: June 23th, 2012
*/
require_once "application/common/JP_Lucene_Analyzer.php";

class SearchController extends Zend_Controller_Action {
	
	public function createAction() {
		try {
	    	$obj_q = new application_models_question();
	    	$rows = $obj_q->getAllQuestionContent();
	    	$size = count($rows);
	    	$index = new Zend_Search_Lucene(_INDEXFILE,true);
	    	Zend_Search_Lucene_Analysis_Analyzer::setDefault(new JP_Lucene_Analyzer());
	    	for($i = 0; $i < $size; $i++) {
		    	$doc = new Zend_Search_Lucene_Document();
            	$doc->addField(Zend_Search_Lucene_Field::Text('keyword', $rows[$i]['id']));
            	$doc->addField(Zend_Search_Lucene_Field::UnStored('contents', $rows[$i]['content']));
            	$index->addDocument($doc);
	    	}
	    	$index->commit();
	    	$index->optimize();
	    	$this->view->total = $i;
		}
		catch (Zend_Exception $e) {
	    	$this->view->errorinfo = "Caught exception: " . get_class($e) . "\n";
    	    $this->view->errorinfo = "Message: " . $e->getMessage() . "\n";
		}
    }
    
 	public function searchAction() {
	    try {
	    	//Zend_Lucene was deprecated now, replaced by sql search;
	        if(isset($_GET['query']) && 0) {
	        	$index = new Zend_Search_Lucene(_INDEXFILE);
	    		Zend_Search_Lucene_Analysis_Analyzer::setDefault(new JP_Lucene_Analyzer());
	    		$hits = $index->find($_GET['query']);
            	$obj_q = new application_models_question();
	    		$result = array();
	    		$i = 0;
	    		foreach ($hits as $hit) {
	    			$i++;
					$result[$hit->keyword] = $obj_q->getQuestionContentById($hit->keyword);
	    		}
	    		$this->view->result = Zend_Json::encode($result);
	    		$this->view->total = $i;
	    	}
	    	if(isset($_GET['query'])) {
	    		$obj_question = new application_models_question();
	    		$arr = $obj_question->getQuestionBySimContent2($_GET['query']);
	    		$this->view->result = Zend_Json::encode($arr);
	    	}
		}
		catch (Zend_Exception $e) {
	    	$this->view->errorinfo = "Caught exception: " . get_class($e) . "\n";
            $this->view->errorinfo = "Message: " . $e->getMessage() . "\n";
		}
    }

    public function deleteAction() {
		try {
	    	$index = new Zend_Search_Lucene(_INDEXFILE);
	    	$i = 0;
	    	for(; $i < $index->Count(); $i++) {
				$index->delete($i);
	    	}
	    	$this->view->total = $i;
		}
		catch (Zend_Exception $e) {
            $this->view->errorinfo = "Caught exception: " . get_class($e) . "\n";
            $this->view->errorinfo = "Message: " . $e->getMessage() . "\n";
        }
    }

    public function relatedAction() {
		try {
	    	if(isset($_POST['id'])) {
	        	$id = $_POST["id"];
	        	$result = GetRelatedQuestions($id);
	        	$this->view->result = Zend_Json::encode($result);
            }
		}
		catch (Zend_Exception $e) {
	    	$this->view->errorinfo = "Caught exception: " . get_class($e) . "\n";
            $this->view->errorinfo = "Message: " . $e->getMessage() . "\n";
		}
    }
}
?>