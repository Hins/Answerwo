
//全角转半角的代码
String.prototype.DBC2SBC = function (){return this.replace(/[\uff01-\uff5e]/g,function(a){return String.fromCharCode(a.charCodeAt(0)-65248);}).replace(/\u3000/g," ");};
//把1个汉字当做两个英文字母来计算字符串长度的
String.prototype.byteLength = function(){return (this.length+(! this.match(/[^\x00-\x80]/g)?0:this.match(/[^\x00-\x80]/g).length));};

//跟随tip初始代码调用
var initTipTip = function(o,str){
	if($.type(str)=="string") o.attr("title","点击取消收藏");
	o.tipTip();
};

(function($){
	
	//定义键盘的回车事件
	$.fn.enter = function(callback){
		$(this).keyup(function(event){if(event.keyCode=="13") callback();});
	};
	
	//定义radio点击选择后的联动（用于表单）
	$.fn.radioShow = function(){
		var obj = $(this).find("[radio-show]");
		obj.each(function(){
			var target = $(this).attr("radio-show");
			$(this).click(function(){
				$("*[radio-target]").hide();
				$("*[radio-target='"+target+"']").show();
			});
		});
		
		
	};
	
	//ZTM.note
	//用于动态把内容变换为文本输入框
	$.fn.note = function(callback,container){
		
		this.each(function(){
			
			var obj = $(this),
				oEdit = obj.find("[note-id='edit']"),
				oContent = obj.find("[note-id='content']"),
				oSave = null,
				oCancel = null,
				oTextarea = null;
			
			if(container) oContainer = obj.find("[note-id='container']");
			
			//绑定编辑事件
			obj.bind("note.editable",function(){
				//创建保存和取消按钮
				oEdit.after(oEdit.clone().attr("note-id","save").html("保存"));
				oSave = oEdit.next();
				//绑定保存按钮行为
				oSave.click(function(){
					if($.type(callback)=="function" && oTextarea!=null){
						if($.trim(oTextarea.val())!=$.trim(oContent.html()))
							callback(oTextarea.val());
						else
							obj.trigger("note.cancel");
					}
				});
				oSave.after(oEdit.clone().attr("note-id","cancel").html("取消"));
				oCancel = oSave.next();
				//绑定取消按钮的行为
				oCancel.click(function(){obj.trigger("note.cancel");});
				//变成文本编辑器
				//判断有没有Container
				if(container){
					oContainer.hide();
					oContainer.after("<textarea>"+$.trim(oContent.html())+"</textarea>");
				}else{
					oContent.hide();
					oContent.after("<textarea>"+$.trim(oContent.html())+"</textarea>");
				}
				oTextarea = oContent.next();
				//最后删除编辑按钮
				oEdit.remove();
			});
			
			//绑定取消编辑事件
			obj.bind("note.cancel",function(){
				if(oTextarea!=null) {
					oTextarea.remove();
					oTextarea = null;
				}
				if(container)
					oContainer.show();
				else
					oContent.show();
				if(oSave!=null && oCancel!=null){
					oSave.before(oSave.clone().attr("note-id","edit").html("编辑"));
					oEdit = oSave.prev();
					//重新绑定编辑按钮的行为
					oEdit.click(function(){obj.trigger("note.editable");});
					//删除按钮
					oSave.remove();
					oSave = null;
					oCancel.remove();
					oCancel = null;
				}
			});
			
			//绑定同步textarea和显示html的代码
			obj.bind("note.update",function(){
				if(oTextarea!=null) oContent.html($.trim(oTextarea.val()));
			});
			
			//绑定编辑按钮的行为
			oEdit.click(function(){obj.trigger("note.editable");});
			
			
			
		});
		return this;
	};
	
	
	/*
	 * jQuery.ZTM.formCheck
	 *
	 * lanslot wrote in 2012-5-7
	 * 
	 * @param error, json, 错误信息
	 * @param warn, string, 错误提示文本的class
	 * @param intro, string, 常规提示信息文本的class
	 * @param formwarn, string, input框出错时的class
	 */
	$.fn.formCheck = function(options) { 
		var defaults = {
			error:{
				"default"		: "你输入的内容不符合要求",
				"required"		: "这里的输入不能为空",
				"minlength"		: "请至少输入{n}个字符",
				"maxlength"		: "最多只能输入{n}个字符，一个中文字相当于两个字符",
				"email"			: "请输入正确的邮箱地址",
				"pattern"		: "你在这里的输入不符合要求",
				"equal"			: "这里的输入与上面的不一致",
				"usernamechk"	: "你所输入的用户名已存在，请换一个试试",
				"emailchk"		: "你所输入的邮箱地址已存在，请换一个试试"
			},
			warn:"te-warn",
			intro:"te-gary",
			formwarn:"fo-inp-warn"
		};
		var settings = $.extend({}, defaults, options);		
		
		//检查所有的表单项
		var checkAll = function(o,form){			
			
			//清除前后的空格
			var value = $.trim(o.val());
			//如果有全角转半角，则应该先清除掉全角
			value = (o.attr("dbc2sbc")=="true")?value.DBC2SBC():value;
			
			//验证是否为空
			if(typeof(o.attr("required"))!="undefined" && value=="") return "required";
			//验证是否与上面的输入相同
			if(typeof(o.attr("equal"))!="undefined" && value!=o.parents("form").find("input[name='"+o.attr("equal")+"']").val()) return "equal";
			//验证最小长度
			if(typeof(o.attr("minlength"))!="undefined" && value.byteLength()<parseInt(o.attr("minlength"))) return "minlength";
			//验证最大长度
			if(typeof(o.attr("maxlength"))!="undefined" && value.byteLength()>parseInt(o.attr("maxlength"))) return "maxlength";
			//验证邮箱地址
			if(o.attr("type")=="email" && value.replace(/^([a-zA-Z0-9_\-])+\.?([a-zA-Z0-9_\-])+@([a-zA-Z0-9_\-])+((\.[a-zA-Z0-9_\-]{2,4}){1,2})$/,"")!="") return "email";
			//验证正则表达式
			if(typeof(o.attr("pattern"))!="undefined"){
				var reg = new RegExp(o.attr("pattern"),"gi");
				if(value.replace(reg,"")!="") return "pattern";
			}
			//ajax验证用户名		
			if(typeof(o.attr("ajax"))!="undefined"){
				ajax.registerCheck({para:value},function(data){
					if(data.status==0){
											
						var thestr="";
						if(o.attr("ajaxcheck")=="username") thestr="usernamechk";
						if(o.attr("ajaxcheck")=="email") thestr="emailchk";

						showError(form,o,thestr);
						return thestr;
					}
				});
			}
			//所有验证通过后输出allpass
			return "allpass";
			
		};
		//显示错误信息
		var showError = function (form,o,str){
			var obj = form.find("p[warn='"+o.attr("name")+"']");
			var tip = obj.html();
			
			var err;
			//判断输入的错误信息是字符串还是数字，如果是字符串，则是使用了内置的错误信息，如果是数字，则是使用了公共的错误信息定义
			if($.type(str)=="number"){
				err=error[str];
			}else{
				if(err=="") err="default";
				err = settings.error[str];
				if(err.indexOf("{n}")>0) err=err.replace("{n}",o.attr(str));
			}
			obj.html(err);
			obj.removeClass(settings.intro).addClass(settings.warn);
			o.addClass(settings.formwarn);
		}
		
		
		this.each(function() {
			var form = $(this);
			
			//离开聚焦的时候开始检测所有的项是否符合要求
			form.find("input").blur(function(){
				//先检测所有的是否符合
				var result = checkAll($(this),form);
				//如果没通过检测，输出全部通过
				if(result!="allpass") showError(form,$(this),result);
				//执行全角转半角
				if($(this).attr("dbc2sbc")=="true") $(this).val($(this).val().DBC2SBC());
				//执行清除掉前后的空格
				$(this).val($.trim($(this).val()));				
			});
			//聚焦的时候清除掉错误信息，重新出现提示信息
			form.find("input").focus(function(){
				$(this).removeClass(settings.formwarn);
				var obj = form.find("p[warn='"+$(this).attr("name")+"']");
				if(obj.hasClass(settings.warn)){
					obj.removeClass(settings.warn).addClass(settings.intro);
					obj.html(obj.attr("tip"));
				}
			});
			//如果页面初始载入的时候有错误信息，则直接显示出来
			if(typeof(formResult)=="object"){
				form.find("input").each(function(i){
					if(typeof(formResult[$(this).attr("name")])!="undefined"){
						showError(form,$(this),formResult[$(this).attr("name")]);
					}
				});
			}
			
		});  
		return this;  
	};


	/*
	 * jQuery.ZTM.explain
	 *
	 * lanslot wrote in 2012-5-8
	 * 
	 * @param error, json, 错误信息
	 * @param warn, string, 错误提示文本的class
	 * @param intro, string, 常规提示信息文本的class
	 * @param formwarn, string, input框出错时的class
	 */
	$.fn.explain = function(startObj,callback,options) { 
		
		var defaults = {
			img:"/images/loading_blue.gif",
			btn:"fo-btn",
			editorJs: "/kindeditor-4.0.6/kindeditor-min.js",
			editorPath:"/kindeditor-4.0.6/",
			editorOption:{
				resizeType : 1,
				width:"100%",
				height:"250px",
				allowPreviewEmoticons : false,
				allowImageUpload : false,
				filterMode:true,
				items : [ 'bold', 'italic', 'underline', 'insertorderedlist', 'insertunorderedlist', 'removeformat'],
				//设置允许的html标签
				htmlTags: {
					//font : ['color', 'size', 'face', '.background-color'],
					span : ['style'],
					//div : ['class', 'align', 'style'],
					table: ['class', 'border', 'cellspacing', 'cellpadding', 'width', 'height', 'align', 'style'],
					'td,th': ['class', 'align', 'valign', 'width', 'height', 'colspan', 'rowspan', 'bgcolor', 'style'],
					//a : ['class', 'href', 'target', 'name', 'style'],
					//embed : ['src', 'width', 'height', 'type', 'loop', 'autostart', 'quality', 'style', 'align', 'allowscriptaccess', '/'],
					//img : ['src', 'width', 'height', 'border', 'alt', 'title', 'align', 'style', '/'],
					//hr : ['class', '/'],
					br : ['/'],
					'p,ol,ul,li,blockquote,h1,h2,h3,h4,h5,h6' : ['align', 'style'],
					'tbody,tr,strong,b,sub,sup,em,i,u,strike' : []
				},
				newlineTag:"br",
				//初始载入隐藏编辑器
				afterCreate :　function(){$(".ke-container").hide();}
			}
		};
		var settings = $.extend({}, defaults, options);		
		
		//定义父级元素
		var self=this, editor=null;
		
		//定义全局的object对象
		var obj = {
			content : $("<div class='explain-content' />"),
			loading : $("<div class='explain-loading' style='display:none'><img src='"+settings.img+"' /><br />文本编辑器载入中...请稍候...</div>"),
			editor  : $("<textarea style='display:none' />"),
			save	: $("<button class='"+settings.btn+"'>保存解析</button>"),
			cancel	: $("<a href='javascript:void(0)'>取消</a>"),
			warn	: $("<span class='explain-warn' />"),
			wrap	: $("<div class='explain-btns' style='display:none' />")
		};
		
		//定义关闭编辑器的自定义事件
		this.bind("explain.close",function(){
			//显示编辑解析按钮
			startObj.show();
			//隐藏编辑器
			obj.content.siblings().fadeOut("fast",function(){
				obj.content.show();
			});
		});
		
		//定义创建编辑器事件
		this.bind("explain.create",function(){
			$.getScript(settings.editorJs, function(){
				//设置编辑器的基本路径
				KindEditor.basePath = settings.editorPath;
				//创建编辑器的对象
				editor = KindEditor.create("#"+self.attr("id")+" textarea",settings.editorOption);
			});
		});
		
		//定义打开编辑器事件
		this.bind("explain.open",function(){
			//开始loading的效果
			obj.content.fadeOut("fast",function(){
				obj.loading.fadeIn("fast", function(){			
					//首先将文本拷贝一份到textarea里面
					if(self.attr("explain-blank")!="blank") obj.editor.html(obj.content.html());					
					//如果没有加载过JS的话，开始加载JS文件							
					if(editor==null){												
						self.trigger("explain.create");
					}else{
						obj.loading.fadeOut("fast",function(){
							//显示操作按钮
							obj.wrap.show();
							$(".ke-container").show();
						});
					}							
				});
			});	
			startObj.hide();
		});
		
		//绑定启动编辑器的事件
		startObj.click(function(){self.trigger("explain.open");});
		//绑定关闭编辑器事件
		obj.cancel.click(function(){self.trigger("explain.close");});
		//绑定保存编辑器事件
		obj.save.click(function(){
			var text = $.trim(editor.html());
			if(text==""){
				obj.warn.html("你不能够把这里的解析全部清空啊！");
			}else{
				if(editor.isDirty()){
					//如果有改动的话，执行回调函数
					if($.type(callback)=="function") callback(text,obj.warn,obj.save);
				}else{
					self.trigger("explain.close");
				}
			}			
		});			
		
		//如果是空白内容的提示信息的话，将其存入变量中
		if(this.attr("explain-blank")=="blank"){
			obj.blank = this.children();
		}
		//初始化编辑器：填充html
		this.wrapInner(obj.content);
		obj.content = this.children().eq(0);
		obj.content.after(obj.loading,obj.editor,obj.wrap);
		obj.loading = obj.content.next();
		obj.editor = obj.loading.next();
		obj.wrap = obj.editor.next();
		obj.wrap.append(obj.save,obj.cancel,obj.warn);
		obj.save = obj.wrap.children().eq(0);
		obj.cancel = obj.save.next();
		obj.warn = obj.cancel.next();
		
		//首先将文本拷贝一份到textarea里面
		if(self.attr("explain-blank")!="blank") obj.editor.html(obj.content.html());
		//初始化加载编辑器
		self.trigger("explain.create");
			
	};

	

	 /*
	 * jQuery.ZTM.formStyle
	 *
	 * lanslot wrote in 2012-5-5
	 * 
	 * @param select, string, 已选上的class
	 * @param disable, string, 不可用的class
	 * @param sel-disable, string, 已选上不可用的class
	 * @param wran, string 警告样式的class
	 * @param radio, string radio的样式class识别符
	 * @param check, string checkbox的样式的class识别符
	 */
	$.fn.formStyle = function(options) { 
		var defaults = {
			selected:"selected",
			disable:"disable",
			sel_disable:"select-disable",
			wran:"wran",
			radio:"radio",
			check:"check"
		};
		var settings = $.extend({}, defaults, options);	
		
		
		this.each(function() {
			var o = $(this);
			var obj = o.children("input");
			//初始状态的载入
			if(obj.attr("checked")=="checked" && obj.attr("disabled")!="disabled")	o.addClass(settings.selected);
			if(obj.attr("checked")!="checked" && obj.attr("disabled")=="disabled")	o.addClass(settings.disable);
			if(obj.attr("checked")=="checked" && obj.attr("disabled")=="disabled")	o.addClass(settings.sel_disable);
			//点击效果的切换 - checkbox
			if(obj.attr("disabled")!="disabled" && o.parent("ul").hasClass(settings.check)){
				o.click(function(){
					
					//wran的话要清除掉wran的样式
					if($(this).hasClass(settings.wran)) $(this).removeClass(settings.wran);
					//点击后变换效果和赋值
					if(obj.attr("checked")=="checked"){
						$(this).removeClass(settings.selected);
						obj.attr("checked",false);
					}else{
						$(this).addClass(settings.selected);
						obj.attr("checked",true);
					}
					
				});
			}
			//点击效果的切换 - radio
			if(obj.attr("disabled")!="disabled" && o.parent("ul").hasClass(settings.radio)){
				o.click(function(){						
					o.addClass(settings.selected);
					o.siblings().removeClass(settings.selected);
					o.siblings().each(function(i){$(this).children("input").attr("checked",false);});
					o.children("input").attr("checked",true);
				});
			}	
		});  
		return this;  
	};




	 /*
	 * jQuery.ZTM.formStyleSelect
	 * @change : function, 改变时调用的函数
	 * lanslot wrote in 2012-5-13
	 * 
	 */
	$.fn.formStyleSelect = function(options) { 
		var defaults = {change:null};
		var settings = $.extend({}, defaults, options);	
		
		var str = "";
		var str_cur = '';
		
		this.each(function() {
			var o = $(this);
	
			o.children("option").each(function(i){
				if(parseInt($(this).val())>=0) str = str + "<li index='"+i+"'>"+$(this).text()+"</li>";
			});
			if(parseInt(o.val())<0){
				str_cur = '<b class="ym-clearfix"><span>'+o.children("option:selected").text()+'</span><i></i></b>';
			}else{
				str_cur = '<b class="ym-clearfix pl-select-selected"><span>'+o.children("option:selected").text()+'</span><i></i></b>';
			}
		
			o.after(
				'<div class="pl-select">'+
				str_cur+
				'<ul>'+
				str+
				'</ul></div>'
			);
				
			o.next(".pl-select").children("b").width(o.parent().width());
			o.next(".pl-select").children("ul").children("li").width(o.parent().width());
			o.next(".pl-select").children("b").click(function(){
				if($(this).hasClass("pl-select-opened")){
					$(this).next().slideUp("fast");
					$(this).removeClass("pl-select-opened");
				}else{
					$(this).next().slideDown("fast");
					$(this).addClass("pl-select-opened");
				}		
			});
			o.next(".pl-select").children("ul").delegate("li","click", function(){
				$(this).parent("ul").slideUp("fast");
				$(this).parent().prev().removeClass("pl-select-opened").addClass("pl-select-selected");
				o.val(o.children().eq(parseInt($(this).attr("index"))).val());
				$(this).parent().prev().html("<span>"+o.children().eq(parseInt($(this).attr("index"))).text()+"</span><i></i>");
				if(typeof settings.change=="function") settings.change();
			});

		});  
		return this;  
	};
	
/*	jQuery.ZTM.tagger

	@param oDone : 两种传入形式：
		1.函数形式，函数将返回一个JSON对象 {“tagger-id”,object}
		2.对象形式，直接传入一个对象
	@param oBtn  : 添加按钮的object
	@param oTip  : 提示的object
	
	html要求：
	1.以input元素为基准：$(input).tagger()
	2.input元素必须含有一个tagger-id的属性
	3.待插入的区域也必须要含有tagger-id的属性
	最终将对比tagger-id来进行真正的插入
	
	具有两个回调函数：
	添加了tag的时候执行，funAdd:function(tag,id){}第一个参数是tag的文本，第二个参数是tagger-id的值
	删除了tag的时候执行，funDelete:function(tag,id){}第一个参数是tag的文本，第二个参数是tagger-id的值
*/
	$.fn.tagger = function(options) { 
		
		var defaults = {
			oDone : null,
			oBtn : null,
			oTip : null,
			templDone : "<li class='ym-clearfix'><span>{{tag}}</span><a href='javascript:void(0)' class='delete'></a></li>",
			seperate : ",",
		};
		var para = $.extend({}, defaults, options);	
		this.each(function() {
			var self = $(this),
				oDone = para.oDone,
				oTip = para.oTip,
				oBtn = para.oBtn;
				
			//在done里面添加标签
			if(oDone!=null){
				
				//如果oDone是通过function方式传入的taggger-id区分的多个对象
				if($.type(oDone)=="function"){
					oDone = oDone();
				}else{
					oDone = {};
					oDone[self.attr("tagger-id")] = para.oDone;
				}
				$.each(oDone,function(i,n){
					n.bind("tagger.add",function(e,tag){
						//console.log(para.templDone.toString().replace("{{tag}}",tag));
						n.append(para.templDone.toString().replace("{{tag}}",tag.v));
						//如果有添加时调用的函数的话，执行
						if($.type(para.funAdd)=="function") para.funAdd(tag.v,tag.id);
					});
				});	
			}
			
			//点击tip添加标签
			if(oTip!=null){
				oTip.find("a").bind("click",function(){
					//首先判断有没有oDone，如果有的话添加到里面
					if(oDone!=null){
						oDone[self.attr("tagger-id")].trigger("tagger.add",{v:$(this).html(),id:self.attr("tagger-id")});			
					}else{
						//否则的话则加入到input里面
						if($.trim(self.val())=="") self.val($(this).html());
						else self.val(self.val()+para.seperate+$(this).html());
					}
					
				});
			}
			
			//绑定done里面的删除事件
			if(oDone!=null){
				
				$.each(oDone,function(i,n){
					n.delegate("a","click",function(){
						//如果有删除调用的函数的话，执行
						if($.type(para.funDelete)=="function") para.funDelete($(this).prev().html(),i);
						//移除元素
						$(this).parent().remove();
					});
				});
				
				
			}
			
			//在input里面输入后回车添加
			self.keyup(function(event){
				if(event.keyCode=="13" && $.trim(self.val())!="" && oDone!=null){
					oDone[self.attr("tagger-id")].trigger("tagger.add",{v:$.trim(self.val()),id:self.attr("tagger-id")});
					self.val("");
				}
			});

			//点击按钮添加
			if(oBtn!=null){
				oBtn.click(function(){
					if($.trim(self.val())!="" && oDone!=null){
						oDone[self.attr("tagger-id")].trigger("tagger.add",{v:$.trim(self.val()),id:self.attr("tagger-id")});
						self.val("");
					}
				});
			}
		});  
		return this; 
	};

	 /*
	 * jQuery.ZTM.paginate
	 *
	 * lanslot wrote in 2012-6-5
	 * 
	 * @param : callback, function, 用于执行翻页数据操作的函数
	 * @use : $(X).paginate(function(obj){}); 初始化，obj为click的那个对象$()
	 * @method : $(X).trigger("paginate.update",{total:10,current:1}); 初始化之后外部调用修改翻页的数值
	 */

	$.fn.paginate = function(callback){
		//定义全局变量
		var self = this;
		
		//设置html的helper
		var helper = {
			//常规链接的html
			htmlLink	: function(n){return '<a href="javascript:void(0)">'+String(n)+'</a>';},
			//当前页的html
			htmlCurrent	: function(n){return '<b>'+String(n)+'</b>';},
			//省略号的html
			htmlDot		: '<b>...</b>',
			//字符拼接的规则
			combine		: function(val,start,end,first,last){
							var str = "",i;
							if(first) str = str + helper.htmlLink(1) + helper.htmlDot;
							for(i=start;i<=end;i++) str = (i==val.current)?str+helper.htmlCurrent(i):str+helper.htmlLink(i);								
							if(last) str = str + helper.htmlDot + helper.htmlLink(val.total);
							return str;
						},
			//字符拼接的规则对照表
			matrix		: function(val){
							if(val.total<=0) return "";
							if(val.total<=9) return helper.combine(val,1,val.total,false,false);
							if(val.total>9 && val.current<=5) return helper.combine(val,1,7,false,true);
							if(val.total>9 && val.current>5 && val.current<val.total-5) return helper.combine(val,val.current-2,val.current+2,true,true);
							if(val.total>9 && val.current>=val.total-5) return helper.combine(val,val.total-6,val.total,true,false); //因为两位数字占位问题，所以这里应该第二个是减7变为减6
						}
		};
		
		//更新翻页数值
		this.bind("paginate.update",function(e,val){
			//首先验证合理性
			val.total = (val.total>=1)?val.total:0;
			val.current = (val.current>=1)?val.current:0;
			//如果只有1页，则全部设为0，以达到不显示翻页的效果
			if(val.total==val.current && val.total==1) val.total=0;
			//然后才开始更新数据
			self.attr("page-total",val.total).attr("page-current",val.current);
			self.html(helper.matrix(val));
		});
		
		
		//绑定点击事件
		this.delegate("a","click",function(){
			var v = {
				total : parseInt($.trim(self.attr("page-total"))),
				current : parseInt($.trim($(this).html()))
			};	
			//如果有回调函数的话，执行
			if($.type(callback)=="function"){
				callback($(this));
			}else{
				//如果没有回调函数则直接执行
				self.trigger("paginate.update",v);
			}
			
		});
		
		//初始化翻页的基本数据
		self.trigger("paginate.update",{
			total	: parseInt($.trim(self.attr("page-total"))),
			current	: parseInt($.trim(self.attr("page-current")))
		});
	
	};


	 /*
	 * jQuery.ZTM.scrollFollow
	 *
	 * lanslot wrote in 2012-5-5
	 * 
	 * @param container, object, 容器div的选择器
	 * @param fix, array, 修正的大小【上,下,左,右】
	 * 注意代码里面所有的定位数组全部都是【上,下,左,右】
	 * 注意此插件必须给出container参数, fix参数为空即为[0,0,0,0]
	 */		

	$.fn.scrollFollow = function(container,fix) {
	
		var o=this;
		
		//首先判断传入参数是不是数组
		fix = ($.isArray(fix))?fix:[0,0,0,0];
		
		//计算并设置位置的函数
		var position = {
			//获取边界
			border : function(o){return [o.offset().top,o.offset().top+o.height(),o.offset().left,o.offset().left+o.width()];},
			//计算尺寸大小
			size : function(pos,fix){return [pos[0]+fix[0],pos[1]+fix[1],pos[2]+fix[2],pos[3]+fix[3]];},
			//设置位置
			set : function(o,pos){
				o.width(pos[3]-pos[2]);
				o.height($(window).height()-pos[0]);
				o.offset({top:pos[0],left:pos[2]});
			}
		};
		
		//初始化开始
		position.set(o,position.size(position.border(container),fix));
		
		//浏览器窗口大小变化时，变更区域大小
		$(window).resize(function(){
			position.set(o,position.size(position.border(container),fix));
		});	
		
		//浏览器滚动条滚动时
		$(window).scroll(function(){
			var exact = position.size(position.border(container),fix);
			//首先在滚动高度小于ListFollow整体距离顶部高度的时候
			if($(window).scrollTop()<exact[0]){
				if(o.css("position")!="absolute" || o.offset().top!=exact[0]){
					o.css("position","absolute");
					o.offset({top:exact[0]});
				}
				o.height($(window).height()-exact[0]+$(window).scrollTop());	
			}else if($(window).scrollTop()+$(window).height()>exact[1]){
				//然后是判断是不是滚到最底部了
				if(o.css("position")!="absolute" || o.offset().top!=$(window).scrollTop()){
					o.css("position","absolute");
					o.offset({top:$(window).scrollTop()});
				}
				o.height(exact[1]-$(window).scrollTop());				
			}else{
				//最后是中间的状态
				o.height($(window).height());				
				if($.browser.msie && $.browser.version=="6.0"){
					//ie6不支持fixed属性，要继续使用absolute
					o.css("top",String($(window).scrollTop())+"px");
					o.height($(window).height());
				}else if(o.css("position")!="fixed" || o.css("top")!="0"){
					//非ie6都支持fixed属性						
					o.css("position","fixed");
					o.css("top","0");					
				}					
			}			
		});	
		
	};

	 /*
	 * jQuery Rater Star Plugin
	 * http://raychou.com/labs/rater-star/
	 *
	 */ 
	$.fn.rater	= function(options) {
			
		// 默认参数
		var settings = {
			enabled	: true,
			min		: 1,
			max		: 5,
			step	: 1,
			value	: null,
			after_click	: null,
			image	: "/images/star.gif",
			width	: 19,
			height	: 18,
			title	: ["很简单","偏简单","普通难度","较难题目","很难的题目"],
			title_container	: null
		}; 
		
		// 自定义参数
		if(options) {  
			jQuery.extend(settings, options); 
		}
		
		// 主容器
		var content	= jQuery("<ul class='rater-star'></ul>");
		content.css("background-image" , "url(" + settings.image + ")");
		content.css("height" , settings.height);
		content.css("width" , (settings.width*settings.step) * (settings.max-settings.min+settings.step)/settings.step);
		
		// 当前选中的
		var item	= jQuery("<li class='rater-star-item-current'></li>");
		item.css("background-image" , "url(" + settings.image + ")");
		item.css("height" , settings.height);
		item.css("width" , 0);
		item.css("z-index" , settings.max / settings.step + 1);
		if (settings.value) {
			item.css("width" , ((settings.value-settings.min)/settings.step+1)*settings.step*settings.width);
		}
		
		content.append(item);
		
		// 星星
		for (var value=settings.min ; value<=settings.max ; value+=settings.step) {
			item	= jQuery("<li class='rater-star-item'></li>");
			
			if (typeof settings.title_format == "function") {
				item.attr("title" , settings.title_format(value));
			}
			else {
				item.attr("title" , value);
			}
			item.css("height" , settings.height);
			item.css("width" , (value-settings.min+settings.step)*settings.width);
			item.css("z-index" , (settings.max - value) / settings.step + 1);
			item.css("background-image" , "url(" + settings.image + ")");
			
			if (!settings.enabled) {	// 若是不能更改，则隐藏
				item.hide();
			}
			
			content.append(item);
		}
		
		content.mouseover(function(){
			if (settings.enabled) {
				jQuery(this).find(".rater-star-item-current").hide();
			}
		}).mouseout(function(){
				jQuery(this).find(".rater-star-item-current").show();
		})
		
		// 添加鼠标悬停/点击事件
		content.find(".rater-star-item").mouseover(function() {
			jQuery(this).attr("class" , "rater-star-item-hover");
			if (typeof settings.title_container == "string"){
				$(settings.title_container).html(settings.title[parseInt($(this).attr("title"))-1]);
			}
		}).mouseout(function() {
			jQuery(this).attr("class" , "rater-star-item");
		}).click(function() {
			jQuery(this).prevAll(".rater-star-item-current").css("width" , jQuery(this).width());
			
			var star_count		= (settings.max - settings.min) + settings.step;
			var current_number	= jQuery(this).prevAll(".rater-star-item").size()+1;
			var current_value	= settings.min + (current_number - 1) * settings.step;
			var data	= {
				value	: current_value,
				number	: current_number,
				count	: star_count,
				min		: settings.min,
				max		: settings.max
			}
			
			// 处理回调事件
			if (typeof settings.after_click == "function") {
				settings.after_click(data);
			}
			
		})
		
		$(this).html(content);
		
	};
	
	 /*
	 * TipTip
	 * Copyright 2010 Drew Wilson
	 * www.drewwilson.com
	 * code.drewwilson.com/entry/tiptip-jquery-plugin
	 *
	 * Version 1.3   -   Updated: Mar. 23, 2010
	 *
	 * This Plug-In will create a custom tooltip to replace the default
	 * browser tooltip. It is extremely lightweight and very smart in
	 * that it detects the edges of the browser window and will make sure
	 * the tooltip stays within the current window size. As a result the
	 * tooltip will adjust itself to be displayed above, below, to the left 
	 * or to the right depending on what is necessary to stay within the
	 * browser window. It is completely customizable as well via CSS.
	 *
	 * This TipTip jQuery plug-in is dual licensed under the MIT and GPL licenses:
	 *   http://www.opensource.org/licenses/mit-license.php
	 *   http://www.gnu.org/licenses/gpl.html
	 */
	$.fn.tipTip=function(options){var defaults={activation:"hover",keepAlive:false,maxWidth:"200px",edgeOffset:3,defaultPosition:"bottom",delay:400,fadeIn:200,fadeOut:200,attribute:"title",content:false,enter:function(){},exit:function(){}};var opts=$.extend(defaults,options);if($("#tiptip_holder").length<=0){var tiptip_holder=$('<div id="tiptip_holder" style="max-width:'+opts.maxWidth+';"></div>');var tiptip_content=$('<div id="tiptip_content"></div>');var tiptip_arrow=$('<div id="tiptip_arrow"></div>');$("body").append(tiptip_holder.html(tiptip_content).prepend(tiptip_arrow.html('<div id="tiptip_arrow_inner"></div>')))}else{var tiptip_holder=$("#tiptip_holder");var tiptip_content=$("#tiptip_content");var tiptip_arrow=$("#tiptip_arrow")}return this.each(function(){var org_elem=$(this);if(opts.content){var org_title=opts.content}else{var org_title=org_elem.attr(opts.attribute)}if(org_title!=""){if(!opts.content){org_elem.removeAttr(opts.attribute)}var timeout=false;if(opts.activation=="hover"){org_elem.hover(function(){active_tiptip()},function(){if(!opts.keepAlive){deactive_tiptip()}});if(opts.keepAlive){tiptip_holder.hover(function(){},function(){deactive_tiptip()})}}else if(opts.activation=="focus"){org_elem.focus(function(){active_tiptip()}).blur(function(){deactive_tiptip()})}else if(opts.activation=="click"){org_elem.click(function(){active_tiptip();return false}).hover(function(){},function(){if(!opts.keepAlive){deactive_tiptip()}});if(opts.keepAlive){tiptip_holder.hover(function(){},function(){deactive_tiptip()})}}function active_tiptip(){opts.enter.call(this);tiptip_content.html(org_title);tiptip_holder.hide().removeAttr("class").css("margin","0");tiptip_arrow.removeAttr("style");var top=parseInt(org_elem.offset()['top']);var left=parseInt(org_elem.offset()['left']);var org_width=parseInt(org_elem.outerWidth());var org_height=parseInt(org_elem.outerHeight());var tip_w=tiptip_holder.outerWidth();var tip_h=tiptip_holder.outerHeight();var w_compare=Math.round((org_width-tip_w)/2);var h_compare=Math.round((org_height-tip_h)/2);var marg_left=Math.round(left+w_compare);var marg_top=Math.round(top+org_height+opts.edgeOffset);var t_class="";var arrow_top="";var arrow_left=Math.round(tip_w-12)/2;if(opts.defaultPosition=="bottom"){t_class="_bottom"}else if(opts.defaultPosition=="top"){t_class="_top"}else if(opts.defaultPosition=="left"){t_class="_left"}else if(opts.defaultPosition=="right"){t_class="_right"}var right_compare=(w_compare+left)<parseInt($(window).scrollLeft());var left_compare=(tip_w+left)>parseInt($(window).width());if((right_compare&&w_compare<0)||(t_class=="_right"&&!left_compare)||(t_class=="_left"&&left<(tip_w+opts.edgeOffset+5))){t_class="_right";arrow_top=Math.round(tip_h-13)/2;arrow_left=-12;marg_left=Math.round(left+org_width+opts.edgeOffset);marg_top=Math.round(top+h_compare)}else if((left_compare&&w_compare<0)||(t_class=="_left"&&!right_compare)){t_class="_left";arrow_top=Math.round(tip_h-13)/2;arrow_left=Math.round(tip_w);marg_left=Math.round(left-(tip_w+opts.edgeOffset+5));marg_top=Math.round(top+h_compare)}var top_compare=(top+org_height+opts.edgeOffset+tip_h+8)>parseInt($(window).height()+$(window).scrollTop());var bottom_compare=((top+org_height)-(opts.edgeOffset+tip_h+8))<0;if(top_compare||(t_class=="_bottom"&&top_compare)||(t_class=="_top"&&!bottom_compare)){if(t_class=="_top"||t_class=="_bottom"){t_class="_top"}else{t_class=t_class+"_top"}arrow_top=tip_h;marg_top=Math.round(top-(tip_h+5+opts.edgeOffset))}else if(bottom_compare|(t_class=="_top"&&bottom_compare)||(t_class=="_bottom"&&!top_compare)){if(t_class=="_top"||t_class=="_bottom"){t_class="_bottom"}else{t_class=t_class+"_bottom"}arrow_top=-12;marg_top=Math.round(top+org_height+opts.edgeOffset)}if(t_class=="_right_top"||t_class=="_left_top"){marg_top=marg_top+5}else if(t_class=="_right_bottom"||t_class=="_left_bottom"){marg_top=marg_top-5}if(t_class=="_left_top"||t_class=="_left_bottom"){marg_left=marg_left+5}tiptip_arrow.css({"margin-left":arrow_left+"px","margin-top":arrow_top+"px"});tiptip_holder.css({"margin-left":marg_left+"px","margin-top":marg_top+"px"}).attr("class","tip"+t_class);if(timeout){clearTimeout(timeout)}timeout=setTimeout(function(){tiptip_holder.stop(true,true).fadeIn(opts.fadeIn)},opts.delay)}function deactive_tiptip(){opts.exit.call(this);if(timeout){clearTimeout(timeout)}tiptip_holder.fadeOut(opts.fadeOut)}}})};


	/*
	 * --------------------------------------------------------------------
	 * jQuery-Plugin - selectToUISlider - creates a UI slider component from a select element(s)
	 * by Scott Jehl, scott@filamentgroup.com
	 * http://www.filamentgroup.com
	 * reference article: http://www.filamentgroup.com/lab/update_jquery_ui_16_slider_from_a_select_element/
	 * demo page: http://www.filamentgroup.com/examples/slider_v2/index.html
	 * 
	 * Copyright (c) 2008 Filament Group, Inc
	 * Dual licensed under the MIT (filamentgroup.com/examples/mit-license.txt) and GPL (filamentgroup.com/examples/gpl-license.txt) licenses.
	 *
	 * Usage Notes: please refer to our article above for documentation
	 *  
	 * --------------------------------------------------------------------
	 */
	 /* lanslot changed! check .plugins.src */
	jQuery.fn.selectToUISlider=function(f){var k=jQuery(this);var q=jQuery.extend({labels:3,tooltip:true,tooltipSrc:"text",labelSrc:"value",sliderOptions:null},f);var h=(function(){var j=[];k.each(function(){j.push("handle_"+jQuery(this).attr("id"))});return j})();var a=(function(){var j=[];k.eq(0).find("option").each(function(){j.push({value:jQuery(this).attr("value"),text:jQuery(this).text()})});return j})();var b=(function(){if(k.eq(0).find("optgroup").size()>0){var j=[];k.eq(0).find("optgroup").each(function(r){j[r]={};j[r].label=jQuery(this).attr("label");j[r].options=[];jQuery(this).find("option").each(function(){j[r].options.push({text:jQuery(this).text(),value:jQuery(this).attr("value")})})});return j}else{return null}})();function i(j){return j.constructor==Array}function m(j){return(q.tooltipSrc=="text")?a[j].text:a[j].value}var p={step:1,min:0,orientation:"horizontal",max:a.length-1,range:k.length>1,slide:function(u,t){var s=jQuery(t.handle);var r=m(t.value);s.attr("aria-valuetext",r).attr("aria-valuenow",t.value).find(".ui-slider-tooltip .ttContent").text(r);var j=jQuery("#"+s.attr("id").split("handle_")[1]);j.find("option").eq(t.value).attr("selected","selected");s.find("span.screenShowText").html(a[t.value].value)},values:(function(){var j=[];k.each(function(){j.push(jQuery(this).get(0).selectedIndex)});return j})()};q.sliderOptions=(f)?jQuery.extend(p,f.sliderOptions):p;k.bind("change keyup click",function(){var r=jQuery(this).get(0).selectedIndex;var j=jQuery("#handle_"+jQuery(this).attr("id"));var s=j.data("handleNum");j.parents(".ui-slider:eq(0)").slider("values",s,r)});var d=jQuery("<div></div>");k.each(function(r){var s="";var u=jQuery("label[for="+jQuery(this).attr("id")+"]");var t=(u.size()>0)?"Slider control for "+u.text()+"":"";var j=u.attr("id")||u.attr("id","label_"+h[r]).attr("id");if(q.tooltip==false){s=' style="display: none;"'}jQuery('<a href="#" tabindex="0" id="'+h[r]+'" class="ui-slider-handle" role="slider" aria-labelledby="'+j+'" aria-valuemin="'+q.sliderOptions.min+'" aria-valuemax="'+q.sliderOptions.max+'" aria-valuenow="'+q.sliderOptions.values[r]+'" aria-valuetext="'+m(q.sliderOptions.values[r])+'" ><span class="screenReaderContext">'+t+'</span><span class="screenShowText">'+a[q.sliderOptions.values[r]].value+'</span><span class="ui-slider-tooltip ui-widget-content ui-corner-all"'+s+'><span class="ttContent"></span><span class="ui-tooltip-pointer-down ui-widget-content"><span class="ui-tooltip-pointer-down-inner"></span></span></span></a>').data("handleNum",r).appendTo(d)});if(b){var c=0;var e=d.append('<dl class="ui-slider-scale ui-helper-reset" role="presentation"></dl>').find(".ui-slider-scale:eq(0)");jQuery(b).each(function(r){e.append('<dt style="width: '+(100/b.length).toFixed(2)+"%; left:"+(r/(b.length-1)*100).toFixed(2)+'%"><span>'+this.label+"</span></dt>");var j=this.options;jQuery(this.options).each(function(s){var t=(c==a.length-1||c==0)?'style="display: none;"':"";var u=(q.labelSrc=="text")?j[s].text:j[s].value;e.append('<dd style="left:'+n(c)+'"><span class="ui-slider-label">'+u+'</span><span class="ui-slider-tic ui-widget-content"'+t+"></span></dd>");c++})})}else{var e=d.append('<ol class="ui-slider-scale ui-helper-reset" role="presentation"></ol>').find(".ui-slider-scale:eq(0)");jQuery(a).each(function(j){var r=(j==a.length-1||j==0)?'style="display: none;"':"";var s=(q.labelSrc=="text")?this.text:this.value;e.append('<li style="left:'+n(j)+'"><span class="ui-slider-label">'+s+'</span><span class="ui-slider-tic ui-widget-content"'+r+"></span></li>")})}function n(j){return(j/(a.length-1)*100).toFixed(2)+"%"}if(q.labels>1){d.find(".ui-slider-scale li:last span.ui-slider-label, .ui-slider-scale dd:last span.ui-slider-label").addClass("ui-slider-label-show")}var l=Math.max(1,Math.round(a.length/q.labels));for(var g=0;g<a.length;g+=l){if((a.length-g)>l){d.find(".ui-slider-scale li:eq("+g+") span.ui-slider-label, .ui-slider-scale dd:eq("+g+") span.ui-slider-label").addClass("ui-slider-label-show")}}d.find(".ui-slider-scale dt").each(function(j){jQuery(this).css({left:((100/(b.length))*j).toFixed(2)+"%"})});d.insertAfter(jQuery(this).eq(this.length-1)).slider(q.sliderOptions).attr("role","application").find(".ui-slider-label").each(function(){jQuery(this).css("marginLeft",-jQuery(this).width()/2)});d.find(".ui-tooltip-pointer-down-inner").each(function(){var r=jQuery(".ui-tooltip-pointer-down-inner").css("borderTopWidth");var j=jQuery(this).parents(".ui-slider-tooltip").css("backgroundColor");jQuery(this).css("border-top",r+" solid "+j)});var o=d.slider("values");if(i(o)){jQuery(o).each(function(j){d.find(".ui-slider-tooltip .ttContent").eq(j).text(m(this))})}else{d.find(".ui-slider-tooltip .ttContent").eq(0).text(m(o))}return this};

})(jQuery);

 /*
 * jQuery.Cookie
 *
 * get cookie value: value = $.cookie("name");
 * set cookie value: $.cookie("name","value");
 * check cookie existed: $.cookie("name")==null
 * delete cookie: $.cookie("name",null);
 * set full cookie options: $.cookie("name","value",{expires:7,path:"/",domain:"jquery.com"});
 */
