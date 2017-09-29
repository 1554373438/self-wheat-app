(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('NnyProtocolController', NnyProtocolController);

  /** @ngInject */
  function NnyProtocolController($stateParams, BasicApi) {
    var vm = this;
    vm.template = 'assets/templates/nny.protocol.html';
    BasicApi.getNxyProtol({id:$stateParams.id}).success(function(res){
      if(res.flag == 1){
        vm.data = res.data;
      }
    }); 

    
  }
})();
