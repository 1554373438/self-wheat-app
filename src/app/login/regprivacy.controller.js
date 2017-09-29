(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('RegPrivacyController', RegPrivacyController);

  /** @ngInject */
  function RegPrivacyController($state, $scope, $stateParams, CommonApi) {
    var vm = this;

    vm.regContent = '';
   

    init();
    function init() {
      CommonApi.getAgreementRegPrivacy({
        bizCode: 0
      }).success(function(res) {
        if (res.succeed) {
          vm.regContent = res.data && res.data.content;
        } else {
          toastr.info(res.errorMessage);
        }
      });
    }

  }
})();

