<?php
	if(!isset($this->curuser)) { 
?>
			<div class="userinfo">
				<a href="http://www.answerwo.com/u/login" popup="login">登录</a>
				<a href="http://www.answerwo.com//u/register">新用户注册</a>
			</div>
<?php
	}
    else { 
?>
			<div class="userinfo">
				<a href="http://www.answerwo.com/q/myfavorite?user=<?php echo $this->curuser;?>"><?php echo $this->curuser;?></a>
				<a href="javascript:exit('answerwo_name');">退出</a>
			</div>
<?php
	} 
?>