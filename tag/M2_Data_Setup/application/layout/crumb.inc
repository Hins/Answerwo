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
$crumb_title = isset($include_param['title'])?$include_param['title']:'';
$crumb_linktext = isset($include_param['linktext'])?$include_param['linktext']:'';
$crumb_linkurl = isset($include_param['linkurl'])?$include_param['linkurl']:'';
?>
<div id="crumb">
    	<div class="ym-wrapper">
            <div class="ym-wbox">
                <div class="ym-grid">
                    <div class="ym-g85 ym-gl">
                        <div class="ym-gbox">
                            <h1><?php echo $crumb_title ?></h1>
                        </div>
                    </div>
                    <div class="ym-g15 ym-gr">
                        <div class="ym-gbox">
                            <div class="more"><a href="<?php echo $crumb_linkurl?>"><?php echo $crumb_linktext?></a></div>
                        </div>
                    </div>
                </div>            	
            </div>
        </div>
    </div>