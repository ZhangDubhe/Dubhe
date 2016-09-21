jQuery(document).ready(function(){
	jQuery(".nodeIcon").hover(function(){
		if(jQuery(this).hasClass("openIcon")){
			jQuery(this).removeClass("openIcon").addClass("openHoverIcon");
		}else if(jQuery(this).hasClass("openHoverIcon")){
			jQuery(this).removeClass("openHoverIcon").addClass("openIcon");
		}else if(jQuery(this).hasClass("closeIcon")){
			jQuery(this).removeClass("closeIcon").addClass("closeHoverIcon");
		}else{
			jQuery(this).removeClass("openHoverIcon").addClass("closeIcon");
		}
	}).click(function(evt){
		var close = false;
		if(jQuery(this).hasClass("closeIcon")){
			jQuery(this).removeClass("closeIcon").addClass("openIcon");
			jQuery("tr[parentNode='"+jQuery(this).parent().parent().attr("id")+"']").show();
		}else if(jQuery(this).hasClass("closeHoverIcon")){
			jQuery(this).removeClass("closeHoverIcon").addClass("openHoverIcon");
			jQuery("tr[parentNode='"+jQuery(this).parent().parent().attr("id")+"']").show();
		}else {
			jQuery(this).trigger("closeNode");
		}
		evt.stopPropagation();
	}).bind("closeNode",function(evt){
		if(jQuery(this).hasClass("openIcon")){
			jQuery(this).removeClass("openIcon").addClass("closeIcon");
		}else{
			jQuery(this).removeClass("openHoverIcon").addClass("closeHoverIcon");
		}
		jQuery("tr[parentNode='"+jQuery(this).parent().parent().attr("id")+"']").each(function(){
			jQuery(this).find(".nodeIcon").trigger("closeNode");
		});
		jQuery("tr[parentNode='"+jQuery(this).parent().parent().attr("id")+"']").hide();
		evt.stopPropagation();
	});
	
	jQuery("#electGroupResultsTable tr:not(.electGroupResultHead)").each(function(){
		var tr = jQuery(this);
		var select  = tr.find("select");
		tr.click(function(e,selected){
			if(!selected && e.target.tagName=="TR") return;
			if(select.length==0 && !jQuery(this).attr("hasLesson")) return;
			if(e.target.tagName=="SELECT" || e.target.tagName=="OPTION") return;
			if(!tr.hasClass("trSelected")){
				jQuery("#electGroupResultsTable tr.trSelected").each(function(){
					jQuery(this).removeClass("trSelected");
				});
			}
			tr.toggleClass("trSelected")
			if(selected) tr.addClass("trSelected");
			// TAFFY
			var conditions = {};
			if(tr.hasClass("trSelected")){
				if(!conditions["code"]){
					conditions["code"]= {};
				}
				if(!conditions["courseTypeId"]){
					conditions["courseTypeId"] = {};
				}
				conditions["courseTypeId"]["c"+tr.find("td input.groupCourseTypeId").val()]=true;
				if(select.val()==""){
					select.children().each(function(){
						if(this.value!=""){
							conditions["code"]["c"+this.value] = true;
						}
					});
				}else{
					conditions["code"]["c"+select.val()] = true;
				}
			}
			electCourseTable.init(conditions);
		}).dblclick(function(evt){
			tr.find(".nodeIcon").click();
			evt.stopPropagation();
		});
		if(select.is(":visible")){
			select.change(function(){
				tr.trigger("click",[true]);
			}).mousedown(function(){
				select.data("unkeyup",true);
			}).mouseup(function(){
				select.data("unkeyup",false);
			}).blur(function(){
				select.data("unkeyup",false);
			}).keyup(function(e){
				/*
				if(!select.data("unkeyup")){
					var oldVal = select.val();
					var i = 0;
					if(e.keyCode==39 || e.keyCode==40){
						if(select[0].length>select[0].selectedIndex+1){
							
						}	
					}else if(e.keyCode==37 || e.keyCode==38){
						i = -1;
					}
					if(select[0].selectedIndex-1 > 0
				}
				*/
			});
		}
	});
	
	if(!jQuery.isFunction(jQuery(window).data("_onbeforeunload"))){
		jQuery(window).data("_onbeforeunload",window.onbeforeunload);
	}
	jQuery(window).data("triggerBeforeuUnload",true);
	window.onbeforeunload = function(e){
		var triggerBeforeUnload = true;
		if(typeof jQuery(window).data("triggerBeforeUnload")!="undefined"){
			triggerBeforeUnload = jQuery(window).data("triggerBeforeUnload");
		}
		if(!triggerBeforeUnload) return jQuery(this).data("_onbeforeunload")(e);
		var msg = "你当前还有以下课程类别的学分未选:";
		var flag = false;
		jQuery(".electGroupResult").each(function(){
			var tds = jQuery(this).find("td");
			var electGroupResult = jQuery(this);
			if(jQuery(tds[6]).find("input.requiredCreditsInput").val()>0){
				if(jQuery(".electGroupResult[parentNode='"+electGroupResult.attr("id")+"']").length==0){
					flag = true;
					msg +=("\n"+jQuery(tds[0]).text()+"课程计"+jQuery(tds[6]).find("input.requiredCreditsInput").val()+"学分;")
				}
			}
		});
		if(jQuery.browser.msie){
			if(flag){
				msg +="\n确定退出？";
				return msg;
				jQuery(this).data("_onbeforeunload")(e);
			}
		}else{
			if(flag){
				msg +="\n确定退出？";
				triggerBeforeUnload = confirm(msg);
			}
			if(triggerBeforeUnload && jQuery(this).data("_onbeforeunload")){
				return jQuery(this).data("_onbeforeunload")(e);
			} 
			return triggerBeforeUnload;
		}
	}
//	jQuery("#electFloatBar").show(0);
	jQuery.struts2_jquery.require( [ "js/base/jquery.ui.widget" + jQuery.struts2_jquery.minSuffix + ".js", "js/base/jquery.ui.progressbar" + jQuery.struts2_jquery.minSuffix + ".js" ],function(){
		jQuery("#electProgressbar").progressbar({value:0});
	});
	
	jQuery("#electDialog").bind("showDialog",function(e,html,type){
		var dialog = jQuery(this);
		if(type=="alert"){
			jQuery(this).find("input[name='cancel']").hide();
		}else{
			jQuery(this).find("input[name='cancel']").show();
		}
		jQuery(this).find(".content").html(html);
		if(dialog.width()<150){
			dialog.width(150);
		}
		dialog.css("left",(jQuery(window).width()-dialog.width())/2);
		jQuery(this).prev().width(jQuery(document).width()).height(jQuery(document).height()).show();
		jQuery(this).show();
	}).bind("closeDialog",function(e,returnValue){
		var dialog = jQuery(this);
		dialog.hide().prev().hide();
		return returnValue;
	})
	
	jQuery(".electTab").click(function(){
		var tab = this;
		var showContent;
		jQuery(".electTab").each(function(index){
			var content = jQuery(".electTabContent:eq("+index+")");
			if(this==tab){
				jQuery(this).addClass("electTabSelected");
				showContent = content;
				content.show();
			} else {
				jQuery(this).removeClass("electTabSelected");
				content.hide();
			}
			if(showContent){
				showContent.show(0,function(){
					showContent.height(Math.max(540,showContent.find("table").height()+50));
				});
			}
		});
	});
	//初始化课表单元格
	ElectCourseTable.prototype.initCell = function(cell, weekDayUnitLessonMap){
		jQuery("#electableLessonList thead tr:eq(1) th:first").attr("colspan",2);
		jQuery("#electableLessonList thead tr th input[type='submit']").css("cursor","pointer");
		var weekDay = parseInt(cell.attr("weekDay"), 10);
		var unit = parseInt(cell.attr("unit"), 10);
		var _cellLessons = weekDayUnitLessonMap["" + weekDay]["" + unit];
		if(_cellLessons.length > 0){
			var elected = [];
			
			cell.removeClass("transientOperator");	
			cell.removeClass("defaultElected");
			cell.removeClass("audited");
			var cssClass;
			var audit;
			var hasRetakeLesson = false;
			var hasConflictLesson = false;
			var weekStates = [];
			for(var z = 0; z < _cellLessons.length; z++){
				var lesson = _cellLessons[z];
				if(lesson.elected==true){
					elected[elected.length]=lesson;
				}
				if(lesson.audited==true && electCourseTable.config.needAudit){
					audit = true;
				}
				if(lesson.elected==lesson.defaultElected) {
					if(lesson.elected==true){
						cssClass = "defaultElected";
						if(global.retake.isRetake(lesson.id)) {
							hasRetakeLesson = true;
						}
						for(var zz = 0; zz < lesson.arrangeInfo.length; zz++) {
							var activity = lesson.arrangeInfo[zz];
							if(activity.weekDay == weekDay && activity.startUnit <= unit && unit <= activity.endUnit) {
								weekStates[weekStates.length] = activity.weekState;
								break;
							}
						};
					}
				}else{
					cssClass = "transientOperator";	
				}
			}
			// 重修课的颜色
			if(hasRetakeLesson) {
				global.retake.addStyle(cell);
			} else {
				global.retake.removeStyle(cell);
			}
			// 冲突的颜色
			for(var k = 1; k < weekStates.length; k++) {
				var w1 = weekStates[k - 1];
				var w2 = weekStates[k];
				for(var h = 0; h < w1.length; h++) {
					if(parseInt(parseInt(w1[h], 10) & parseInt(w2[h], 10)) != 0) {
						hasConflictLesson = true;
						break;
					}
				}
			}
			if(hasConflictLesson) {
				global.conflict.addStyle(cell);
			} else {
				global.conflict.removeStyle(cell);
			}
			var html = "";
			if(elected.length==0){
				html = _cellLessons.length;
			}else{
				for(var i=0;i<elected.length;i++){
					var electedLesson = elected[i];
					html += ((i==0) ? "" : "</br>") + electedLesson.name;
				}
			}
			cell.html(html);
			if(cssClass){
				cell.addClass(cssClass);
			}
			if(audit){
				cell.addClass("audited");
			}
		}else{
			cell.removeClass("transientOperator").removeClass("defaultElected");
			cell.html("");
		}
	}

	ElectCourseTable.prototype.showProgressbar = function(callback){
		var electProgressbar = jQuery("#electProgressbar");
		if(electProgressbar.parent().is(":hidden") && electProgressbar.length>0){
			electProgressbar[0].style.left = (jQuery(window).width()-electProgressbar.width())/2 +"px"; 
			electProgressbar.progressbar("value",100);
			var overlay = electProgressbar.parent().prev();
			overlay.show();
			electProgressbar.parent().show();
		}
		if(callback){
			callback();
		}
	}
	
	ElectCourseTable.prototype.progress = function(progressStep){
		var electProgressbar = jQuery("#electProgressbar");
		if(electProgressbar.length>0){
			//electProgressbar.progressbar('value',electProgressbar.progressbar('option', 'value')+progressStep);
		}
	}
	ElectCourseTable.prototype.hideProgressbar = function(){
		var electProgressbar = jQuery("#electProgressbar");
		if(electProgressbar.length>0){
			var overlay = electProgressbar.parent().prev();
			overlay.hide();
			electProgressbar.parent().hide();
		}
		
	}

	//初始化函数
	ElectCourseTable.prototype.init = function(conditions,reInit,callback){
		this.showProgressbar();
		var lessonQuery = this.lessons();
		if(jQuery.isFunction(conditions)){
			callback = conditions;
		}else{
			if(conditions){
				if(!reInit){
					this.filters = [
						function(lesson){
							if(lesson.elected==true || (conditions["courseTypeId"] || {})["c"+lesson.courseTypeId]) return true;
							for(key in conditions){
								if(key=="" || key=="courseTypeId") continue;
								if(!(conditions[key] || {})["c"+lesson[key]]){
									return false;
								}
							}
							return true;
						}
					];
				}
			}
			lessonQuery = this.doFilter(lessonQuery);
		}
		var tip = this.tip;
		
		var electCells = jQuery(this.table).find("tbody tr td.electableCell");
		
		// 初始化 星期，小节 任务分布图
		var _lessons = lessonQuery.get();
		var _weekDayUnitMap = {};
		for(var w = 1; w <= 7; w++) {
			_weekDayUnitMap["" + w] = {};
			for(var u = 1; u <= 14; u++) {
				_weekDayUnitMap["" + w]["" + u] = [];
			}
		}
		for(var i = 0; i < _lessons.length; i++) {
			var _lesson = _lessons[i];
			for(var j = 0; j < _lesson.arrangeInfo.length; j++) {
				var _activity = _lesson.arrangeInfo[j];
				for(var k = _activity.startUnit; k <= _activity.endUnit; k++) {
					var lessonInUnit = false;
					var unitLessons = _weekDayUnitMap["" + _activity.weekDay]["" + k];
					for(var z = 0; z < unitLessons.length; z++) {
						if(unitLessons[z].id == _lesson.id) {
							lessonInUnit = true;
							break;
						}
					}
					if(!lessonInUnit) {
						unitLessons.push(_lesson);
					}
				}
			}
		}
		window._weekDayUnitMap = _weekDayUnitMap;
		// 初始化 星期，小节 任务分布图 完毕
		electCells.each(function(index){
			var cell = jQuery(this);
			var _weekDay = parseInt(cell.attr("weekDay"), 10);
			var _unit = parseInt(cell.attr("unit"), 10);
			electCourseTable.initCell(cell,_weekDayUnitMap);
			
			cell.unbind("click").click(function(evt){
				if(cell.html()!=""){
					if(cell.hasClass("highlightCell")){
						jQuery(".highlightCell").removeClass("highlightCell");
					}
					electCells.removeClass("electCellHover");
					cell.addClass("electCellHover");
					tip.hide();
					tip.data("selectedCell",this);
					tip.setLessons(_weekDayUnitMap["" + _weekDay]["" + _unit], _weekDay, _unit);
					electCourseTable.showTip(cell);
				}
			});
			
			var pct = (electCells.length == 0 ? 0 : (index + 1) / electCells.length);
			electCourseTable.progress(pct);
		});
		this.initLessonList(lessonQuery);
		this.hideProgressbar();
		
		// 课程代码到任务的map
		this._code2Lessons = {};
		var that = this;
		// 初始化课程代码到任务的map
		this.lessons().each(function (l) {
			var _ls = that._code2Lessons[l.code];
			if(!_ls) {
				_ls = [];
				that._code2Lessons[l.code] = _ls;
			}
			_ls.push(l);
		});
	}


	// 返回新的lessonQuery
	ElectCourseTable.prototype.doFilter = function(lessonQuery,filters){
		lessonQuery = lessonQuery || this.lessons();
		filters = filters || this.filters;
		var cons = this.conditions;
		var newLessonQuery = lessonQuery;
		if(cons.length > 0) {
			for(var i = 0; i < cons.length; i++) {
				newLessonQuery = newLessonQuery.filter(cons[i]);
			}
		}
		if(filters.length > 0) {
			newLessonQuery = newLessonQuery.filter(function(){
				for(var i=0;i<filters.length;i++){
					var result = filters[i](this);
					if(!result){
						return false;
					}
				}
				return true;
			});	
		}
		return newLessonQuery;
	};
	
	//排序任务
	ElectCourseTable.prototype.sort = function(compare,lessons,off,len){
		if(!compare) return jQuery(lessons);
		off = off || 0;
		len = len || lessons.length;
		if (len < 7) {
		    for (var i=off; i<len+off; i++)
				for (var j=i; j>off && compare(lessons[j-1],lessons[j])>0; j--){
					var t = lessons[j];
					lessons[j] = lessons[j-1];
					lessons[j-1] = t;
				}
		    return;
		}
		var m = off + (len >> 1);
		if (len > 7) {
			var med3 = function(compare,lessons,med3_a,med3_b,med3_c){
				return (compare(lessons[med3_a],lessons[med3_b])<0 ?
					(compare(lessons[med3_b],lessons[med3_c])<0 ? med3_b : compare(lessons[med3_a],lessons[med3_c])<0 ? med3_c : med3_a) :
					(compare(lessons[med3_b], lessons[med3_c])>0 ? med3_b : compare(lessons[med3_a],lessons[med3_c])>0 ? med3_c : med3_a));
			}
		    var l = off;
		    var n = off + len - 1;
		    if (len > 40) {
				var s = len/8;
				l = med3(compare,lessons, l,     l+s, l+2*s);
				m = med3(compare,lessons, m-s,   m,   m+s);
				n = med3(compare,lessons, n-2*s, n-s, n);
		    }
		    m = med3(compare,lessons, l, m, n);
		}
		var v = lessons[m];
	
		var a = off;
		var b = a;
		var c = off + len - 1;
		var d = c;
		while(true) {
		    while (b <= c && compare(lessons[b],v) < 1) {
				if (lessons[b] == v){
					a++;
					var t = lessons[a]
					lessons[a] = lessons[b];
					lessons[b] = t;
				}
				b++;
		    }
		    while (c >= b && compare(lessons[c],v) > -1) {
				if (compar(lessons[c],v)==0){
					d--;
					var t = lessons[c];
					lessons[c] = lessons[d];
					lessons[d] = t;
				}
				c--;
		    }
		    if (b > c)
				break;
			b++;
			c--;
			var t = lessons[b];
			lessons[b] = lessons[c];
			lessons[c] = t;
		}
	
		var s, n = off + len;
		s = Math.min(a-off, b-a  );
		var vecswap_b = b-s;
		for(var vecswap_i=0;vecswap_i<s;vecswap_i++,off++,vecswap_b++){
			var t = lessons[vecswap_a];
			lessons[vecswap_a] = lessons[vecswap_b];
			lessons[vecswap_b] = t;
		}
		s = Math.min(d-c,   n-d-1); 
		vecswap_b = n-s;
		for(var vecswap_i=0;vecswap_i<s;vecswap_i++,b++,vecswap_b++){
			var t = lessons[b];
			lessons[b] = lessons[vecswap_b];
			lessons[vecswap_b] = t;
		}
	
		if ((s = b-a) > 1)
		    sort(compare,lessons, off, s);
		if ((s = d-c) > 1)
		    sort(compare,lessons, n-s, s);
	}
	
	ElectCourseTable.prototype.changeVirtualCash = function(lessonId){
		jQuery("#virtualCashChangeSpan").text(jQuery("#virtualCashSpan").text());jQuery("#changeLessonId").val(lessonId);jQuery.colorbox({speed: 0,inline: true,top:"30%",href: "#virtualCashDiv",width:"30%",	height:"30%"});
	}
	
	//初始化任务列表
	ElectCourseTable.prototype.initLessonList = function(reInitLessonQuery,target,operatorType,orderOperator){
		if(!target){
			this.initLessonList(reInitLessonQuery.filter({elected:false}),electCourseTable.electableLessonList,{config:this.config,isRetakeCourse:this.isRetakeCourse,operator:"ELECTION",tips:"#electableLessonTips"});
			this.initLessonList(reInitLessonQuery.filter({elected:true}),electCourseTable.electedLessonList,{name:"退课",operator:"WITHDRAW",tips:"#electedLessonTips"},true);
		}else if(reInitLessonQuery){
			var tbody = target.find("tbody");
			target.find("thead tr:eq(1) th:eq(0)").attr("colspan",2);
			var lessonListTips = jQuery(operatorType.tips);
			var pageLimit = electCourseTable.pageLimit[operatorType.operator];
			var virtualCashEnabled = this.config.virtualCashEnabled;
			//排序
			//reInitLessonQuery = electCourseTable.sort(electCourseTable.compare,l);
			//分页
			var start = (pageLimit.pageNo-1)*pageLimit.pageSize;
			if(reInitLessonQuery.start(start).count() == 0){
				start = 0;
				electCourseTable.pageLimit[operatorType.operator].pageNo = 1;
			}
			//reInitLessonQuery = reInitLessonQuery.slice(start);
			tbody.empty();
			lessonListTips.empty();
			reInitLessonQuery.start(start).limit(pageLimit.pageSize).each(function(lesson, i) {
				var cssClass = "electGridTr electGridTr-"+ (i % 2 == 0 ? "even" : "odd");
				if(lesson.elected!=lesson.defaultElected){
					cssClass += " transientOperator";
				}else if(lesson.elected==true){
					//cssClass += " defaultElected";	
				}
				var anchor = "";
				var cashTd = "";
				if(operatorType.operator=="WITHDRAW"){
					if(lesson.defaultElected!=true || lesson.withdrawable==true){
						var onclick = "electCourseTable.tip.submit({lessonId: "+lesson.id+",ele:this,type:jQuery(this).attr('operator')})";
						//var onclick = "electCourseTable.tip.submit("+lesson.id+",this,jQuery(this).attr('operator'))";
						anchor = "<a class='lessonListOperator' href='##' onclick=\""+onclick+"\" operator='"+operatorType.operator+"'>"+operatorType.name+"</a>"
					}
					
					if(lesson.defaultElected!=true){
						var onclick = "electCourseTable.tip.submit({lessonId: "+lesson.id+",ele:this,type:jQuery(this).attr('operator')})";
						//var onclick = "electCourseTable.tip.submit("+lesson.id+",this,jQuery(this).attr('operator'))";
						anchor = "<a class='lessonListOperator' href='##' onclick=\""+onclick+"\" operator='"+operatorType.operator+"'>"+operatorType.name+"</a>"
					}else{
						if(lesson.withdrawable==true){
							var onclick = "electCourseTable.tip.submit({lessonId: "+lesson.id+",ele:this,type:jQuery(this).attr('operator')})";
						// var onclick = "electCourseTable.tip.submit("+lesson.id+",this,jQuery(this).attr('operator'))";
							anchor = "<a class='lessonListOperator' href='##' onclick=\""+onclick+"\" operator='"+operatorType.operator+"'>"+operatorType.name+"</a>"
						}else if(lesson.assigned==true){
							anchor = "已指定";
						}
					}
					if(virtualCashEnabled){
						jQuery.ajax({
							type: "post",
							url : electCourseTable.config.base+"/stdVirtualCashElect!getLessonConsume.action",
							error : function() { alert('响应失败!'); },
							dataType : "text",
							async : false,
							data: {
								lessonId:lesson.id,
								profileId:electCourseTable.config.profileId
							},
							success : function(result) {
								if(result){
									if(result == 0){
										cashTd = "<td>"+result+"</td>";
									}else{
										var profileId = electCourseTable.config.profileId;
										var strArr = result.split("-");
										if(strArr[1] != profileId) {
											cashTd = "<td><span id='resultSpan"+lesson.id+"'>"+strArr[0]+"</span></td>";
										} else {
											cashTd = "<td><span id='resultSpan"+lesson.id+"'>"+strArr[0]+"</span><a href='#' onClick=\"jQuery('#virtualCashChangeSpan').text(jQuery('#virtualCashSpan').text());jQuery('#changeLessonId').val("+lesson.id+");jQuery.colorbox({fixed:true,top:'"+(jQuery(window).height()/2 - 100)+"px',speed:0,inline:true,href:'#virtualCashDiv',width:'30%',height:'30%'});\">[更改意愿值]</a></td>";
										}
									}
								}
							}
						});
					}
				}else{
					var onclick = "electCourseTable.tip.submit({lessonId: "+lesson.id+",ele:this,type:jQuery(this).attr('operator'),virtualLoc:'list',virtualCashEnabled:"+virtualCashEnabled+"})"
					//var onclick = "electCourseTable.tip.submit("+lesson.id+",this,jQuery(this).attr('operator'))";
					var operatorTitle = "选课";
					if(!operatorType.config.noRetake && operatorType.isRetakeCourse("c"+lesson.courseId)){
						operatorTitle = "重修";
					}
					anchor = "<a class='lessonListOperator' href='##' onclick=\""+onclick+"\" operator='"+operatorType.operator+"'>"+operatorTitle+"</a>"
					if(virtualCashEnabled){
						cashTd = "<td><input type='text' name='virtualCashCost"+lesson.id+"' id='list_virtualCashCost"+lesson.id+"' value='' class='virtualCashCost' style='width:60px'/></td>";
					}
				}
				//获取该课程该教师最近一学期评教结果转换成星级显示
				var str="";
				jQuery.ajax({
					type: "post",
					url : electCourseTable.config.base+"/stdElectCourse!getEvaluateStat.action",
					error : function() { alert('响应失败!'); },
					dataType : "text",
					async : false,
					data: {
						lessonId:lesson.id
					},
					success : function(result) {
						if(result && result!=0){
							str=result;
						}
					}
				});
				var newTr = "<tr id='lesson"+lesson.id+"'>" +
											"<td colspan='2'>" + lesson.no + "</td>" +
//											"<td>" + lesson.code + "</td>" +
											"<td><a href='electionLessonInfo.action?lesson.id="+lesson.id+"' target='blank' title='点击查看教学任务信息'>" + lesson.name + "</a></td>" +
//											"<td>" +str+ "</td>" +
											"<td>" + lesson.courseTypeName + "</td>" +
											"<td>" + lesson.credits + "</td>" +
											"<td>" + lesson.teachers + "</td>" +
											//"<td>" + lesson.weekHour+"</td>"+
											"<td>" + lesson.campusName.replace("校区","") + "</td>"+
											//"<td>" + lesson.remark + "</td>" +
											"<td class='stdCount'>";
				if(window.lessonId2Counts["" + lesson.id]){
					newTr += window.lessonId2Counts["" + lesson.id].sc + "/" + window.lessonId2Counts["" + lesson.id].lc
				}
				newTr += "</td>";					
				var arrange = "";
				var activities = lesson.arrangeInfo;
				if(activities.length>0){
					var weekDays = electCourseTable.config.weekDays;
					jQuery(activities).each(function(i){
						if(i > 0){
							arrange += "<br/>";
						}
						arrange+= activities[i].weekStateText + "   "+ weekDays[activities[i].weekDay-1] +""+activities[i].startUnit+"-"+activities[i].endUnit+"节 "+ activities[i].rooms;
					});
				}else{
					arrange += "尚未排课";
				}
				newTr += "<td>"+ arrange +"</td>";
				/* 会导致多一个td，导致退课按钮出不来
				if(orderOperator){
					newTr += "<td></td>"
				}
				*/
				newTr += cashTd;
				newTr = jQuery(newTr += "<td>" +anchor + "</td></tr>");
				tbody.append(newTr);
				newTr.addClass(cssClass);
			});
			var pgbar = target.parent().find(".girdbar-pgbar").empty();
			jQuery(pgbar.parent().css("background-color","white")[0]).empty().append(
							"<div style='float:left;' class='toolbar-title'><img class='toolbar-icon' src='"+electCourseTable.config.base+"/static/themes/default/icons/16x16/actions/info.png'><strong>课程列表</strong><span style='color:red'>查询后上方课表会发生变化。如要显示全部课程，请清空查询条件后再做一次查询。</span></div>"+
							"<div id='electableLessonList_bar1_page' class='girdbar-pgbar'></div>"
			).css("margin-bottom","2px");
			pgbar=target.parent().find(".girdbar-pgbar");
			jQuery(pgbar.parent()[1]).css("margin-top","2px");
			var maxPageNo = Math.ceil(reInitLessonQuery.count()/pageLimit.pageSize);
			var pageNo = pageLimit.pageNo;
			if(maxPageNo<6){
				for(var i=1;i<=maxPageNo;i++){
					if(i==pageNo){
						pgbar.append("<a class='pgButton pgButtonHover'  pageNo='"+ i +"'>"+i+"</a>");
					}else{
						pgbar.append("<a class='pgButton'   pageNo='"+ i +"'>"+i+"</a>");
					}
				}
			}else{
				var startIndex = pageNo -2;
				if(startIndex < 1){
					startIndex = 1;
				}
				var endIndex = pageNo +2;
				if(endIndex > maxPageNo){
					endIndex = maxPageNo;
				}
				var endHtml = "";
				if(startIndex > 1){
					pgbar.append("<a class='pgPrevBtn' href='###' pageNo='"+ (pageNo-1) +"'>上一页</a>");
					pgbar.append("<a class='pgButton pgFirst'  pageNo='1'>1..</a>");
					if(endIndex - startIndex < 5){
						startIndex = endIndex - 5;
					}
				}else{
					if(pageNo==1){
						pgbar.append("<a class='pgButton pgFirst pgButtonHover'  pageNo='1'>1</a>");
					}else{
						pgbar.append("<a class='pgButton pgFirst'  pageNo='1'>1</a>");
					}
					startIndex = 2;
					if((endIndex - startIndex) <4){
						endIndex = startIndex +4;
					}
				}
				if(endIndex < maxPageNo){
					endHtml += "<a class='pgButton pgLast'  pageNo='"+ maxPageNo +"'>"+ maxPageNo+"...</a>";
					endHtml += "<a class='pgNextBtn'  pageNo='"+ (pageNo+1) +"'>下一页</a>";
				}else{
					if(pageNo==maxPageNo){
						endHtml +="<a class='pgButton pgButtonHover pgLast'  pageNo='maxPageNo'>"+ maxPageNo+"</a>";
					}else{
						endHtml +="<a class='pgButton pgLast'  pageNo='"+maxPageNo+"'>"+ maxPageNo+"</a>";
					}
					endIndex = maxPageNo;
				}
				for(var i=startIndex;i<endIndex;i++){
					if(i==pageNo){
						pgbar.append("<a class='pgButton pgButtonHover'  pageNo='"+ i +"'>"+i+"</a>");
					}else{
						pgbar.append("<a class='pgButton'   pageNo='"+ i +"'>"+i+"</a>");
					}
				}
				pgbar.append(endHtml);
			}
			pgbar.find("a").click(function(){
				electCourseTable.pageLimit[operatorType.operator].pageNo = parseInt(jQuery(this).attr("pageNo"), 10);
				electCourseTable.initLessonList(electCourseTable.doFilter());
			});
//			target.parent().parent().parent().parent().find(".electTabSelected").trigger("click");
			// 点击任务在课表上显示
			jQuery("tr.electGridTr", target).click(this.showLessonOnTable);
		}
	}
	
	ElectCourseTable.prototype.isConflict = function(lesson,lesson2){
		if(!this.config.checkTimeConflict){
			return false;
		}
		var audited = lesson2.audited;
		if(audited == true){
			return false;
		}
		if(electCourseTable.isRetakeCourse("c"+lesson.courseId)){
			return false;
		}
		var unitCount = this.config.checkTimeConflict.conflictTimeCount;
		var checkType = this.config.checkTimeConflict.checkType;
		var isContinuous = this.config.checkTimeConflict.isContinuous;
		
		var activities = lesson.arrangeInfo;
		var activities2 = lesson2.arrangeInfo;
		if(activities.length==0 || activities2.length==0){
			return false;
		}
		var allUnitCount=0; //总节次
		var conflictCount = 0;//冲突节次
		var maxConflict=0;//最大连续冲突节次
		var maxUnConflict=0;//最大连续空闲节次
		for(var i=0;i<activities.length;i++){
			var activity = activities[i];
			var weekState = activity.weekState;
			var timeStartUnit = activity.startUnit;
			var timeEndUnit = activity.endUnit;
			var oneDayUnit= timeEndUnit-timeStartUnit+1;
			var oneDayUnConfictCount = oneDayUnit;
			allUnitCount+=oneDayUnit;
			for(var j=0;j<activities2.length;j++){
				var activity2 = activities2[j];
				var weekState2 = activity2.weekState;
				var time2StartUnit = activity2.startUnit;
				var time2EndUnit = activity2.endUnit;
				for(var k=0;k<weekState.length;k++){
					if(parseInt(parseInt(weekState[k], 10) & parseInt(weekState2[k], 10))>0 && 
						   activity.weekDay==activity2.weekDay){
						if(timeStartUnit <= time2EndUnit && timeEndUnit >= time2StartUnit){
							oneDayUnConfictCount=0;
							if(unitCount==0 && checkType){
								return true;
							}else {
								var minStart = Math.min(timeStartUnit, time2StartUnit);
								var maxStart = Math.max(timeStartUnit, time2StartUnit);
								var minEnd = Math.min(time2EndUnit, time2EndUnit);
								var maxEnd = Math.max(time2EndUnit, time2EndUnit);
								var oneDayConflictCount  = (minEnd - maxStart+1);
								conflictCount+=oneDayConflictCount;
								if(oneDayConflictCount>maxConflict) {
									maxConflict = oneDayConflictCount;
								}
								if(minStart==timeStartUnit){
									var leftOneDayUnConflictCount = (maxStart - minStart);
									if(!isContinuous || leftOneDayUnConflictCount>1){
										oneDayUnConfictCount += leftOneDayUnConflictCount;									
									}
								}
								if(maxEnd==time2EndUnit){
									var rightOneDayUnConflictCount = (maxEnd - minEnd);
									if(!isContinuous || rightOneDayUnConflictCount>1){
										oneDayUnConfictCount += rightOneDayUnConflictCount;
									}
								}
								if(oneDayUnConfictCount>maxUnConflict) {
									maxUnConflict =oneDayUnConfictCount;
								}
							}
						}
					}	
				}
			}
			if(oneDayUnConfictCount>maxUnConflict) {
				maxUnConflict =oneDayUnConfictCount;
			}
		}
		//检查冲突
		if(checkType){
			//冲突节次如果大于等于指定数量则冲突
			if(conflictCount >=unitCount && conflictCount>0){
				return true;
			}
		}else {
			//空闲节次如果大于等于指定数量则不冲突
			if(maxUnConflict>=unitCount && maxUnConflict>0){
				return !(unitCount>0);
			}else{
				return true;
			}
		}
		return false;
	}
	
	//检查冲突
	ElectCourseTable.prototype.checkConflict = function(lesson,checkCode){
		var conflictLessons = {
			lessons: {},
			each: function(callback){
				var i = 0;
				for(key in this.lessons){
					callback(i,this.lessons[key]);
					i++;
				}
			},
			length: 0,
			addLesson: function(lesson){
				if(!this.lessons["l"+lesson.id]){
					this.lessons["l"+lesson.id] = lesson;
					this.length++;
				}
			}
		};
		if(!electCourseTable.config.checkTimeConflict){
			if(checkCode){
				var _lessons = this._code2Lessons[lesson.code];
				for(var h = 0; h < _lessons.length; h++) {
					if(_lessons.elected) {
						conflictLessons.addLesson(_lessons[h]);
					}
				}
			}else{
				return conflictLessons;
			}
		}else{
			var expr = {elected:true,id:{"!is":lesson.id}};
			this.lessons().filter(expr).each(function(lesson2, index){
				if(lesson2.code==lesson.code && checkCode){
					conflictLessons.addLesson(lesson2);
				}else if(electCourseTable.isConflict(lesson,lesson2)){
					conflictLessons.addLesson(lesson2);
				}
			});
		}
		return conflictLessons;
	};
	
	ElectCourseTable.prototype.showTip = function(cell){
		var offset = cell.offset();
		// 根据tipPanel的width和border计算得出，在courseTablePanel.ftl中定义了
		// 不能使用 this.tip.outerWidth() 这个方法会耗时200ms+
		var _tipOuterWidth = 728;
		if(offset.left + _tipOuterWidth > jQuery(window).width()) {
			offset.left -= _tipOuterWidth - cell.width();
		}
		if(offset.left < 0) {
			offset.left = 0;
		}
		this.tip.show();
		this.tip.offset(offset);
	};
	
	ElectCourseTable.prototype.queryStdCount = function(){
		var qrScript = jQuery("script#qr_script");
		var src = qrScript.attr("src");
		qrScript.remove();
		
		var body = document.getElementsByTagName("body")[0];         
		var newScript = document.createElement('script');
		newScript.id = "qr_script";
		newScript.type = 'text/javascript';
		newScript.src = src;
		body.appendChild(newScript);
	}
	
	ElectCourseTable.prototype.isRetakeCourse = function(courseId){
		if(courseId){
			if(typeof this.config.hisCourses[courseId] != "undefined"){
				return true;
			}
			for(var i=0;i<this.config.courseSubstitutions.length;i++){
				var courseSubstitution = this.config.courseSubstitutions[i];
				if(typeof courseSubstitution.substitutes[courseId]!="undefined"){
					for(hisCourseId in this.config.hisCourses){
						if(typeof courseSubstitution.origins[hisCourseId] !="undefined"){
							return true;
						}
					}
				}
			}
		}
		return false;
	};
	
	function ElectCourseTable(table,tip,electableLessonList,electedLessonList,electCart){
		this.config = {
			time:30000,//同步当前人数时间间隔
			base:bg.getContextPath(),
			weekDays:[],
			checkTimeConflict:false
		};
		//分页信息
		this.pageLimit = {
			ELECTION:{pageNo: 1, pageSize: 20},
			WITHDRAW:{pageNo: 1, pageSize: 20}
		}
		// 排序信息
		this.orderBy = {key:"",desc:false};
		// 筛选信息
		this.filters = [];
		// 可选课程查询栏里的查询条件
		this.conditions = [];
						
		//课表
		this.table = jQuery(table);
		
		//所有课程列表
		this.electableLessonList = jQuery(electableLessonList);
		this.electedLessonList = jQuery(electedLessonList);
		
		//教学任务数据
		this.lessons = TAFFY();
		//提示框初始化
		this.tip = jQuery(tip);	
		this.tip.mouseover(function(){
			var tip = jQuery(this);
			tip.addClass("tipHover").show();
			jQuery(tip.data("selectedCell")).addClass("electCellHover");
		}).mouseout(function(){
			var tip = jQuery(this);
			jQuery(tip.data("selectedCell")).removeClass("electCellHover").trigger("mouseout");
			tip.removeClass("tipHover");
		});
		this.tip.setLessons = function(lessons, weekDay, unit){
			var tbody = this.find("table tbody");
			tbody.empty();
			var hoverCell = jQuery(".electCellHover");
			var noRetake = electCourseTable.config.noRetake;
			var title = "选课";
			var type = "'ELECTION'";
			//var electedLessonUnits = electCourseTable.lessons.find(".lesson[elected='true'] .activity[weekDay='" + weekDay + "'] .activityUnit[value='"+unit+"']");
			var trsHtml = "";
			var virtualCashEnabled = electCourseTable.config.virtualCashEnabled;
			var trsHtmlArr = new Array();
			hoverCell.data("emptyCell",true);
			for(var i = 0; i < lessons.length; i++) {
				var lesson = lessons[i];
				title="选课";
				var limitCount = window.lessonId2Counts["" + lesson.id].lc;
				var stdCount = window.lessonId2Counts["" + lesson.id].sc;
				if(virtualCashEnabled || lesson.elected==true || limitCount>stdCount || hoverCell.html()=="1"){
					hoverCell.data("emptyCell",false);
					var cssClass = "";
					if(lesson.elected==lesson.defaultElected){
						if(lesson.elected==true){
							cssClass = " class='defaultElected'";
						}
					}else{
						cssClass = " class='transientOperator'";	
					}
					var conflictLessons = electCourseTable.checkConflict(lesson, true);
					var operator = "";
					if(conflictLessons.length >0){
						title = "";
						type = "''";
						/* 换课功能有BUG，暂时不支持换课
						title = "换课";
						type = "'CHANGE'";
						*/
					}else{
						if(!noRetake && electCourseTable.isRetakeCourse("c"+lesson.courseId)){
							title = "重修";
						}
						type = "'ELECTION'";
					}
					if(lesson.defaultElected != true){
						operator = "<a title=\"" + (lesson.elected ==true ? "退课" : title) + "\" href=\"###\" onclick=\"electCourseTable.tip.submit({lessonId: "+lesson.id+",ele:this,type:"+ (lesson.elected==true ? "'WITHDRAW'" : type)+"})\" >"+ (lesson.elected==true ? "退课" : title) +"</a>";
					}else{
						if(lesson.withdrawable==true){
							operator = "<a title=\"" + (lesson.elected==true ? "退课" : title) + "\" href=\"###\" onclick=\"electCourseTable.tip.submit({lessonId: "+lesson.id+",ele:this,type:"+  (lesson.elected==true ? "'WITHDRAW'" : type)+"})\" >"+ (lesson.elected==true ? "退课" : title) +"</a>";
						}else if(lesson.assigned==true){
							operator = "已指定";
						}
					}
					//获取该课程该教师最近一学期评教结果转换成星级显示
					var str="";
					jQuery.ajax({
						type: "post",
						url : electCourseTable.config.base+"/stdElectCourse!getEvaluateStat.action",
						error : function() { alert('响应失败!'); },
						dataType : "text",
						async : false,
						data: {
							lessonId:lesson.id
						},
						success : function(result) {
							if(result && result!=0){
								str=result;
							}
						}
					});
					trsHtmlArr.push("<tr><td");trsHtmlArr.push(cssClass);trsHtmlArr.push(">" );trsHtmlArr.push( lesson.no );trsHtmlArr.push( "</td>");
					trsHtmlArr.push("<td");trsHtmlArr.push(cssClass);trsHtmlArr.push(">" );trsHtmlArr.push( lesson.name );trsHtmlArr.push( "</td>");
					//trsHtmlArr.push("<td");trsHtmlArr.push(cssClass);trsHtmlArr.push(">" );trsHtmlArr.push( str );trsHtmlArr.push( "</td>");
					trsHtmlArr.push("<td");trsHtmlArr.push(cssClass);trsHtmlArr.push(">" );trsHtmlArr.push( lesson.credits );trsHtmlArr.push( "</td>");
					trsHtmlArr.push("<td");trsHtmlArr.push(cssClass);trsHtmlArr.push(">" );trsHtmlArr.push( lesson.teachers );trsHtmlArr.push( "</td>");
					trsHtmlArr.push("<td");trsHtmlArr.push(cssClass);trsHtmlArr.push(">");trsHtmlArr.push( lesson.startWeek);trsHtmlArr.push("-");trsHtmlArr.push(lesson.endWeek);trsHtmlArr.push(" ");
					var _rooms = "";
					for(var h = 0; h < lesson.arrangeInfo.length; h++) {
						if(lesson.arrangeInfo[h].startUnit <= unit && unit <= lesson.arrangeInfo[h].endUnit) {
							_rooms = lesson.arrangeInfo[h].rooms;
						}
					}
					trsHtmlArr.push(_rooms+"["+lesson.campusName.replace("校区","")+"]");trsHtmlArr.push( "</td>");
					trsHtmlArr.push("<td");trsHtmlArr.push(cssClass);trsHtmlArr.push(">" );
					trsHtmlArr.push( stdCount );trsHtmlArr.push("/");trsHtmlArr.push( limitCount );
					trsHtmlArr.push( "</td>");
					if(virtualCashEnabled){
						if(operator.indexOf("选课") > -1 || operator.indexOf("重修") > -1){
							trsHtmlArr.push("<td");trsHtmlArr.push(cssClass);trsHtmlArr.push(">");trsHtmlArr.push("<input style='width:90%' type='text' name='virtualCashCost"+lesson.id+"' id='virtualCashCost"+lesson.id+"' value='' class='virtualCashCost'/></td>");
						}else if (operator.indexOf("退课") > -1){
							jQuery.ajax({
								type: "post",
								url : electCourseTable.config.base+"/stdVirtualCashElect!getLessonCost.action",
								error : function() { alert('响应失败!'); },
								dataType : "text",
								async : false,
								data: {
									lessonId:lesson.id,
									profileId:electCourseTable.config.profileId
								},
								success : function(result) {
									if(result){
										trsHtmlArr.push("<td");trsHtmlArr.push(cssClass);trsHtmlArr.push(">" + result + "</td>");
									}
								}
							});
						}else{
							trsHtmlArr.push("<td");trsHtmlArr.push(cssClass);trsHtmlArr.push(">");trsHtmlArr.push("<td");trsHtmlArr.push(cssClass);trsHtmlArr.push("&nbsp;");trsHtmlArr.push("<td");trsHtmlArr.push(cssClass);trsHtmlArr.push("</td>");
						}
					}
					trsHtmlArr.push("<td");trsHtmlArr.push(cssClass);trsHtmlArr.push(">");trsHtmlArr.push(operator);trsHtmlArr.push("</td></tr>");
				}
			}
			if(hoverCell.data("emptyCell")){
				trsHtmlArr.push("<tr><td colspan='7' style='text-align:center;font-size:14px;color:#b2b200;font-weight:bold'>本节次所有课都已满人</td></tr>");
			}
			tbody.append(trsHtmlArr.join(""));
		};
		
		this.tip.submit = function(params){
			var lessonId = params.lessonId;
			var ele = params.ele;
			var type = params.type;
			var unCheckConflict = params.unCheckConflict;
			var isCancel = params.isCancel;
			var callback = params.callback;
			var virtualCashEnabled = params.virtualCashEnabled;
			var _lessonQuery = electCourseTable.lessons({id:lessonId});
			var lesson = _lessonQuery.first();
			var requiredCreditsInput = jQuery(".requiredCreditsInput").prev().find("option[value='"+lesson.code+"']").parent().next();
			var isChange = jQuery.isArray(type);
			var groupId="";
			var groupInput = "";
			var virtualLoc = params.virtualLoc;
			if(isChange){
				if(type.length==2){
					groupInput = "<input type='hidden' name='groupId' value='" + type[1] + "'/>";
					groupId = type[1];
				}
				type = type[0];
			}
			if(type=="ELECTION"){
				var credits = parseFloat(lesson.credits, 10);
				if(window.electCourseTable.config.limitCheck.checkMax){
					if(lesson.defaultElected!=true && !isCancel && window.lessonId2Counts["" + lesson.id].lc <=window.lessonId2Counts["" + lesson.id].sc){
						alert("上限人数已满，请稍后再试"); 
						return false; 
					}					
				}
				if(parseFloat(requiredCreditsInput.val()) - credits < 0 && (electCourseTable.config.noRetake || !electCourseTable.isRetakeCourse("c"+lesson.courseId))){
					alert("超过限选学分,请先将同一课程组下已选课程退课后再试"); 
					return false;
				}
				if(!unCheckConflict || !electCourseTable.config.checkTimeConflict){
					var alertMsg = "";
					electCourseTable.lessons({elected:true},{id :{"!is" : lesson.id }}, {code : lesson.code}).each(function(sameLesson) {
						if(sameLesson.defaultElected != true || sameLesson.withdrawable == true) {
							alertMsg = "你已经选过 " + lesson.name + ",如需要换课请先退课,课程序号为 "+ sameLesson.no;
						}else{
							alertMsg = "你已经选过 " + lesson.name + ",课程序号为 " + sameLesson.no;
						}
					});
					if(alertMsg != "") {
						alert(alertMsg);
						return false;
					}
					
					var conflictLessons = electCourseTable.checkConflict(lesson);
					if (conflictLessons.length > 0) {
						var msg = lesson.name+"["+lesson.no+"]与以下课程冲突:";
						conflictLessons.each(function(i,lesson){
							msg +="\n"+ lesson.name + "[" + lesson.no + "]";
						})
						alert(msg);
						return false;
					}
				}
				if(lesson.defaultElected==true){
					electCourseTable.electCart.cancel(lesson.id);
				}else{
					var materialNum = 0;
					var operator = "";
					var noRetake = electCourseTable.config.noRetake;
					electCourseTable.electCart.children("tbody").prepend(
						"<tr>" +
							"<td><input type='hidden' name='lesson.id' value='" + lesson.id + "'/>"+
									"<input type='hidden' name='materialNum' value='" + materialNum + "'/>" + 
									groupId+lesson.name + 
							"</td>" +
							"<td>" + lesson.teachers + "</td>" +
							"<td>"+((!electCourseTable.config.noRetake && electCourseTable.isRetakeCourse("c"+lesson.courseId))?"重修":"选课")+"</td>" +
							"<td>"+operator+groupId+"</td>" +
							"<td><a href='###' onclick=\"electCourseTable.electCart.cancel("+lesson.id+",'WITHDRAW')\">撤销</a></td>" +
						"</tr>"
					);
				}
				electCourseTable.tip.trigger("mouseout");
				// 状态的更新应该在electResult中做
//				_lessonQuery.update({elected : true});
				/*
				lesson.find("input.activityUnit").each(function(){
					var activityUnit = jQuery(this);
					electCourseTable.initCell(jQuery(".electableCell[weekDay='"+activityUnit.parent().attr("weekDay")+"'][unit='"+activityUnit.val()+"']"));
				});
				*/
				var newElectedCredits = parseFloat(requiredCreditsInput.val()) - parseFloat(lesson.credits);
				requiredCreditsInput.val(newElectedCredits);
			}else if(type=="WITHDRAW"){
				electCourseTable.tip.trigger("mouseout");
				// 状态的更新应该在electResult中做
//				_lessonQuery.update({elected : false});
				if(lesson.defaultElected == true){
					electCourseTable.electCart.children("tbody").prepend(
						"<tr>" +
							"<td><input type='hidden' name='lesson.id' value='" + lesson.id + "'/>" + lesson.name + "</td>" +
							"<td>" + lesson.teachers + "</td>" +
							"<td>退课</td>" +
							"<td></td>" +
							"<td><a href='###' onclick=\"electCourseTable.electCart.cancel("+lesson.id+",'ELECTION')\">撤销</a></td>" +
						"</tr>"
					);
				}else{
					electCourseTable.electCart.cancel(lesson.id);
				}
				
				var newElectedCredits = parseFloat(requiredCreditsInput.val()) + lesson.credits;
				requiredCreditsInput.val(newElectedCredits);
				/*
				lesson.find("input.activityUnit").each(function(){
					var activityUnit = jQuery(this);
					electCourseTable.initCell(jQuery(".electableCell[weekDay='"+activityUnit.parent().attr("weekDay")+"'][unit='"+activityUnit.val()+"']"));
				});
				*/
			} else {
				// 重修?
				var sameCodeElectedLesson = electCourseTable.lessons( { elected : true, id : { "!is" : lesson.id }, code : lesson.code } ).first();
				var actionConfirm = true;
				if(sameCodeElectedLesson) {
					if(sameCodeElectedLesson.defaultElected != true || sameCodeElectedLesson.withdrawable == true) {
						actionConfirm &= confirm("你已经选过 "+lesson.name+",确定换课程将退掉课程序号为 "+sameCodeElectedLesson.no+"的选课记录");
					}else{
						alert("你已经选过 "+lesson.name+",课程序号为 " + sameCodeElectedLesson.no);
						return false;
					}
				}
				if(actionConfirm){
					var conflictLessons = electCourseTable.checkConflict(lesson);
					if(conflictLessons.length>0){
						var msg = "";
						var withdrawable = true;
						conflictLessons.each(function(i,lesson){
							if(lesson.defaultElected==true && lesson.withdrawable!=true){
								withdrawable = false
							}
							msg +="\n"+lesson.name+"["+lesson.no+"]";
						});
						if(withdrawable){
							actionConfirm &= confirm(lesson.name+"["+lesson.no+"]与以下课程冲突,确认换课以下课程将被退课:"+msg);
						}else{
							alert(lesson.name+"["+lesson.no+"]与以下课程冲突,换课失败:"+msg)
							return false;
						}
					}
				}
				if(actionConfirm){
					var cartLessons = [];
					electCourseTable.electCart.find("input[name='lesson.id'][groupId='"+lesson.id+"']").each(function(i,e){
						cartLessons[cartLessons.length] = e.value;
					});
					var withdrawLessonIds = [];
					var withdrawedLessonIds = [];
					
					
					if (sameCodeElectedLesson.defaultElected != true) {
						alert(sameCodeElectedLesson.id + ":" + ele);
						var submitParam = {
								lessonId: sameCodeElectedLesson.id,
								ele		: ele,
								type	: ["WITHDRAW"],
								unCheckConflict	: true
						};
						var submited = electCourseTable.tip.submit(submitParam);
						if(submited){
							withdrawedLessonIds[withdrawedLessonIds.length] = sameCodeElectedLesson.id;
						}
					}else{
						withdrawLessonIds[withdrawLessonIds.length] = sameCodeElectedLesson.id;
					}
					conflictLessons.each(function(i,l){
						var conflictLesson = l;
						if(conflictLesson.defaultElected != true){
							var tipSubmitParams = {
									lessonId: conflictLesson.id,
									ele: ele,
									type: ["WITHDRAW"],
									unCheckConflict:true
							};
							if(electCourseTable.tip.submit(tipSubmitParams)){
								withdrawedLessonIds[withdrawedLessonIds.length] = sameCodeElectedLesson.id;
							}
						}else{
							withdrawLessonIds[withdrawLessonIds.length] = conflictLesson.id;						
						}
					});
					for(var i=0;i<withdrawLessonIds.length;i++){
						var tipSubmitParams = {
								lessonId: withdrawLessonIds[i],
								ele: ele,
								type: ["WITHDRAW",lesson.id],
								unCheckConflict:true
						};
						if(electCourseTable.tip.submit(tipSubmitParams)){
							withdrawedLessonIds[withdrawedLessonIds.length] = sameCodeElectedLesson.id;
						}
					}
					var tipSubmitParams = {
							lessonId: lesson.id,
							ele: ele,
							type: ["ELECTION",lesson.id,withdrawLessonIds.length],
							unCheckConflict:true
					};
					if(!electCourseTable.tip.submit(tipSubmitParams)){
						return false;
					}
				}
			}
			if(!electCourseTable.config.batchOperator){
				if(type=="ELECTION" && electCourseTable.isRetakeCourse("c"+lesson.courseId)) {
					global.retake.addLesson(lessonId);
				}
				if(type=="WITHDRAW") {
					global.retake.removeLesson(lessonId);
				}
				if(type="virtualCashEnabled" &&　virtualCashEnabled){
					electCourseTable.electCart.submit(document.electCartForm, (!isChange || type=='CHANGE'),virtualLoc);
				}else{
					electCourseTable.electCart.submit(document.electCartForm, (!isChange || type=='CHANGE'));
				}
			} else {
				if((!isChange || type=='CHANGE')){
					electCourseTable.init();					
				}
			}
			return true;
		}
		
		//选退课暂存操作列表
		this.electCart = jQuery(electCart);
		this.electCart.submit = function(form,submit,virtualLoc){
			var datas = {};
			var count = 0;
			var virtualCashEnabled = electCourseTable.config.virtualCashEnabled;
			electCourseTable.electCart.find("tbody tr").each(function(i){
				var lessonId = jQuery(this).find("input[name='lesson.id']");
				var materialNum = jQuery(this).find("input[name='materialNum']");
				if(lessonId.length>0){
					var courseId = electCourseTable.lessons({id:new Number(lessonId.val())}).first().courseId;
					var electTitle = "选课";
					if(!electCourseTable.config.noRetake && electCourseTable.isRetakeCourse("c"+courseId)){
						electTitle = "重修";
					}
					if(virtualCashEnabled){
						var current = "";
						jQuery.ajax({
							type: "post",
							url : electCourseTable.config.base+"/stdVirtualCashElect!getCurrentCash.action",
							error : function() { alert('响应失败!'); },
							dataType : "text",
							async : false,
							data: {profileId:electCourseTable.config.profileId},
							success : function(result) {
								current = parseInt(result,10);
							}
						});
						if(isNaN(current)){
							alert("尚未进行初始化");
							return;
						}
						if(virtualLoc){
							var virtualCashCost = jQuery("#list_virtualCashCost"+lessonId.val()).val();
						}else{
							var virtualCashCost = jQuery("#virtualCashCost"+lessonId.val()).val();
						}
						if((jQuery(this).find("td:eq(2)").html()==electTitle) && (!virtualCashCost || isNaN(virtualCashCost) || virtualCashCost<1 || virtualCashCost > current || virtualCashCost.indexOf(".")>-1)){
							alert("请填写正确的意愿值花费.必须为1-"+jQuery("#virtualCashSpan").text()+"的整数");
							return;
						}
						datas["virtualCashCost"+lessonId.val()] = virtualCashCost;
					}
					var value = lessonId.val()+":"+(jQuery(this).find("td:eq(2)").html()==electTitle);
					if(materialNum.length>0){
						value +=(":"+materialNum.val());
					}
					datas["operator"+i] = value;
					count++;
				}
			}); 
			if((submit || electCourseTable.config.batchOperator)&& count>0 && confirm(window.electCourseTable.config.stdName+"同学,是否确认此次操作?")){
				jQuery(window).data("triggerBeforeUnload",false);
				jQuery.colorbox({
					transition:"none",
					title:"操作结果",
					href:electCourseTable.config.base+"/stdElectCourse!batchOperator.action?profileId="+electCourseTable.config.profileId,
					width:"50%",
					height:"30%",
					data:datas,
					onOpen:function(){
						var tbody = electCourseTable.electCart.find("tbody");
						tbody.html("<tr><td colspan='5'><input type='button' value='提交' onClick='electCourseTable.electCart.submit(document.electCartForm)'/></td></tr>");
					},
					onComplete:function(){
						jQuery(function(){
							var electProgressbar = jQuery("#electProgressbar");
							if(electProgressbar.parent().is(":hidden") && electProgressbar.length>0){
								electProgressbar[0].style.left = (jQuery(window).width()-electProgressbar.width())/2 +"px"; 
								electProgressbar.progressbar("value",100);
								var overlay = electProgressbar.parent().prev();
								overlay.show();
								electProgressbar.parent().show();
							}
							window.electCourseTable.showProgressbar();
							window.electCourseTable.init();
						});
						if(virtualCashEnabled){
							var res = jQuery.post(electCourseTable.config.base+"/stdVirtualCashElect!getCurrentCash.action",{profileId:electCourseTable.config.profileId},function(){
								if(res.status==200){
									if(res.responseText!=""){
										jQuery("#virtualCashSpan").text(res.responseText);
									}
								}
							},"text");
						}
					}
				});
			}else if(!electCourseTable.config.batchOperator){
				electCourseTable.electCart.find("tbody tr").each(function(i){
					jQuery(this).find("a").click();
				}); 
			}
		}
		
		this.electCart.cancel = function(lessonId,type){
			var result = true;
			if(type){
				result = electCourseTable.tip.submit({
					lessonId: lessonId,
					ele: false,
					type: type,
					unCheckConflict:true
				});
			}
			if(result){
				var input = this.find("input[name='lesson.id'][value='"+lessonId+"']");
				var tr = input.parent().parent();
				tr.remove();
			}
			return result;
		}
		
		this.jQueryBtn = this.electableLessonList.find("thead tr:eq(0) input:eq(0)");
		this.jQuerySearchInputs = this.electableLessonList.find("thead tr:eq(0) input:not(:eq(0))");
		var that = this;
		this.jQueryBtn.click(function(){
			that.conditions = [];
			that.jQuerySearchInputs.each(function(){
				var ele = jQuery(this);
				var query_value = ele.val();
				if(jQuery.trim(query_value) !== ""){
					var key = ele.attr("name").replace("electableLesson.","").replace("course.","");
					if(key=="courseType.name"){
						key = "courseTypeName";
					}
					if(key=="campus.name") {
						key = "campusName";
					}
					var cond = [];
					cond[0] = {elected:true};
					cond[1] = {};
					if(key == "credits") {
						cond[1][key] = parseFloat(query_value);
					} else if (key == "weekHour") {
						cond[1][key] = parseInt(query_value, 10);
					} else {
						cond[1][key] = { 'like' : query_value };
					}
					that.conditions[that.conditions.length] = cond;
				}
			});
			that.init();
		});
		this.jQuerySearchInputs.each(function(index){
			var input = jQuery(this);
			input.keyup(function(event){
				that.electedLessonList.find("thead tr:eq(0) input[name='"+input.attr("name").replace("electableLesson","electedLesson")+"']").val(input.val());
				if(event.keyCode==13){
					that.jQueryBtn.trigger("click");
				}
			});
		});
		this.electedLessonList.find("thead tr:eq(0) input").each(function(index){
			var input = jQuery(this);
			if(index==0){
				input.click(function(){
					electCourseTable.electableLessonList.find("thead tr:eq(0) input:eq(0)").trigger("click");
				}).css("cursor","pointer");
			}else{
				input.keyup(function(event){
					electCourseTable.electableLessonList.find("thead tr:eq(0) input[name='"+input.attr("name").replace("electedLesson","electableLesson")+"']").val(input.val());
					if(event.keyCode==13){
						electCourseTable.electableLessonList.find("thead tr:eq(0) input:eq(0)").trigger("click");
					}
				});
			}
		});
		//定时轮询队列
		//this.queryStdQueue = this.table.queue("queryStdQueue",setTimeout("electCourseTable.queryStdCount",this.config.time));
	}

	ElectCourseTable.prototype.openedCourseIds = function(){
		return "," + window.electCourseTable.openCourseIds + ",";
	}

	jQuery("#electFloatBar").bind("initStdElectCourseDefaultPage",function(e,base,profileId,
			electableIds,electedIds,hasOrderTextbookLessonIds,unWithdrawableLessonIds,
			weekDays,checkTimeConflict,noRetake,hisCourses,courseSubstitutions,
			batchOperator,limitCheck,virtualCashEnabled,stdName,needAudit,auditLessonIds){
			window.electCourseTable = new ElectCourseTable(jQuery("#courseTable table"),jQuery("#tip"),jQuery("#electableLessonList"),jQuery("#electedLessonList"),jQuery("#electCart table"));
			window.electCourseTable.showProgressbar();
			var lessons = TAFFY(lessonJSONs);
			var takedLessonJSONs = eval(takedLessonsStr);
			lessons.insert(takedLessonJSONs);
			
			var _removedCount = lessons(function() { return !electableIds["l"+this.id]; }).remove();
			var lessonIds = new Array(lessonJSONs.length + takedLessonJSONs.length - _removedCount);
			var openCourseIds = new Array();
			var courseTypeId2HasLesson = {};
			window.electCourseTable.lessons = lessons;
			
			lessons().each(function(lessonArray, index) {				
				var lessonId = lessonArray.id;
				var elected = electedIds["l"+lessonId]==true;				
				var audited = auditLessonIds["l"+lessonId]==true;
				var hasOrderTextbook = hasOrderTextbookLessonIds["l"+lessonId]==true;
				var withdrawable = !unWithdrawableLessonIds["l"+lessonId] == true;
				lessons(lessonArray.___id).update({
					assign : (electableIds["l" + lessonId]=="assign"),
					elected : elected,
					defaultElected : elected,
					hasOrderTextBook : hasOrderTextbook,
					withdrawable : withdrawable,
					audited : audited
				});
				courseTypeId2HasLesson[lessonArray.courseTypeId] = true;
				lessonIds.push(lessonArray.id);
				openCourseIds.push(lessonArray.courseId);
			});
			for(courseTypeId in courseTypeId2HasLesson) {
				jQuery(".electGroupResult[courseTypeId='"+courseTypeId+"']").attr("hasLesson",true);
			}
			window.electCourseTable.lessonIds = lessonIds.join(",");
			window.electCourseTable.openCourseIds = openCourseIds.join(",");
			window.electCourseTable.config.weekDays = weekDays;
			window.electCourseTable.config.checkTimeConflict = checkTimeConflict || false;
			window.electCourseTable.config.noRetake = noRetake;
			window.electCourseTable.config.hisCourses = hisCourses;
			window.electCourseTable.config.courseSubstitutions = courseSubstitutions;
			window.electCourseTable.config.batchOperator = batchOperator;
			window.electCourseTable.config.limitCheck = limitCheck;
			window.electCourseTable.config.virtualCashEnabled = virtualCashEnabled;
			window.electCourseTable.config.stdName = stdName;
			window.electCourseTable.config.needAudit = needAudit;
			window.electCourseTable.config.profileId = profileId;
			window.electCourseTable.init();
			
			jQuery(".gridempty").hide();
			jQuery(".electTabPanel").show();
			
			//jQuery("body").append("<textarea style='width:100%'>"+lessons+"</textarea>")
			jQuery(".electTabPanel").find(".electTabSelected").trigger("click");
			
			var _q = function() {
				electCourseTable.queryStdCount();
				setTimeout(_q, electCourseTable.config.time);
			};
			setTimeout(_q, electCourseTable.config.time);
			window.electCourseTable.tipRequiredCourse();
	});
	
	ElectCourseTable.prototype.tipRequiredCourse = function(){
		var res = jQuery.post(electCourseTable.config.base+"/stdElectCourse!tipRequiredCourse.action",{profileId:electCourseTable.config.profileId},function(){
			if(res.status==200){
				jQuery("#requiredSpan").empty();
				if(res.responseText){
					jQuery("#requiredSpan").append("<font color='red'>未选专业必修课:</font>"+res.responseText+"");
				}
			}
		},"text");
	}
	
	ElectCourseTable.prototype.thisTurnRemain = function(lessonId) {
		jQuery.colorbox({
			transition:"none",
			title:"",
			href:electCourseTable.config.base + "/stdElectCourse!thisTurnRemain.action?lessonId=" + lessonId,
			width:"400px",
			height:"160px"
		});
	}
	
	// 学生点击任务，课表上显示任务的颜色
	var prev_lessonId_showed_on_table = null;
	ElectCourseTable.prototype.showLessonOnTable = function(event) {
		jQuery(window.electCourseTable.table).find("tbody tr td.electableCell").removeClass("lessonOnTable");
		var lessonId = jQuery(this).attr("id").replace("lesson", "");
		// 学生再次点击就了在课表上的显示
		if(prev_lessonId_showed_on_table === lessonId) {
			prev_lessonId_showed_on_table = null;
			return;
		}
		prev_lessonId_showed_on_table = lessonId;
		var _lesson = window.electCourseTable.lessons({id : parseInt(lessonId, 10) }).first();
		for(var i = 0; i < _lesson.arrangeInfo.length; i++) {
			var activity = _lesson.arrangeInfo[i];
			var weekDay = activity.weekDay;
			for(var j = activity.startUnit; j <= activity.endUnit; j++) {
				jQuery(window.electCourseTable.table).find("tbody tr td.electableCell[weekDay=" + weekDay + "][unit=" + j + "]").addClass("lessonOnTable");
			}
		}
	}
	jQuery("#electedLessonList tr:first-child").hide();
	
	// 解决在IE8下，点击课表弹出的教学任务单元格子，当鼠标在上面晃悠的时候，会闪烁的问题
	jQuery("html").unbind("mouseover").mouseover(
			function(event) {
				var tip = electCourseTable.tip;
				var tipId = tip.attr("id");
				var target = event.target;
				if(!tip.is(":hidden") && 
						target.id !== tipId && !jQuery(target).is("#" + tipId + " *") 
				) {
					tip.hide();
					jQuery('.electCellHover').removeClass("electCellHover");
				}
			}
	);
	
	var lessonPredicate = function(options) {
		return function() {
			var pass = true;
			for(key in options) {
				pass &= (this[key] == options[key]);
			}
			if(pass) return true;
			return false;
		};
	};
	var arrangePredicate = function(options) {
		return function() {
			for(var i = 0; i < this.arrangeInfo.length; i++) {
				var pass = true;
				for(key in options) {
					if(key == "unit") {
						pass &= this.arrangeInfo[i].startUnit <= options[key] && options[key] <= this.arrangeInfo[i].endUnit;
					} else {
						pass &= (this.arrangeInfo[i][key] == options[key]);
					}
				}
				if(pass) return true;
			}
			return false;
		};
	};
});
