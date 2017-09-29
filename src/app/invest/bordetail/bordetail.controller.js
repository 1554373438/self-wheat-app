(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('InvestBordetailController', InvestBordetailController);

  /** @ngInject */
function InvestBordetailController($state, $stateParams, BasicApi) {
    var vm = this,

      bo_id = $stateParams.bo_id,
      user_id = $stateParams.user_id;

    vm.data = false;
    vm.info = {};
    init();
    function init() {
      BasicApi.getBorrowerInfo({ bo_id: bo_id, user_id:user_id })
        .success(function(res) {
          if (res.flag === 1) {
            if (!res.data) {
              vm.borData = true;
              return;
            }
            vm.info = res.data;
          }
        });
    }

  }
})();
