(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('CouponController', CouponController);

  /** @ngInject */
  function CouponController(CouponService, $stateParams, $rootScope) {
    var vm = this;
    vm.type = $stateParams.type;
    vm.submit = submit;

    init();

    function init() {
      if (vm.type == 'interest') {
        vm.list = CouponService.interestList;
      } else {
        vm.list = CouponService.cashList;
      }
    }

    function submit() {
      $rootScope.$ionicGoBack();
    }

  }
})();
