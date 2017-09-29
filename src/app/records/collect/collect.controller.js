(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('CollectDetailController', CollectDetailController);

  /** @ngInject */
  function CollectDetailController(localStorageService) {
    var vm = this;
    vm.listInfo = localStorageService.get('collect');


  }
})();
