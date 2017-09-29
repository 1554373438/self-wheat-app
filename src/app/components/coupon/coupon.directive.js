(function() {
  'use strict';

  angular
    .module('nonoApp')
    .directive('coupon', coupon);

  /** @ngInject */
  function coupon() {
    var directive = {
      restrict: 'E',
      scope: {
        data: '=',
        type: '@'
      },
      replace: true,
      templateUrl: 'app/components/coupon/coupon.html',
      link: function(scope, element, attrs) {
        var d = scope.data;
        scope.info = {
          name: d.uv_approach,
          value: d.value,
          isUsed: +d.is_used,
          isExpired: +d.statue === 4,
          remark: d.uv_remark,
          expireDate: d.stop_time,
          type: scope.type === 'coupon' ? '现<br />金<br />券' : '加<br />息<br />券'
        };
      }
    };

    return directive;
  }

})();
