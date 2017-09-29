(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('ExchangelistController', ExchangelistController);

  /** @ngInject */
  function ExchangelistController(SystemApi, $log, $rootScope, localStorageService, $state) {
    var vm = this,pageIndex, itemsPerPage;

    vm.loadMore = load;
    vm.doRefresh = init;
    vm.goBackExchange = goBackExchange;
    vm.goBack = goBack;

    function goBack() {
      $state.go("mall:nbRules");
    }

    function goBackExchange(cb_id) {
      localStorageService.set('cd_Id', cb_id);
      $state.go("mall:exchange");
    }

    function init() {
      pageIndex = 0;
      itemsPerPage = 10;
      vm.hasMoreData = false;

      vm.items = [];
      load();
    }

    function load() {
      $log.debug(pageIndex)
      SystemApi.getCoinExChangeLogList({
        pageIndex: pageIndex,
        itemsPerPage: itemsPerPage
      }).success(function(res) {
        if (res.flag === 1) {
          res.data.result.forEach(function(_item) {
            if(_item.remark.indexOf('奖品')!=-1){
              _item.remark = '已兑换'
            }else if(_item.remark.indexOf('失败')!=-1){
               _item.remark = '<i class="assertive">抽奖未中奖<i>';
            }else{
               _item.remark = ''
            }
            vm.items.push(_item);
          });
          vm.hasMoreData = res.data.result.length === itemsPerPage;
        }
      }).finally(function() {
        $rootScope.$broadcast('scroll.refreshComplete');
        $rootScope.$broadcast('scroll.infiniteScrollComplete');
      });

      pageIndex++;
    }
    init();
  }
})();
