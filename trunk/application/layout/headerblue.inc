<?php
if(!isset($include_param)){
    $include_param = array(
        'type'=>'',
    );
}
$type = $include_param['type'];
if($type == 'search'){
?>
<header id="blue">
	<div class="ym-wrapper">
		<div class="ym-wbox ym-clearfix">
			<div class="logo"><a href="#"><img src="/images/logo.gif" width="313" height="35" alt="找题目" /></a></div>
			<a href="#" class="add">新增</a>
			<form class="ym-clearfix">
				<input type="search" placeholder="输入关键字搜索" class="inpmain" />
				<input type="submit" value="搜索" class="inpsearch" />
			</form>
		</div>
	</div>
</header>
<?php
}
else if($type == 'register'){
?>
<header id="blue">
	<div class="ym-wrapper">
		<div class="ym-wbox ym-clearfix">
			<div class="logo"><a href="http://www.zhaotimu.com"><img src="/images/logo.gif" width="313" height="35" alt="找题目" /></a></div>
			<a href="/account/register/" class="login">新用户注册</a>
			<div class="intro">还没有找题目的账号？</div>             
		</div>
	</div>
</header>
<?php
}
else if($type == 'login'){
?>
<header id="blue">
	<div class="ym-wrapper">
		<div class="ym-wbox ym-clearfix">
			<div class="logo"><a href="http://www.zhaotimu.com"><img src="/images/logo.gif" width="313" height="35" alt="找题目" /></a></div>
			<a href="/account/login/" class="login">老用户登录</a>
			<div class="intro">已经有找题目的账号？</div>             
		</div>
	</div>
</header>
<?php
}
?>