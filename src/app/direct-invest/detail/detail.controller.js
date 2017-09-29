(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('DirectInvestDetailController', InvestDetailController);

  /** @ngInject */
  function InvestDetailController($state, $stateParams, $scope, $ionicScrollDelegate, BasicApi, localStorageService, OrderService, utils, user, AppService, toastr, EbankService, AgreementService, $rootScope) {
    var vm = this,
      slider, investPageIndex = 0,
      itemsPerPage = 10,
      id = $stateParams.id;

    vm.noData = false;
    vm.info = null;
    vm.product = {};
    vm.order = {};
    vm.investedUsers = [];
    vm.loadMore = load;

    vm.purchase = purchase;
    vm.showTemplate = showTemplate;

    vm.options = {
      loop: false,
      effect: 'fade',
      speed: 500
    };

    vm.sliderIndex = 0;

    $scope.$watch(function() {
      return vm.sliderIndex;
    }, function(val) {
      slider && slider.slideTo && slider.slideTo(+val);
    });

    $scope.$on("$ionicSlides.sliderInitialized", function(event, data) {
      // data.slider is the instance of Swiper
      slider = data.slider;
    });

    $scope.$on("$ionicSlides.slideChangeEnd", function(event, data) {
      // note: the indexes are 0-based
      vm.sliderIndex = data.slider.activeIndex;
      $scope.$apply();
    });

    // main scroll 
    var test = document.getElementById('test');
    var contentH = test.offsetHeight - 44;
    vm.style = {"height":contentH + 'px'};

    init();

    function init() {
      OrderService.resetOrder();
      BasicApi.getProductDetail({
          proId: id
        })
        .success(function(res) {
          if (+res.flag === 1) {
            vm.info = res.data;
            vm.info.id = id;

            vm.product.rateShow = res.data.rate + '<span class="small">%</span>';
            vm.product.expect = res.data.bo_expect;
            vm.product.total = res.data.total;
            vm.product.expectUnit = '月';
            vm.product.priceMin = 100;
            vm.product.name = res.data.name;

            var order = {};
            order.id = res.data.id;
            order.title = res.data.name;
            order.rate = res.data.rate;
            order.rateShow = res.data.rate;
            order.expect = +res.data.bo_expect;
            order.unit = 0; //期限类型， 0：月， 1， 天
            order.balance = +res.data.residueAmount; //剩余可投金额
            order.increment = +res.data.limitAmount; //增加份数
            order.priceMin = +res.data.limitAmount; //起投金额
            order.priceMax = +res.data.residueAmount;
            order.price = +res.data.limitAmount; //起投金额
            order.productType = OrderService.productType.nny;
            vm.order = order;
          }
        });

      add();
    }

    function add(){
      BasicApi.getDirectProductInfo({
          bid: id
        })
        .success(function(res) {
          if (+res.flag === 1) {
            vm.productInfo = res.data;
          }
        });

      BasicApi.getBorrower({
          id: id
        })
        .success(function(res) {
          if (+res.flag === 1) {
            if ( (typeof res.data) == 'string' ){
              vm.noData = true; 
              return;
            }
            vm.borrowInfo = res.data;
          }
        });
      load();
    }

    function load() {
      BasicApi.getBidRecord({
        id: id,
        pageIndex: investPageIndex,
        itemsPerPage: itemsPerPage
      }).success(function(res) {
        if (res.flag === 1) {
          res.data && res.data.records.forEach(function(_item) {
            var str = _item.user_name;
            if (str && str.length >= 5) {
              _item.username = str.slice(0, 3) + '***' + str.slice(-2);
            } else {
              _item.username = str;
            }
            vm.investedUsers.push(_item);
          });

          vm.hasMoreData = (res.data && res.data.records.length) === itemsPerPage;
        }
      }).finally(function() {
        $rootScope.$broadcast('scroll.infiniteScrollComplete');
      });

      investPageIndex++;
    }


    function purchase() {
      _czc.push(['_trackEvent', '微站-散标购买', '点击', '立即投资']);
      if (!user.sessionId) {
        AppService.login();
      } else {
        if (!user.hasEBank) {
          EbankService.showPopup('投资');
          return;
        }
        OrderService.setOrder(vm.order);
        $state.go('purchase');
      }
    }

    function showTemplate() {
       AgreementService.getTemplate({type: 10, name: '借款协议'});
    }

  }
})();
