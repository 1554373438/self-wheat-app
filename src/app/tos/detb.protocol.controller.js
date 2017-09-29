(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('DebtProtocolController', DebtProtocolController);

  /** @ngInject */
  function DebtProtocolController($stateParams, BasicApi, $state) {
    var vm = this;
    vm.template = 'assets/templates/debt.protocol.html';
    vm.goToIns = goToIns;
    BasicApi.getDebtProtol({id:$stateParams.id }).success(function(res){
      if(res.flag == 1){
        vm.transferor = res.data.transferor;
        vm.transferee = res.data.transferee;
        vm.debtRow = res.data.debtRow;
      }
    }); 

    function goToIns() {
      $state.go('instructions', {type: 6})
    }    
  }
})();
