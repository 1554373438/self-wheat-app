/**
 * Created by lucongcong on 17/8/2.
 */


(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('RecordsLatelyDetailController', RecordsLatelyDetailController);

  /** @ngInject */
  function RecordsLatelyDetailController($state, $stateParams, InvtApi, AgreementService) {
    var vm = this;

    // vm.showProtocol = showProtocol;

    InvtApi.getmyDebtTransferDetail({
      type: 1,
      id: $stateParams.dsId
    }).success(function(res) {
      if (res.succeed) {
        vm.items = res.data;
      }
    });

    // function showProtocol(index) {
    //   var item  = vm.items[index];
    //   AgreementService.getAgreementInvest({dblId: item.agreementId});
    // }


  }
})();

