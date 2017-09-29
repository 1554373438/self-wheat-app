(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('EnvoyRewardController', EnvoyRewardController);

  /** @ngInject */
  function EnvoyRewardController(utils, MktApi, $rootScope) {
    var vm = this,
      pageIndex = 1,
      itemsPerPage = 10;
    vm.info = {};
    vm.friendList = [];
    vm.loadMore = loadMore;
    vm.showAlert = showAlert;

    init();

    function init() {

      loadMore(true);
    }

    function loadMore(isFirst) {
      MktApi.getEnvoyRewardInfo({
        pageIndex: pageIndex,
        pageSize: itemsPerPage
      }).success(function(res) {
        if (res.succeed) {
          if (isFirst) {
            vm.info = res.data;
          }
          res.data && res.data.results.forEach(function(item) {
            vm.friendList.push(item);
          })

          vm.hasMoreData = (res.data.results && res.data.results.length) == itemsPerPage;
        }

      }).finally(function() {
        $rootScope.$broadcast('scroll.infiniteScrollComplete');

      });
      pageIndex++;

    }

    function showAlert() {
      utils.alert({
        'title': '什么是预期结算金额？',
        'cssClass': 'envoy-reward-popup',
        'content': '<b>预期待结算金额：</b><p>根据 "当前好友持有的本金" 计算的奖励金额。</p><b>实际结算金额：</b><p>根据“结算时好友持有的本金”计算的奖励金额。<br />在产品持有期间，如果好友提前转让/退 出产品，即好友持有的本金减少，实际结算奖励将相应地减少。</p>',
        'okText': '知道了'
      });
    }
  }
})();
