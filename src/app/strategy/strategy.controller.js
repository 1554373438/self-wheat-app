(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('StrategyController', StrategyController);

  /** @ngInject */
  function StrategyController($scope, $state, $rootScope, InvtApi, AccApi, user, BridgeService, AppService) {
    var vm = this;

    vm.user = user;
    vm.planInfo = '';
    vm.oldStatus = false;

    vm.iconFGray = true;
    vm.iconSGray = true;
    vm.iconTGray = true;

    vm.goRegister = goRegister;
    vm.goInvest = goInvest;
    vm.goNewInvest = goNewInvest;
    vm.getInvestStatus = getInvestStatus;

    init();

    function init() {
      if (user.sessionId) {
        getInvestStatus();
      } else {
        vm.iconFGray = false;
        vm.iconSGray = true;
        vm.iconTGray = true;
      }

      InvtApi.getXinkeForMain().success(function(res) {
        if (res.succeed) {
          vm.planInfo = res.data;
        }
      });
    }

    function getInvestStatus() {
      AccApi.getInvestStatus().success(function(res) {
        if (res.succeed) {
          vm.oldStatus = res.data.jxjhInvest;
          selectIcon(vm.oldStatus);
        }
      });
    }

    function selectIcon(state) {
      if (!state) {
        vm.iconFGray = true;
        vm.iconSGray = false;
        vm.iconTGray = true;
        return;
      };
      vm.iconFGray = false;
      vm.iconSGray = false;
      vm.iconTGray = false;
    }

    function goRegister() {
      _czc.push(['_trackEvent', '新手指引', '点击', '去注册']);
      if (BridgeService.bridge) {
        BridgeService.send({
          type: 'register',
          data: {
            url: window.location.href
          }
        });
        return;
      }

      AppService.register({
        onSuccess: function() {
          AppService.showNotePopup();
          init();
        },
        onCancel: function() {
          // $rootScope.$ionicGoBack();
        }
      });

    }

    function goInvest() {
      _czc.push(['_trackEvent', '新手指引', '点击', '去投资']);
      if (BridgeService.bridge) {
        var link = '',
          showType = 0;
        if (+vm.oldStatus) {
          link = 'mzjf://product_jumpToInvestList/?index=0';
          showType = '2';
        } else {
          link = 'mzjf://product_planDetail/?productId=' + vm.planInfo.fp_id + '&productType=4&scope=1';
        }

        BridgeService.send({
          type: 'pageRoute',
          data: {
            link: link,
            showType: showType
          }
        });
        return;
      }

      if (+vm.oldStatus) {
        $state.go('product', { type: 0 });
        return;
      }
      $state.go('invest:detail', { scope: 1, id: vm.planInfo.fp_id });
    }

    function goNewInvest() {
      _czc.push(['_trackEvent', '新手指引', '点击', '新客计划区域购买']);
      if (BridgeService.bridge) {
        BridgeService.send({
          type: 'pageRoute',
          data: {
            link: 'mzjf://product_planDetail/?productId=' + vm.planInfo.fp_id + '&productType=4&scope=1',
            showType: 0
          }
        });
        return;
      }
      $state.go('invest:detail', { scope: 1, id: vm.planInfo.fp_id });
    }
  }
})();
