
(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('TenderController', TenderController);

  /** @ngInject */
  function TenderController($stateParams, EbankService) {
    var vm = this;

    vm.complete = complete;

    function complete (){
      EbankService.goPage('pwd/enter.html?flag=' + $stateParams.type);
    }

  }
})();
