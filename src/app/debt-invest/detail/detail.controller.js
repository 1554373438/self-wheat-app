(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('DebtInvestDetailController', InvestDetailController);

  /** @ngInject */
  function InvestDetailController($scope, utils, $state, $stateParams, BasicApi, OrderService, user, AppService, EbankService, $rootScope, AgreementService) {
    var vm = this,
      id = $stateParams.id;
    vm.order = {};
    vm.protocolUrl = ''
    vm.goToIntro = goToIntro;
    vm.purchase = purchase;
    vm.showTemplate = showTemplate;
    
    $scope.$on('$ionicView.beforeEnter', function(event, data) {
      init();
    });


    function init() {
      OrderService.resetOrder();
      BasicApi.getDebtDetail({
          id: id
        })
        .success(function(res) {
          if (+res.flag === 1) {
            var info = vm.info = res.data;
            var order = {};
            order.id = id; //id
            order.title = info.title; //title
            // order.rateMax = info.bp_rate_lender; //最大利率
            // order.rateMin = info.bp_rate_lender; //最小利率
            order.rate = info.bp_rate_lender; //利率
            order.rateShow = info.bp_rate_lender; //产品显示利率
            order.expect = +info.ds_expect; //期限
            // order.balance = +(info.residue_price * info.transfer_rate/100).toFixed(2); //剩余可投金额
            // order.priceMin = +info.residue_price; //起投金额
            // order.priceMax = parseInt(Math.min(+info.residue_price, +info.residue_price));
            order.earnings = +info.profit * info.residue_count; //预期收益
            order.price = +(info.residue_price * info.transfer_rate/100).toFixed(2); //起投金额
            order.productType = OrderService.productType.zhaizhuan; //债转
            vm.order = order;
          }
        });
    }

    function goToIntro() {
      $state.go('debtInvest:intro', { id: id });
    }

    function purchase() {
      if (!user.sessionId) {
        AppService.login();
      } else {
        if (!user.hasEBank) {
          EbankService.showPopup('投资');
          return;
        }
        OrderService.setOrder(vm.order);
        $state.go('debtInvest:purchase');
      }
    }

    function showTemplate() {
      AgreementService.getTemplate({type: 1, name: '债权转让协议'});
    }
  }
})();
