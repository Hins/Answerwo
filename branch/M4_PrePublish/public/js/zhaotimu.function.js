//定义常用的函数===============================================================
var assert = {
	equalJSON : function(j1,j2){
		var equal=true;
		$.each(j1,function(key,value){
			if(value!=j2[key]) equal=false;
		});
		return equal;
	}
};


// QuestionList页面所有的JS绑定性代码=====================================================================
var list = {
	init		: function(){
					//首先让容器的大小高度与实际的限制大小高度一致
					$("#ListFollowContainer").height($("#ListFollowContainer").prev().height());			
					
					//全局变量写入
					g_param.list_preview_loading=false;
					
					//首次载入右侧的预览
					g_param.list_preview_id = $(".ListItem:first").attr("qid");
					ajax.questionPreview({qid:$(".ListItem:first").attr("qid")},function(data){
						if(data.status==1){								
							data = templ.questionFun(data);
							$("#ListFollowContent").html(Mustache.render(templ.question,data));
							$(".ListItemMore:first").addClass("more-current");
						}
					});
				},
	auto		: function(){
					//获取autoComplete的数据
					knots = [{id:2,label:"一元二次方程"},{id:3,label:"一元三次方程"},{id:4,label:"一元四次方程"},{id:5,label:"一元五次方程"}];
							
					$("#FliterKeyword").autocomplete({
						source:knots,minLength:1,zIndex:4,
						open:function(event,ui){$('.ui-autocomplete').width(212);},
						select:function(event,ui){event.preventDefault();list.update();}
					});
				},
	itemOver	: function(){
					if(!$(this).children(".ListItemMore").hasClass("more-current"))	$(this).children(".ListItemMore").addClass("more-itemhover");
				},
	itemOut		: function(){
					$(this).children(".ListItemMore").removeClass("more-itemhover");
				},
	moreOver	: function(){
					if(!$(this).hasClass("more-current")) $(this).addClass("more-hover");
				},
	moreOut		:function(){
					if(!g_param.list_preview_loading) $(this).removeClass("more-hover");
				},
	preview		: function(){
					
					var o = $(this);
					g_param.list_preview_loading = true;
					g_param.list_preview_id=o.parents(".ListItem").attr("qid");
					
					//显示loading	
					$("#ListFollowContent").fadeOut("fast",function(){$("#ListFollowLoading").fadeIn("fast",function(){
						
						//ajax获取结果
						ajax.questionPreview({qid:g_param.list_preview_id},function(data){
							
							if(data.status==1){								
								data = templ.questionFun(data);
								$("#ListFollowContent").html(Mustache.render(templ.question,data));
								//隐藏原有的当前current的箭头
								$(".more-current").removeClass("more-current");
								o.addClass("more-current");
							}else{								
								notice.failed();
							}
							
							//显示内容
							$("#ListFollowLoading").fadeOut("fast",function(){$("#ListFollowContent").fadeIn("fast");});
							g_param.list_preview_loading = false;
							o.removeClass("more-hover");
						});
					});});	
				},
	condition	: function(){		
					var tstr = "";
					$("#FliterType input[checked]").each(function(i){
						tstr+=$(this).val()+",";
					});
					
					//将获得条件保存到全局变量中
					g_param.list_conditions = {
						k:$.trim($("#FliterKeyword").val()),
						lmin:$("#FliterHardA").val(),
						lmax:$("#FliterHardB").val(),
						ymin:$("#FliterYearA").val(),
						ymax:$("#FliterYearB").val(),
						t:tstr,
						g:$("#FliterGrade").val(),
						so:$("#FliterSource").val(),
						p:$("#ListPager").attr("page-current")
					};
					
					//将全局变量转化为字符串写入cookie
					var str = JSON.stringify(g_param.list_conditions);
					//$.cookie("ZTM_list_conditions",str);
					
					//显示测试字符串
					$("#TEST").html(str);
					
				},
	update		: function(){		
					
					//更新全局变量			
					list.condition();					
					
					//首先插入loading字符串
					if($("#ListItems").find(".list-loading").length<=0)	$("#ListItems").prepend('<div class="list-loading"><span>正在为你寻找合适的题目...请稍候...</span></div>');
					
					//执行ajax
					ajax.questionList(g_param.list_conditions,function(data){
						
						if(data.status==1){
							//如果成功的话，需要判断是否跟用户当前需要的一致
							var _data = data.result.verify;
							var _d = g_param.list_conditions;
							var _p = data.result.other.total_page;
								
							//如果两个JSON相等的话
							if(assert.equalJSON(_data,_d)){
								data = templ.listFun(data.result);
								$("#ListItems").fadeOut("fast",function(){
									$("#ListItems").html(Mustache.render(templ.list,data));
									$("#ListItems").fadeIn("fast");
								});
								//需要重置listFollowContainer的高度
								$("#ListFollowContainer").height($(".ym-gl .ym-gbox").height());
								//重置翻页的数据
								$("#LinkPager").attr("page-total",_p);
								$("#LinkPager").pager("update");
							}
							
						}else{
							notice.failed();
							$("#ListItems").find(".list-loading").remove();
						}
					});
				},
	page		: function(obj){					
					var p = parseInt($.trim(obj.html()));					
					//隐藏可点击的翻页按钮
					var loading = $('<span>'+String(p)+'</span>');
					obj.after(loading);
					obj.hide();		
					//显示loading信息
					if($("#ListItems").find(".list-loading").length<=0) $("#ListItems").append('<div class="list-loading"><span>正在为你寻找合适的题目...请稍候...</span></div>');
					//更新页面全局的条件
					list.condition();					
					//调用ajax		
					ajax.questionList(g_param.list_conditions,function(data){
						if(data.status==1){							
							data = templ.listFun(data.result);
							$("#ListItems").fadeOut("fast",function(){
								$("#ListItems").html(Mustache.render(templ.list,data));
								$("#ListItems").fadeIn("fast");
							});
							//需要重置listFollowContainer的高度
							$("#ListFollowContainer").height($(".ym-gl .ym-gbox").height());
							//设置翻页页码信息
							$("#ListPager").trigger("paginate.update",{total:$("#ListPager").attr("page-total"),current:p});							
						}else{
							notice.failed();
							$("#ListItems").find(".list-loading").remove();
						}
						//删除loading状态
						loading.remove();	
						obj.show();
					});								
				},
	favorite	: function(){				
					
					var o=$(this);
					
					if(o.attr("popup")=="#PopupLogin"){
						Popup["Login"].dialog("open");
					}else{					
						var sta = (o.attr("hasfavorite")=="1")?2:1;
						var id = (o.attr("id")=="ListPreviewFavorite")?o.attr("qid"):o.parents(".ListItem").attr("qid");
						ajax.favoriteToggle(
							{qid:id,op:sta},
							function(data){
								if(data.status==1){
									//如果是没有收藏，则成功后是收藏成功显示标签的浮动层
									if(sta==1){
										//变更收藏状态
										o.attr("hasfavorite","1");										
										if(o.attr("id")=="ListPreviewFavorite"){
											o.addClass("tl-favorite").removeClass("tl-unfavorite");
											o.children("span").html("取消收藏");
										}else{
											o.html("★ 取消收藏");
										}	
									}
									//如果是已经收藏，则成功后是收藏失败，显示提示信息
									if(sta==2){
										//变更收藏状态
										o.attr("hasfavorite","0");
										if(o.attr("id")=="ListPreviewFavorite"){
											o.addClass("tl-unfavorite").removeClass("tl-favorite");
											o.children("span").html("添加收藏");
										}else{
											o.html("☆ 添加收藏");
										}
									}
								}else{
									notice.failed();
								}
							}
						);
					}
				}

};



