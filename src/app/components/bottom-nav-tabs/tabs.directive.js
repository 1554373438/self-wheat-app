(function() {
  'use strict';

  angular
    .module('nonoApp')
    .directive('bottomNavTabs', bottomNavTabs);

  /** @ngInject */
  function bottomNavTabs($ionicHistory) {
    var directive = {
      restrict: 'E',
      scope: {
        active: '@'
      },
      templateUrl: 'app/components/bottom-nav-tabs/tabs.html',
      link: function(scope, element, attr) {
        if(scope.active == null) {
          scope.active = 0;
        }

        scope.onTabSelected = function() {
          $ionicHistory.clearHistory();
        };
      }
    };

    return directive;
  }

})();
