(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('PurchaseSuccessController', PurchaseSuccessController);

  /** @ngInject */
  function PurchaseSuccessController($scope, $state, OrderService, CLIENT_VERSION, BridgeService) {

    var vm = this;
    vm.goHome = goHome;

    $scope.$on('$ionicView.beforeEnter', function() {
      vm.order = OrderService.getOrder();
      if (!vm.order.paySuccess) {
        goHome();
      }
    });

    function goHome() {
      OrderService.resetOrder();
      if(!CLIENT_VERSION) {
        $state.go('home');
      } else if (BridgeService.bridge) {
        BridgeService.backToApp();
      }
    }

  }
})();
