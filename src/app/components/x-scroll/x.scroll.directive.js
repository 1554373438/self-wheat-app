(function() {
  'use strict';

  angular
    .module('nonoApp')
    .directive('scrollX', scrollX)

  /** @ngInject */
  function scrollX($log, $timeout) {
    var directive = {
      restrict: 'E',
      transclude: true,
      template: '<div class="scroll" ng-transclude></div>',
      link: function(scope, element, attr) {
        var tx, sx, ex, animating = false,
          sw = 0,
          cw = element.children()[0].clientWidth;

        function walkDOM(main) {
          var loop = function(main) {
            do {
              var _sw = main.scrollWidth;
              if (_sw > sw) {
                sw = _sw;
              }
              if (main.hasChildNodes())
                loop(main.firstChild);
            }
            while (main = main.nextSibling);
          }

          loop(main);
        }

        $timeout(function() {
          walkDOM(element.children()[0]);
        }, 1000); // wait for dom ready


        element.on('touchstart', function(e) {
          $log.debug('touchstart');
          sx = e.touches[0].pageX;
          tx = getTx();

          animating = true;
        });

        element.on('touchmove', function(e) {
          e.preventDefault();
          e.stopPropagation();

          if (!animating) return;

          ex = e.touches[0].pageX;

          transform(tx + ex - sx);

        });

        element.on('touchend', function(e) {
          animating = false;

          tx = getTx();

          if (tx > 0) {
            transform(0, 500);
          } else if (tx < cw - sw) {
            transform(cw - sw, 500);
          }
        });

        function getTx() {
          var style = getComputedStyle(element.children()[0]);
          var matrix = style.getPropertyValue("-webkit-transform") ||
            style.getPropertyValue("-moz-transform") ||
            style.getPropertyValue("-ms-transform") ||
            style.getPropertyValue("-o-transform") ||
            style.getPropertyValue("transform");

          return +matrix.split(',')[4] || 0;
        }

        function transform(x, duration) {
          duration = duration || 0;
          element.children()[0].style.webkitTransform = 'translate3d(' + x + 'px,0,0)';
          element.children()[0].style.transform = 'translate3d(' + x + 'px,0,0)';
          element.children()[0].style['transition-duration'] = duration + 'ms';
        }
      }
    };

    return directive;
  }


})();
