<?php
	if(!isset($this->curuser)) { 
?>
			<div class="userinfo">
				<a href="javascript:showlogin()" popup="login">登录</a>
				<a href="javascript:showregister()">新用户注册</a>
			</div>
<?php
	}
    else { 
?>
			<div class="userinfo">
				<a href="javascript:void(0)"><?php echo $this->curuser;?></a>
				<a href="http://www.answerwo.com/p/profile?user=<?php echo $this->curuser;?>">个人中心</a>
				<a href="javascript:exit('answerwo_name');">退出</a>
			</div>
<?php
	} 
?>