/**
 * Baidu statistics code
 */
//var _bdhmProtocol = (("https:" == document.location.protocol) ? " https://" : " http://");
//document.write(unescape("<script src='" + _bdhmProtocol + "hm.baidu.com/h.js%3F92151da7e610ead3bd6f8103b48fd469' type='text/javascript'></script>"));

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
	window.location.href = window.location.href;  //mustn't use window.location.reload;
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
		showlogin();
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
		showlogin();
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
 * Add favorite for detail page
 */
function DetailAddFavorite() {
	if(getCookie("answerwo_name") == null || getCookie("answerwo_name") == "") {
		showlogin();
		return 0;
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
	var discusscontent = document.getElementsByName("discusscontent")[0];
	discusscontent.value = "回复"+number+"楼"+user+"：";
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

function SetSource(source) {
	var src = document.getElementsByName("source")[0];
	src.value = source;
	var form = document.getElementsByName("form")[0];
	form.submit();
}

function SetType(type) {
	var t = document.getElementsByName("type")[0];
	t.value = type;
	var form = document.getElementsByName("form")[0];
	form.submit();
}

function SetDifficulty(difficulty) {
	var diff = document.getElementsByName("difficulty")[0];
	diff.value = difficulty;
	var form = document.getElementsByName("form")[0];
	form.submit();
}

function SetLevel(level) {
	var lev = document.getElementsByName("level")[0];
	lev.value = level;
	var form = document.getElementsByName("form")[0];
	form.submit();
}

function SetAutoLogin() {
	var autologin = document.getElementsByName("autologin")[0];
	if(autologin.value == 0) {
		autologin.value = 1;
	}
	else {
		autologin.value = 0;
	}
}

function getAjaxObject() {
	var xmlhttp;
	if (window.XMLHttpRequest)
	{// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	}
	else
	{// code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	return xmlhttp;
}

function DisplayMore()
{
	var xmlhttp = getAjaxObject();
	xmlhttp.onreadystatechange=function()
	{
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
	    {
			var hiddenanswer = document.getElementsByName("hiddenanswer")[0];
			hiddenanswer.style.visibility = "visible";
			var hiddenexplain = document.getElementsByName("hiddenexplain")[0];
			if(hiddenexplain != undefined) {
				hiddenexplain.style.visibility = "visible";
			}
			var form = document.getElementsByName("form")[0];
			form.style.visibility = "visible"; 
			var statistics = document.getElementById("statistics");
			statistics.style.visibility = "visible";
			var QuestionShow = document.getElementsByName("QuestionShow")[0];
			QuestionShow.style.visibility = "hidden";
	    }
	}

	var answeroption = document.getElementsByName("answeroption");
	var answeroptionvalue = 0;
	if(answeroption[0].checked) {
		answeroptionvalue = 1;
	}
	if(answeroption[1].checked) {
		answeroptionvalue = 2;
	}
	if(answeroption[2].checked) {
		answeroptionvalue = 3;
	}
	if(answeroption[3].checked) {
		answeroptionvalue = 4;
	}
	var encryptid = document.getElementsByName("encryptid")[0];
	if(answeroptionvalue != 0) {
		xmlhttp.open("POST","/q/detail",true);
		xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		xmlhttp.send("encryptid="+encryptid.value+"&answeroption="+answeroptionvalue);
	}
	else {
		xmlhttp.open("GET","/q/detail?encryptid="+encryptid.value,true);
		xmlhttp.send();
	}	
}

function Display() 
{
	var hiddenanswer = document.getElementsByName("hiddenanswer")[0];
	hiddenanswer.style.visibility = "visible";
	var hiddenexplain = document.getElementsByName("hiddenexplain")[0];
	if(hiddenexplain != undefined) {
		hiddenexplain.style.visibility = "visible";
	}
	var form = document.getElementsByName("form")[0];
	form.style.visibility = "visible"; 
	var statistics = document.getElementsByName("statistics")[0];
	statistics.style.visibility = "visible";
	var QuestionShow = document.getElementsByName("QuestionShow")[0];
	QuestionShow.style.visibility = "hidden";
}

function showlogin()
{
	var PopupLogin = document.getElementById("PopupLogin");
	PopupLogin.style.display = "block";
	var exposeMask = document.getElementById("exposeMask");
	exposeMask.style.display = "block";
}

function login() 
{
	var PopupLogin = document.getElementById("PopupLogin");
	PopupLogin.style.display = "none";
	var exposeMask = document.getElementById("exposeMask");
	exposeMask.style.display = "none";
	this.sumbit();
}

function cancel()
{
	var PopupLogin = document.getElementById("PopupLogin");
	PopupLogin.style.display = "none";
	var exposeMask = document.getElementById("exposeMask");
	exposeMask.style.display = "none";
}

function showregister()
{
	var PopupRegister = document.getElementById("PopupRegister");
	PopupRegister.style.display = "block";
	var exposeMask = document.getElementById("exposeMask");
	exposeMask.style.display = "block";
}

function cancelRegister()
{
	var PopupRegister = document.getElementById("PopupRegister");
	PopupRegister.style.display = "none";
	var exposeMask = document.getElementById("exposeMask");
	exposeMask.style.display = "none";
}

function profilevalidate()
{
	if(getCookie("answerwo_name") == null || getCookie("answerwo_name") == "") {
		window.location.href = "http://www.answerwo.com/q/list";
		return 0;
	}
}

function backvalidate()
{
	if(getCookie("answerwo_name") == null || getCookie("answerwo_name") == "") {
		window.location.href = "http://www.answerwo.com";
	}
}
