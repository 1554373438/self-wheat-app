(function() {
  'use strict';

  angular
    .module('nonoApp')
    .directive('signData', signData);

  /** @ngInject */
  function signData($rootScope, localStorageService) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        info: '=',
        repayinfor: '='
      },
      required: ['info', 'repayinfor'],
      templateUrl: "app/components/sign/sign.html",
      link: function(scope, element, attr) {
        dateSign();
        scope.$watch('info', function(arr) {
          if (arr && arr.length) {
            sign(arr);
          }
        }, true);

        scope.$watch('repayinfor', function(arr) {
          if (arr && arr.length) {
            repaySign(arr);
          }
        }, true);

        var chooseData = new Date();
        var y = scope.YY = chooseData.getFullYear();
        var m = scope.MM = chooseData.getMonth() + 1 + '月';

        scope.backData = function() {
          document.getElementById("box").innerHTML = '';

          document.getElementById("month").innerHTML = m;
          document.getElementById("year").innerHTML = y;

          dateSign();
          var backYY = y;
          var backMM = parseInt(m).toString();
          localStorageService.set('confirmData', backYY.toString().concat(backMM < 10 ? '0' + backMM : backMM));
          $rootScope.$broadcast('repay.confirmData');
        }

        window.LCalendar = (function() {
          var MobileCalendar = function() {
            this.gearDate;
            this.minY = 1900;
            this.minM = 1;
            this.minD = 1;
            this.maxY = 2099;
            this.maxM = 12;
            this.maxD = 31;
          }
          MobileCalendar.prototype = {
            init: function(params) {
              this.type = params.type;
              this.trigger = document.querySelector(params.trigger);

              this.triggerMonth = document.querySelector(params.triggerMonth);
              this.triggerYear = document.querySelector(params.triggerYear);

              if (params.minDate) {
                var minArr = params.minDate.split('-');
                this.minY = ~~minArr[0];
                this.minM = ~~minArr[1];
                this.minD = ~~minArr[2];
              }
              if (params.maxDate) {
                var maxArr = params.maxDate.split('-');
                this.maxY = ~~maxArr[0];
                this.maxM = ~~maxArr[1];
                this.maxD = ~~maxArr[2];
              }
              this.bindEvent(this.type);
            },
            bindEvent: function(type) {
              var _self = this;
              //呼出年月插件
              function popupYM(e) {
                document.getElementById("arrow-down").className = "arrow-direction";
                _self.gearDate = document.createElement("div");
                _self.gearDate.className = "gearDate";
                _self.gearDate.innerHTML = '<div class="date_ctrl slideInUp">' +
                  '<div class="date_btn_box">' +
                  '<div class="date_btn lcalendar_cancel">取消</div>' +
                  '<div class="date_btn lcalendar_finish">确定</div>' +
                  '</div>' +
                  '<div class="date_roll_mask">' +
                  '<div class="ym_roll">' +
                  '<div>' +
                  '<div class="gear date_yy" data-datetype="date_yy"></div>' +
                  '<div class="date_grid">' +
                  '<div>年</div>' +
                  '</div>' +
                  '</div>' +
                  '<div>' +
                  '<div class="gear date_mm" data-datetype="date_mm"></div>' +
                  '<div class="date_grid">' +
                  '<div>月</div>' +
                  '</div>' +
                  '</div>' +
                  '</div>' +
                  '</div>' +
                  '</div>';
                document.body.appendChild(_self.gearDate);
                ymCtrlInit();
                var lcalendar_cancel = _self.gearDate.querySelector(".lcalendar_cancel");
                lcalendar_cancel.addEventListener('touchstart', closeMobileCalendar);
                var lcalendar_finish = _self.gearDate.querySelector(".lcalendar_finish");
                lcalendar_finish.addEventListener('touchstart', finishMobileYM);
                var date_yy = _self.gearDate.querySelector(".date_yy");
                var date_mm = _self.gearDate.querySelector(".date_mm");
                date_yy.addEventListener('touchstart', gearTouchStart);
                date_mm.addEventListener('touchstart', gearTouchStart);
                date_yy.addEventListener('touchmove', gearTouchMove);
                date_mm.addEventListener('touchmove', gearTouchMove);
                date_yy.addEventListener('touchend', gearTouchEnd);
                date_mm.addEventListener('touchend', gearTouchEnd);
              }
              //初始化年月插件默认值
              function ymCtrlInit() {
                var date = new Date();
                var dateArr = {
                  yy: date.getFullYear(),
                  mm: date.getMonth()
                };
                if (/^\d{4}-\d{1,2}$/.test(_self.trigger.value)) {
                  var rs = _self.trigger.value.match(/(^|-)\d{1,4}/g);
                  dateArr.yy = rs[0] - _self.minY;
                  dateArr.mm = rs[1].replace(/-/g, "") - 1;
                } else {
                  dateArr.yy = dateArr.yy - _self.minY;
                }
                _self.gearDate.querySelector(".date_yy").setAttribute("val", dateArr.yy);
                _self.gearDate.querySelector(".date_mm").setAttribute("val", dateArr.mm);
                setDateGearTooth();
              }
              //重置日期节点个数
              function setDateGearTooth() {
                var passY = _self.maxY - _self.minY + 1;
                var date_yy = _self.gearDate.querySelector(".date_yy");
                var itemStr = "";
                if (date_yy && date_yy.getAttribute("val")) {
                  //得到年份的值
                  var yyVal = parseInt(date_yy.getAttribute("val"));
                  //p 当前节点前后需要展示的节点个数
                  for (var p = 0; p <= passY - 1; p++) {
                    itemStr += "<div class='tooth'>" + (_self.minY + p) + "</div>";
                  }
                  date_yy.innerHTML = itemStr;
                  var top = Math.floor(parseFloat(date_yy.getAttribute('top')));
                  if (!isNaN(top)) {
                    top % 2 == 0 ? (top = top) : (top = top + 1);
                    top > 8 && (top = 8);
                    var minTop = 8 - (passY - 1) * 2;
                    top < minTop && (top = minTop);
                    date_yy.style["-webkit-transform"] = 'translate3d(0,' + top + 'em,0)';
                    date_yy.setAttribute('top', top + 'em');
                    yyVal = Math.abs(top - 8) / 2;
                    date_yy.setAttribute("val", yyVal);
                  } else {
                    date_yy.style["-webkit-transform"] = 'translate3d(0,' + (8 - yyVal * 2) + 'em,0)';
                    date_yy.setAttribute('top', 8 - yyVal * 2 + 'em');
                  }
                } else {
                  return;
                }
                var date_mm = _self.gearDate.querySelector(".date_mm");
                if (date_mm && date_mm.getAttribute("val")) {
                  itemStr = "";
                  //得到月份的值
                  var mmVal = parseInt(date_mm.getAttribute("val"));
                  var maxM = 11;
                  var minM = 0;
                  //当年份到达最大值
                  if (yyVal == passY - 1) {
                    maxM = _self.maxM - 1;
                  }
                  //当年份到达最小值
                  if (yyVal == 0) {
                    minM = _self.minM - 1;
                  }
                  //p 当前节点前后需要展示的节点个数
                  for (var p = 0; p < maxM - minM + 1; p++) {
                    itemStr += "<div class='tooth'>" + (minM + p + 1) + "</div>";
                  }
                  date_mm.innerHTML = itemStr;
                  if (mmVal > maxM) {
                    mmVal = maxM;
                    date_mm.setAttribute("val", mmVal);
                  } else if (mmVal < minM) {
                    mmVal = maxM;
                    date_mm.setAttribute("val", mmVal);
                  }
                  date_mm.style["-webkit-transform"] = 'translate3d(0,' + (8 - (mmVal - minM) * 2) + 'em,0)';
                  date_mm.setAttribute('top', 8 - (mmVal - minM) * 2 + 'em');
                } else {
                  return;
                }
              }
              //触摸开始
              function gearTouchStart(e) {
                e.preventDefault();
                var target = e.target;
                while (true) {
                  if (!target.classList.contains("gear")) {
                    target = target.parentElement;
                  } else {
                    break;
                  }
                }
                clearInterval(target["int_" + target.id]);
                target["old_" + target.id] = e.targetTouches[0].screenY;
                target["o_t_" + target.id] = (new Date()).getTime();
                var top = target.getAttribute('top');
                if (top) {
                  target["o_d_" + target.id] = parseFloat(top.replace(/em/g, ""));
                } else {
                  target["o_d_" + target.id] = 0;
                }
                target.style.webkitTransitionDuration = target.style.transitionDuration = '0ms';
              }
              //手指移动
              function gearTouchMove(e) {
                e.preventDefault();
                var target = e.target;
                while (true) {
                  if (!target.classList.contains("gear")) {
                    target = target.parentElement;
                  } else {
                    break;
                  }
                }
                target["new_" + target.id] = e.targetTouches[0].screenY;
                target["n_t_" + target.id] = (new Date()).getTime();
                var f = (target["new_" + target.id] - target["old_" + target.id]) * 30 / window.innerHeight;
                target["pos_" + target.id] = target["o_d_" + target.id] + f;
                target.style["-webkit-transform"] = 'translate3d(0,' + target["pos_" + target.id] + 'em,0)';
                target.setAttribute('top', target["pos_" + target.id] + 'em');
                if (e.targetTouches[0].screenY < 1) {
                  gearTouchEnd(e);
                }
              }
              //离开屏幕
              function gearTouchEnd(e) {
                e.preventDefault();
                var target = e.target;
                while (true) {
                  if (!target.classList.contains("gear")) {
                    target = target.parentElement;
                  } else {
                    break;
                  }
                }
                var flag = (target["new_" + target.id] - target["old_" + target.id]) / (target["n_t_" + target.id] - target["o_t_" + target.id]);
                if (Math.abs(flag) <= 0.2) {
                  target["spd_" + target.id] = (flag < 0 ? -0.08 : 0.08);
                } else {
                  if (Math.abs(flag) <= 0.5) {
                    target["spd_" + target.id] = (flag < 0 ? -0.16 : 0.16);
                  } else {
                    target["spd_" + target.id] = flag / 2;
                  }
                }
                if (!target["pos_" + target.id]) {
                  target["pos_" + target.id] = 0;
                }
                rollGear(target);
              }
              //缓动效果
              function rollGear(target) {
                var d = 0;
                var stopGear = false;

                function setDuration() {
                  target.style.webkitTransitionDuration = target.style.transitionDuration = '200ms';
                  stopGear = true;
                }
                var passY = _self.maxY - _self.minY + 1;
                clearInterval(target["int_" + target.id]);
                target["int_" + target.id] = setInterval(function() {
                  var pos = target["pos_" + target.id];
                  var speed = target["spd_" + target.id] * Math.exp(-0.03 * d);
                  pos += speed;
                  if (Math.abs(speed) > 0.1) {} else {
                    var b = Math.round(pos / 2) * 2;
                    pos = b;
                    setDuration();
                  }
                  if (pos > 8) {
                    pos = 8;
                    setDuration();
                  }
                  switch (target.dataset.datetype) {
                    case "date_yy":
                      var minTop = 8 - (passY - 1) * 2;
                      if (pos < minTop) {
                        pos = minTop;
                        setDuration();
                      }
                      if (stopGear) {
                        var gearVal = Math.abs(pos - 8) / 2;
                        setGear(target, gearVal);
                        clearInterval(target["int_" + target.id]);
                      }
                      break;
                    case "date_mm":
                      var date_yy = _self.gearDate.querySelector(".date_yy");
                      //得到年份的值
                      var yyVal = parseInt(date_yy.getAttribute("val"));
                      var maxM = 11;
                      var minM = 0;
                      //当年份到达最大值
                      if (yyVal == passY - 1) {
                        maxM = _self.maxM - 1;
                      }
                      //当年份到达最小值
                      if (yyVal == 0) {
                        minM = _self.minM - 1;
                      }
                      var minTop = 8 - (maxM - minM) * 2;
                      if (pos < minTop) {
                        pos = minTop;
                        setDuration();
                      }
                      if (stopGear) {
                        var gearVal = Math.abs(pos - 8) / 2 + minM;
                        setGear(target, gearVal);
                        clearInterval(target["int_" + target.id]);
                      }
                      break;
                    default:
                  }
                  target["pos_" + target.id] = pos;
                  target.style["-webkit-transform"] = 'translate3d(0,' + pos + 'em,0)';
                  target.setAttribute('top', pos + 'em');
                  d++;
                }, 30);
              }
              //控制插件滚动后停留的值
              function setGear(target, val) {
                val = Math.round(val);
                target.setAttribute("val", val);
                if (/date/.test(target.dataset.datetype)) {
                  setDateGearTooth();
                } else {
                  setTimeGearTooth();
                }
              }
              //取消
              function closeMobileCalendar(e) {
                e.preventDefault();
                var evt;
                try {
                  evt = new CustomEvent('input');
                } catch (e) {
                  //兼容旧浏览器(注意：该方法已从最新的web标准中删除)
                  evt = document.createEvent('Event');
                  evt.initEvent('input', true, true);
                }
                _self.trigger.dispatchEvent(evt);
                document.body.removeChild(_self.gearDate);
                _self.gearDate = null;
                document.getElementById("arrow-down").className = "";
              }
              //年月确认
              function finishMobileYM(e) {
                var passY = _self.maxY - _self.minY + 1;
                var date_yy = parseInt(Math.round(_self.gearDate.querySelector(".date_yy").getAttribute("val")));
                var date_mm = parseInt(Math.round(_self.gearDate.querySelector(".date_mm").getAttribute("val"))) + 1;
                // date_mm = date_mm > 9 ? date_mm : '0' + date_mm;
                _self.trigger.value = (date_yy % passY + _self.minY) + "年" + date_mm + "月";
                var date_year = date_yy % passY + _self.minY;

                _self.triggerMonth.innerHTML = date_mm + '月';
                _self.triggerYear.innerHTML = date_year;

                document.getElementById("box").innerHTML = '';
                dateSign(date_year, date_mm);
                closeMobileCalendar(e);

                document.getElementById("arrow-down").className = "";
                localStorageService.set('confirmData', date_year.toString().concat(date_mm < 10 ? '0' + date_mm : date_mm));
                $rootScope.$broadcast('repay.confirmData');

                // document.getElementById("arrow-down").removeClass("arrow-direction");
              }
              _self.trigger.addEventListener('click', {
                "ym": popupYM
              }[type]);
            }
          }
          return MobileCalendar;
        })();

        var calendarym = new LCalendar();
        calendarym.init({
          'trigger': '#dataLeft',
          'triggerMonth': '#month',
          'triggerYear': '#year',
          'type': 'ym',
          'minDate': new Date().getFullYear() + '-' + (new Date().getMonth() + 1),
          'maxDate': new Date().getFullYear() + 3 + '-' + (new Date().getMonth() + 1)
        });

        //---------------------------签到日历-------------------
        function sign(info) {
          var datasArr = document.getElementsByClassName("data");
          var arr = info;
          var arrItem = [];
          var currentDate = info[info.length - 1].sign_date; //最后一项
          for (var i = 0; i < arr.length; i++) {
            arrItem[i] = arr[i].sign_date;
          }
          for (var i = 0; i < datasArr.length; i++) {
            var sign_date = datasArr[i].getAttribute('value');
            // console.log(sign_date);
            for (var j = 0; j < arrItem.length; j++) {
              if (sign_date == arrItem[j]) {
                // console.log(arrItem[j]);
                if (sign_date == currentDate) {
                  datasArr[i].setAttribute('class', 'data current');
                } else {
                  datasArr[i].setAttribute('class', 'data sign');
                }
              }
            }
          }
        }

        //---------------------------回款-------------------
        function repaySign(info) {
          var today = new Date();
          var _year = today.getFullYear(),
            _month = today.getMonth() + 1,
            _day = today.getDate();
          var nowDatas = _year + "-" + (_month < 10 ? '0' + _month : _month) + "-" + (_day < 10 ? '0' + _day : _day);
          var datasArr = document.getElementsByClassName("data");
          var arrItem = info;
          var currentDate = arrItem[0]; //第一项
          for (var i = 0; i < datasArr.length; i++) {
            var sign_date = datasArr[i].getAttribute('value');
            for (var j = 0; j < arrItem.length; j++) {
              if (sign_date == arrItem[j]) {
                datasArr[i].setAttribute('class', 'data line');
              }
            }
            if (sign_date == nowDatas) {
              datasArr[i].className = datasArr[i].className + ' nowDatas';
            }
          }
        }

        function dateSign(scrollYear, scrollMonth) {
          // alert("a");
          //判断闰年
          function runNian(_year) {
            if (_year % 400 === 0 || (_year % 4 === 0 && _year % 100 !== 0)) {
              return true;
            } else {
              return false;
            }
          }
          //判断某年某月的1号是星期几
          function getFirstDay(_year, _month) {
            var allDay = 0,
              y = _year - 1,
              i = 1;
            allDay = y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) + 1;
            for (; i < _month; i++) {
              switch (i) {
                case 1:
                  allDay += 31;
                  break;
                case 2:
                  if (runNian(_year)) {
                    allDay += 29;
                  } else {
                    allDay += 28;
                  }
                  break;
                case 3:
                  allDay += 31;
                  break;
                case 4:
                  allDay += 30;
                  break;
                case 5:
                  allDay += 31;
                  break;
                case 6:
                  allDay += 30;
                  break;
                case 7:
                  allDay += 31;
                  break;
                case 8:
                  allDay += 31;
                  break;
                case 9:
                  allDay += 30;
                  break;
                case 10:
                  allDay += 31;
                  break;
                case 11:
                  allDay += 30;
                  break;
                case 12:
                  allDay += 31;
                  break;
              }
            }
            return allDay % 7;
          }
          //显示日历
          function showCalendar(_year, _month, _day, firstDay) {
            var i = 0,
              monthDay = 0,
              showStr = "";
              // _classname = "",
              // today = new Date();
            //月份的天数
            switch (_month) {
              case 1:
                monthDay = 31;
                break;
              case 2:
                if (runNian(_year)) {
                  monthDay = 29;
                } else {
                  monthDay = 28;
                }
                break;
              case 3:
                monthDay = 31;
                break;
              case 4:
                monthDay = 30;
                break;
              case 5:
                monthDay = 31;
                break;
              case 6:
                monthDay = 30;
                break;
              case 7:
                monthDay = 31;
                break;
              case 8:
                monthDay = 31;
                break;
              case 9:
                monthDay = 30;
                break;
              case 10:
                monthDay = 31;
                break;
              case 11:
                monthDay = 30;
                break;
              case 12:
                monthDay = 31;
                break;
            }

            //输出日历表格，这部分因结构而异
            showStr = "<table class='cld-w'><thead>";
            //日历头部
            showStr += "<tr><th colspan='7'><div class='cld-hd'><em id='showDate' value='" + _year + "-" + _month + "-" + _day + "'>" + _year + "年" + _month + "月" + _day + "日" + "</em></div></th></tr>";
            //日历星期
            showStr += "<tr><th class='noBlue'>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th class='noBlue'>六</th></tr>";
            showStr += "</thead><tbody><tr>";
            //当月第一天前的空格
            for (var i = 1; i <= firstDay; i++) {
              showStr += "<td><span></span></td>";
            }
            //显示当前月的天数

            for (var i = 1; i <= monthDay; i++) {
              //把日期存在对应的value 
              var datas = _year + "-" + (_month < 10 ? '0' + _month : _month) + "-" + (i < 10 ? '0' + i : i);
              // var datas = _year + "-" + _month + "-" + i;
              var nowDatas = _year + "-" + (_month < 10 ? '0' + _month : _month) + "-" + (_day < 10 ? '0' + _day : _day);
              if (datas == nowDatas) {
                showStr += "<td><span class = 'data nowDatas' value = " + datas + ">" + i + "</span></td>";
              } else {
                showStr += "<td><span class = 'data' value = " + datas + ">" + i + "</span></td>";
              }
              // datasArr.push(datas);
              firstDay = (firstDay + 1) % 7;
              if (firstDay === 0 && i !== monthDay) {
                showStr += "</tr><tr>";
              }
            }

            //剩余的空格
            if (firstDay !== 0) {
              for (i = firstDay; i < 7; i++) {
                showStr += "<td><span></span></td>";
              }
            }

            showStr += "</tr></tbody></table>";
            //插入calendar的页面结构里
            calendar.innerHTML = showStr;
          }
          //显示年月日
          function showDate(_year, _month, _day) {
            var date = "",
              firstDay = getFirstDay(_year, _month, _day);
            if (_day !== 0) {
              date = _year + "年" + _month + "月" + _day + "日";
            } else {
              date = "No Choose.";
            }
            document.getElementById("showDate").innerHTML = date; //日历头部显示
            showCalendar(_year, _month, _day, firstDay); //调用日历显示函数
          }
          //初始化
          var calendar = document.createElement('div');
          calendar.setAttribute('id', 'showCld');
          document.getElementById("box").appendChild(calendar); //增加到你的box里

          //获取当天的年月日    
          var today = new Date();
          var _year = scrollYear || today.getFullYear(),
            _month = scrollMonth || today.getMonth() + 1,
            _day = today.getDate();
          var firstDay = getFirstDay(_year, _month);

          //显示日历
          showCalendar(_year, _month, _day, firstDay);
        }
      }
    }

    return directive;
  };

})();
