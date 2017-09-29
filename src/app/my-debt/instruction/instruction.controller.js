(function(){
  'use strict';

  angular
    .module('nonoApp')
    .controller('DebtInstructionController', DebtInstructionController);

  /** @ngInject */
  function DebtInstructionController(SystemApi) {
    var vm = this;

    SystemApi.getDebtInstruction().then(function(res) {
      vm.items = res.data;
    });

  }
})();