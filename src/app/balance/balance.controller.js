(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('BalanceController', BalanceController);

  /** @ngInject */
  function BalanceController(UserApi, $log, $rootScope) {
    var vm = this, pageIndex, itemsPerPage, id;

    vm.loadMore = load;
    vm.doRefresh = init;

    init();

    function init() {
      id = 0; // for item list track
      pageIndex = 0;
      itemsPerPage = 10;
      // vm.hasMoreData = true;

      vm.items = [];
      load();
    }

    function load() {
      UserApi.getBalanceDetail({
        pageIndex: pageIndex,
        itemsPerPage: itemsPerPage
      }).success(function(res) {
        if(res.flag === 1) {
          res.data && res.data.forEach(function(_item) {
            _item.id = id;
            _item.income = +_item.income;
            _item.expend = +_item.expend;
            _item.balance = +_item.balance;
            vm.items.push(_item);
            id++;
          });
          vm.hasMoreData = res.data && res.data.length === itemsPerPage;
        }
      }).finally(function() {
        $rootScope.$broadcast('scroll.refreshComplete');
        $rootScope.$broadcast('scroll.infiniteScrollComplete');
      });

      pageIndex++;
    }

  }
})();
