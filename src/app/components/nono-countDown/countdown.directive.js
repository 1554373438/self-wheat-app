(function() {
  'use strict';

  angular
    .module('nonoApp')
    .directive('countDown', countDown);

  /** @ngInject */
  function countDown(utils, $timeout) {
    var directive = {
      restrict: 'A',
      scope: {
        diff: '=',
        callback: '&',
        unit: '@'
      },
      link: function(scope, element) {
        var timer = function() {
          // var diff = Math.floor(scope.diff / 1000);
          if(scope.unit == 'dhsm') {
             element.text(utils.dhms(scope.diff));
          } else {
            element.text(scope.diff);
          }
         
          if (scope.diff) {
            $timeout(timer, 1000);
            scope.diff -= 1;
          } else {
            scope.callback && scope.callback();
          }
        };

        timer();
      }
    };

    return directive;
  }

})();