jQuery.cookie=function(d,e,b){if(arguments.length>1&&String(e)!=="[object Object]"){b=jQuery.extend({},b);if(e===null||e===undefined){b.expires=-1}if(typeof b.expires==="number"){var g=b.expires,c=b.expires=new Date();c.setDate(c.getDate()+g)}e=String(e);return(document.cookie=[encodeURIComponent(d),"=",b.raw?e:encodeURIComponent(e),b.expires?"; expires="+b.expires.toUTCString():"",b.path?"; path="+b.path:"",b.domain?"; domain="+b.domain:"",b.secure?"; secure":""].join(""))}b=e||{};var a,f=b.raw?function(h){return h}:decodeURIComponent;return(a=new RegExp("(?:^|; )"+encodeURIComponent(d)+"=([^;]*)").exec(document.cookie))?f(a[1]):null};






/*
 * jQuery Pines Notify (pnotify) Plugin 1.1.1
 *
 * http://pinesframework.org/pnotify/
 * Copyright (c) 2009-2012 Hunter Perrin
 *
 * Triple license under the GPL, LGPL, and MPL:
 *	  http://www.gnu.org/licenses/gpl.html
 *	  http://www.gnu.org/licenses/lgpl.html
 *	  http://www.mozilla.org/MPL/MPL-1.1.html
 */
