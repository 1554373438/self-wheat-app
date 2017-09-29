(function(){
  'use strict';

  angular
    .module('nonoApp')
    .controller('AgreementController', AgreementController);

  /** @ngInject */
  function AgreementController($stateParams) {
    var vm = this;
    vm.title = $stateParams.title;
    vm.url = $stateParams.url;
  }
})();