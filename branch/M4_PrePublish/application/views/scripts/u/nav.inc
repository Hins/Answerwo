<?php
header("Expires: " . gmdate("D, d M Y H:i:s") . "GMT");
$uri = $_SERVER['REQUEST_URI'];
$current = explode("?", $uri);
$current = $current[0];
$current = explode("/",$current);
$current = array_reverse($current);
$current = $current[0];
//$current_user = application_common_userutil::getLoginUserInfo();

$ADMIN_SUBJECT = isset($_COOKIE['ADMIN_SUBJECT'])?$_COOKIE['ADMIN_SUBJECT']:-1;
?>
<script>
function setSubject(obj){
    index = obj.selectedIndex;
    select = document.getElementById('select-subject');
    subjectid = select[index].value;
    setCookie('ADMIN_SUBJECT', subjectid);
    window.location.reload();
}
</script>
<div id="logo"></div>
    <div class="admin-block" id="myinfo">
	<ul>
	<li><?php echo $this->user;?></li>
	</ul>
	<ul>

	<li><a href="javascript:exit('answerwo_name');">退出登录</a></li>
	</ul>
	</div>

    <div id="adv-admin">
	<h2>题目管理</h2>
	<div class="admin-block"><h3>题目管理</h3>
	<ul>
        <li <?php echo $current=='addquestion'?'class="current"':''; ?>><a href="/u/addquestion">题目创建</a></li>
        <li <?php echo $current=='editquestion'?'class="current"':''; ?>><a href="/u/editquestion">题目编辑</a></li>
        <li <?php echo $current=='deletequestion'?'class="current"':''; ?>><a href="/u/deletequestion">题目删除</a></li>
        <li <?php echo $current=='listquestion'?'class="current"':''; ?>><a href="/u/listquestion">题目一览</a></li>
        <li <?php echo $current=='searchquestion'?'class="current"':''; ?>><a href="/u/searchquestion">题目检索</a></li>
    </ul>
    </div>

	<div id="normal-admin">
	<h2>用户管理</h2>
	<div class="admin-block"><h3>用户信息管理</h3>
	<ul>
        <li <?php echo $current=='userlist'?'class="current"':''; ?>><a href="/u/userlist">用户一览</a></li>
        <li <?php echo $current=='useradd'?'class="current"':''; ?>><a href="/u/useradd">添加新用户</a></li>
        <li <?php echo $current=='useredit'?'class="current"':''; ?>><a href="/u/useredit">编辑用户</a></li>
        <li <?php echo $current=='userdelete'?'class="current"':''; ?>><a href="/u/userdelete">删除用户</a></li>
    </ul>
	</div>


    <div class="admin-block"><h3>UGC信息管理</h3>
	<ul>
        <li <?php echo $current=='discuss'?'class="current"':''; ?>><a href="/u/discuss">讨论一览</a></li>
        <li <?php echo $current=='explain'?'class="current"':''; ?>><a href="/u/explain">解析一览</a></li>
        <li <?php echo $current=='favorite'?'class="current"':''; ?>><a href="/u/favorite">收藏一览</a></li>
    </ul>
	</div>

	</div>
