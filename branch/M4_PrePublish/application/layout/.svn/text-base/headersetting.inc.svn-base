<?php
if(!isset($include_param)){
    $include_param = array(
        'current'=>'',
    );
}
$current = $include_param['current'];
?>
<header id="blue">
    	<div class="ym-wrapper">
            <div class="ym-wbox ym-clearfix">
                <div class="logo"><a href="#"><img src="../images/logo.gif" width="313" height="35" alt="找题目" /></a></div>
                <a href="/profile/favorite" class="login">回到个人中心</a>
            </div>
        </div>
    </header>

    <div id="crumb">
    	<div class="ym-wrapper">
            <div class="ym-wbox">
                <div class="ym-grid">
                    <div class="ym-gbox">
                        <h1>账号设置</h1>
                        <div class="set-nav ym-clearfix">
                            <?php
                                if($current=='setting'){
                            ?>
                                    <b>个人基本资料</b>
                            <?php
                                }
                                else{
                            ?>
                                    <a href="/account/setting">个人基本资料</a>
                            <?php
                                }
                                if($current=='modifypassword'){
                            ?>
                                    <b>修改密码</b>
                            <?php
                                }
                                else{
                            ?>
                                    <a href="/account/modifypassword">修改密码</a>
                            <?php
                                }
                                if($current=='mailsetup'){
                            ?>
                                    <b>邮件策略</b>
                            <?php
                                }
                                else{
                            ?>
                                    <a href="/account/mailsetup">邮件策略</a>
                            <?php
                                }
                                if($current=='binding'){
                            ?>
                                    <b>外部账号绑定</b>
                            <?php
                                }
                                else{
                            ?>
                                    <a href="/account/binding">外部账号绑定</a>
                            <?php
                                }
                            ?>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
