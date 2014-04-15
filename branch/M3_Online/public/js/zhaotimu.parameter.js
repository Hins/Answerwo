
//定义需要用的到全局变量==============================================================================================
var g_param={};


//定义所有的AJAX调用接口=============================================================================================
var ajax = {
	
	//hide			： 用于隐藏主操作元素，然后dom增加一个灰度的一样的按钮
	hide			: function(o){o.after("<button class='fo-btn-gary'>"+o.html()+"中...</button>");o.hide();},
	//show			: 与hide相反，用于在ajax调用的时候恢复原状态
	show 			: function(o){o.siblings("button.fo-btn-gary").remove();o.show();},
		
	//login			: name用户名, password密码, remember自动登录(bool)
	login			: function (p,c){$.post("/account/ajaxlogin"				,p,c,"json")},
	//register		: para参数（可以输入用户名或者邮箱地址，返回正确与否）
	registerCheck	: function (p,c){$.post("/account/ajaxregistercheck"		,p,c,"json")},
	//favoriteToggle: qid题目id, op状态（1为添加收藏，2为取消收藏）
	favoriteToggle	: function (p,c){$.post("/subject/questioncollect"			,p,c,"json")},
	//favoriteTag	: ln标签文本, qid题目id
	favoriteTag		: function (p,c){$.post("/subject/addquestionlabel"			,p,c,"json")},
	//report		: qid题目id， type错误类型, msg错误内容
	report			: function (p,c){$.post("/subject/errorreport"				,p,c,"json")},
	//commentAdd	: qid题目ID, content讨论内容, reid引用回复的讨论id
	commentAdd		: function (p,c){$.post("/subject/addquestionremark"		,p,c,"json")},
	//commentGet	: qid题目id， p页数
	commentGet		: function (p,c){$.post("/subject/getquestionremark"		,p,c,"json")},
	//knotAdd		: qid题目id, k标签名
	knotAdd			: function (p,c){$.post("/subject/addquestionknowledge"		,p,c,"json")},
	//knotRemove	: qid题目id, k标签名
	knotRemove		: function (p,c){$.post("/subject/delquestionknowledge"		,p,c,"json")},
	//knotAll		: qid题目id
	knotAll			: function (p,c){$.post("/subject/allknowledge"				,p,c,"json")},
	//explainAdd	: qid题目id, explain解析内容
	explainAdd		: function (p,c){$.post("/subject/savequestionexplain"		,p,c,"json")},
	//rate			: qid题目id, score评分
	rate			: function (p,c){$.post("/subject/savequestiondifficulty"	,p,c,"json")},
	//questionPrevie: qid题目id
	questionPreview	: function (p,c){$.post("/subject/questionpreview"			,p,c,"json")},
	//questionList	: k搜索字符串, s科目(可选), lmin难度下限, lmax难度上限, ymin年份下限, ymax年份上限, t题目类型, so题目来源, g年级, p页数
	questionList	: function (p,c){$.post("/subject/getquestionlist"			,p,c,"json")},
	//noteAdd		: qid题目id, content内容
	noteAdd			: function (p,c){$.post("/profile/commitcomment"			,p,c,"json")},
	//sheetCreate	: title清单标题, text清单简介, share清单分享（0完全公开，1使用密码，2不公开）, password清单访问密码, qid题目id（多个id用,隔开）
	sheetCreate		: function (p,c){$.post("/profile/createsheet"				,p,c,"json")},
	//sheetAdd		: sheetid清单id, qid题目id（多个id用,隔开）
	sheetAdd		: function (p,c){$.post("/profile/addtosheet"				,p,c,"json")},
	//sheetRemove	: sheetid清单id, qid题目id（多个id用,隔开）
	sheetRemove		: function (p,c){$.post("/profile/delfromsheet"				,p,c,"json")}
};

