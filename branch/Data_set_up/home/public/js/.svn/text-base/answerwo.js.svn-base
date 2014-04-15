/**
 * Set cookie
 * @param name
 * @param value
 * @param expire
 */
function SetCookie(name,value,expire)//两个参数，一个是cookie的名子，一个是值
{
	var exp  = new Date();    //new Date("December 31, 9998");
    exp.setTime(exp.getTime() + expire);
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString() + ";path=/;domain=www.answerwo.com";
}

/**
 * get cookie by name
 * @param name
 * @returns
 */
function getCookie(name)//取cookies函数        
{
    var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
    if(arr != null) {
    	return unescape(arr[2]); 
    }
    return null;
}

/**
 * delete cookie by name
 * @param name
 */
function delCookie(name)//删除cookie
{
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if(cval!=null) {
    	SetCookie(name,"",exp);
    }
}

/**
 * user exit
 * @param name
 */
function exit(name) {
		delCookie(name);
		window.location.reload(); 
}

/**
 * Submit valiation
 */
function Submit() 
{
	var nickname = document.getElementsByName("nickname")[0];
	var password = document.getElementsByName("password")[0];
	var repassword = document.getElementsByName("repassword")[0];
	var email = document.getElementsByName("email")[0];
	var form = document.getElementsByName("form")[0];
	if(nickname.value.length < 6 || nickname.value.length > 16) {
		alert("对不起，您的昵称长度不正确！");
		return;
	}
	else if(password.value.length < 6 || password.value.length > 16) {
		alert("对不起，您的密码长度不正确！");
		return;
	}
	else if(password.value != repassword.value) {
		alert("对不起，您的密码与确认密码不相符！");
		return;
	}
	else if(email.value.indexOf("@") < 1) {
		alert("对不起，您的邮箱格式不正确！");
		return;
	}
	else {
		form.submit();
	}
}

/**
 * Add favorite for search page
 * @param qid
 */
function SearchAddFavorite(qid) {
	if(getCookie("answerwo_name") == null || getCookie("answerwo_name") == "") {
		alert("请您先登录");
		return 0;
	}
	else {
		var questionid = document.getElementsByName("questionid")[0];
		questionid.value = qid;
		var form = document.getElementsByName("form")[0];
		form.submit();
	}
}


/**
 * Add favorite for list page
 * @param qid
 */
function ListAddFavorite(qid) {
	if(getCookie("answerwo_name") == null || getCookie("answerwo_name") == "") {
		alert("请您先登录");
	}
	else {
		var questionid = document.getElementsByName("questionid")[0];
		questionid.value = qid;
		var form = document.getElementsByName("form")[0];
		form.submit();
	}
}

/**
 * Add favorite for detail page
 */
function DetailAddFavorite() {
	if(getCookie("answerwo_name") == null || getCookie("answerwo_name") == "") {
		alert("请您先登录");
	}
	else {
		var favorite = document.getElementsByName("favorite")[0];
		favorite.value = 1;
		var form = document.getElementsByName("form")[0];
		form.submit();
	}
}

/**
 * Add reply information in discuss
 * @param number
 * @param user
 */
function AddReply(number,user) {
	if(getCookie("answerwo_name") == null || getCookie("answerwo_name") == "") {
		alert("请您先登录");
	}
	else {
		var discusscontent = document.getElementsByName("discusscontent")[0];
		discusscontent.value = "回复"+number+"楼"+user+"：";
	}
}

/**
 * Remove favorite record
 * @param number
 * @returns
 */
function RemoveFavorite(number) {
	if(getCookie("answerwo_name") == null || getCookie("answerwo_name") == "") {
		alert("请您先登录");
	}
	else {
		var removeid = document.getElementsByName("removeid")[0];
		removeid.value = number;
		var form = document.getElementsByName("form")[0];
		form.submit();
	}
	
}

