(function() {
  'use strict';

  angular
    .module('nonoApp')
    .directive('extHref', extHref);

  /** @ngInject */
  function extHref($state, $log, $location, BridgeService) {
    var directive = {
      restrict: 'A',
      link: function(scope, element, attr) {
        var name = attr.extName || element.html(),
            link = attr.extHref;

        element.bind('click', function() {
          if(/nono-app/.test(link)) {
            $location.path(decodeURIComponent(link.split('#')[1]));
          } else if(BridgeService.bridge && /^http/.test(link)) {
            BridgeService.send({
              type:'activity',
              data:{
                name: name,
                link: link
              }
            });
          } else if(/^https/.test(link)) {
            $state.go('external', {name: name, link: link});
          } 
        });
      }
    };

    return directive;
  }

})();
