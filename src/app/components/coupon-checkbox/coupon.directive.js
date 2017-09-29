(function() {
  'use strict';

  angular
    .module('nonoApp')
    .directive('couponCheckbox', couponCheckbox);

  /** @ngInject */
  function couponCheckbox(CouponService) {
    var directive = {
      restrict: 'E',
      scope: {
        type: '@',
        index: '@',
        data: '='
      },
      replace: true,
      templateUrl: 'app/components/coupon-checkbox/coupon.html',
      link: function(scope, element, attrs) {
        var index = scope.index;
        var type = scope.type;
        element.on('click', function() {
          CouponService.doSelect(type, index);
          scope.$apply();
        });
      }
    };

    return directive;
  }

})();
