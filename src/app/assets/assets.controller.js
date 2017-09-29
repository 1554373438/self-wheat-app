(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('AssetsController', AssetsController);

  /** @ngInject */
  function AssetsController(UserService, InvtApi, $filter) {
    var vm = this;
    vm.total = '-';
    vm.categories = [{
      name: '持有本金',
      total: '-',
      detailList: [{
        name: '计划',
        amount: '-'
      }, {
        name: '月月升',
        amount: '-'
      }, {
        name: '诺诺盈',
        amount: '-'
      }, {
        name: '债转',
        amount: '-'
      }]
    }, {
      name: '冻结金额',
      total: '-',
      detailList: [{
        name: '提现冻结金额',
        amount: '-'
      }, {
        name: '投资冻结金额',
        amount: '-'
      }]
    }, {
      name: '可用金额',
      total: '-',
      detailList: []
    }];
    init();

    function init() {
      var account = UserService.getAccountInfo();
      vm.total = $filter('number')(account.total, 2);
      vm.categories[0].total = $filter('number')(account.assets, 2);
      vm.categories[1].total = $filter('number')(account.lock, 2);
      vm.categories[2].total = $filter('number')(account.available, 2);

    }

    InvtApi.getAssetsDetails({showFrozen: 1}).success(function(res) {
      if (res.succeed) {
        var data = res.data;
        vm.categories[0].detailList = [{
          name: '计划',
          amount: $filter('number')(data.jh, 2)
        }, {
          name: '月月升',
          amount: $filter('number')(data.yys, 2)
        }, {
          name: '诺诺盈',
          amount: $filter('number')(data.nny, 2)
        }, {
          name: '债转',
          amount: $filter('number')(data.zz, 2)
        }];

        vm.categories[1].detailList = [{
          name: '提现冻结金额',
          amount: $filter('number')(data.tx, 2)
        }, {
          name: '投资冻结金额',
          amount: $filter('number')(data.tz, 2)
        }];
      }
    });
  }
})();
