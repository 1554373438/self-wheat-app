(function() {
  'use strict';

  angular
    .module('nonoApp')
    .directive('pullScroll', pullScroll)

  /** @ngInject */
  function pullScroll($log, $timeout, $ionicScrollDelegate, $rootScope) {
    var directive = {
      restrict: 'E',
      transclude: true,
      template: '<div class="pull-scroll-container" ng-transclude></div>',
      scope: {
        pullend: '='
      },
      link: function(scope, element, attr) {

        var $mainScroll = $ionicScrollDelegate.$getByHandle('mainScroll');
        var mainScrolEle = $ionicScrollDelegate._instances[0].element;

        var isMoving = false,
          lastTop, contentH, windowH, maxY, threshold;
        var userAgent = window.navigator.userAgent.toLowerCase(),
          ios = /iphone|ipod|ipad/.test(userAgent);

        $rootScope.$on('scroll.infiniteScrollComplete', function() {
          if (isMoving) {
            return;
          }
          contentH = mainScrolEle.scrollHeight - 60;
          windowH = mainScrolEle.clientHeight;
          maxY = Math.max(contentH - windowH, 0); //屏幕允许滚动的最大距离
          threshold = parseInt(maxY + windowH / 3);
          lastTop = $mainScroll.getScrollPosition() && $mainScroll.getScrollPosition().top;
          if (ios) {
            if (lastTop >= threshold) {
              $mainScroll.scrollTo(0, contentH, true);
              scope.pullend = true;
            } else {
              scope.pullend = false;
            }

          } else {
            if (lastTop >= maxY) {
              $mainScroll.scrollTo(0, contentH, true);
              scope.pullend = true;
            } else {
              scope.pullend = false;
            }
          }
        });

        element.on('touchmove', function() {
          isMoving = true;
        })

        element.on('touchend', function(e) {
          isMoving = false;
          if (scope.pullend) {
            var curTop = $mainScroll.getScrollPosition().top;
            if (curTop < contentH) {
              scope.pullend = false;
              scope.$apply();
            }
          }
        });


      }
    };

    return directive;
  }


})();
