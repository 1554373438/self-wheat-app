(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('ProductController', ProductController);

  /** @ngInject */
  function ProductController($stateParams, $rootScope, $scope, $state, $ionicHistory, InvtApi, toastr) {

    var vm = this,
      slider, itemsPerPage = 10;

    // 优化
    var product = null;
    vm.planInfoNull = true;
    vm.nnyInfoNull = true;
    vm.debtInfoNull = true;
    vm.info = {
      jh: {
        list: []
      },
      yys: {},
      nny: {
        pageNo: 1,
        list: [],
        hasMoreData: false
      },
      debt: {
        pageNo: 1,
        list: [],
        hasMoreData: false
      },
      noData: false,
      minExpect: 1,
      maxExpect: 36
    };

    vm.toolbar = {
      show: false,
      rangeMin: 1,
      rangeMax: 36,
      rangeShow: false,
      showModal: showModal,
      closeModal: closeModal,
      reset: reset,
      search: search,
      isClass: false
    };

    vm.toggleTab = toggleTab;
    vm.fn = {};
    vm.fn.getJhList = getJhList;
    vm.fn.getYysList = getYysList;
    vm.fn.getNnyList = getNnyList;
    vm.fn.getDebtList = getDebtList;
    vm.fn.goDetail = goDetail;

    init();

    function init() {
      vm.sliderIndex = +$stateParams.type || 0;

      $scope.$on("$ionicSlides.sliderInitialized", function(event, data) {
        slider = data.slider;
        $scope.$watch(function() {
          return vm.sliderIndex;
        }, function(val) {

          vm.info.noData = false;
          slider && slider.slideTo && slider.slideTo(+val);
          $state.go('.', { type: +val }, { notify: false, location: 'replace' });
        });

      });

      $scope.$on("$ionicSlides.slideChangeEnd", function(event, data) {
        vm.sliderIndex = data.slider.activeIndex;
        vm.toolbar.rangeMin = null;
        vm.toolbar.rangeMax = null;
        console.log('slideChangeEnd');
        getProductInfo();
      });


      getProductInfo();
    }


    function getProductInfo() {
      switch (+vm.sliderIndex) {
        case 0:
          vm.toolbar.show = false;
          if (!vm.info.jh.list.length) {
            getJhList();
          }

          break;
        case 1:
          vm.toolbar.show = false;
          if (!vm.info.yys.pro_id) {
            getYysList();
          }
          break;
        case 2:
          vm.toolbar.show = true;
          vm.toolbar.rangeShow = false;
          vm.toolbar.rangeMax = 36;
          vm.info.minExpect = 1;
          vm.info.maxExpect = 36;
          if (!vm.info.nny.list.length) {
            getNnyList();
          }


          break;
        case 3:
          vm.toolbar.show = true;
          vm.toolbar.rangeShow = false;
          vm.toolbar.rangeMax = 36;
          vm.info.minExpect = 1;
          vm.info.maxExpect = 36;
         
          if (!vm.info.debt.list.length) {
            getDebtList();
          }


          break;
      }
    }

    function getJhList(options) {
      InvtApi.getJhList().success(function(res) {
        vm.planInfoNull = false;
        if (res.succeed) {
          vm.info.jh.list = res.data.productList;
        }
      }).error(function() {
        toastr.info('加载失败');
      }).finally(function() {
        if (options && options.refresh) {
          $scope.$broadcast('scroll.refreshComplete');
        }
      });
    }

    function getYysList(options) {
      InvtApi.getYysList().success(function(res) {
        if (res.succeed) {
          vm.info.yys = res.data && res.data.financeList[0];
          if (vm.info.yys.rate_show && vm.info.yys.rate_show.indexOf('+') > -1) {
            var rates = vm.info.yys.rate_show.split('+');
            var rate = rates[0].replace('%', '');
            vm.info.yys.rateShow = '<span class="font-60">' + rate + '</span>' + '%+' + rates[1];
          } else {
            vm.info.yys.rateShow = vm.info.yys.rate_show && vm.info.yys.rate_show.replace(/([\d.])/g, '<span class="font-60">$1</span>');
          }
        }
      }).error(function() {
        toastr.info('加载失败');
      }).finally(function() {
        if (options && options.refresh) {
          $scope.$broadcast('scroll.refreshComplete');
        }

      });
    }

    function getNnyList(options) {
      if (options && options.refresh) {
        vm.info.nny.pageNo = 1;
        vm.info.nny.list = [];
      }

      InvtApi.getNnyList({
        pageNo: vm.info.nny.pageNo,
        pageSize: itemsPerPage,
        minExpect: vm.info.minExpect,
        maxExpect: vm.info.maxExpect
      }).success(function(res) {
        vm.nnyInfoNull = false;
        if (res.succeed) {
          var data = res.data;
          if (!data.total) {
            vm.info.nny.hasMoreData = false;
            vm.info.noData = true;
            return;
          }

          vm.info.noData = false;
          var list = res.data.financeList;
          vm.info.nny.list = vm.info.nny.list.concat(list);
          vm.info.nny.hasMoreData = (list && list.length) == itemsPerPage;

        }
      }).error(function() {
        toastr.info('加载失败');
      }).finally(function() {
        if (options && options.loadmore) {
          console.log('nny loadmore');
          $rootScope.$broadcast('scroll.infiniteScrollComplete');
        }
        if (options && options.refresh) {
          console.log('nny refresh');
          $scope.$broadcast('scroll.refreshComplete');
        }
      });
      vm.info.nny.pageNo++;
    }

    function getDebtList(options) {
      if (options && options.refresh) {
        vm.info.debt.pageNo = 1;
        vm.info.debt.list = [];
      }
      InvtApi.getDebtList({
        pageNo: vm.info.debt.pageNo,
        pageSize: itemsPerPage,
        minExpect: vm.info.minExpect,
        maxExpect: vm.info.maxExpect
      }).success(function(res) {
        vm.debtInfoNull = false;
        if (res.succeed) {
          var data = res.data;
          if (!data.total) {
            vm.info.debt.hasMoreData = false;
            vm.info.noData = true;
            return;
          }
          vm.info.noData = false;
          var list = res.data.productList;
          vm.info.debt.list = vm.info.debt.list.concat(list);
          vm.info.debt.hasMoreData = (list && list.length) == itemsPerPage;

        }
      }).error(function() {
        toastr.info('加载失败');
      }).finally(function() {
        if (options && options.loadmore) {
          console.log('debt loadmore');
          $rootScope.$broadcast('scroll.infiniteScrollComplete');
        }
        if (options && options.refresh) {
          console.log('debt refresh');
          $scope.$broadcast('scroll.refreshComplete');
        }


      });
      vm.info.debt.pageNo++;
    }

    function toggleTab(index) {
      if (index == 1) {
        vm.sliderIndex = 2;
      } else {
        vm.sliderIndex = 3;
      }
    }

    function goDetail(index) {
      var route = '';
      var p = null;
      switch (+vm.sliderIndex) {
        case 0:
          p = vm.info.jh.list[index];
          route = 'invest:detail';
          break;
        case 1:
          p = vm.info.yys;
          route = 'yys:detail';
          break;
        case 2:
          p = vm.info.nny.list[index];
          route = 'directInvest:detail';
          break;
        case 3:
          p = vm.info.debt.list[index];
          p.pro_id = p.id;
          route = 'debtInvest:detail';
          break;
      }
      $state.go(route, { id: p.pro_id, scope: p.scope });
    }

    // 筛选弹出层
    function showModal() {
      vm.toolbar.rangeShow = true;
    }

    function closeModal() {
      vm.toolbar.rangeShow = false;
    }

    function reset() {
      vm.toolbar.isClass = false;
      vm.info.minExpect = 1;
      vm.info.maxExpect = vm.toolbar.rangeMax;
    }

    function search() {
      vm.toolbar.rangeShow = false;
      if (vm.sliderIndex == 2) {
        vm.info.nny.list = [];
        vm.info.nny.pageNo = 1;
        vm.info.nny.hasMoreData = false;
        getNnyList();
      } else {
        vm.info.debt.list = [];
        vm.info.debt.pageNo = 1;
        vm.info.debt.hasMoreData = false;
        getDebtList();
      }
    }

  }
})();
