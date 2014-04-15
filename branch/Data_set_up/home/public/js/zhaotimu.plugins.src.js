
//jQuery.Tools.Form定义代码开始======================================================================================

//验证重复密码
$.tools.validator.fn("[data-equals]", function(input) {
	var name = input.attr("data-equals"),
	field = this.getInputs().filter("[name=" + name + "]"); 
	var strict = input.attr("strict");
	iv = (strict=="true")?input.val():input.val().toLowerCase();
	fv = (strict=="true")?field.val():field.val().toLowerCase();
	return (iv == fv) ? true : {
		cn: "此处输入与上面不同"
	}; 
});

//验证最小长度
$.tools.validator.fn("[minlength]", function(input, value) {
	var min = input.attr("minlength");	
	return value.replace(/[^\x00-\xff]/g,"xx").length >= min ? true : {
		cn: "请至少输入" + min + "个字符"
	};
});

//验证最大长度
$.tools.validator.fn("[maxlength]", function(input, value) {
	var max = input.attr("maxlength");	
	return value.replace(/[^\x00-\xff]/g,"xx").length <= max ? true : {
		cn: "最多可输入8个中文字"
	};
});

//定义出错的提示语
$.tools.validator.localize("cn", {
	'*'			    : '你的输入不符合要求',
	':email'  		: '请输入正确的邮箱地址',
	'[required]' 	: '这里的输入不能为空'
});


//用户注册页面
var RegisterAction = function(form){

	//补充的ajax实时验证，注意要把邮箱验证那个也写成
	form.find("input[ajaxrequest]").blur(function () {
		var o = $(this);
		var name = o.attr("ajaxrequest");
		var value = o.val();
		if (value != "") {
			ajaxFunction[name]({ v: value }, function (data) {
				if (data!= 0) {
					err = errorMsg(data);
					s = o.attr("name");
					if (s == "nickname") form.data("validator").invalidate({ "nickname": err });
					if (s == "email") form.data("validator").invalidate({ "email": err });
				}
			});
		}
	});

	//补充全角转半角
	form.find("input[name=nickname], input[name=email]").blur(function (){$(this).val($(this).val().DBC2SBC());});

	//用户点击提交按钮的时候，再次获得服务器端验证结果
	form.validator({ lang: 'cn', inputEvent: 'blur', errorInputEvent: 'blur', offset: [-40, -125], messageClass:'reg-error' }).submit(function (e) {
	
		// client-side validation OK.
		if (!e.isDefaultPrevented()) {
			ajaxFunction["Register"]({
				nickname: form.find("input[name=nickname]").val(),
				psd: form.find("input[name=password]").val(),
				role: form.find("input[name=role]:checked").val(),
				email: form.find("input[name=email]").val()
			}, function (data) {
				if (data==0) {
					//window.location.href = "register-success.html";
				} else {
					form.data("validator").invalidate(false);
				}
			});
			// prevent default form submission logic
			e.preventDefault();
		}

	});
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
(function($){	

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

})(jQuery);


 /*
 * jQuery.ZTM.scrollFollow
 *
 * lanslot wrote in 2012-5-5
 * 
 * @param container, string, 容器div的选择器
 * @param fix, array, 修正的大小【上,下,左,右】
 * 注意代码里面所有的定位数组全部都是【上,下,左,右】
 * 注意此插件必须给出container参数
 */
(function($){	

	$.fn.scrollFollow = function(options) { 
		var defaults = {
			container:"#container",
			fix:[0,0,0,0]
		};
		var settings = $.extend({}, defaults, options);		
		
		//返回一个元素的上下左右边距
		var getBorder = function(o){return [o.offset().top,o.offset().top+o.height(),o.offset().left,o.offset().left+o.width()];};
		
		//计算实际的容器控制范围
		var calSize = function(pos,fix){return [pos[0]+fix[0],pos[1]+fix[1],pos[2]+fix[2],pos[3]+fix[3]];};
		
		var initPosition = function(o,pos){
			o.width(pos[3]-pos[2]);
			o.height($(window).height()-pos[0]);
			o.offset({top:pos[0],left:pos[2]});
		};				
		
		this.each(function() {  
			var o = $(this);
			var obj = $(settings.container);			
			var fix = settings.fix;
			var pos = getBorder($(settings.container));		
			var exact = calSize(pos,fix);		
	
			//开始初始化
			initPosition(o,exact);
			
			//浏览器窗口大小变化时，变更区域大小
			$(window).resize(function(){
				//修正container的位置
				pos = getBorder($(settings.container));
				//修正实际位置
				exact = calSize(pos,fix);			
				//重新载入位置
				initPosition(o,exact);
			});	
	
			//浏览器滚动条滚动时
			$(window).scroll(function(){
				//首先在滚动高度小于ListFollow整体距离顶部高度的时候
				if($(window).scrollTop()<exact[0]){
					if(o.css("position")!="absolute" || o.offset().top!=exact[0]){
						o.css("position","absolute");
						o.offset({top:exact[0]});
					}
					o.height($(window).height()-exact[0]+$(window).scrollTop());	
				}else{
					
					if($(window).scrollTop()+$(window).height()>exact[1]){
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
						}else{
							//非ie6都支持fixed属性				
							if(o.css("position")!="fixed" || o.css("top")!="0"){
								o.css("position","fixed");
								o.css("top","0");
							}
						}					
					}
				}
			});		
			
		});  
		return this;  
	};

})(jQuery);




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


