// ===============================================================
// 这里定义了所有的弹出浮动层及其相关代码
// HTML 定义：
// 浮动层在html上的所有定义均使用id，并且全部以Popup开头后面再接首字母大写的单词，所有的浮动层本身都具有class=Popup
// 浮动层触发物件的定义也在html上使用id，并且全部以Pop开头，所有的浮动层触发点都有class=Pop
// 例如说收藏的浮动层，触发按钮的id为PopFavorite，其浮动层的id则为PopupFavorite

//定义所有的popup，将通过初始化函数填充
var popup = {};

//定义所有的popup需要使用的函数
var popfun={
	//初始化popup
	initPopup	: function(){				
					$(".Popup").each(function(i){						
						var obj = $(this);
						var objTrigger = $("*[popup='"+obj.attr("popup-id")+"']");						
						//使用初始参数设置popup的对象
						popup[obj.attr("popup-id")] = obj.dialog({
							position:["center",150],
							autoOpen:false,
							closeText:"关闭",
							resizable:false,
							modal:true,
							show:{effect:"fade",duration:500},
							hide:{effect:"fade",duration:500},
							resizable:false
						});							
						var p = popup[obj.attr("popup-id")];						
						//如果是粘性的位置，则在trigger点击前改变位置(选择在点击前来改变位置是为了避规scroll的影响)
						if($.type(obj.attr("popup-stick"))!="undefined"){
							$("*[popup='"+obj.attr("popup-id")+"']").click(function(){
								popup[$(this).attr("popup")].dialog("option",{position:popfun.getPosition(obj.attr("popup-stick"),$(this),obj)});
							});
							//stick模式的话modal为false
							p.dialog("option",{modal:false});
							//stick模式的话边框颜色需要变化
							p.dialog("widget").css("border-color","#cbcbcb")
						}
						
						//如果设置的宽度
						if($.type(obj.attr("popup-width"))!="undefined")
							p.dialog("option","width",parseInt(obj.attr("popup-width")));
						
						//如果设置的高度
						if($.type(obj.attr("popup-height"))!="undefined")
							p.dialog("option","height",parseInt(obj.attr("popup-height")));
						
						//如果不显示title的话
						if(obj.attr("popup-title")=="none")
							p.dialog("widget").children(".ui-dialog-titlebar").hide();
						
						//如果要使用其它title的样式
						if(obj.attr("popup-title")!="none" && $.type(obj.attr("popup-title"))!="undefined")
							p.dialog("widget").children(".ui-dialog-titlebar").removeClass("ui-dialog-titlebar").addClass("ui-dialog-titlebar-"+obj.attr("popup-title"));
						
						//如果要使用其它显示效果
						if($.type(obj.attr("popup-effect"))!="undefined")
							p.dialog("option",{show:obj.attr("popup-effect"),hide:obj.attr("popup-effect")});
						
						//如果有按钮的话，绑定按钮事件
						if($.type(obj.attr("popup-btn"))!="undefined"){							
							p.dialog("option","buttons",{									
								"Confirm" : {"text":"确认提交","class":"ui-button-confirm","click":function(){}},
								"Cancel" : {"text":"取消","class":"ui-button-cancel","click":function(){$(this).dialog("close");}}
							});	
							//解除原有的事件绑定，将提交按钮的事件放到外部去绑定，这里仅仅用来调整样式
							p.dialog("widget").find(".ui-button-confirm").unbind("click");							
						}						
						//设置默认的trigger打开
						objTrigger.click(function(){
							//如果是多个对应一个，且位置是sticky的话
							if($.type(obj.attr("popup-multi"))!="undefined" && $.type(obj.attr("popup-stick"))!="undefined" && !p.dialog("isOpen")){
								p.dialog("open");					
							}else{
								if(p.dialog("isOpen"))
									p.dialog("close");
								else
									p.dialog("open");
							}
						});	
					});						
					//为所有的浮动层绑定点击浮动层外部关闭的事件
					$(document).click(function(event){
						var obj=$(event.target);
						if(!obj.hasClass("ui-dialog") && obj.parents(".ui-dialog").length<=0 && !($.type(obj.attr("popup"))!="undefined") && obj.parents("*[popup]").length<=0){
							$.each(popup,function(i,p){
								if(p.dialog("isOpen")) p.dialog("close");
							});
						}
					});						
				},
	//用来获得popup应有的位置
	//@pos, string, 位置有"righttop","centerbottom"
	//@trigger, object, 触发的对象
	//@obj, object, popup对象
	getPosition	: function(pos,trigger,obj){
//						console.log(trigger.offset().left);
//						console.log(obj.width());
//						console.log(trigger.width());
						var _pos=["center","center"];
						if(pos=="centertop")  _pos=[trigger.offset().left-parseInt((parseInt(obj.attr("popup-width"))-trigger.outerWidth())/2),trigger.offset().top+trigger.outerHeight()-135];
						if(pos=="centerbottom")  _pos=[trigger.offset().left-parseInt((parseInt(obj.attr("popup-width"))-trigger.width())/2),trigger.offset().top+trigger.height()+10];
						if(pos=="righttop") _pos=[parseInt(trigger.offset().left+trigger.width()+10),parseInt(trigger.offset().top)];
						if(pos=="rightbottom") _pos=[parseInt(trigger.offset().left+trigger.width()-parseInt(obj.attr("popup-width")))-2,parseInt(trigger.offset().top+trigger.height()+5)];
						return _pos;
					},
	//浮动层登录提交按钮
	login		: function(){
					var _data = {
						name : $.trim($("#LoginPopupName").val()),
						password : $.trim($("#LoginPopupPassword").val()),
						remember : ($.type($("#LoginPopupRemember:checked").val())=="undefined")?0:1
					};
					//console.log(JSON.stringify(_data));			
					var o = $("#LoginSubmit");
					//判断是否为空
					if(_data.name!="" && _data.password!=""){
						ajax.hide(o);
						ajax.login(_data,function(data){
							if(data.status==1){
								ajax.show(o);
								o.siblings(".warn").html("");
								window.location.reload();
							}else{
								ajax.show(o);
								o.siblings(".te-warn").html("用户名或者密码错误！");
							}
						});
					}else{
						o.siblings(".te-warn").html("用户名和密码都不得为空！");
					}
				},
	//浮动层报告题目错误提交按钮
	report		:function(){
					//console.log("outsider");
					var o = $(this);
					var typ = $("#ReportDetailForm select").val();
					var m = $("#ReportDetailForm textarea").val();
					ajax.hide(o);
					ajax.report({qid:g_param.qid,type:typ,msg:m},function(data){
						ajax.show(o);
						data = parseInt(data);
						if(data.status=1){						
							notice.report();
							popup["report"].dialog("close");
						}else{
							notice.failed();
						}
					});
				}


};

