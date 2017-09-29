(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('AccountsController', AccountsController);

  /** @ngInject */
  function AccountsController($state, $stateParams, InvtApi, AgreementService) {
    var vm = this;

    vm.showProtocol = showProtocol;

    InvtApi.getmyDebtTransferDetail({
      type: $stateParams.type,
      id: $stateParams.id
    }).success(function(res) {
      if (res.succeed) {
        vm.items = res.data;
      }
    })

    function showProtocol(index) {
      var item  = vm.items[index];
      AgreementService.getAgreementInvest({dblId: item.agreementId});
    }


  }
})();
