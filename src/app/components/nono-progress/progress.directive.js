(function() {
  'use strict';

  angular
    .module('nonoApp')
    .directive('nonoProgress', nonoProgress);

  /** @ngInject */
  function nonoProgress() {
    var directive = {
      restrict: 'E',
      scope: {
        value: '@'
      },
      required: 'type',
      // replace: true,
      templateUrl: 'app/components/nono-progress/progress.html',
      link: function(scope, element, attr) {
        var type = attr.type ? attr.type : 'positive';

        scope.show = angular.isDefined(attr.shownumber);
        scope.type = type + '-bg';
      }
    };

    return directive;
  }

})();
