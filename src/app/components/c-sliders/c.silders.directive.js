(function() {
  'use strict';

  angular
    .module('nonoApp')
    .directive('cSliders', cSliders);

  /** @ngInject */
  function cSliders($state, $log, $timeout) {
    var directive = {
      restrict: 'E',
      scope: {
        sliders: '='
      },
      templateUrl: 'app/components/c-sliders/c.sliders.html',
      link: function(scope, element, attrs) {
        var sx, // start x
          ex, // end x
          tx, // translate x
          animating = false,
          movement,
          $sliders,
          $slider,
          len,
          containerWidth,
          sliderWidth;

        scope.$watch('sliders', function(val) {
          if(val) {
            init();
          }
        });

        scope.select = function(index) {
          var item = scope.sliders[index];
          $state.go('external', {name: item.name, link: item.link});
        };

        function init() {
          $sliders = document.querySelector('.c-sliders');
          $slider = document.querySelectorAll('.c-slider');
          len = $slider.length;
          var container = document.querySelector('.c-sliders-container');
          var slider =  document.querySelector('.c-sliders-container .c-slider')
          containerWidth = container && container.clientWidth;
          sliderWidth = slider && slider.clientWidth;

          for (var i = 0; i < len; i++) {
            $slider[i].style.left = i * sliderWidth + 'px';
          }

          tx = (containerWidth - sliderWidth) / 2 - sliderWidth;
          transform(tx);
        }

        function move(direction) {
          // $log.debug('direction', direction);

          var firstEle = document.querySelector('.c-slider');
          var lastEle = document.querySelector('.c-slider:last-child');

          if(direction === 'ftl') { // first to last
            firstEle.style.left = +firstEle.style.left.replace('px', '') + sliderWidth * len + 'px';
            $sliders.appendChild(firstEle, lastEle);
          } else if(direction === 'ltf') { // last to first
            lastEle.style.left = +lastEle.style.left.replace('px', '') - sliderWidth * len + 'px';
            $sliders.insertBefore(lastEle, firstEle);
          }
        }

        element.on('touchstart', function(e) {
          sx = e.touches[0].pageX;
          animating = true;
          tx = getTx();
          movement = '';
        });

        element.on('touchmove', function(e) {
          e.preventDefault();
          e.stopPropagation();

          if (!animating) return;

          ex = e.touches[0].pageX;

          transform(tx + ex - sx);

          var critical = sliderWidth - (containerWidth - sliderWidth) / 2;
          var cur = ex - sx; // current
          if(cur < 0) { // slide left
            if(cur + critical > 0 && cur + critical < 10 && movement === 1) {
              move('ltf');
              movement = 0;
            } else if(cur + critical < 0 && cur + critical > -10 && !movement) {
              move('ftl');
              movement = 1;
            } else if(cur + critical + sliderWidth > 0 && cur + critical + sliderWidth < 10 && movement === 2) {
              move('ltf');
              movement = 1;
            } else if(cur + critical + sliderWidth < 0 && cur + critical + sliderWidth > -10 && movement === 1) {
              move('ftl');
              movement = 2;
            }
          } else { // slide right
            if(cur - critical < 0 && cur - critical > -10 && movement === 1) {
              move('ftl');
              movement = 0;
            } else if(cur - critical > 0 && cur - critical < 10 && !movement) {
              move('ltf');
              movement = 1;
            } else if(cur - critical - sliderWidth < 0 && cur - critical - sliderWidth > -10 && movement === 2) {
              move('ftl');
              movement = 1;
            } else if(cur - critical - sliderWidth > 0 && cur - critical - sliderWidth < 10 && movement === 1) {
              move('ltf');
              movement = 2;
            }
          }
        });

        element.on('touchend', function(e) {
          animating = false;
          tx = getTx();
          // center element
          tx = Math.floor(tx / sliderWidth) * sliderWidth + (containerWidth - sliderWidth) / 2;

          transform(tx);

          var checker = function() {
            var doCheck = function() {
              var firstEle = document.querySelector('.c-slider');
              var lastEle = document.querySelector('.c-slider:last-child');
              if(firstEle.getBoundingClientRect().left > 0) {
                move('ltf');
                checker();
              } else if(lastEle.getBoundingClientRect().right < containerWidth) {
                move('ftl');
                checker();
              }
            };

            if(requestAnimationFrame) {
              requestAnimationFrame(doCheck);
            } else { // Android 4.3 and below
              $timeout(doCheck, 1000/60);
            }
          };

          checker();
        });

        function getTx() {
          var style = getComputedStyle($sliders);
          var matrix = style.getPropertyValue("-webkit-transform") ||
                       style.getPropertyValue("-moz-transform") ||
                       style.getPropertyValue("-ms-transform") ||
                       style.getPropertyValue("-o-transform") ||
                       style.getPropertyValue("transform");

          return +matrix.split(',')[4] || 0;
        }

        function transform(x) {
          $sliders.style.transform = 'translate3d(' + x + 'px,0,0)';
        }
      }
    };

    return directive;
  }

})();
