(function() {
  'use strict';

  angular
    .module('nonoApp')
    .directive('productDetailHeader', productDetailHeader)

  /** @ngInject */
  function productDetailHeader() {
    var directive = {
      restrict: 'E',
      scope: {
        product: '='
      },
      templateUrl: 'app/components/product-detail-header/header.html'
      // link: function(scope, element, attr) {

      //   var format = function() {
      //     var p = scope.product;
      //   }
      //   scope.$watch('product', format, true);
      // }
    };

    return directive;
  }

  

})();
