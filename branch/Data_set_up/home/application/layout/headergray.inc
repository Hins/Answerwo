<?php
$user = application_common_userutil::getLoginUserInfo();
?>
    <header id="gary" class="ym-wrapper">
        <div class="ym-wbox ym-clearfix">
            <div class="logo"><a href="#"><img src="/images/logo_black.gif" width="317" height="35" alt="找题目" /></a></div>
            <div class="links ym-clearfix">
            	<a href="#"><?php echo $user['name']; ?> 的个人中心</a>
                <a href="/account/setting">账号设置</a>
                <a href="/account/exit" class="last">退出登录</a>
            </div>
        </div>
    </header>
