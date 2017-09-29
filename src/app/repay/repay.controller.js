(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('RepayController', RepayController);

  /** @ngInject */
  function RepayController($rootScope, $scope, BasicApi, UserService, localStorageService, toastr) {
    var vm = this,
      pageIndex = 0,
      pageSize = 6;
    vm.repayMonthItems = [];
    vm.repayDetailItems = [];
    vm.toggle = toggle;
    vm.loadPlanDetail = loadPlanDetail;

    vm.titleButton = true;

    var today = new Date();
    var _year = today.getFullYear(),
      _month = today.getMonth() + 1;
    _month = (_month < 10 ? '0' + _month : _month);

    vm.repayData = _year.toString().concat(_month.toString());
    init(vm.repayData);
    // $scope.repayMonthDetail = init;

    $rootScope.$on('repay.confirmData', function() {
      var selectDate = localStorageService.get('confirmData');
      init(selectDate);
    });

    function init(YyMm) {
      vm.info = [];
      vm.titleButton = true;
      vm.repayData = YyMm;
      BasicApi.getRepayPlanForMonth({
        data: vm.repayData
      }).success(function(res) {
        if (res.flag === 1) {
          vm.noRepay = false;
          vm.month_expect = res.data.month_expect;
          vm.repayMonthItems = res.data.repay_items;
          res.data.repay_items && res.data.repay_items.forEach(function(_item) {
            vm.info.push(_item.repay_date);
          });
        }
      });
    }

    function toggle() {
      vm.titleButton = !vm.titleButton;
      pageIndex = 0;
      // 去除重复数据
      vm.repayDetailItems = [];
      loadPlanDetail();
    }

    function loadPlanDetail(refresh) {
      if (refresh) {
        pageIndex = 0;
      }
      BasicApi.getRepayListInfo({
        pageIndex: pageIndex,
        pageSize: pageSize
      }).success(function(res) {
        if (res.flag === 1) {
          // 回款日为同一天只显示一个
          res.data.repay_items.forEach(function(item) {
            for (var i = 0; i < item.month_items.length - 1; i++) {
              for (var j = i + 1; j < item.month_items.length; j++) {
                if (item.month_items[i].repay_date == item.month_items[j].repay_date) {
                  item.month_items[j].flag = false;
                }
              }
            }
          })
          if (refresh) {
            vm.repayDetailItems = res.data.repay_items;
            return;
          }

          vm.repayDetailItems = vm.repayDetailItems.concat(res.data.repay_items);
        }
        vm.hasMorePlanDetail = res.data && res.data.repay_items && res.data.repay_items.length === pageSize;
      }).finally(function() {
        $rootScope.$broadcast('scroll.refreshComplete');
        $rootScope.$broadcast('scroll.infiniteScrollComplete');
      });
      pageIndex++;
    }
  }
})();
