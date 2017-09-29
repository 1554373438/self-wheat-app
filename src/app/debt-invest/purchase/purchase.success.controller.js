(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('DebtPurchaseSuccessController', debtPurchaseSuccessController);

  /** @ngInject */
  function debtPurchaseSuccessController($state, OrderService) {

    var vm = this;
    vm.order = OrderService.getOrder();
    if(!vm.order.paySuccess) {
      goHome();
    }
    vm.goHome = goHome;

    function goHome() {
      OrderService.resetOrder();
      $state.go('home');
    }

  }
})();
