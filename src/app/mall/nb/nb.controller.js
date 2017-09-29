(function(){
  'use strict';

  angular
    .module('nonoApp')
    .controller('NblistController', NblistController);

  /** @ngInject */
  function NblistController($log, $rootScope, localStorageService, $state, WelfareApi, user) {
    var vm = this,pageIndex, itemsPerPage;

    vm.coin = user.coin || 0;

    vm.loadMore = load;
    vm.coinLogList = [];
    function init() {
      pageIndex = 0;
      itemsPerPage = 10;
      vm.hasMoreData = false;
      load();
    }

    function load() {
      WelfareApi.coinLog({
        pageIndex: pageIndex,
        itemsPerPage: itemsPerPage
      }).success(function(res) {
        if (res.flag === 1) {
          vm.coinLogCount = res.data.totalCount;
          
          res.data.result.forEach(function(_item) {
            var item = {
              name: _item.remark,
              amount: _item.ncay_op + (+_item.expend_coin || +_item.income_coin),
              date: _item.op_time
            };
            vm.coinLogList.push(item);
          });

          vm.hasMoreCoin = vm.coinLogList.length !== +vm.coinLogCount;
        }
      }).finally(function() {
        $rootScope.$broadcast('scroll.infiniteScrollComplete');
      });

      pageIndex++;
    }
    init();
  } 

})();
