(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('DebtInvestBordetailController', InvestBordetailController);

  /** @ngInject */
  function InvestBordetailController($stateParams, BasicApi) {
    var vm = this,

      bo_id = $stateParams.bo_id,
      user_id = $stateParams.user_id;

    vm.info = {};
    init();

    function init() {
      BasicApi.getBorrowerInfo({ bo_id: bo_id, user_id: user_id })
        .success(function(res) {
          if (res.flag === 1) {
            vm.info = res.data;
          }
        });
    }

  }
})();
