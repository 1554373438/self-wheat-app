(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('WithdrawSuccessController', WithdrawSuccessController);

  /** @ngInject */
  function WithdrawSuccessController($stateParams, $state) {

    var vm = this;
    vm.amount = $stateParams.amount;
    vm.countdown = 5;
    vm.goBack = function() {
      $state.go('mine');
    }

  }
})();
