(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('NxyInstructionController', NxyInstructionController);

  /** @ngInject */
  function NxyInstructionController() {
    var vm = this;
    vm.template = 'assets/templates/nxy.instructions.html';
  }
})();
