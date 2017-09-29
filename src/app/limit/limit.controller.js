(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('LimitController', LimitController);

  /** @ngInject */
  function LimitController(PayApi) {
    var vm = this;
    PayApi.getFastBankList().success(function(res) {
        if(res.succeed) {
           vm.list = res.data;
        }
    });
  }
})();
