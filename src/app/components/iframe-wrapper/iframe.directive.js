(function() {
  'use strict';

  angular
    .module('nonoApp')
    .directive('iframeWrapper', iframeWrapper);

  /** @ngInject */
  function iframeWrapper() {
    var directive = {
      restrict: 'E',
      scope: {
        src: '@'
      },
      required: 'src',
      link: function(scope, element, attr) {
        var iframe = document.createElement('iframe');
        iframe.setAttribute('src', scope.src);
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        element.append(iframe);
      }
    };

    return directive;
  }

})();
