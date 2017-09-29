(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('ReportMoreController', ReportMoreController);

  /** @ngInject */
  function ReportMoreController(HOST) {
    var vm = this;
    vm.url = HOST + '/nono/report/';
  }
})();
