(function() {
  'use strict';

  angular
    .module('nonoApp')
    .directive('mallMember', mallMember)

  /** @ngInject */
  function mallMember() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/mall-member-scroll/member.html',
      scope: {
        member: '='
      },
      link: function(scope, element) {
        topTen(400);
        function topTen(h) {
          var list1 = document.getElementById('userList1'),
            list2 = document.getElementById('userList2'),
            listHeight = h, //列表高度，作为入参传过来，不能直接获取（确保数据获取到之后才执行滚动）400
            delay = 0, //延时：每2秒滚动一次
            stopY = 0, //定时高度：stopY==listHeight时，停2秒
            showHeight = 40; //显示区域高度

          //初始化2个列表位置（相对显示区域）  
          list1.style.top = 0 + 'px';
          list1.style.top = listHeight + 'px'
            //初始化2个列表的滚动起始位置
          list1.startY = list1.offsetTop;
          list2.startY = list2.offsetTop;
          //初始化2个列表的滚动高度
          list1.scrollY = 0;
          list2.scrollY = 0;

          setInterval(function() {

            //2秒定时器
            if (delay > 0) {
              delay -= 33;
              return;
            } else {
              delay = 0;
            }

            //列表没33毫秒的滚动高度
            list1.scrollY += 2;
            list2.scrollY += 2;

            //列表超出显示区域下移
            if (list1.scrollY - list1.startY >= listHeight) {
              list1.scrollY = 0;
              list1.startY = list2.startY - list2.scrollY + listHeight;
              list1.style.top = list1.startY + 'px';
            }
            if (list2.scrollY - list2.startY >= listHeight) {
              list2.scrollY = 0;
              list2.startY = list1.startY - list1.scrollY + listHeight;
              list2.style.top = list2.startY + 'px';
            }

            //滚动动画
            list1.style.transform = 'translate3d(0,' + (-list1.scrollY) + 'px,0)';
            list1.style.webkitTransform = 'translate3d(0,' + (-list1.scrollY) + 'px,0)';
            list2.style.transform = 'translate3d(0,' + (-list2.scrollY) + 'px,0)';
            list2.style.webkitTransform = 'translate3d(0,' + (-list2.scrollY) + 'px,0)';

            //利用已经滚动的高度计算是否定时
            stopY += 2;
            if (stopY >= showHeight) {
              stopY = 0;
              delay = 2000;
            }
          }, 33);
        }
      }
    };
    return directive;
  }

})();
