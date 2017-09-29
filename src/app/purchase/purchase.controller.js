(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('PurchaseController', PurchaseController);

  /** @ngInject */
  function PurchaseController($state, $scope, OrderService, CouponService, AccApi, toastr) {
    var vm = this;
    vm.selectedCash = CouponService.selectedCash;
    vm.selectedInterest = CouponService.selectedInterest;

    vm.order = OrderService.getOrder();
    vm.userBalance = 0;
    vm.goCouponPage = goCouponPage;
    vm.agreeTos = true;
    
    init();

    $scope.$on('$ionicView.beforeEnter', function() {
       getBalance();
    });

    function init() {
      getBalance();
      if(vm.order.productType !=9) {
        CouponService.init(vm.order.price);
      }
      
    }

    function getBalance() {
      AccApi.getBalance().success(function(res) {
        if (!res.succeed) {
          toastr.info(res.errorMessage);
          return;
        }
        var data = res.data;
        vm.userBalance = +data.nonoAvlBalance;

      });
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
