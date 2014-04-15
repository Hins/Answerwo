    <nav id="dark">
    	<div class="ym-wrapper">
            <div class="ym-wbox ym-clearfix">
                <ul>
                  <li class="current">初中数学</li>
                  <li><a href="#">初中语文</a></li>
                  <li><a href="#">初中英语</a></li>
                  <li><a href="#">初中物理</a></li>
                  <li>
                    <a class="dropdown" href="#">初中/中考▾</a>
                    <ul>
                      <li><a href="#">初中数学</a></li>
                      <li><a href="#">初中语文</a></li>
                      <li><a href="#">初中英语</a></li>
                      <li><a href="#">初中物理</a></li>
                      <li><a href="#">初中化学</a></li>
                      <li><a href="#">初中历史</a></li>
                      <li><a href="#">初中地理</a></li>
                      <li><a href="#">初中政治</a></li>
                      <li><a href="#">初中生物</a></li>
                    </ul>
                  </li>
                </ul>
                <div class="userinfo">
                    <?php
                    $user = application_common_userutil::getLoginUserInfo();
                    if($user['login']==1){
                    ?>
                        <span>欢迎你，<?php echo $user['name']?></span>
                        <a href="/profile/">进入个人中心</a>
                        <a href="/account/exit?<?php echo application_common_util::flushBrowserCache()?>">退出登录</a>
                    <?php
                    }
                    else{
                    ?>
                        <a href="javascript:void(0)" popup="login">登录</a>
                        <a href="/account/register" class="important">新用户注册</a>
                    <?php
                    }
                    ?>
                </div>
            </div>
        </div>
    </nav>
