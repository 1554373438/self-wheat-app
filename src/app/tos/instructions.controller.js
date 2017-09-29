(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('InstructionsController', InstructionsController);

  /** @ngInject */
  function InstructionsController($stateParams, $http) {
    var vm = this;
    var type = $stateParams.type;
    var collectionMode = $stateParams.collectionMode;
     vm.isLocalTemplate = true;
    switch (type) {
      // case '1':
      //   vm.title = '0元投资计划说明书';
      //   vm.template = 'assets/templates/0yjh.instructions.html';
      //   break;
      case '2':
        vm.title = '诺诺精选投资计划说明书';
        vm.template = 'assets/templates/jxjh.instructions.html';
        break;
      case '3':
        vm.title = '懒人计划说明书';
        vm.template = 'assets/templates/lrjh.instructions.html';
        break;
      case '11':
        vm.title = '贴心计划说明书';
        vm.template = 'assets/templates/txjh.instructions.html';
        break;
      case '1':
        vm.title = '新客投资计划说明书';
        vm.template = 'assets/templates/jxjh.instructions.html';
        vm.mode = collectionMode;
        break;
      case '6':
        vm.title = '债权转让说明书';
        vm.template = 'assets/templates/debt.instructions.html';
        break;
      case '7':
        vm.title = '诺诺镑客注册协议';

        $http.get('https://m.nonobank.com/agreements/nono/template/service.html')
          .success(function(data) {
            vm.isLocalTemplate = false;
            vm.template = data;
          })
          .error(function(res) {

            vm.template = 'assets/templates/reg.instructions.html';
          })
         
        break;
    }
  }
})();
