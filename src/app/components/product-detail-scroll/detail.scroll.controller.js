(function() {
  'use strict';

  angular
    .module('nonoApp')
    .directive('detailScroll', detailScroll)

  /** @ngInject */
  function detailScroll($ionicScrollDelegate) {
    var directive = {
      restrict: 'E',
      replace: true,
      transclude: true,
      template: '<div class="detail-scroll-container" ng-transclude></div>',
      link: function(scope, element, attr) {
        // main scroll 
        var top = 0;
        var test = document.getElementById('test');
        var proDetail = document.getElementById('pro-detail');
        var proInfo = document.getElementById('pro-info');

        var contentH = test.offsetHeight - 44;
        //加载tab
        var proDetailH;
        proDetail.addEventListener('touchstart', function(event) {}, false);
        proDetail.addEventListener('touchmove', function(event) {}, false);
        proDetail.addEventListener('touchend', function(event) {
          proDetailH = proDetail.offsetHeight;
          var dis = proDetailH - contentH + 30;
          top = $ionicScrollDelegate.$getByHandle('mainScroll').getScrollPosition().top;
          if (top > dis) {
            $ionicScrollDelegate.$getByHandle('mainScroll').scrollTo(0, proDetailH, true);
          }
        }, false);

        //返回detail
        proInfo.addEventListener('touchstart', function(event) {}, false);
        proInfo.addEventListener('touchmove', function(event) {}, false);
        proInfo.addEventListener('touchend', function(event) {
          top = $ionicScrollDelegate.$getByHandle('mainScroll').getScrollPosition().top;
          if (top > (proDetailH + 3)) {
            $ionicScrollDelegate.$getByHandle('mainScroll').scrollTo(0, proDetailH, true);
          }
          if (top < (proDetailH - 30)) {
            $ionicScrollDelegate.$getByHandle('mainScroll').scrollTop(true);
          }

        }, false);

      }
    };

    return directive;
  }


})();