(function(d){var p,i,o=d("body"),h=d(window),q=function(){o=d("body");h=d(window);h.bind("resize",function(){i&&clearTimeout(i);i=setTimeout(d.pnotify_position_all,10)})};o.length?q():d(q);d.extend({pnotify_remove_all:function(){var e=h.data("pnotify");e&&e.length&&d.each(e,function(){this.pnotify_remove&&this.pnotify_remove()})},pnotify_position_all:function(){i&&clearTimeout(i);i=null;var e=h.data("pnotify");e&&e.length&&(d.each(e,function(){var d=this.opts.pnotify_stack;if(d)d.nextpos1=d.firstpos1,d.nextpos2=d.firstpos2,d.addpos2=0,d.animation=true}),d.each(e,function(){this.pnotify_position()}))},pnotify:function(e){var f,a;typeof e!="object"?(a=d.extend({},d.pnotify.defaults),a.pnotify_text=e):a=d.extend({},d.pnotify.defaults,e);if(a.pnotify_before_init&&a.pnotify_before_init(a)===false)return null;var j,n=function(a,c){b.css("display","none");var e=document.elementFromPoint(a.clientX,a.clientY);b.css("display","block");var f=d(e),h=f.css("cursor");b.css("cursor",h!="auto"?h:"default");if(!j||j.get(0)!=e)j&&(m.call(j.get(0),"mouseleave",a.originalEvent),m.call(j.get(0),"mouseout",a.originalEvent)),m.call(e,"mouseenter",a.originalEvent),m.call(e,"mouseover",a.originalEvent);m.call(e,c,a.originalEvent);j=f},b=d("<div />",{"class":"ui-pnotify "+a.pnotify_addclass,css:{display:"none"},mouseenter:function(k){a.pnotify_nonblock&&k.stopPropagation();a.pnotify_mouse_reset&&f=="out"&&(b.stop(true),f="in",b.css("height","auto").animate({width:a.pnotify_width,opacity:a.pnotify_nonblock?a.pnotify_nonblock_opacity:a.pnotify_opacity},"fast"));a.pnotify_nonblock&&b.animate({opacity:a.pnotify_nonblock_opacity},"fast");a.pnotify_hide&&a.pnotify_mouse_reset&&b.pnotify_cancel_remove();a.pnotify_sticker&&!a.pnotify_nonblock&&b.sticker.trigger("pnotify_icon").show();a.pnotify_closer&&!a.pnotify_nonblock&&b.closer.show()},mouseleave:function(k){a.pnotify_nonblock&&k.stopPropagation();j=null;b.css("cursor","auto");a.pnotify_nonblock&&f!="out"&&b.animate({opacity:a.pnotify_opacity},"fast");a.pnotify_hide&&a.pnotify_mouse_reset&&b.pnotify_queue_remove();a.pnotify_sticker_hover&&b.sticker.hide();a.pnotify_closer_hover&&b.closer.hide();d.pnotify_position_all()},mouseover:function(b){a.pnotify_nonblock&&b.stopPropagation()},mouseout:function(b){a.pnotify_nonblock&&b.stopPropagation()},mousemove:function(b){a.pnotify_nonblock&&(b.stopPropagation(),n(b,"onmousemove"))},mousedown:function(b){a.pnotify_nonblock&&(b.stopPropagation(),b.preventDefault(),n(b,"onmousedown"))},mouseup:function(b){a.pnotify_nonblock&&(b.stopPropagation(),b.preventDefault(),n(b,"onmouseup"))},click:function(b){a.pnotify_nonblock&&(b.stopPropagation(),n(b,"onclick"))},dblclick:function(b){a.pnotify_nonblock&&(b.stopPropagation(),n(b,"ondblclick"))}});b.opts=a;if(a.pnotify_shadow&&!d.browser.msie)b.shadow_container=d("<div />",{"class":"ui-widget-shadow ui-pnotify-shadow"}).prependTo(b),a.pnotify_cornerclass!=""&&b.shadow_container.addClass(a.pnotify_cornerclass);b.container=d("<div />",{"class":"ui-widget ui-widget-content ui-pnotify-container "+(a.pnotify_type=="error"?"ui-state-error":a.pnotify_type=="info"?"":"ui-state-highlight")}).appendTo(b);a.pnotify_cornerclass!=""&&b.container.addClass(a.pnotify_cornerclass);b.pnotify_version="1.1.1";b.pnotify=function(k){var c=a;typeof k=="string"?a.pnotify_text=k:a=d.extend({},a,k);b.opts=a;if(a.pnotify_shadow!=c.pnotify_shadow)a.pnotify_shadow&&!d.browser.msie?b.shadow_container=d("<div />",{"class":"ui-widget-shadow ui-pnotify-shadow"}).prependTo(b):b.children(".ui-pnotify-shadow").remove();a.pnotify_addclass===false?b.removeClass(c.pnotify_addclass):a.pnotify_addclass!==c.pnotify_addclass&&b.removeClass(c.pnotify_addclass).addClass(a.pnotify_addclass);a.pnotify_title===false?b.title_container.hide("fast"):a.pnotify_title!==c.pnotify_title&&(a.pnotify_title_escape?b.title_container.text(a.pnotify_title).show(200):b.title_container.html(a.pnotify_title).show(200));a.pnotify_text===false?b.text_container.hide("fast"):a.pnotify_text!==c.pnotify_text&&(a.pnotify_text_escape?b.text_container.text(a.pnotify_text).show(200):b.text_container.html(a.pnotify_insert_brs?String(a.pnotify_text).replace(/\n/g,"<br />"):a.pnotify_text).show(200));b.pnotify_history=a.pnotify_history;b.pnotify_hide=a.pnotify_hide;a.pnotify_type!=c.pnotify_type&&b.container.removeClass("ui-state-error ui-state-highlight").addClass(a.pnotify_type=="error"?"ui-state-error":a.pnotify_type=="info"?"":"ui-state-highlight");if(a.pnotify_notice_icon!=c.pnotify_notice_icon&&a.pnotify_type=="notice"||a.pnotify_info_icon!=c.pnotify_info_icon&&a.pnotify_type=="info"||a.pnotify_error_icon!=c.pnotify_error_icon&&a.pnotify_type=="error"||a.pnotify_type!=c.pnotify_type)if(b.container.find("div.ui-pnotify-icon").remove(),a.pnotify_error_icon&&a.pnotify_type=="error"||a.pnotify_info_icon&&a.pnotify_type=="info"||a.pnotify_notice_icon)d("<div />",{"class":"ui-pnotify-icon"}).append(d("<span />",{"class":a.pnotify_type=="error"?a.pnotify_error_icon:a.pnotify_type=="info"?a.pnotify_info_icon:a.pnotify_notice_icon})).prependTo(b.container);a.pnotify_width!==c.pnotify_width&&b.animate({width:a.pnotify_width});a.pnotify_min_height!==c.pnotify_min_height&&b.container.animate({minHeight:a.pnotify_min_height});a.pnotify_opacity!==c.pnotify_opacity&&b.fadeTo(a.pnotify_animate_speed,a.pnotify_opacity);b.sticker.trigger("pnotify_icon");a.pnotify_sticker_hover?b.sticker.hide():a.pnotify_nonblock||b.sticker.show();a.pnotify_closer_hover?b.closer.hide():a.pnotify_nonblock||b.closer.show();a.pnotify_hide?c.pnotify_hide||b.pnotify_queue_remove():b.pnotify_cancel_remove();b.pnotify_queue_position();return b};b.pnotify_position=function(a){var c=b.opts.pnotify_stack;if(c){if(!c.nextpos1)c.nextpos1=c.firstpos1;if(!c.nextpos2)c.nextpos2=c.firstpos2;if(!c.addpos2)c.addpos2=0;if(b.css("display")!="none"||a){var d,e={},f;switch(c.dir1){case "down":f="top";break;case "up":f="bottom";break;case "left":f="right";break;case "right":f="left"}a=parseInt(b.css(f));isNaN(a)&&(a=0);if(typeof c.firstpos1=="undefined")c.firstpos1=a,c.nextpos1=c.firstpos1;var g;switch(c.dir2){case "down":g="top";break;case "up":g="bottom";break;case "left":g="right";break;case "right":g="left"}d=parseInt(b.css(g));isNaN(d)&&(d=0);if(typeof c.firstpos2=="undefined")c.firstpos2=d,c.nextpos2=c.firstpos2;if(c.dir1=="down"&&c.nextpos1+b.height()>h.height()||c.dir1=="up"&&c.nextpos1+b.height()>h.height()||c.dir1=="left"&&c.nextpos1+b.width()>h.width()||c.dir1=="right"&&c.nextpos1+b.width()>h.width())c.nextpos1=c.firstpos1,c.nextpos2+=c.addpos2+(typeof c.spacing2=="undefined"?10:c.spacing2),c.addpos2=0;if(c.animation&&c.nextpos2<d)switch(c.dir2){case "down":e.top=c.nextpos2+"px";break;case "up":e.bottom=c.nextpos2+"px";break;case "left":e.right=c.nextpos2+"px";break;case "right":e.left=c.nextpos2+"px"}else b.css(g,c.nextpos2+"px");switch(c.dir2){case "down":case "up":if(b.outerHeight(true)>c.addpos2)c.addpos2=b.height();break;case "left":case "right":if(b.outerWidth(true)>c.addpos2)c.addpos2=b.width()}if(c.nextpos1)if(c.animation&&(a>c.nextpos1||e.top||e.bottom||e.right||e.left))switch(c.dir1){case "down":e.top=c.nextpos1+"px";break;case "up":e.bottom=c.nextpos1+"px";break;case "left":e.right=c.nextpos1+"px";break;case "right":e.left=c.nextpos1+"px"}else b.css(f,c.nextpos1+"px");(e.top||e.bottom||e.right||e.left)&&b.animate(e,{duration:500,queue:false});switch(c.dir1){case "down":case "up":c.nextpos1+=b.height()+(typeof c.spacing1=="undefined"?10:c.spacing1);break;case "left":case "right":c.nextpos1+=b.width()+(typeof c.spacing1=="undefined"?10:c.spacing1)}}}};b.pnotify_queue_position=function(a){i&&clearTimeout(i);a||(a=10);i=setTimeout(d.pnotify_position_all,a)};b.pnotify_display=function(){b.parent().length||b.appendTo(o);a.pnotify_before_open&&a.pnotify_before_open(b)===false||(a.pnotify_stack.push!="top"&&b.pnotify_position(true),a.pnotify_animation=="fade"||a.pnotify_animation.effect_in=="fade"?b.show().fadeTo(0,0).hide():a.pnotify_opacity!=1&&b.show().fadeTo(0,a.pnotify_opacity).hide(),b.animate_in(function(){a.pnotify_after_open&&a.pnotify_after_open(b);b.pnotify_queue_position();a.pnotify_hide&&b.pnotify_queue_remove()}))};b.pnotify_remove=function(){if(b.timer)window.clearTimeout(b.timer),b.timer=null;a.pnotify_before_close&&a.pnotify_before_close(b)===false||b.animate_out(function(){a.pnotify_after_close&&a.pnotify_after_close(b)===false||(b.pnotify_queue_position(),a.pnotify_remove&&b.detach())})};b.animate_in=function(d){f="in";var c;c=typeof a.pnotify_animation.effect_in!="undefined"?a.pnotify_animation.effect_in:a.pnotify_animation;c=="none"?(b.show(),d()):c=="show"?b.show(a.pnotify_animate_speed,d):c=="fade"?b.show().fadeTo(a.pnotify_animate_speed,a.pnotify_opacity,d):c=="slide"?b.slideDown(a.pnotify_animate_speed,d):typeof c=="function"?c("in",d,b):b.show(c,typeof a.pnotify_animation.options_in=="object"?a.pnotify_animation.options_in:{},a.pnotify_animate_speed,d)};b.animate_out=function(d){f="out";var c;c=typeof a.pnotify_animation.effect_out!="undefined"?a.pnotify_animation.effect_out:a.pnotify_animation;c=="none"?(b.hide(),d()):c=="show"?b.hide(a.pnotify_animate_speed,d):c=="fade"?b.fadeOut(a.pnotify_animate_speed,d):c=="slide"?b.slideUp(a.pnotify_animate_speed,d):typeof c=="function"?c("out",d,b):b.hide(c,typeof a.pnotify_animation.options_out=="object"?a.pnotify_animation.options_out:{},a.pnotify_animate_speed,d)};b.pnotify_cancel_remove=function(){b.timer&&window.clearTimeout(b.timer)};b.pnotify_queue_remove=function(){b.pnotify_cancel_remove();b.timer=window.setTimeout(function(){b.pnotify_remove()},isNaN(a.pnotify_delay)?0:a.pnotify_delay)};b.closer=d("<div />",{"class":"ui-pnotify-closer",css:{cursor:"pointer",display:a.pnotify_closer_hover?"none":"block"},click:function(){b.pnotify_remove();b.sticker.hide();b.closer.hide()}}).append(d("<span />",{"class":"ui-icon ui-icon-close"})).appendTo(b.container);b.sticker=d("<div />",{"class":"ui-pnotify-sticker",css:{cursor:"pointer",display:a.pnotify_sticker_hover?"none":"block"},click:function(){a.pnotify_hide=!a.pnotify_hide;a.pnotify_hide?b.pnotify_queue_remove():b.pnotify_cancel_remove();d(this).trigger("pnotify_icon")}}).bind("pnotify_icon",function(){d(this).children().removeClass("ui-icon-pin-w ui-icon-pin-s").addClass(a.pnotify_hide?"ui-icon-pin-w":"ui-icon-pin-s")}).append(d("<span />",{"class":"ui-icon ui-icon-pin-w"})).appendTo(b.container);if(a.pnotify_error_icon&&a.pnotify_type=="error"||a.pnotify_info_icon&&a.pnotify_type=="info"||a.pnotify_notice_icon)d("<div />",{"class":"ui-pnotify-icon"}).append(d("<span />",{"class":a.pnotify_type=="error"?a.pnotify_error_icon:a.pnotify_type=="info"?a.pnotify_info_icon:a.pnotify_notice_icon})).appendTo(b.container);b.title_container=d("<div />",{"class":"ui-pnotify-title"}).appendTo(b.container);a.pnotify_title===false?b.title_container.hide():a.pnotify_title_escape?b.title_container.text(a.pnotify_title):b.title_container.html(a.pnotify_title);b.text_container=d("<div />",{"class":"ui-pnotify-text"}).appendTo(b.container);a.pnotify_text===false?b.text_container.hide():a.pnotify_text_escape?b.text_container.text(a.pnotify_text):b.text_container.html(a.pnotify_insert_brs?String(a.pnotify_text).replace(/\n/g,"<br />"):a.pnotify_text);typeof a.pnotify_width=="string"&&b.css("width",a.pnotify_width);typeof a.pnotify_min_height=="string"&&b.container.css("min-height",a.pnotify_min_height);b.pnotify_history=a.pnotify_history;b.pnotify_hide=a.pnotify_hide;var g=h.data("pnotify");if(g==null||typeof g!="object")g=[];g=a.pnotify_stack.push=="top"?d.merge([b],g):d.merge(g,[b]);h.data("pnotify",g);a.pnotify_stack.push=="top"&&b.pnotify_queue_position(1);a.pnotify_after_init&&a.pnotify_after_init(b);if(a.pnotify_history){var l=h.data("pnotify_history");typeof l=="undefined"&&(l=d("<div />",{"class":"ui-pnotify-history-container ui-state-default ui-corner-bottom",mouseleave:function(){l.animate({top:"-"+p+"px"},{duration:100,queue:false})}}).append(d("<div />",{"class":"ui-pnotify-history-header",text:"Redisplay"})).append(d("<button />",{"class":"ui-pnotify-history-all ui-state-default ui-corner-all",text:"All",mouseenter:function(){d(this).addClass("ui-state-hover")},mouseleave:function(){d(this).removeClass("ui-state-hover")},click:function(){d.each(g,function(){this.pnotify_history&&(this.is(":visible")?this.pnotify_hide&&this.pnotify_queue_remove():this.pnotify_display&&this.pnotify_display())});return false}})).append(d("<button />",{"class":"ui-pnotify-history-last ui-state-default ui-corner-all",text:"Last",mouseenter:function(){d(this).addClass("ui-state-hover")},mouseleave:function(){d(this).removeClass("ui-state-hover")},click:function(){var a=-1,b;do{b=a==-1?g.slice(a):g.slice(a,a+1);if(!b[0])break;a--}while(!b[0].pnotify_history||b[0].is(":visible"));if(!b[0])return false;b[0].pnotify_display&&b[0].pnotify_display();return false}})).appendTo(o),p=d("<span />",{"class":"ui-pnotify-history-pulldown ui-icon ui-icon-grip-dotted-horizontal",mouseenter:function(){l.animate({top:"0"},{duration:100,queue:false})}}).appendTo(l).offset().top+2,l.css({top:"-"+p+"px"}),h.data("pnotify_history",l))}a.pnotify_stack.animation=false;b.pnotify_display();return b}});var r=/^on/,s=/^(dbl)?click$|^mouse(move|down|up|over|out|enter|leave)$|^contextmenu$/,t=/^(focus|blur|select|change|reset)$|^key(press|down|up)$/,u=/^(scroll|resize|(un)?load|abort|error)$/,m=function(e,f){var a,e=e.toLowerCase();document.createEvent&&this.dispatchEvent?(e=e.replace(r,""),e.match(s)?(d(this).offset(),a=document.createEvent("MouseEvents"),a.initMouseEvent(e,f.bubbles,f.cancelable,f.view,f.detail,f.screenX,f.screenY,f.clientX,f.clientY,f.ctrlKey,f.altKey,f.shiftKey,f.metaKey,f.button,f.relatedTarget)):e.match(t)?(a=document.createEvent("UIEvents"),a.initUIEvent(e,f.bubbles,f.cancelable,f.view,f.detail)):e.match(u)&&(a=document.createEvent("HTMLEvents"),a.initEvent(e,f.bubbles,f.cancelable)),a&&this.dispatchEvent(a)):(e.match(r)||(e="on"+e),a=document.createEventObject(f),this.fireEvent(e,a))};d.pnotify.defaults={pnotify_title:false,pnotify_title_escape:false,pnotify_text:false,pnotify_text_escape:false,pnotify_addclass:"",pnotify_cornerclass:"ui-corner-all",pnotify_nonblock:false,pnotify_nonblock_opacity:0.2,pnotify_history:true,pnotify_width:"300px",pnotify_min_height:"16px",pnotify_type:"notice",pnotify_notice_icon:"ui-icon ui-icon-info",pnotify_info_icon:"ui-icon ui-icon-info",pnotify_error_icon:"ui-icon ui-icon-alert",pnotify_animation:"fade",pnotify_animate_speed:"slow",pnotify_opacity:1,pnotify_shadow:false,pnotify_closer:true,pnotify_closer_hover:true,pnotify_sticker:true,pnotify_sticker_hover:true,pnotify_hide:true,pnotify_delay:8E3,pnotify_mouse_reset:true,pnotify_remove:true,pnotify_insert_brs:true,pnotify_stack:{dir1:"down",dir2:"left",push:"bottom",spacing1:10,spacing2:10}}})(jQuery);


