(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('SpecInvestDetailController', SpecInvestDetailController);

  /** @ngInject */
  function SpecInvestDetailController(SpecInvestApi, $scope, $stateParams, $state, toastr, localStorageService, BridgeService, BILog, OrderService, user, AppService, $log) {
    var vm = this,
      terminal = $stateParams.terminal;

    vm.productName = $stateParams.name;
    vm.isShare = $stateParams.isShare === 'true';
    vm.intro = [{
      title: '全部商品 正品保证',
      desc: '所有商品均来自官方渠道或官方授权供应商',
      icon: 'nono-cup'
    }, {
      title: '全场包邮 急速发货',
      desc: '所有商品包邮，最快次日发货',
      icon: 'nono-plane'
    }, {
      title: '放心投资 提前享乐',
      desc: '消费不需要花钱，还能赚钱方便划算',
      icon: 'nono-basket'
    }];
    vm.list = [];
    vm.banner = [];
    vm.selectDuration = selectDuration;
    vm.minusNum = minusNum;
    vm.addNum = addNum;
    vm.buyProduct = buyProduct;

    // init specInvestDetail info
    init();

    function init() {
      getDetailInfo()
    }

    function getDetailInfo() {
      SpecInvestApi.getSpecInvestDetailInfo({ 'productName': vm.productName }).success(function(res) {
        if (res.flag === 1) {
          vm.list = res.data;
          var len = vm.list.length;
          var initSelectdNum = len - 1 >= 0 ? len - 1 : 0;
          for (var i = len - 1; i >= 0; i--) {
            var status = vm.list[i].fp_status;
            if (status == 3) {
              initSelectdNum = i;
              break;

            }
          }
          selectDuration(initSelectdNum);
        }
      });
    }

    function selectDuration(index) {
      vm.product = vm.list[index] || {};
      var status = vm.product.fp_status;
      if (status == 0) {
        vm.statusText = '未开始';
      } else if (status == 1) {
        vm.statusText = '已售罄';
      } else if (status == 3) {
        vm.statusText = '立即加入';
      }

      vm.duration = parseFloat(vm.product.fp_expect);
      var banner = vm.product['productMobileDetailImg'];
      if (angular.isString(banner)) {
        vm.banner.push(banner);
      } else {
        vm.banner = banner;
      }
      var priceMax = Math.min(vm.product.fp_price_max, vm.product.balance);
      var increment = vm.product.fp_price_increment;
      vm.maxNum = parseInt(priceMax / increment);
      vm.buyNum = 1;
    }

    function minusNum() {
      vm.buyNum = vm.buyNum - 1;
    }

    function addNum() {
      vm.buyNum = vm.buyNum + 1;
    }

    function buyProduct() {
      if (!user.sessionId) {
        AppService.login({
          onSuccess: function() {
            callback();
          }
        });
      } else {
        callback();
      }

      function callback() {
        if (terminal == 4 || terminal == 5) {
          if (vm.buyNum < 1 || !vm.buyNum) {
            toastr.info('请选择购买数量');
            return;
          }

          // add BI Log
          orderLog();
          leaveLog();

          BridgeService.send({
            type: 'specInvestBuy',
            data: {
              buy_num: vm.buyNum,
              product: vm.product
            }
          });
        } else {
          var order = {};
          order.key = vm.product.fp_id;
          order.id = vm.product.fp_id;
          order.type = 1; // 除 债转 诺诺盈 都为1 
          order.scope = vm.product.fp_scope;
          order.title = vm.product.fp_title;
          order.rate = vm.product.fp_rate_max;
          order.expect = +vm.product.fp_expect;
          order.unit = vm.product.fp_expect_unit;
          order.increment = +vm.product.fp_price_increment;
          order.priceMin = +vm.product.fp_price_min;
          // order.priceMax = +vm.product.fp_price_max;
          order.priceMax = parseInt(Math.min(+vm.product.balance, +vm.product.fp_price_max));
          $log.debug('priceMax', order.priceMax);


          order.price = +vm.product.fp_price_min;
          order.count = +vm.buyNum;
          OrderService.setOrder(order);

          SpecInvestApi.getFinancePlan({ id: vm.product.fp_id }).success(function(res) {
            if (res.flag == 1) {
              var data = res.data && res.data.fp;
              localStorageService.set('prodcut.detail', data);
              $state.go('specInvest:purchase');
            }
          });
        }
      }

    }

    // BI Log
    function orderLog() {
      BILog.click({
        page_name: 'product_info',
        page_module: 'order',
        title: 'order',
        page_info: {
          category: 'special',
          product_id: vm.product.fp_id
        }
      });
    }

    // BI Log
    function leaveLog() {
      BILog.leave({
        page_name: 'product_info',
        page_info: {
          category: 'special',
          product_id: vm.product.fp_id
        }
      });
    }

    $scope.$watch(function() {
      return vm.buyNum;
    }, function(val) {
      if (~~val <= 1) {
        vm.buyNum = 1;
      }
      if (~~val >= vm.maxNum) {
        vm.buyNum = vm.maxNum;
      }
    });

    $scope.$on('$ionicView.beforeLeave', leaveLog);

  }
})();
