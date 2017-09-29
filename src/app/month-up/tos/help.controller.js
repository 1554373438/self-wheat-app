(function(){
  'use strict';

  angular
    .module('nonoApp')
    .controller('MonthUpHelpController', MonthUpHelpController);

  /** @ngInject */
  function MonthUpHelpController(SystemApi) {
    var vm = this;

    SystemApi.getMonthUpHelp().then(function(res) {
      vm.items = res.data;
    });

  }
})();