/*!
 * mustache.js - Logic-less {{mustache}} templates with JavaScript
 * http://github.com/janl/mustache.js
 */
var Mustache=(typeof module!=="undefined"&&module.exports)||{};(function(w){w.name="mustache.js";w.version="0.5.0-dev";w.tags=["{{","}}"];w.parse=m;w.compile=e;w.render=v;w.clearCache=u;w.to_html=function(A,y,z,B){var x=v(A,y,z);if(typeof B==="function"){B(x)}else{return x}};var s=Object.prototype.toString;var f=Array.isArray;var b=Array.prototype.forEach;var g=String.prototype.trim;var i;if(f){i=f}else{i=function(x){return s.call(x)==="[object Array]"}}var r;if(b){r=function(y,z,x){return b.call(y,z,x)}}else{r=function(A,B,z){for(var y=0,x=A.length;y<x;++y){B.call(z,A[y],y,A)}}}var k=/^\s*$/;function c(x){return k.test(x)}var p;if(g){p=function(x){return x==null?"":g.call(x)}}else{var n,h;if(c("\xA0")){n=/^\s+/;h=/\s+$/}else{n=/^[\s\xA0]+/;h=/[\s\xA0]+$/}p=function(x){return x==null?"":String(x).replace(n,"").replace(h,"")}}var d={"&":"&amp;","<":"<",">":">",'"':"&quot;","'":"&#39;"};function o(x){return String(x).replace(/&(?!\w+;)|[<>"']/g,function(y){return d[y]||y})}function l(D,F,G,z){z=z||"<template>";var H=F.split("\n"),x=Math.max(G-3,0),A=Math.min(H.length,G+3),y=H.slice(x,A);var E;for(var B=0,C=y.length;B<C;++B){E=B+x+1;y[B]=(E===G?" >> ":"    ")+y[B]}D.template=F;D.line=G;D.file=z;D.message=[z+":"+G,y.join("\n"),"",D.message].join("\n");return D}function t(x,F,E){if(x==="."){return F[F.length-1]}var D=x.split(".");var B=D.length-1;var C=D[B];var G,y,A=F.length,z,H;while(A){H=F.slice(0);y=F[--A];z=0;while(z<B){y=y[D[z++]];if(y==null){break}H.push(y)}if(y&&typeof y==="object"&&C in y){G=y[C];break}}if(typeof G==="function"){G=G.call(H[H.length-1])}if(G==null){return E}return G}function j(A,x,E,z){var y="";var C=t(A,x);if(z){if(C==null||C===false||(i(C)&&C.length===0)){y+=E()}}else{if(i(C)){r(C,function(F){x.push(F);y+=E();x.pop()})}else{if(typeof C==="object"){x.push(C);y+=E();x.pop()}else{if(typeof C==="function"){var B=x[x.length-1];var D=function(F){return v(F,B)};y+=C.call(B,E(),D)||""}else{if(C){y+=E()}}}}}return y}function m(Z,B){B=B||{};var K=B.tags||w.tags,L=K[0],G=K[K.length-1];var y=['var buffer = "";',"\nvar line = 1;","\ntry {",'\nbuffer += "'];var F=[],aa=false,X=false;var V=function(){if(aa&&!X&&!B.space){while(F.length){y.splice(F.pop(),1)}}else{F=[]}aa=false;X=false};var S=[],P,C,M;var U=function(ab){K=p(ab).split(/\s+/);C=K[0];M=K[K.length-1]};var J=function(ab){y.push('";',P,'\nvar partial = partials["'+p(ab)+'"];',"\nif (partial) {","\n  buffer += render(partial,stack[stack.length - 1],partials);","\n}",'\nbuffer += "')};var x=function(ad,ab){var ac=p(ad);if(ac===""){throw l(new Error("Section name may not be empty"),Z,I,B.file)}S.push({name:ac,inverted:ab});y.push('";',P,'\nvar name = "'+ac+'";',"\nvar callback = (function () {","\n  return function () {",'\n    var buffer = "";','\nbuffer += "')};var E=function(ab){x(ab,true)};var T=function(ac){var ab=p(ac);var ae=S.length!=0&&S[S.length-1].name;if(!ae||ab!=ae){throw l(new Error('Section named "'+ab+'" was never opened'),Z,I,B.file)}var ad=S.pop();y.push('";',"\n    return buffer;","\n  };","\n})();");if(ad.inverted){y.push("\nbuffer += renderSection(name,stack,callback,true);")}else{y.push("\nbuffer += renderSection(name,stack,callback);")}y.push('\nbuffer += "')};var W=function(ab){y.push('";',P,'\nbuffer += lookup("'+p(ab)+'",stack,"");','\nbuffer += "')};var z=function(ab){y.push('";',P,'\nbuffer += escapeHTML(lookup("'+p(ab)+'",stack,""));','\nbuffer += "')};var I=1,Y,D;for(var Q=0,R=Z.length;Q<R;++Q){if(Z.slice(Q,Q+L.length)===L){Q+=L.length;Y=Z.substr(Q,1);P="\nline = "+I+";";C=L;M=G;aa=true;switch(Y){case"!":Q++;D=null;break;case"=":Q++;G="="+G;D=U;break;case">":Q++;D=J;break;case"#":Q++;D=x;break;case"^":Q++;D=E;break;case"/":Q++;D=T;break;case"{":G="}"+G;case"&":Q++;X=true;D=W;break;default:X=true;D=z}var A=Z.indexOf(G,Q);if(A===-1){throw l(new Error('Tag "'+L+'" was not closed properly'),Z,I,B.file)}var O=Z.substring(Q,A);if(D){D(O)}var N=0;while(~(N=O.indexOf("\n",N))){I++;N++}Q=A+G.length-1;L=C;G=M}else{Y=Z.substr(Q,1);switch(Y){case'"':case"\\":X=true;y.push("\\"+Y);break;case"\r":break;case"\n":F.push(y.length);y.push("\\n");V();I++;break;default:if(c(Y)){F.push(y.length)}else{X=true}y.push(Y)}}}if(S.length!=0){throw l(new Error('Section "'+S[S.length-1].name+'" was not closed properly'),Z,I,B.file)}V();y.push('";',"\nreturn buffer;","\n} catch (e) { throw {error: e, line: line}; }");var H=y.join("").replace(/buffer \+= "";\n/g,"");if(B.debug){if(typeof console!="undefined"&&console.log){console.log(H)}else{if(typeof print==="function"){print(H)}}}return H}function q(B,z){var y="view,partials,stack,lookup,escapeHTML,renderSection,render";var x=m(B,z);var A=new Function(y,x);return function(D,E){E=E||{};var C=[D];try{return A(D,E,C,t,o,j,v)}catch(F){throw l(F.error,B,F.line,z.file)}}}var a={};function u(){a={}}function e(y,x){x=x||{};if(x.cache!==false){if(!a[y]){a[y]=q(y,x)}return a[y]}return q(y,x)}function v(z,x,y){return e(z)(x,y)}})(Mustache);


/*
    json2.js
    2011-10-19

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint evil: true, regexp: true */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.
var JSON;if(!JSON){JSON={}}(function(){function f(n){return n<10?"0"+n:n}if(typeof Date.prototype.toJSON!=="function"){Date.prototype.toJSON=function(key){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(key){return this.valueOf()}}var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;function quote(string){escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];return typeof c==="string"?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+string+'"'}function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==="object"&&typeof value.toJSON==="function"){value=value.toJSON(key)}if(typeof rep==="function"){value=rep.call(holder,key,value)}switch(typeof value){case"string":return quote(value);case"number":return isFinite(value)?String(value):"null";case"boolean":case"null":return String(value);case"object":if(!value){return"null"}gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==="[object Array]"){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||"null"}v=partial.length===0?"[]":gap?"[\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"]":"["+partial.join(",")+"]";gap=mind;return v}if(rep&&typeof rep==="object"){length=rep.length;for(i=0;i<length;i+=1){if(typeof rep[i]==="string"){k=rep[i];v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}else{for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}v=partial.length===0?"{}":gap?"{\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"}":"{"+partial.join(",")+"}";gap=mind;return v}}if(typeof JSON.stringify!=="function"){JSON.stringify=function(value,replacer,space){var i;gap="";indent="";if(typeof space==="number"){for(i=0;i<space;i+=1){indent+=" "}}else{if(typeof space==="string"){indent=space}}rep=replacer;if(replacer&&typeof replacer!=="function"&&(typeof replacer!=="object"||typeof replacer.length!=="number")){throw new Error("JSON.stringify")}return str("",{"":value})}}if(typeof JSON.parse!=="function"){JSON.parse=function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==="object"){for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v}else{delete value[k]}}}}return reviver.call(holder,key,value)}text=String(text);cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})}if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){j=eval("("+text+")");return typeof reviver==="function"?walk({"":j},""):j}throw new SyntaxError("JSON.parse")}}}());