jQuery.fn.selectToUISlider = function(settings){
	var selects = jQuery(this);
	
	//accessible slider options
	var options = jQuery.extend({
		labels: 3, //number of visible labels
		tooltip: true, //show tooltips, boolean
		tooltipSrc: 'text',//accepts 'value' as well
		labelSrc: 'value',//accepts 'value' as well	,
		sliderOptions: null
	}, settings);


	//handle ID attrs - selects each need IDs for handles to find them
	var handleIds = (function(){
		var tempArr = [];
		selects.each(function(){
			tempArr.push('handle_'+jQuery(this).attr('id'));
		});
		return tempArr;
	})();
	
	//array of all option elements in select element (ignores optgroups)
	var selectOptions = (function(){
		var opts = [];
		selects.eq(0).find('option').each(function(){
			opts.push({
				value: jQuery(this).attr('value'),
				text: jQuery(this).text()
			});
		});
		return opts;
	})();
	
	//array of opt groups if present
	var groups = (function(){
		if(selects.eq(0).find('optgroup').size()>0){
			var groupedData = [];
			selects.eq(0).find('optgroup').each(function(i){
				groupedData[i] = {};
				groupedData[i].label = jQuery(this).attr('label');
				groupedData[i].options = [];
				jQuery(this).find('option').each(function(){
					groupedData[i].options.push({text: jQuery(this).text(), value: jQuery(this).attr('value')});
				});
			});
			return groupedData;
		}
		else return null;
	})();	
	
	//check if obj is array
	function isArray(obj) {
		return obj.constructor == Array;
	}
	//return tooltip text from option index
	function ttText(optIndex){
		return (options.tooltipSrc == 'text') ? selectOptions[optIndex].text : selectOptions[optIndex].value;
	}
	
	//plugin-generated slider options (can be overridden)
	var sliderOptions = {
		step: 1,
		min: 0,
		orientation: 'horizontal',
		max: selectOptions.length-1,
		range: selects.length > 1,//multiple select elements = true
		slide: function(e, ui) {//slide function
				var thisHandle = jQuery(ui.handle);
				//handle feedback 
				var textval = ttText(ui.value);
				thisHandle
					.attr('aria-valuetext', textval)
					.attr('aria-valuenow', ui.value)
					.find('.ui-slider-tooltip .ttContent')
					.text( textval );

				//control original select menu
				var currSelect = jQuery('#' + thisHandle.attr('id').split('handle_')[1]);
				currSelect.find('option').eq(ui.value).attr('selected', 'selected');
				
				//add change inside text change
				thisHandle.find("span.screenShowText").html(selectOptions[ui.value].value);
				
		},
		values: (function(){
			var values = [];
			selects.each(function(){
				values.push( jQuery(this).get(0).selectedIndex );
			});
			return values;
		})()
	};
	
	//slider options from settings
	options.sliderOptions = (settings) ? jQuery.extend(sliderOptions, settings.sliderOptions) : sliderOptions;
		
	//select element change event	
	selects.bind('change keyup click', function(){
		var thisIndex = jQuery(this).get(0).selectedIndex;
		var thisHandle = jQuery('#handle_'+ jQuery(this).attr('id'));
		var handleIndex = thisHandle.data('handleNum');
		thisHandle.parents('.ui-slider:eq(0)').slider("values", handleIndex, thisIndex);
	});
	

	//create slider component div
	var sliderComponent = jQuery('<div></div>');

	//CREATE HANDLES
	selects.each(function(i){
		var hidett = '';
		
		//associate label for ARIA
		var thisLabel = jQuery('label[for=' + jQuery(this).attr('id') +']');
		//labelled by aria doesn't seem to work on slider handle. Using title attr as backup
		var labelText = (thisLabel.size()>0) ? 'Slider control for '+ thisLabel.text()+'' : '';
		var thisLabelId = thisLabel.attr('id') || thisLabel.attr('id', 'label_'+handleIds[i]).attr('id');
		
		if( options.tooltip == false ){hidett = ' style="display: none;"';}
		jQuery('<a '+
				'href="#" tabindex="0" '+
				'id="'+handleIds[i]+'" '+
				'class="ui-slider-handle" '+
				'role="slider" '+
				'aria-labelledby="'+thisLabelId+'" '+
				'aria-valuemin="'+options.sliderOptions.min+'" '+
				'aria-valuemax="'+options.sliderOptions.max+'" '+
				'aria-valuenow="'+options.sliderOptions.values[i]+'" '+
				'aria-valuetext="'+ttText(options.sliderOptions.values[i])+'" '+
			'><span class="screenReaderContext">'+labelText+'</span>'+
			'<span class="screenShowText">'+selectOptions[options.sliderOptions.values[i]].value+'</span>'+
			'<span class="ui-slider-tooltip ui-widget-content ui-corner-all"'+ hidett +'><span class="ttContent"></span>'+
				'<span class="ui-tooltip-pointer-down ui-widget-content"><span class="ui-tooltip-pointer-down-inner"></span></span>'+
			'</span></a>')
			.data('handleNum',i)
			.appendTo(sliderComponent);
	});
	
	//CREATE SCALE AND TICS
	
	//write dl if there are optgroups
	if(groups) {
		var inc = 0;
		var scale = sliderComponent.append('<dl class="ui-slider-scale ui-helper-reset" role="presentation"></dl>').find('.ui-slider-scale:eq(0)');
		jQuery(groups).each(function(h){
			scale.append('<dt style="width: '+ (100/groups.length).toFixed(2) +'%' +'; left:'+ (h/(groups.length-1) * 100).toFixed(2)  +'%' +'"><span>'+this.label+'</span></dt>');//class name becomes camelCased label
			var groupOpts = this.options;
			jQuery(this.options).each(function(i){
				var style = (inc == selectOptions.length-1 || inc == 0) ? 'style="display: none;"' : '' ;
				var labelText = (options.labelSrc == 'text') ? groupOpts[i].text : groupOpts[i].value;
				scale.append('<dd style="left:'+ leftVal(inc) +'"><span class="ui-slider-label">'+ labelText +'</span><span class="ui-slider-tic ui-widget-content"'+ style +'></span></dd>');
				inc++;
			});
		});
	}
	//write ol
	else {
		var scale = sliderComponent.append('<ol class="ui-slider-scale ui-helper-reset" role="presentation"></ol>').find('.ui-slider-scale:eq(0)');
		jQuery(selectOptions).each(function(i){
			var style = (i == selectOptions.length-1 || i == 0) ? 'style="display: none;"' : '' ;
			var labelText = (options.labelSrc == 'text') ? this.text : this.value;
			scale.append('<li style="left:'+ leftVal(i) +'"><span class="ui-slider-label">'+ labelText +'</span><span class="ui-slider-tic ui-widget-content"'+ style +'></span></li>');
		});
	}
	
	function leftVal(i){
		return (i/(selectOptions.length-1) * 100).toFixed(2)  +'%';
		
	}
	

	
	
	//show and hide labels depending on labels pref
	//show the last one if there are more than 1 specified
	if(options.labels > 1) sliderComponent.find('.ui-slider-scale li:last span.ui-slider-label, .ui-slider-scale dd:last span.ui-slider-label').addClass('ui-slider-label-show');

	//set increment
	var increm = Math.max(1, Math.round(selectOptions.length / options.labels));
	//show em based on inc
	for(var j=0; j<selectOptions.length; j+=increm){
		if((selectOptions.length - j) > increm){//don't show if it's too close to the end label
			sliderComponent.find('.ui-slider-scale li:eq('+ j +') span.ui-slider-label, .ui-slider-scale dd:eq('+ j +') span.ui-slider-label').addClass('ui-slider-label-show');
		}
	}

	//style the dt's
	sliderComponent.find('.ui-slider-scale dt').each(function(i){
		jQuery(this).css({
			'left': ((100 /( groups.length))*i).toFixed(2) + '%'
		});
	});
	

	//inject and return 
	sliderComponent
	.insertAfter(jQuery(this).eq(this.length-1))
	.slider(options.sliderOptions)
	.attr('role','application')
	.find('.ui-slider-label')
	.each(function(){
		jQuery(this).css('marginLeft', -jQuery(this).width()/2);
	});
	
	//update tooltip arrow inner color
	sliderComponent.find('.ui-tooltip-pointer-down-inner').each(function(){
				var bWidth = jQuery('.ui-tooltip-pointer-down-inner').css('borderTopWidth');
				var bColor = jQuery(this).parents('.ui-slider-tooltip').css('backgroundColor')
				jQuery(this).css('border-top', bWidth+' solid '+bColor);
	});
	
	var values = sliderComponent.slider('values');
	
	if(isArray(values)){
		jQuery(values).each(function(i){
			sliderComponent.find('.ui-slider-tooltip .ttContent').eq(i).text( ttText(this) );
		});
	}
	else {
		sliderComponent.find('.ui-slider-tooltip .ttContent').eq(0).text( ttText(values) );
	}
	
	return this;
}


