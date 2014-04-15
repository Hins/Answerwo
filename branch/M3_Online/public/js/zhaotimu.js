/*
	主操作文件，所有页面的加载从这里开始
	页面总共有两种JS加载和调用
	1. init 页面加载完成后需要执行的代码
	2. trigger 页面上某个元素的行为需要绑定的事件，按照jQuery框架，总共有三种绑定方式： bind, one, live
*/

jQuery(document).ready(function ($) {

	//【全页面】通过JS代码修正顶部导航在IE6下的效果
	if($.browser.msie && $.browser.version=="6.0"){
		//IE6下还需要修正二级菜单位置：默认状态下IE6的二级菜单是从上一个元素的结束才开始，所以要margin-left负掉上一个元素的宽度
		$("nav#dark ul li ul").css("margin-left","-"+String($("nav#dark ul a.dropdown").parent().width()+5)+"px");
		//IE6下面需要将main设置为static才不会遮挡住下滑菜单
		$("#main").css("position","static");
	
		//为IE6增加元素的hover效果
		$(".IE6Hover").hover(
			function() {$(this).addClass("iehover"); },
			function() {$(this).removeClass("iehover"); }
		);
	}
	
	//初始化全部的登录浮动层
	if($(".Popup").length>0) popfun.initPopup();
	
	//【register页面】注册页面注册表单的所有效果
	$("#Register").formCheck();
	
	//【全页面】表单中的radio和checkbox的样式替换
	$(".fo-form ul.radio li, .fo-form ul.check li").formStyle();
	
	//【全页面】登录浮动层中提交按钮的操作		
	$("#LoginSubmit").bind("click",popfun.login);
	$("#LoginPopupPassword").enter(popfun.login);
	
	//detail页面的代码开始
	if($("#DETAIL").length>0){	
		//开始初始化
		detail.init();
		//调用编辑器的代码开始
		$("#Explain").explain($("#ExplainStart"),detail.editor);	
		//Comment翻页代码开始
		$("#CommentPager").paginate(detail.pager);
		//提交内容纠错的事件绑定
		$('.Popup[popup-id="report"]').next().find(".ui-button-confirm").bind("click",popfun.report);
		//绑定引用回复的操作
		$("#Comment a").live("click",detail.commentRe);
		//提交评论的操作
		$("#CommentAdd button").bind("click",detail.comment);
		//终端页评分
		detail.rate();	
		//终端页收藏成功的浮层里面的添加标签
		$("#FavoriteTagDetail input").tagger({oTip:$("#FavoriteTagDetail ul")});
		//右栏的添加和删除知识点
		$("#KnotDetailAdd input").tagger({
			oDone		: $("#KnotDetailAdd").prev(),
			oBtn		: $("#KnotDetailAdd a"),
			funDelete	: function(tag,id){
							//console.log("tagger-text:"+tag+"|tagger-id:"+String(id));
							ajax.knotRemove({qid:g_param.qid,k:tag});
						},
			funAdd		: function(tag,id){
							ajax.knotAdd({qid:g_param.qid,k:tag});
							//console.log("tagger-text:"+tag+"|tagger-id:"+String(id));
						}
		});
	}
	
	//list页面的代码开始，包括题目列表页、搜索结果页、相似题目页三种页面
	if($("#LIST").length>0){
		//开始进行初始化
		list.init();
		//进行右侧滚动的插件绑定
		$("#ListFollow").scrollFollow($("#ListFollowContainer"),[0,0,30,10]);	
		//监听左栏鼠标移上移出导致的箭头出现事件
		$(".ListItem").live("mouseenter",list.itemOver);
		$(".ListItem").live("mouseleave",list.itemOut);
		$(".ListItem").delegate(".ListItemMore","mouseenter",list.moreOver);
		$(".ListItem").delegate(".ListItemMore","mouseleave",list.moreOut);		
		//加载预览
		$(".ListItemMore").live("click",list.preview);
		//翻页代码的事件监控绑定
		$("#ListPager").paginate(list.page);
		//收藏按钮的绑定和监听
		$("#ListPreviewFavorite").live("click",list.favorite);
		$(".ListItemFavorite").live("click",list.favorite);
		
		//进行顶部筛选条件的绑定
		if($("#FLITER").length>0){
			$("#FliterHardA, #FliterHardB").selectToUISlider({labels:0,sliderOptions:{change:list.update}});
			$("#FliterYearA, #FliterYearB").selectToUISlider({labels:0,sliderOptions:{change:list.update}});
			$("#FliterGrade").formStyleSelect({change:list.update});
			$("#FliterSource").formStyleSelect({change:list.update});
			//获取autocomplete所需要的数据，并启用autocomplete
			list.auto();
			//监听fliter里面输入搜索关键词的事件
			$("#FliterKeyword").next("button").bind("click",list.update);
			$("#FliterKeyword").enter(function(){list.update();});
			//监听flifter里面选择复选框的事件
			$("#FliterType").delegate("li","click",list.update);
		}		

	}

	//在每次打开添加标签的时候同步qid到浮动层
	$("*[popup='favoritetag']").click(function(){
		$("#TagAddFavorite input").attr("tagger-id",$(this).prev().attr("tagger-id"));
		//console.log($(this).prev().attr("tagger-id"));
	});
	
	//收藏夹页面的添加收藏标签
	$("#TagAddFavorite input").tagger({
		oDone:function(id){
			var obj = {};
			$.each($(".FavoriteItem ul"),function(){obj[$(this).attr("tagger-id")]=$(this);});
			return obj;
		},
		oBtn:$("#TagAddFavorite a"),
		funAdd : function(tag,id){
			popup["favoritetag"].dialog("close");
			console.log("tagger-text:"+tag+"|tagger-id:"+String(id));
		},
		funDelete : function(tag,id){
			console.log("tagger-text:"+tag+"|tagger-id:"+String(id));
		}
	});
	//收藏夹页面取消收藏
	$(".FavoriteRemove").click(function(){
		var obj = $(this).parents(".FavoriteItem");
		var content = obj.find(".favo-content");
		
		//取消成功后执行
		obj.after(Mustache.render(templ.favoremove,{
			url : content.children().attr("href"),
			text : content.children().html().substring(0,20),
			qid : obj.attr("qid")
		}));
		obj.next().children("a.FavoriteBack").bind("click",function(){
			obj.slideDown("fast");
			$(this).parent().hide();
		});
		obj.slideUp("fast");
		

	});
	
	//加入清单按钮的操作
	$(".FavoriteListAdd").click(function(){		
		var o = $(this);
		$("body").append('<div class="favo-list-addfeedback favo-list-addsuccess" style="display:none">成功添加到题目清单""</div>');
		var obj = $("body div:last");
		obj.offset({top:$(this).offset().top+$(this).outerHeight()+5,left:$(this).offset().left-(obj.outerWidth()-$(this).outerWidth()-22)});
		obj.slideDown("fast",function(){
			$(window).click(function(event){
				if($(event.target)!=o){
					obj.slideUp("fast");
					obj.remove();
				}
			});	
		});		
	});
	
	
	//绑定批注部分的事件和滚动条初始化
	$(".FavoriteNote").each(function(i){
		var o = $(this);
		o.note(function(text){
			//ajax请求服务器
			ajax.noteAdd({qid:o.parents(".FavoriteItem").attr("qid"),content:text},function(data){
				if(data.status==1){
					//update数据
					o.trigger("note.update");
					o.trigger("note.cancel");
				}else{
					notice.failed();
				}
			});
			
			
		});
		
	});
	
	$("#ExportRadioShow").radioShow();
	
	
	
	
});


