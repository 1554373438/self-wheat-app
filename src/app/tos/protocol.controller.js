(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('ProtocolController', ProtocolController);

  /** @ngInject */
  function ProtocolController($stateParams, BasicApi, $filter) {
    var vm = this;
    var type = $stateParams.type;
    vm.fp_id = $stateParams.id;
    var $date = $filter('date');

    BasicApi.getFinancePlan({id:vm.fp_id }).success(function(res){
      if(res.flag == 1){
        vm.product = res.data.fp;
        vm.product.total = res.data.total || '零';
        vm.product.records = [{'date':'','amount':''}];
        
        vm.product.fp_publish_date = vm.product.fp_publish_date && vm.product.fp_publish_date.replace(/\-/g, '/');
        vm.product.fp_start_date = vm.product.fp_start_date && vm.product.fp_start_date.replace(/\-/g, '/');
        vm.product.fp_end_date = vm.product.fp_end_date && vm.product.fp_end_date.replace(/\-/g, '/');

        vm.product.fp_publish_date = $date(new Date(vm.product.fp_publish_date), '【yyyy】年【MM】月【dd】日');
        vm.product.fp_start_date = $date(new Date(vm.product.fp_start_date), '【yyyy】年【MM】月【dd】日');
        vm.product.fp_end_date = $date(new Date(vm.product.fp_end_date), '【yyyy】年【MM】月【dd】日');
        vm.userInfo = res.data.user || {};
      }
    }); 
    vm.template = 'assets/templates/jh.protocol.html';     
    switch (type){
      case '1':
        vm.template = 'assets/templates/0yjh.protocol.html';
        vm.typeName = '0元计划';
        break;
      case '2':
        vm.typeName = '精选计划';
        break;
      case '3':
        vm.typeName = '懒人计划';
        break;
      case '4':
        vm.typeName = '贴心计划';
        break;
      case '5':
        vm.typeName = '新客专享计划';
        break;
    }
  }
})();
