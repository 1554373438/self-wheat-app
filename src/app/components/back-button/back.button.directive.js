(function() {
  'use strict';

  angular
    .module('nonoApp')
    .directive('backButton', backButton);

  /** @ngInject */
  function backButton() {
    var directive = {
      restrict: 'A',
      link: function(scope, element, attrs) {
        scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
          switch(toState.name) {
            case 'home':
            case 'product':
            case 'discover':
            case 'mine':
              element.addClass('hide');
              break;
            default:
              element.removeClass('hide');
          }
        });
      }
    };

    return directive;
  }

})();
