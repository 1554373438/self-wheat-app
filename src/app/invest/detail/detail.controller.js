(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('InvestDetailController', InvestDetailController);

  /** @ngInject */

  function InvestDetailController(AccApi, $scope, $state, $stateParams, BasicApi, OrderService, user, AppService, toastr, $rootScope, EbankService, AgreementService) {
    var vm = this,
      slider,
      investPageIndex = 1,
      borPageIndex = 1,
      itemsPerPage = 10,
      scope = +$stateParams.scope,
      id = $stateParams.id;

    vm.borLoadMore = borLoad;
    vm.loadMore = getInvestRecords;
    vm.goToBorDetail = goToBorDetail;

    vm.borInvestedUsers = [];
    vm.investedUsers = [];


    vm.order = { id: id };
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
    vm.style = { "height": contentH + 'px' };

    init();

    function init() {
      BasicApi.getFinanceProductDetails({
          proId: id,
          scope: scope
        })
        .success(function(res) {
          if (+res.flag === 1) {
            vm.status = res.data.status;
            var p = res.data.fp;

            var info = {};
            info.title = p.title;
            info.scope = p.scope;
            info.suffix = p.fp_suffix;
            info.rateShow = p.fp_rate_show && p.fp_rate_show.replace(/%/g, '<span class="small">%</span>');

            info.expect = +p.fp_expect;
            info.expectUnit = +p.fp_expect_unit ? '天' : '月';
            info.priceMin = p.fp_price_min;
            info.total = p.total;
            info.investDate = p.fp_invest_date;
            info.startDate = p.fp_start_date;
            info.endDate = p.fp_end_date;
            info.interest = p.fp_expect_interest;
            info.price = p.fp_price;
            info.balance = p.balance;
            if (p.scope == 15) {
              info.lockDay = +p.lock_day;
              info.rateAll = p.rate_all;
            }
            info.id = p.fp_id; //协议用
            info.collectionMode = p.collection_mode; //协议用
            vm.info = info;

            var order = {};
            order.id = p.fp_id;
            order.title = p.title;
            order.rate = p.fp_rate_max;
            order.rateShow = p.fp_rate_show && p.fp_rate_show.replace(/%/g, '');
            order.expect = +p.fp_expect;
            order.unit = p.fp_expect_unit; //期限类型， 0：月， 1， 天
            order.balance = +p.balance; //剩余可投金额
            order.increment = +p.fp_price_increment; //增加份数
            order.priceMin = +p.fp_price_min; //起投金额
            order.priceMax = parseInt(Math.min(+p.balance, +p.fp_price_max)) || +p.balance;
            order.price = +p.fp_price_min;
            order.startDate = p.fp_start_date; //成功页计息开始日期
            vm.order = order;

            getProductType();
          }
        });
      add();

    }

    function add() {
      BasicApi.getFinanceProductInfo({
          fid: id,
          scope: scope
        })
        .success(function(res) {
          if (+res.flag === 1) {
            vm.productInfo = res.data && res.data.info;
          }
        });
      getInvestRecords();
      borLoad();
    }

    function getProductType() {
      var insName, productType;
      switch (scope) {
        case 1:
          insName = '新客投资计划';
          productType = OrderService.productType.xinke; //新客
          break;
        case 11:
          insName = '贴心计划';
          productType = OrderService.productType.tiexin; //贴心
          break;
        case 15:
          insName = '月月升投资计划';
          productType = OrderService.productType.yys; //月月升
          break;
      }
      vm.info.insName = insName;
      vm.order.productType = productType;
    }

    function borLoad() { //借款信息
      BasicApi.getPlanBorrows({
        scope: scope,
        id: id,
        pageIndex: borPageIndex,
        itemsPerPage: itemsPerPage
      }).success(function(res) {
        if (res.flag === 1) {
          res.data && res.data.forEach(function(_item) {
            vm.borInvestedUsers.push(_item);
          });

          vm.borHasMoreData = (res.data && res.data.length) === itemsPerPage;
        }
      }).finally(function() {
        $rootScope.$broadcast('scroll.infiniteScrollComplete');
      });

      borPageIndex++;
    }

    function goToBorDetail(index) {
      var curItem = vm.borInvestedUsers[index];
      $state.go('invest:bordetail', { bo_id: curItem['bo_id'], user_id: curItem['user_id'] });
    }

    function getInvestRecords() { //投资记录
      BasicApi.getPlanInvestRecords({
        id: id,
        pageIndex: investPageIndex,
        itemsPerPage: itemsPerPage
      }).success(function(res) {
        if (res.flag === 1) {
          vm.total_amount = res.data.total_amount;
          vm.total_num = res.data.total_num;
          res.data.invest_records && res.data.invest_records.forEach(function(_item) {
            var str = _item.user_name;
            if (str && str.length >= 5) {
              _item.username = str.slice(0, 3) + '***' + str.slice(-2);
            } else {
              _item.username = str;
            }

            vm.investedUsers.push(_item);
          });

          vm.hasMoreData = (res.data && res.data.invest_records.length) === itemsPerPage;
        }
      }).finally(function() {
        $rootScope.$broadcast('scroll.infiniteScrollComplete');
      });

      investPageIndex++;
    }

    function purchase() {
      _czc.push(['_trackEvent', '微站-计划类购买', '点击', '立即投资']);
      if (!user.sessionId) {
        AppService.login();
        return;
      }

      if (scope == 1) { //新客
        AccApi.getInvestStatus().success(function(res) {
          if (!res.succeed) {
            toastr.info(res.errorMessage);
            return;
          }
          if (res.data.jxjhInvest == 1) {
            toastr.info('您已投资过计划类产品，不能再投资新客专享计划!');
            return;
          }
          if (!user.hasEBank) {
            EbankService.showPopup('投资');
            return;
          }

          OrderService.setOrder(vm.order);
          $state.go('purchase');
        });

      } else {
        BasicApi.canBuyFinancePlan({ id: id }).success(function(res) {
          if (res.flag == 2) {
            AppService.login();
            return;
          }
          if (res.flag != 1) {
            toastr.info(res.msg);
            return;
          }
          if (!user.hasEBank) {
            EbankService.showPopup('投资');
            return;
          }

          OrderService.setOrder(vm.order);
          $state.go('purchase');
        });
      }
    }


    function showTemplate() {
      var type = 4;
      if (scope == 1) {
        type = 5;
      } else if (scope == 11) {
        type = 4;
      } else if (scope == 15) {
        type = 3;
      }
      AgreementService.getTemplate({ type: type, productId: id, name: vm.info.title + '协议书' });

    }


  }
})();
