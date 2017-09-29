(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('DebtInvestIntroController', InvestIntroController);

  /** @ngInject */
  function InvestIntroController($scope, $stateParams, $rootScope, $ionicSlideBoxDelegate, $log, BasicApi) {
    var vm = this,
      slider, investPageIndex = 0,
      borPageIndex = 0,
      itemsPerPage = 10;
    vm.borLoadMore = borLoad;
    vm.loadMore = load;
    // sliders options
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

    init();

    function init() {
      vm.borInvestedUsers = [];
      vm.investedUsers = [];
      info();
      load();
      borLoad();
    }

    function info() {
      BasicApi.getDebtBorrowDetail({
        id: $stateParams.id
      }).success(function(res) {
        if (res.flag === 1) {
          vm.info = res.data;
        }
      })
    }

    function borLoad() {
      BasicApi.getDebtBuyLogs({
        id: $stateParams.id,
        pageNo: borPageIndex,
        itemsPerPage: itemsPerPage,
        type: 0
      }).success(function(res) {
        if (res.flag === 1) {
          res.data.debtBuyLogs && res.data.debtBuyLogs.forEach(function(_item) {
            vm.borInvestedUsers.push(_item);
          });
          vm.borHasMoreData = (res.data.debtBuyLogs && res.data.debtBuyLogs.length) === itemsPerPage;
        }
      }).finally(function() {
        $rootScope.$broadcast('scroll.infiniteScrollComplete');
      });

      borPageIndex++;
    }

    function load() {
      BasicApi.getDebtRepayLogs({
        id: $stateParams.id,
        pageNo: investPageIndex,
        itemsPerPage: itemsPerPage
      }).success(function(res) {
        if (res.flag === 1) {
          res.data.debtBuyLogs && res.data.debtBuyLogs.forEach(function(_item) {
            _item.ba_success_time = _item.ba_success_time && _item.ba_success_time.slice(0,10);
            vm.investedUsers.push(_item);
          });

          vm.hasMoreData = (res.data.debtBuyLogs && res.data.debtBuyLogs.length) === itemsPerPage;
        }
      }).finally(function() {
        $rootScope.$broadcast('scroll.infiniteScrollComplete');
      });

      investPageIndex++;
    }


  }
})();
