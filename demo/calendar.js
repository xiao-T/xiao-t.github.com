<script type="text/javascript">
			Array.prototype.in_array = function(e) {
			    for (i = 0; i < this.length; i++) {
			        if (this[i] == e)
			            return true;
			    }
			    return false;
			}

			function DateLinkMapping(date, link) {
			    this.Date = date;
			    this.Link = link;
			}
			var Calendar = {
			    settings: {
			        firstDayOfWeek: 7,
			        baseClass: "calendar",
			        curDayClass: "curDay",
			        prevMonthCellClass: "prevMonth",
			        nextMonthCellClass: "nextMonth",
			        curMonthNormalCellClass: "",
			        prevNextMonthDaysVisible: true
			    },
			    containerId: "",
			    weekDayNames: [],
			    dateLinkMappings: [],
			    Init: function(weekDayNames, dateLinkMappings, settings) {
			        if (!weekDayNames || weekDayNames.length && weekDayNames.length != 7) {
			            this.weekDayNames[1] = "一";
			            this.weekDayNames[2] = "二";
			            this.weekDayNames[3] = "三";
			            this.weekDayNames[4] = "四";
			            this.weekDayNames[5] = "五";
			            this.weekDayNames[6] = "六";
			            this.weekDayNames[7] = "日";
			        } else {
			            this.weekDayNames = weekDayNames;
			        }
			        if (dateLinkMappings) {
			            this.dateLinkMappings = dateLinkMappings;
			        }
			    },
			    RenderCalendar: function(divId, month, year) {
			        this.containerId = divId;
			        var ht = [];

			        ht.push("<table class='", this.settings.baseClass, "' cellspacing='0' cellpadding='0' border='0'>");
			        ht.push(this._RenderTitle(month, year));
			        ht.push(this._RenderBody(month, year));
			        ht.push("</table>");

			        document.getElementById(divId).innerHTML = ht.join("");
			        this._InitEvent(divId, month, year);
			    },
			    _RenderTitle: function(month, year) {
			        var ht = [];
			        //日期
			        ht.push("<thead><tr>");
			        ht.push("<th colspan='7'><div class='tit'><h4>直播日历</h4><div class='ny'>", year, "年", month, "月</div><a id='", this.containerId, "_prevMonth' href='javascript:void(0);' class='left_btn' title='上一月'>上一月</a><a href='javascript:void(0);' id='", this.containerId, "_nextMonth' class='right_btn' title='下一月'>下一月</a></div></th>");
			        ht.push("</tr></thead>");
			        //星期
			        ht.push("<tr>");
			        for (var i = 0; i < 7; i++) {
			            var day = (i + this.settings.firstDayOfWeek) == 7 ? 7 : (i + this.settings.firstDayOfWeek) % 7;
			            ht.push("<th><p>", this.weekDayNames[day], "</p></th>")
			        }
			        ht.push("</tr>");
			        return ht.join("");
			    },
			    _RenderBody: function(month, year) {
			        var date = new Date(year, month - 1, 1);
			        var day = date.getDay();
			        var dayOfMonth = 1;
			        var daysOfPrevMonth = (7 - this.settings.firstDayOfWeek + day) % 7;
			        var totalDays = this._GetTotalDays(month, year);
			        var totalDaysOfPrevMonth = this._GetToalDaysOfPrevMonth(month, year);
			        var ht = [];
			        var curDate;
			        var obj = [];

			        $.ajax({
			            type: "POST",
			            url: "/site/choosedate.html",
			            data: "year=" + year + "&month=" + month,
			            async: false,
			            dataType: "json",
			            success: function(data) {
			                obj = data;
			            }
			        });

			        for (var i = 0;; i++) {
			            curDate = null;
			            if (i % 7 == 0) { //新起一行
			                ht.push("<tr>");
			            }
			            ht.push("<td");
			            if (i >= daysOfPrevMonth && dayOfMonth <= totalDays) { //本月
			                curDate = new Date(year, month - 1, dayOfMonth);
			                if (Date.parse(new Date().toDateString()) - curDate == 0) {
			                    ht.push(" class='", this.settings.curDayClass, "'");
			                } else {
			                    ht.push(" class='", this.settings.curMonthNormalCellClass, "'");
			                }
			                dayOfMonth++;

			            } else if (i < daysOfPrevMonth) { //上月
			                if (this.settings.prevNextMonthDaysVisible) {
			                    var prevMonth = month;
			                    var prevYear = year;
			                    if (month == 1) {
			                        prevMonth = 12;
			                        prevYear = prevYear - 1;
			                    } else {
			                        prevMonth = prevMonth - 1;
			                    }
			                    curDate = new Date(prevYear, prevMonth - 1, totalDaysOfPrevMonth - (daysOfPrevMonth - i - 1));

			                    ht.push(" class='", this.settings.prevMonthCellClass, "'");
			                }
			            } else { //下月
			                if (this.settings.prevNextMonthDaysVisible) {
			                    var nextMonth = month;
			                    var nextYear = year;
			                    if (month == 12) {
			                        nextMonth = 1;
			                        nextYear = prevYear + 1;
			                    } else {
			                        nextMonth = nextMonth + 1;
			                    }
			                    curDate = new Date(nextYear, nextMonth - 1, i - dayOfMonth - daysOfPrevMonth + 2);
			                    ht.push(" class='", this.settings.nextMonthCellClass, "'");
			                }
			            }
			            ht.push("><p>");
			            //ht.push("<a href='#'>"); //类名S1,S2,s3分别为正在，结束，即将

			            if (obj[this._BuildCell(curDate)]) {
			                //url = '/site/index.html?year='+year+'&month='+month+'&day='+this._BuildCell(curDate);
			                url = '/' + year + '-' + month + '-' + this._BuildCell(curDate);
			                ht.push('<a class="s2" href="' + url + '">');
			            } else if (Date.parse(new Date().toDateString()) - curDate == 0) {
			                url = '/' + year + '-' + month + '-' + this._BuildCell(curDate);
			                ht.push('<a href="' + url + '">');
			            } else {
			                ht.push('<a href="javascript:void(0);">');
			            }
			            ht.push(this._BuildCell(curDate));
			            ht.push("</a></p></td>");
			            if (i % 7 == 6) { //结束一行
			                ht.push("</tr>");
			            }
			            if (i % 7 == 6 && dayOfMonth - 1 >= totalDays) {
			                break;
			            }
			        }
			        return ht.join("");
			    },
			    _BuildCell: function(curDate) {
			        var ht = [];
			        if (curDate) {
			            for (var j = 0; j < this.dateLinkMappings.length; j++) {
			                if (Date.parse(this.dateLinkMappings[j].Date) - curDate == 0) {
			                    ht.push("<a href='", this.dateLinkMappings[j].Link, "'>", curDate.getDate(), "</a>");
			                    break;
			                }
			            }
			            if (j == this.dateLinkMappings.length) {
			                ht.push(curDate.getDate());
			            }
			        } else {
			            ht.push("&nbsp;");
			        }
			        return ht.join("");
			    },
			    _InitEvent: function(divId, month, year) {
			        var t = this;
			        document.getElementById(this.containerId + "_prevMonth").style.cursor = "pointer";
			        document.getElementById(this.containerId + "_nextMonth").style.cursor = "pointer";

			        document.getElementById(this.containerId + "_prevMonth").onclick = function() {
			            if (month == 1) {
			                month = 12;
			                year = year - 1;
			            } else {
			                month = month - 1;
			            }

			            t.RenderCalendar(divId, month, year);
			        };
			        document.getElementById(this.containerId + "_nextMonth").onclick = function() {
			            if (month == 12) {
			                month = 1;
			                year = year + 1;
			            } else {
			                month = month + 1;
			            }

			            t.RenderCalendar(divId, month, year);
			        };
			    },
			    //计算指定月的总天数
			    _GetTotalDays: function(month, year) {
			        if (month == 2) {
			            if (this._IsLeapYear(year)) {
			                return 29;
			            } else {
			                return 28;
			            }
			        } else if (month == 4 || month == 6 || month == 9 || month == 11) {
			            return 30;
			        } else {
			            return 31;
			        }
			    },
			    _GetToalDaysOfPrevMonth: function(month, year) {
			        if (month == 1) {
			            month = 12;
			            year = year - 1;
			        } else {
			            month = month - 1;
			        }
			        return this._GetTotalDays(month, year);
			    },
			    //判断是否是闰年
			    _IsLeapYear: function(year) {
			        return year % 400 == 0 || (year % 4 == 0 && year % 100 != 0);
			    }
			};
		</script>

		<script  type="text/javascript">
			
			var date = new Date();
			var mapping = [];
			mapping.push(new DateLinkMapping("3-22-2010", "javascript:alert(1)"));
			mapping.push(new DateLinkMapping("4-1-2010", "javascript:alert(1)"))
			Calendar.Init(null, mapping);
			Calendar.RenderCalendar("calendar", date.getMonth() + 1, date.getFullYear());
		</script>