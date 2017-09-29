(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('WalletController', WalletController);

  /** @ngInject */
  function WalletController($rootScope, $stateParams, $ionicTabsDelegate, BasicApi, BridgeService) {
    var vm = this;

    vm.banner = 'assets/images/wallet-banner.png';

    vm.goBack = goBack;
    vm.invest = invest;

    // init wallet info
    init();

    function init() {
      BasicApi.getWalletInfo().success(function(res) {
        if(res.flag === 1) {
          // csyyPlanStatus 0: 售罄, 1: 销售中, 2: 下期
          vm.info = res.data;
        }
      });
    }

    function invest() {
      BridgeService.send({
        type: 'walletBuy',
        data: {
          product: vm.info
        }
      });
    }

    function goBack() {
      if($stateParams.from === 'mine') {
        $ionicTabsDelegate.select(3);
      } else {
        $rootScope.$ionicGoBack();
      }
    }
  }
})();
