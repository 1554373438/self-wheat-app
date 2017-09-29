(function() {
  'use strict';

  angular
    .module('nonoApp')
    .directive('headerItem', headerItem);

  /** @ngInject */
  function headerItem($ionicScrollDelegate) {
    var directive = {
      restrict: 'C',
      link: function(scope, element) {
        if(!element.hasClass('back-button')) {
          element.bind('click', function() {
            $ionicScrollDelegate.scrollTop(true);
          });
        }
      }
    };

    return directive;
  }

})();
