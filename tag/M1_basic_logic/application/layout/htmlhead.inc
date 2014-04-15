<?php
/*
 * htmlhead,接收父页的变量，htmlhead_title,htmlhead_keyword,htmlhead_description
 */
if(!isset($include_param)){
    $include_param = array(
        'title'=>'',
        'keyword'=>'',
        'description'=>'',
    );
}
$htmlhead_title = isset($include_param['title'])?$include_param['title']:'';
$htmlhead_keyword = isset($include_param['keyword'])?$include_param['keyword']:'';
$htmlhead_description = isset($include_param['description'])?$include_param['description']:'';
?>
<head>
<meta charset="utf-8"/>
<title><?php echo $htmlhead_title;?></title>    
<meta property="wb:webmaster" content="9b15163589206cb0" />
<meta property="qc:admins" content="556777151346163752776375" />
<meta name="keyword" content="<?php  echo $htmlhead_keyword;?>"/>
<meta name="description" content="<?php echo $htmlhead_description;?>"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" href="http://www.answerwo.com/public/css/answerwo.css" type="text/css"/>
<!--[if lte IE 7]>
<link rel="stylesheet" href="http://www.answerwo.com/public/css/ym-iehacks.min.css" type="text/css"/>
<![endif]-->
<!--[if lt IE 9]>
<script src="http://www.answerwo.com/public/js/google.html5.js"></script>
<![endif]-->
<!--[remove javascript temporarily]
<script type="text/javascript" src="http://www.answerwo.com/public/js/jquery-1.7.1.min.js"></script>
<script type="text/javascript" src="http://www.answerwo.com/public/js/jquery-ui-1.8.7.min.js"></script>
<script type="text/javascript" src="http://www.answerwo.com/public/js/zhaotimu.parameter.js"></script>
<script type="text/javascript" src="http://www.answerwo.com/public/js/zhaotimu.plugins.js"></script>
<script type="text/javascript" src="http://www.answerwo.com/public/js/zhaotimu.function.js"></script>
<script type="text/javascript" src="http://www.answerwo.com/public/js/zhaotimu.popup.js"></script>
<script type="text/javascript" src="http://www.answerwo.com/public/js/zhaotimu.js"></script>
-->
<script type="text/javascript" src="http://www.answerwo.com/public/js/answerwo.js"></script>
</head>
<?php
header("Expires: " . gmdate("D, d M Y H:i:s") . "GMT");
?>
