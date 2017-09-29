(function() {
  'use strict';

  angular
    .module('nonoApp')
    .directive('investCounter', investCounter);

  /** @ngInject */
  function investCounter($filter, toastr, OrderService, CouponService) {
    var directive = {
      restrict: 'E',
      required: 'ngModel',
      scope: {
        order: '=ngModel',
        type: '@'
      },
      template: '<ng-include src="getTemplateUrl()">',
      /** @ngInject */
      controller: function($scope) {
        $scope.getTemplateUrl = function() {
          if ($scope.type == 'hasbutton') {
            return 'app/components/invest-counter/invest.counter.html'
          } else {
            return 'app/components/invest-counter/invest.counter.no.button.html'
          }
        }
      },

      link: function(scope, element) {


        var plan = scope.order,
          peer = +plan.increment,
          min = +plan.priceMin,
          max = +plan.priceMax,
          rate = +plan.rate,
          unit = plan.unit,
          expect = plan.expect;
          
        getEarnings();

        if (scope.order.productType != 9 && scope.order.productType != 15 && scope.order.productType != 16) {
          // 计划类预期收益利率需加上加息券利率
          scope.$watch(function() {
            return CouponService.selectedInterest.value;
          }, function(newVal, oldVal) {
            if(newVal == oldVal) {
              return;
            }
            rate = +plan.rate + newVal;
            getEarnings();
           
          });
        }


        scope.minus = function() {
          if (scope.order.price > min) {
            scope.order.price -= peer;
          }
        };

        scope.plus = function() {
          if (scope.order.price < max) {
            scope.order.price += peer;
          }
        };



        scope.$watch('order.price', function(newVal, oldVal) {
          if (!/^[1-9]\d*/.test(newVal)) {
            scope.order.price = '';
            scope.order.earnings = 0;
            return;
          }
          if (newVal == oldVal) {
            return;
          }
          var price = +newVal || 0;
          if (price - max > 0) {
            scope.order.price = max;
            toastr.info('最大投资金额' + max + '元');
          }

          getEarnings();
          CouponService.autoSelectd(scope.order.price);

        });



        function getEarnings() {
          if (scope.order.productType == 16) {
            //诺诺盈预计收益
            scope.order.earnings = getNNyEarnings(scope.order.price, rate / 100, expect);

          } else {
            //计划类预计收益
            if (unit == 1) { // day
              scope.order.earnings = $filter('number')(scope.order.price * (rate / 100) / 365 * expect, 2);
            } else { // month
              scope.order.earnings = $filter('number')(scope.order.price * (rate / 100) / 12 * expect, 2);
            }
          }

          OrderService.updateOrder({ earnings: scope.order.earnings });

          function getNNyEarnings(amount, rate, expect) {
            var emTotal = amount * rate / 12 * Math.pow(1 + rate / 12, expect) / (Math.pow(1 + rate / 12, expect) - 1); //每月还款金额
            var lxTotal = 0,
              lx = 0,
              em = 0;
            for (var i = 0; i < expect; i++) {
              lx = amount * rate / 12; //每月还款利息
              em = emTotal - lx; //每月还款本金
              amount = amount - em;
              lxTotal = lxTotal + lx;
            }
            return lxTotal && lxTotal.toFixed(2);
          }


        }

      }

    };

    return directive;
  }

})();
