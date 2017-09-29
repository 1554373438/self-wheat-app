(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('RecordsBordetailController', RecordsBordetailController);

  /** @ngInject */
function RecordsBordetailController($state, $stateParams, toastr, BasicApi) {
    var vm = this, bo_id = $stateParams.bo_id;
    vm.noData = false;
    vm.info = {};
    init();
    function init() {
      BasicApi.getBorrower({
        id: bo_id 
      }).success(function(res) {
        if (+res.flag === 1) {
          if ( (typeof res.data) == 'string' ){
            vm.noData = true; 
            toastr.info(res.data);
            return;
          }
          vm.info = res.data;
        }
      });
    }
  }
})();
