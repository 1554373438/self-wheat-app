(function(){
  'use strict';

  angular
    .module('nonoApp')
    .controller('NBRuleController', NBRuleController);

  /** @ngInject */
  function NBRuleController(SystemApi) {
    var vm = this;

    SystemApi.getNBRules().then(function(res) {
      vm.info = res.data;
    });

  }
})();