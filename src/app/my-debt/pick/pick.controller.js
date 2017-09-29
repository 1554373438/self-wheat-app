(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('PickController', PickController);

  /** @ngInject */
  function PickController($rootScope, $stateParams, InvtApi, $scope, utils, $state, localStorageService, toastr) {
    var vm = this;　
    vm.isChoose = false;
    vm.add = add;
    vm.getTotal = getTotal;
    vm.isChecked = [];
    vm.isComplete = false;
    vm.goBack = goBack;

    init();

    function goBack() {
      var arr = [];
      var list = [];
      var boIds = [];
      for (var i = 0; i < expect.length; i++) {
        if (expect[i]) {
          arr.push(expect[i]);
          list.push(vm.list[i]);
          boIds.push(idS[i]);
        }
      }
      var min = Math.min.apply(null, arr);
      var max = Math.max.apply(null, arr);
      var str = boIds.join(',');
      localStorageService.set('pick', {
        pickSum: vm.sum,
        pickEarnings: vm.earnings,
        pickMin: min,
        pickMax: max,
        expectArr: expect,
        picKlist: list,
        deaIds: str
      });
      $state.go('myDebt:detail', { id: '', type: 1 });
    }

    function init() {
      InvtApi.getSaleDebtBatchList({
        id: $stateParams.id
      }).success(function(res) {
        if (res.succeed) {
          vm.list = res.data;
          if (res.data.length == 0) {
            toastr.info('暂无债权信息');
            return;
          }
          for (var i = 0; i < res.data.length; i++) {
            vm.isChecked[i] = false;
          }
        } else {
          toastr.info(res.errorMessage);
        }
      });

    }

    vm.sum = 0;
    vm.earnings = 0;
    var totalSum = 0;
    var totalEarnings = 0;
    var expect = [];
    var idS = [];
    //单个选择取消
    function add($index) {
      var unpaidprice = +vm.list[$index].unPaidPrice; //金额
      var buyUnpaidprice = +vm.list[$index].unPaidFee; //预期收益
      if (vm.isChecked[$index]) {
        totalSum = totalSum + unpaidprice;
        totalEarnings = totalEarnings + buyUnpaidprice;
        expect[$index] = vm.list[$index].remainExpect;
        idS[$index] = vm.list[$index].deaId;
      } else {
        totalSum = totalSum - unpaidprice;
        totalEarnings = totalEarnings - buyUnpaidprice;
        delete expect[$index];
        delete idS[$index];
      }
      vm.sum = totalSum.toFixed(2);
      vm.earnings = totalEarnings.toFixed(2);
    }

    //全部选择取消
    function getTotal() {
      totalEarnings = totalSum = 0;
      expect = [];
      idS = [];
      if (vm.isChoose) {
        for (var i = 0; i < vm.list.length; i++) {
          vm.isChecked[i] = false;
        }
        vm.isChoose = false;
      } else {
        for (var i = 0; i < vm.list.length; i++) {
          vm.isChecked[i] = true;
          totalSum = totalSum + (+vm.list[i].unPaidPrice);
          totalEarnings = totalEarnings + (+vm.list[i].unPaidFee);
          vm.isChoose = true;
          expect[i] = vm.list[i].remainExpect;
          idS[i] = vm.list[i].deaId;
        }
      }
      vm.sum = totalSum.toFixed(2);
      vm.earnings = totalEarnings.toFixed(2);
    }

  }
})();
