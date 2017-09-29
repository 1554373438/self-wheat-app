(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('DebtPurchaseController', debtPurchaseController);

  /** @ngInject */
  function debtPurchaseController(OrderService, AccApi, toastr) {
    var vm = this;
    vm.agreeTos = true;
    vm.order = OrderService.getOrder();

    vm.userBalance = 0;

    init();

    function init() {
      AccApi.getBalance().success(function(res) {
        if (!res.succeed) {
          toastr.info(res.errorMessage);
          return;
        }
        var data = res.data;
        vm.userBalance = +data.nonoAvlBalance;
      });
    }
  }
})();