//定义所有的出错信息=================================================================================================
var error = {
	"-9999" : "非常抱歉，出现了系统异常错误，请联系管理员",
	"-1001" : "抱歉，该用户名已经被注册，请换一个试试",
	"-1002" : "非常抱歉，连接服务器出错，请重试",
	"-1003" : "你所请求的功能需要登录才能使用，请先登录",
	"-1004" : "系统程序请求出现参数错误，请刷新页面后重试",
	"-1005" : "你所提交的内容中含有敏感词语",
	"-1006" : "你提交的用户名不符合要求",
	"-1007" : "你所输入的重复密码与上面不一致",
	"-1008" : "你设定的密码不符合要求",
	"-1009" : "你输入的邮箱名不是正确的邮箱地址",
	"-1010" : "你输入的邮箱已经被别人使用，请换一个试试",
	"-1011" : "用户名不得为空",
	"-1012" : "邮箱地址或用户名不得为空",
	"-1013" : "密码不得为空",
	"-1014" : "你所使用的激活码已经过期",
	"-1015" : "用户不存在",
	"-1016" : "密码错误"
};

//定义所有的pnotify通知信息
var notice = {
	failed			: function(){$.pnotify({pnotify_title:"你刚刚的操作失败",	pnotify_text:"可能由于网络原因。建议你浏览器刷新页面后重试一次。如果仍然有问题，请报告管理员！"});},
	favoriteCancel	: function(){$.pnotify({pnotify_title:"取消收藏成功",		pnotify_text:"题目已经成功取消收藏！"});},
	favoriteTag		: function(){$.pnotify({pnotify_title:"收藏标签添加成功",	pnotify_text:"你可以进入个人中心，在收藏夹里面来管理你收藏的题目和使用的标签。"});},
	report			: function(){$.pnotify({pnotify_title:"内容纠错提交成功",	pnotify_text:"非常感谢你提出的错误，我们会有专人尽快处理你的报告。处理的进展你将可以在个人中心中看到。处理完成后我们也会给您发送邮件。"});},
	explainAdd		: function(){$.pnotify({pnotify_title:"题目解析提交成功",	pnotify_text:"非常感谢你的付出！"});},
	commentAdd		: function(){$.pnotify({pnotify_title:"题目讨论提交成功",	pnotify_text:"非常感谢你的付出！"});}
};


//所有AJAX的全局设定=================================================================================================
$.ajaxSetup({
	async: true, //全部都异步处理
	cache: false, //全部清除缓存
	timeout: 10000, //超过10秒没有响应则视为超时
	error: function (XMLHttpRequest, textStatus, errorThrown) { //请求出错的强制性alert提示
		var s1 = "";
		var s2 = "你对于" + this.url + "的请求失败。";
		if (textStatus == "timeout") s1 = "因为超时，";
		if (textStatus == "error") s1 = "因为其它错误，";
		if (textStatus == "notmodified") s1 = "因为请求页面无变化，";
		if (textStatus == "parsererror") s1 = "因为请求地址不存在，";
		alert(s1 + s2);
	}
});