// detail页面的全部代码的绑定
var detail = {
	init		: function(){
					
					//初始载入评论数据
					if(g_param.comment>0){
						ajax.commentGet({qid:g_param.qid,p:1},function(data){
							if(data.status==1){
								//为模板增加两个判断函数
								data = templ.commentFun(data);
								$("#Comment").html(Mustache.render(templ.comment,data));
							}else{
								notice.failed();
							}
						});
					}
					
					//收藏状态和按钮操作的初始化
					//初始化提示语句
					initTipTip($("#FavoriteDetail"));
					//初始化收藏的样式
					if($("#FavoriteDetail").attr("hasfavorite")=="true") $("#FavoriteDetail").addClass("favorite-yes");
					if($("#FavoriteDetail").attr("hasfavorite")=="false") $("#FavoriteDetail").addClass("favorite-no");		
					//如果在登录状态的话
					if($("#FavoriteDetail").attr("popup")=="favoritedetail"){
						//首先解除favorite的复层绑定
						$("#FavoriteDetail").unbind("click");
						//再根据点击事件进行绑定
						$("#FavoriteDetail").bind("click",detail.favorite);
					}
				},
	//编辑器提交解析
	editor		: function(text,warn,save){
					//隐藏提交按钮
					ajax.hide(save);			
					ajax.explainAdd({qid:g_param.qid,explain:text},function(data){			
						ajax.show(save);
						if(data.status==1){
							//成功的反应
							$("#Explain").trigger("explain.close"); //关闭编辑器
							notice.explainAdd(); //显示提示
							warn.html(""); //清除错误信息
							$("#Explain").children(".explain-content").html(text);
						}else{
							//显示错误信息
							warn.html("出现了一个错误");
						}
					});
				},
	//翻页的点击
	pager		: function(p,obj,successfun){
					ajax.commentGet({qid:g_param.qid,p:parseInt(p)},function(data){
						if(data.status==1){
							//为模板增加两个判断函数
							data = templ.commentFun(data);
							$("#Comment").html(Mustache.render(templ.comment,data));
							successfun();
						}else{					
							notice.failed();					
						}
					});
				},
	//引用回复按钮的点击
	commentRe	: function(){
					$("#CommentAdd textarea").val("回复"+$(this).parents("li").attr("floor")+"楼："+$("#CommentAdd textarea").val());
					$("#CommentAdd button").attr("reid",$(this).parents("li").attr("id"));
					$("#CommentAdd button").attr("refloor",$(this).parents("li").attr("floor"));
				},
	comment		: function(){		
					var o = $(this);
					//判断内容是否为空
					var text = $.trim($("#CommentAdd textarea").val());
					
					var reg = /回复([0-9]+)楼：/i;
					
					//判断内容是否含有回复几楼，如果没有，就是用户手工清除了
					if($.type(reg.exec(text))=="null"){
						o.attr("reid","0");
						o.attr("refloor","0");
					}else{
						text = text.replace(reg,"");
					}		
					
					if(text!=""){
						//隐藏提交按钮
						ajax.hide(o);
										
						ajax.commentAdd({qid:g_param.qid,content:text,reid:o.attr("reid")},function(data){
							ajax.show(o);
							if(data.status==1){					
								
								$("#CommentAdd textarea").val("") //清空原有的输入
								notice.commentAdd(); //显示提示
								
								o.siblings(".warn").html("");//清空警告
								
								var t = new Date().toLocaleString();//获得时间
								
								//设定回复楼数的文本
								var retext = (o.attr("refloor")=="0")?"说":"回复"+o.attr("refloor")+"楼";
								
								//清空re的回复楼数
								o.attr("refloor","0"); 
								o.attr("reid","0"); 
								
								//更新评论数
								g_param.comment = g_param.comment+1;
								//插入刚刚发表的评论
								$("#Comment").append(Mustache.render(templ.comment,{
									result:[
										{
											"uname":$.cookie("ZTM_name"),
											"floor":g_param.comment,
											"id":data.result, //获得返回的id
											"createTime":t,
											"text": retext,
											"delete":"",
											"content":text									
										}
									]
								}));
							}else{
								//显示错误信息
								o.siblings(".warn").html("出现了一个错误");
							}		
						});
					}else{
						o.siblings(".warn").html("讨论输入不得为空！");
					}
				},
	rate		: function(){
					if($("#Rater").attr("hasrate")=="true"){
						$("#Rater").rater({
							value:parseFloat($("#Rater").attr("val")),
							enabled:false
						});
					}else{
						$("#Rater").rater({
							value:parseFloat($("#Rater").attr("val")),
							after_click	: function(ret) {
								ajax.rate({qid:g_param.qid,score:ret.value});					
								this.value	= ret.value;
								this.enabled= false;
								$("#Rater").rater(this);
								$("#Rater").next().children("b").html(ret.value);
								$("#RaterTitle").html("评分成功！");
							},
							title_container:"#RaterTitle"
						});
					}
				},
	favorite	: function(){
					var o=$(this);
					var sta = (o.attr("hasfavorite")=="true")?2:1;
					ajax.favoriteToggle(
						{qid:g_param.qid,op:sta},
						function(data){
							if(data.status==1){								
								//如果是没有收藏，则成功后是收藏成功显示标签的浮动层
								if(sta==1){
									//变更收藏状态
									o.attr("hasfavorite","true");
									//变更图标样式
									o.addClass("favorite-yes").removeClass("favorite-no");
									//打开添加标签浮层
									Popup[o.attr("popup").replace("#Popup","")].dialog("open");
									//变更tiptip的提示
									initTipTip(o,"点击取消收藏");
								}
								//如果是已经收藏，则成功后是收藏失败，显示提示信息
								if(sta==2){
									//变更收藏状态
									o.attr("hasfavorite","false");
									//变更图标样式
									o.addClass("favorite-no").removeClass("favorite-yes");
									//提示操作成功
									notice.favoriteCancel();
									//变更tiptip的提示
									initTipTip(o,"点击添加收藏");
								}
							}else{
								notice.failed();
							}
						}
					);
				}
};





