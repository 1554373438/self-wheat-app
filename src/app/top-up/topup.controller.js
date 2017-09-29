(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('TopUpController', TopUpController);

  /** @ngInject */

  function TopUpController(EbankService, $scope, user, OrderService, toastr, TopUpService, AccApi, localStorageService) {
    var vm = this,
      order = {};

    // OrderService.resetOrder();



    $scope.$on("$ionicView.beforeEnter", init);

    $scope.$on("$ionicView.afterEnter", balance);

    vm.submit = submit;

    var reg = /^([1-9][0-9]*)+(.[0-9]{1,2})?$/;
    $scope.$watch(function() {
      return vm.amount;
    }, function(val, old) {
      if(!+val) {
        vm.amount = '';
        return;
      }
      if(!reg.test(val)) {
        val = String(val); //fix val.indexOf is not a function
        vm.amount =  val.substr(0,val.indexOf('.')+3);
        return;
      }

    }, true);



    function init() {
      var needPay = localStorageService.get("needPay") || '';
      if (+needPay) { //购买详情过来的页面 不清空order缓存
        vm.amount = needPay; 
        vm.hasAmount = true;
      } else {
        OrderService.resetOrder();
      }
      AccApi.getEbankInfo().success(function(res) {
        if (res.succeed) {
          vm.userName = res.data.realName.replace(/(\w|\S{1})(\w|\S)/, '*$2');
          vm.eBank = res.data;
        }
      })
    }

    function balance() {
      AccApi.getBalance().success(function(res) {
        if (res.succeed) {
          vm.nonoAvlBalance = res.data.nonoAvlBalance;
        }
      });
    }

    function submit() {
      _czc.push(['_trackEvent', '微站－充值', '点击', '立即充值']);
      var reg = /^([1-9][0-9]*)+(.[0-9]{1,2})?$/;
      if( +vm.amount <= 1 ){
        toastr.info('请输入至少大于1的数字');
        return;
      }
      if (!reg.test(vm.amount)) {
        toastr.info('请输入数字,最多保留两位小数');
        return;
      }
      order.price = vm.amount;

      order.eBank = vm.eBank;
      OrderService.setOrder(order);

      TopUpService.showPayModal();
    }

  }
})();
