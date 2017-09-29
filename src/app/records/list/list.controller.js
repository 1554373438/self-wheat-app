(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('RecordsListController', RecordsListController);

  /** @ngInject */
  function RecordsListController($scope, $state, $stateParams,  $rootScope, $ionicHistory, $ionicSlideBoxDelegate, InvtApi, BasicApi, localStorageService) {
    // type =8 月月升 需要项目来源 持有天数
    var vm = this,
      slider,
      sliderIndex = 0,
      pageSize = 15;

    vm.jhInfo = {
      planPi: 1,
      jhData: false,
      planList: [],
      loadPlanList: loadPlanList
    };
    vm.yysInfo = {
      monUpPi: 1,
      yysData: false,
      monUpList: [],
      loadMonUpList: loadMonUpList
    };
    vm.nnyInfo = {
      nnyPi: 1,
      nnyData: false,
      nnyList: [],
      loadNnyList: loadNnyList
    };
    vm.zzInfo = {
      debtPi: 1,
      zzList: false,
      debtList: [],
      loadDebtList: loadDebtList
    };

    vm.goDetail = goDetail;
    vm.goProduct = goProduct;

    // vm.sliderTabs = ['计划类', '月月升', '诺诺盈', '债转类'];
    vm.sliderIndex = $stateParams.type || 0;

    $scope.$on("$ionicSlides.sliderInitialized", function(event, data) {
      slider = data.slider;

      $scope.$watch(function() {
        return vm.sliderIndex;
      }, function(val) {
        slider && slider.slideTo && slider.slideTo(+val);
        // $ionicHistory.nextViewOptions({
        //   disableBack: true,
        //   historyRoot: true
        // });
        $state.go('.', { type: +val }, { notify: false, location: 'replace' });
      });
    });

    $scope.$on("$ionicSlides.slideChangeEnd", function(event, data) {
      // note: the indexes are 0-based
      vm.sliderIndex = data.slider.activeIndex;
      $scope.$apply();
      switch (+vm.sliderIndex) {
        case 0:
          if (!vm.jhInfo.planList.length) {
            vm.jhInfo.planPi = 1;
            loadPlanList();
          }
          break;
        case 1:
          if (!vm.yysInfo.monUpList.length) {
            vm.yysInfo.monUpPi = 1;
            loadMonUpList();
          }
          break;
        case 2:
          if (!vm.nnyInfo.nnyList.length) {
            vm.nnyInfo.nnyPi = 1;
            loadNnyList();
          }
          break;
        case 3:
          if (!vm.zzInfo.debtList.length) {
            vm.zzInfo.debtPi = 1;
            loadDebtList();
          }
          break;
      }
    });

    init();
    function init() {
      if(vm.sliderIndex == 0){
        vm.jhInfo.planPi = 1;
        loadPlanList();
      }
    }

    //计划类
    function loadPlanList(refresh) {
      if(refresh){
        vm.jhInfo.planList.length = 0;
        vm.jhInfo.planPi = 1 ;
      }
      InvtApi.getPlanecordList({
        pageIndex: vm.jhInfo.planPi,
        pageSize: pageSize,
        pt: '1,2,3,4,5,6,7'
      }).success(function(res) {
        if (res.succeed) {
          res.data && res.data.list.forEach(function(_item) {
            // if(_item.productType != 15 && _item.isCash == 1) {
            //   _item.isEnd = true;
            // } else if(_item.productType == 15 && _item.yysStatus==2) {
            //    _item.isEnd = true;
            // }
            // 懒人计划
            if(_item.productType == 6) {
              _item.profit = _item.lazyTotalIncome;
            }
            _item.finish_Date = _item.finishDate && _item.finishDate.slice(0, 10);
            _item.finishDate = _item.finishDate && _item.finishDate.slice(0, 10).replace(/-/g,'/');
            vm.jhInfo.planList.push(_item);
          });
          if(vm.jhInfo.planList.length == 0){
            vm.jhInfo.jhData = true ;
          }
        }else { 
          vm.jhInfo.jhData = true ;
        }
        vm.hasMoreDataPlan = res.data && res.data.list && res.data.list.length === pageSize;
      }).finally(function() {
        $rootScope.$broadcast('scroll.refreshComplete');
        $rootScope.$broadcast('scroll.infiniteScrollComplete');
      });
      vm.jhInfo.planPi++;
    }

    // 月月升
    function loadMonUpList(refresh) {
      if(refresh){
        vm.yysInfo.monUpList.length = 0;
        vm.yysInfo.monUpPi = 1 ;
      }
      InvtApi.getPlanecordList({
        pageIndex: vm.yysInfo.monUpPi,
        pageSize: pageSize,
        pt:'15'
      }).success(function(res) {
        if (res.succeed) {
          res.data && res.data.list.forEach(function(_item) {
            _item.finishDate = _item.finishDate && _item.finishDate.slice(0, 10).replace(/-/g,'/');
            vm.yysInfo.monUpList.push(_item);
          });
          if(vm.yysInfo.monUpList.length == 0){
            vm.yysInfo.yysData = true ;
          }
        }else {
          vm.yysInfo.yysData = true ;
        }
        vm.hasMoreDataMonUp = res.data && res.data.list && res.data.list.length === pageSize;
      }).finally(function() {
        $rootScope.$broadcast('scroll.refreshComplete');
        $rootScope.$broadcast('scroll.infiniteScrollComplete');
      });
      vm.yysInfo.monUpPi++;
    }

    // 诺诺盈
    function loadNnyList(refresh) {
      if(refresh){
        vm.nnyInfo.nnyList.length = 0;
        vm.nnyInfo.nnyPi = 1 ;
      }
      InvtApi.getNnyRecordList({
        pageIndex: vm.nnyInfo.nnyPi,
        pageSize: pageSize,
        ver: '0.0.1'
      }).success(function(res) {
        if (res.succeed) {
          res.data && res.data.list.forEach(function(_item) {
            _item.endTime = _item.endTime && _item.endTime.slice(0, 10);
            vm.nnyInfo.nnyList.push(_item);
          });
          if(vm.nnyInfo.nnyList.length == 0){
            vm.nnyInfo.nnyData = true ;
          }
        }else {
          vm.nnyInfo.nnyData = true ;
        }
        vm.hasMoreDataRecordDirect = res.data && res.data.list && res.data.list.length === pageSize;
      }).finally(function() {
        $rootScope.$broadcast('scroll.refreshComplete');
        $rootScope.$broadcast('scroll.infiniteScrollComplete');
      });
      vm.nnyInfo.nnyPi++;
    }

    // 债转类
    function loadDebtList(refresh) {
      if(refresh){
        vm.zzInfo.debtList.length = 0;
        vm.zzInfo.debtPi = 1 ;
      }
      InvtApi.getDebtInvest({
        pageIndex: vm.zzInfo.debtPi,
        pageSize: pageSize
      }).success(function(res) {
        if (res.succeed) {
          res.data && res.data.list && res.data.list.forEach(function(_item) {
            vm.zzInfo.debtList.push(_item);
          });
          if(vm.zzInfo.debtList.length == 0){
            vm.zzInfo.zzData = true ;
          }
        }else {
          vm.zzInfo.zzData = true ;
        }
        vm.hasMoreDataDebt = res.data && res.data.investRecords && res.data.investRecords.length === pageSize;
      }).finally(function() {
        $rootScope.$broadcast('scroll.refreshComplete');
        $rootScope.$broadcast('scroll.infiniteScrollComplete');
      });
      vm.zzInfo.debtPi++;
    }


    function goDetail(index) {
      var pType = '';
      switch (+vm.sliderIndex) {
        case 0:
          pType = 'plan';
          localStorageService.set('record', vm.jhInfo.planList[index]);
          $state.go('records:investDetail', { type: pType });
          break;
        case 1:
          pType = 'monUp';
          localStorageService.set('record', vm.yysInfo.monUpList[index]);
          $state.go('records:investDetail', { type: pType });
          break;
        case 2:
          pType = 'nny';
          localStorageService.set('record', vm.nnyInfo.nnyList[index]);
          $state.go('records:nnyDetail', { type: pType });
          break;
        case 3:
          pType = 'debt';
          localStorageService.set('record', vm.zzInfo.debtList[index]);
          $state.go('records:nnyDetail', { type: pType });
          break;
      }
    }

    function goProduct(pType) {
      switch (+pType) {
        case 0:
          $state.go('product', { type: 0 }); //计划
          break;
        case 1:
          $state.go('product', { type: 1 }); //诺诺盈
          break;
        case 2:
          $state.go('product', { type: 2 }); //债转
          break;
      }
    }
  }
})();
