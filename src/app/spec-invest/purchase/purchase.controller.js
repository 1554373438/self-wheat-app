(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('SpecInvestPurchaseController', SpecInvestPurchaseController);

  /** @ngInject */
  function SpecInvestPurchaseController($scope, $state, OrderService, CouponService, UserApi) {
    var vm = this;
    vm.selectedCash = CouponService.selectedCash;

    vm.user = {};
    vm.order = OrderService.getOrder();
    vm.goCouponPage = goCouponPage;

    // init();
     $scope.$on("$ionicView.beforeEnter", init);
    function init() {
      CouponService.init(vm.order.price);
      getAddress();
    }

    function getAddress() {
      if (!vm.order.userId) {
        UserApi.getDeliverInfo().success(function(res) {
          if (res.flag == 1) {
            var data = res.data;
            if (data) {
              vm.order.userId = data.userId;
              vm.order.receiver = data.receiver;
              vm.order.address = data.address;
              vm.order.mobileNum = data.mobileNum;
              OrderService.updateOrder(vm.order);
            }
          }
        });
      } else {
         vm.order = OrderService.getOrder();
      }
     
    }



    function goCouponPage(type) {
      OrderService.updateOrder(vm.order);

      var interestList = CouponService.interestList;
      if (type == 'interest') {
        if (interestList.length) {
          $state.go('coupon', { type: 'interest' });
        } else {
          $state.go('noCoupon');
        }
      } else {
        if (vm.selectedCash.hasCoupon) {
          $state.go('coupon', { type: 'cash' });
        } else {
          $state.go('noCoupon');
        }
      }
    }

  }
})();
