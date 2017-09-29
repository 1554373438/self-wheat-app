(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('WelfareController', WelfareController);

  /** @ngInject */
  function WelfareController($ionicHistory, $stateParams, $state, $rootScope, $scope, WelfareApi, UserService, AccApi) {
    var vm = this,
      slider,
      couponPageIndex,
      interestPageIndex,
      coinPageIndex,
      ppPageIndex;

    vm.sliderTabs = ['现金券', '加息券', '特权本金', '我的诺币', '现金红包'];



    vm.couponList = [];
    vm.interestList = [];
    vm.coinLogList = [];
    vm.ppList = [];
    vm.redPackets = [];

    vm.loadMore = loadMore;

    $scope.$watch(function() {
      return vm.sliderIndex;
    }, function(val, oldVal) {
      if (val == oldVal) {
        return;
      }
      slider && slider.slideTo && slider.slideTo(+val);
      // $ionicHistory.nextViewOptions({
      //   disableBack: true,
      //   historyRoot: true
      // });
      $state.go('.', { index: +val }, { notify: false, location: 'replace' });
      getRedPoint(+val);
    });

    $scope.$on("$ionicSlides.sliderInitialized", function(event, data) {
      // data.slider is the instance of Swiper
      slider = data.slider;
      vm.sliderIndex = $stateParams.index || 0;
    });

    $scope.$on("$ionicSlides.slideChangeEnd", function(event, data) {
      // note: the indexes are 0-based
      vm.sliderIndex = data.slider.activeIndex;
      $scope.$apply();
    });

    init();

    function init() {
      var _user = UserService.getUser();
      if (_user) {
        vm.level = _user.level || 0;
        vm.coin = _user.coin || 0;
      }



      couponPageIndex = 0;
      interestPageIndex = 0;
      coinPageIndex = 0;
      ppPageIndex = 1;

      vm.couponList.length = 0;
      vm.interestList.length = 0;
      vm.coinLogList.length = 0;
      vm.ppList.length = 0;


      loadCouponList();
      loadInterestList();
      loadPPList();
      loadCoinList();
      loadRP();

    }

    function loadMore(type) {
      switch (type) {
        case 'coupon':
          loadCouponList();
          break;
        case 'interest':
          loadInterestList();
          break;
        case 'coin':
          loadCoinList();
          break;
        case 'pp':
          loadPPList();
      }
    }

    // 现金券
    function loadCouponList() {
      WelfareApi.getWelfares({
        type: 'coupon',
        pageIndex: couponPageIndex,
        itemsPerPage: 10
      }).success(function(res) {
        if (res.flag === 1) {
          res.data && res.data.content && res.data.content.forEach(function(_item) {
            vm.couponList.push(_item);
          });

          vm.hasMoreCoupon = res.data && res.data.content && res.data.content.length === 10;
        } else {
          vm.hasMoreCoupon = false;
        }
      }).finally(function() {
        // $rootScope.$broadcast('scroll.refreshComplete');
        $rootScope.$broadcast('scroll.infiniteScrollComplete');
      });

      couponPageIndex++;
    }

    // 加息券
    function loadInterestList() {
      WelfareApi.getWelfares({
        type: 'interest',
        pageIndex: interestPageIndex,
        itemsPerPage: 10
      }).success(function(res) {
        if (res.flag === 1) {
          res.data && res.data.content && res.data.content.forEach(function(_item) {
            vm.interestList.push(_item);
          });

          vm.hasMoreInterest = res.data && res.data.content && res.data.content.length === 10;
        } else {
          vm.hasMoreInterest = false;
        }
      }).finally(function() {
        // $rootScope.$broadcast('scroll.refreshComplete');
        $rootScope.$broadcast('scroll.infiniteScrollComplete');
      });

      interestPageIndex++;
    }


    // 特权本金列表
    function loadPPList() {
      vm.ppList = [];
      WelfareApi.getExperienceCashList({
        pageNo: ppPageIndex,
        pageSize: 10
      }).success(function(res) {
        if (res.succeed) {
          res.data && res.data.results && res.data.results.forEach(function(_item) {
            if (_item.status == 2 || _item.status == 3) {
              _item.disabled = true;
            }
            if (_item.endDate) {
              _item.endDate = _item.endDate.slice(0, 11);

            }
            vm.ppList.push(_item);
          });
          vm.hasMorePP = res.data && res.data.result && res.data.result.length === 10;
        } else {
          vm.hasMorePP = false;
        }
      }).finally(function() {
        $rootScope.$broadcast('scroll.infiniteScrollComplete');
      });
      ppPageIndex++;
    }

    // 诺币记录
    function loadCoinList() {
      WelfareApi.coinLog({
        pageIndex: coinPageIndex,
        itemsPerPage: 10
      }).success(function(res) {
        if (res.flag === 1) {
          vm.coinLogCount = res.data.totalCount;

          res.data.result.forEach(function(_item) {
            var item = {
              name: _item.remark,
              amount: _item.ncay_op + (+_item.expend_coin || +_item.income_coin),
              date: _item.op_time
            };

            vm.coinLogList.push(item);
          });

          vm.hasMoreCoin = vm.coinLogList.length !== +vm.coinLogCount;
        }
      }).finally(function() {
        // $rootScope.$broadcast('scroll.refreshComplete');
        $rootScope.$broadcast('scroll.infiniteScrollComplete');
      });

      coinPageIndex++;
    }

    // 现金红包
    function loadRP() {
      WelfareApi.getRedPackets().success(function(res) {
        if (res.flag === 1) {

          res.data.forEach(function(_item) {
            var item = {};
            item.isExpired = _item.gain_status;

            item.amount = _item.gain_amount;
            item.desc = _item.package_resource;
            item.expireDate = _item.package_ruls;
            vm.redPackets.push(item);
          })
        }
      });
    }

    // 我的福利 红点
    function getRedPoint(index) {

      var type = null;
      if (index == 3) {
        return;
      } else if (index == 4) {
        type = 5;
      } else {
        type = index + 2;
      }
      AccApi.getRedPoint({ type: type }).success(function(res) {
        if (res.succeed) {
          var data = res.data;
          if (data.flag) { //如果有红点就清除
            AccApi.clearRedPoints({ type: type, token: data.token });
          }
        }
      });
    }

  }
})();
