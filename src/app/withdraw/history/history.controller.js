(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('WithdrawHistoryController', WithdrawHistoryController);

  /** @ngInject */
  function WithdrawHistoryController(TrdApi, $rootScope, PayApi, toastr) {
    var vm = this,
      pageIndex = 1,
      PAGE_SIZE = 20;

    vm.hasMoreData = false;
    vm.withdrawData = [];

    vm.loadData = load;
    load();

    function load(refresh) {
      if(refresh){
        pageIndex = 1;
      }
      var obj = {
        pageSize: PAGE_SIZE,
        currPageNo: pageIndex
      };
      PayApi.withdrawHistory(obj).success(function(res) {
        if (!res.succeed) {
          toastr.info(res.errorMessage);
          return;
        }

        var data = res.data;
        if(data){
          data.withdrawData && data.withdrawData.forEach(function(item) {
            switch (item.status){
              case 'INIT':
                item.msg = '审核中';
                break;
              case 'APPROVAL_PASS':
                item.msg = '审核通过';
                break;
              case 'APPROVAL_NO_PASS':
                item.msg = '审核未通过';
                break;
              case 'USER_CANCEL':
                item.msg = '用户取消';
                break;
              case 'SUCCESS':
                item.msg = '提现成功';
                break;
              case 'FAILURE':
                item.msg = '提现失败';
                break;
            }
          });
          vm.withdrawData = refresh ? data.withdrawData : vm.withdrawData.concat(data.withdrawData);

          vm.hasMoreData = PAGE_SIZE === data.withdrawData.length;
        }

      }).finally(function() {
        $rootScope.$broadcast('scroll.refreshComplete');
        $rootScope.$broadcast('scroll.infiniteScrollComplete');
      });
      pageIndex++;
    }

  }
})();
