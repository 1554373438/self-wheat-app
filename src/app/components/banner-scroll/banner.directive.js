(function() {
  'use strict';

  angular
    .module('nonoApp')
    .directive('bannerScroll', bannerScroll)

  /** @ngInject */
  function bannerScroll($rootScope, $interval) {
    var directive = {
      restrict: 'E',
      replace: true,
      transclude: true,
      template: '<div class="banner-scroll-container" ng-transclude></div>',
      scope: true,
      link: function(scope, element, attr) {

        var vm = this,
          slider, ticker;

        vm.options = {
          loop: true,
          effect: 'fade',
          speed: 500,
          autoplay: 2000
        };
        // banner sliders
        scope.$on("$ionicSlides.sliderInitialized", function(event, data) {
          // data.slider is the instance of Swiper
          slider = data.slider;
          triggerTicker();
        });

        scope.$on('$ionicView.afterLeave', function(event, data) {
          ticker && $interval.cancel(ticker);
        });

        scope.$on('$ionicView.beforeEnter', function(event, data) {
          slider && triggerTicker();
        });

        function triggerTicker() {
          if (!slider) return;
          ticker = $interval(function() {
            if (slider.previousIndex === (slider.slides && (slider.slides.length - 1))) {
              slider.slideTo(0);
            } else {
              slider.slideNext();
            }
          }, 3000);
        }

      }
    };
    return directive;
  }


})();
