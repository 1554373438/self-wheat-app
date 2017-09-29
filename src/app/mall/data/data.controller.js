(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('MallDataController', MallDataController);

  /** @ngInject */
  function MallDataController(SystemApi) {
    var vm = this;
    SystemApi.getsignInLog().success(function(res) {             
      if (+res.flag === 1) {
        vm.info = res.data.result;
        return;
      }
    }); 
  }
})();
