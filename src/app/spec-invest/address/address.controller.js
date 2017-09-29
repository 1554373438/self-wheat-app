(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('SpecInvestAddressController', SpecInvestAddressController);

  /** @ngInject */
  function SpecInvestAddressController($state, OrderService, SpecInvestApi) {
    var vm = this,
      order = OrderService.getOrder();
    vm.info = {};
    vm.submit = submit;

    init();

    function init() {
      if (!order.userId) {
        SpecInvestApi.getDeliverInfo().success(function(res) {
          if (res.flag == 1) {
            var data = res.data;
            if (data) {
              vm.info.userId = data.userId;
              vm.info.receiver = data.receiver;
              vm.info.address = data.address;
              vm.info.mobileNum = data.mobileNum;
              OrderService.updateOrder(vm.info);
            }
          }
        });
      } else {
        vm.info.receiver = order.receiver;
        vm.info.mobileNum = order.mobileNum;
        vm.info.address = order.address;
      }

    }

    function submit() {
       OrderService.updateOrder(vm.info);
       
       $state.go('specInvest:purchase');
    }


  }
})();