//定义JSON解析成HTML的模板 ===============================================
//其中字符串的为html的解析方式
//带有Fun结尾的函数为根据json数据来变更源数据的函数方法
var templ = {
	
	comment : 		'{{#result}}'+
					'<li floor="{{floor}}" id={{id}}>'+
					'	<span>{{floor}}楼：{{uname}} 在 {{createTime}} {{text}}道：</span>'+
					'	<p{{delete}}>{{content}}<a href="javascript:void(0)">回复TA</a></p>'+
					'</li>'+
					'{{/result}}',
					
	commentFun : 	function(json){
						json["delete"] = function(){return (this.status=="0")?"":" class=delete";};
						json["text"] = function(){return (this.re_floor)?"回复"+this.re_floor+"楼":"说";};
						return json;
					},
					
	question :		'{{#result}}'+
					'<div class="list-action">'+
					'	<div class="list-action-cover ym-clearfix">'+
					'		<a href="javascript:void(0)" class="{{favoriteclass}} {{loginclass}}" popup="{{loginpopup}}" hasfavorite="{{favorite}}" id="ListPreviewFavorite" qid="{{encrypt_id}}"><span>{{favoritetext}}</span></a>'+
					'		<a href="/subject/question/{{encrypt_id}}" class="tl-detail" target="_blank"><span>查看详情</span></a>'+
					'		<a class="nobg tl-similar" href="/subject/similar/{{encrypt_id}}" target="_blank"><span>相似题目</span></a>'+
					'	</div>'+
					'</div>'+
					'<div class="list-tag ym-clearfix">'+
					'	<div class="tag"><p>'+
					'		<span class="gary">题目标签：</span>'+
					'		{{#label}}'+
					'		{{.}}，'+
					'		{{/label}}'+
					'		<br />'+
					'		{{#knowledge_has}}'+
					'			<span class="gary">涉及知识：</span>'+
					'			{{#knowledge_arr}}'+
					'			{{.}}，'+
					'			{{/knowledge_arr}}'+
					'		{{/knowledge_has}}'+
					'	</p></div>'+
					'	<div class="rate"><span><b>{{question_level}}</b>/5</span></div>'+
					'</div>'+
					'<div class="list-question">'+
					'	<p>{{question_content}}</p>'+
					'	{{#explain_has}}'+
					'	<strong>题目解析</strong>'+
					'	<p>{{explain_content}}</p>'+
					'	{{/explain_has}}'+
					'	{{#remark_has}}'+
					'		<strong>题目讨论</strong>'+
					'		{{#remark_arr}}'+
					'		<p>{{.}}</p>'+
					'		{{/remark_arr}}'+
					'	{{/remark_has}}'+
					'</div>'+                                
					'<div class="list-detail"><div class="list-detail-cover"><a href="/subject/question/{{encrypt_id}}" target="_blank"><span>查看题目详情</span></a></div></div>'+
					'{{/result}}',
					
	questionFun :	function(json){
						json["favoriteclass"] = function(){return (this.favorite)?"tl-favorite":"tl-unfavorite";};
						json["favoritetext"] = function(){return (this.favorite)?"取消收藏":"添加收藏";};
						json["loginclass"] = function(){return (this.login)?"":"Pop";};
						json["loginpopup"] = function(){return (this.login)?"":"#PopupLogin";};
						return json;
					},
					
	list :			'{{#list}}'+
					'<div class="list-item ym-clearfix ListItem" qid="{{encrypt_id}}">'+
					'	{{#hot}}'+
					'	<div class="float"><i></i></div>'+
					'	<div class="float-clear"></div>'+
					'	{{/hot}}'+
					'	<div class="content">'+
					'		<p><a href="/subject/question/{{encrypt_id}}.html" target="_blank">{{content}}</a></p>'+
					'		<span>{{tag}}，{{explain}}解答，{{comment}}评论，{{favorite_num}}人收藏</span>'+
					'		<button class="{{loginclass}} ListItemFavorite" popup="{{loginpopup}}" hasfavorite="{{favorite}}">{{favoritetext}}</button>'+
					'	</div>'+
					'	<div class="more ListItemMore"></div>'+
					'</div>'+
					'{{/list}}',
					
	listFun :		function(json){
						json["favoritetext"] = function(){return (this.favorite)?"★ 取消收藏":"☆ 添加收藏";};
						json["loginclass"] = function(){return (this.login)?"":"Pop";};
						json["loginpopup"] = function(){return (this.login)?"":"#PopupLogin";};
						return json;
					},
	favoremove :	'<div class="favo-remove">题目"<a href="{{url}}">{{text}}</a>"已经取消收藏。你可以点击<a href="javascript:void(0)" qid="{{qid}}" class="FavoriteBack">这里恢复</a>。</div>',
	favonote :		'<div class="customScrollBox">'+
                    '	<div class="container">'+
					'			<div class="content" note-id="content">{{text}}</div>'+
					'		</div>'+
					'		<div class="dragger_container">'+
					'			<div class="dragger"></div>'+
					'		</div>'+
					'	</div>'
};






