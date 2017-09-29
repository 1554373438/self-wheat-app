(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('EarningsController', EarningsController);

  /** @ngInject */
  function EarningsController($filter, $scope, $rootScope, $state, $ionicModal, AccApi, $log) {
    var vm = this,
      slider,
      type, modal, modalScope = $rootScope.$new(true),
      getLastIncomeSucceed = false,
      getTotalIncomeSucceed = false;

    vm.sliderIndex = 0;
    vm.info = {};

    vm.toggle = toggle;
    vm.showTip = showTip;


    init();

    function init() {
      $scope.$on("$ionicSlides.sliderInitialized", function(event, data) {
        slider = data.slider;
        $scope.$watch(function() {
          return vm.sliderIndex;
        }, function(val) {
          slider && slider.slideTo && slider.slideTo(+val);
        });
      });

      $scope.$on("$ionicSlides.slideChangeEnd", function(event, data) {
        vm.sliderIndex = data.slider.activeIndex;
        $scope.$apply();
        if (vm.sliderIndex == 0) {
          getLastIncome();
        } else if (vm.sliderIndex == 1) {
          $log.info('gettotal');
          getTotalIncome();
        }
      });
      getLastIncome();
    }



    function getLastIncome() {
      if (getLastIncomeSucceed) {
        return;
      }
      vm.info.lastIncome = {
        label: '昨日收益(元)',
        total: '-',
        items: [{
            type: 'jh',
            name: '计划',
            amount: '-',
            percentage: 0,
            color: '#F5CF72'
          },
          {
            type: 'yys',
            name: '月月升',
            amount: '-',
            percentage: 0,
            color: '#9DC4EF'
          },
          {
            type: 'nny',
            name: '诺诺盈',
            amount: '-',
            percentage: 0,
            color: '#BBB8ED'
          }, {
            type: 'zz',
            name: '债转',
            amount: '-',
            percentage: 0,
            color: '#93EADD'
          }
        ],
        size: 150
      };

      // 昨日收益明细
      AccApi.getLastIncome({ showCategory: 1 }).success(function(res) {
        if (res.succeed) {
          var data = res.data;
          if (data.sum == null) {
            vm.info.lastIncome.total = '稍后查看';
            return;
          }
          getLastIncomeSucceed = true;

          vm.info.lastIncome = {
            label: '昨日收益(元)',
            total: data.sum,
            items: [{
                type: 'jh',
                name: '计划',
                amount: $filter('number')(data.jh, 2) || '0.00',
                percentage: 100 * data.jh / data.sum || 0,
                color: '#F5CF72'
              },
              {
                type: 'yys',
                name: '月月升',
                amount: $filter('number')(data.yys, 2) || '0.00',
                percentage: 100 * data.yys / data.sum || 0,
                color: '#9DC4EF'
              },
              {
                type: 'nny',
                name: '诺诺盈',
                amount: $filter('number')(data.nny, 2) || '0.00',
                percentage: 100 * data.nny / data.sum || 0,
                color: '#BBB8ED'
              }, {
                type: 'zz',
                name: '债转',
                amount: $filter('number')(data.zz, 2) || '0.00',
                percentage: 100 * data.zz / data.sum || 0,
                color: '#93EADD'
              }
            ],
            size: 150
          };
        }
      });
    }

    function getTotalIncome() {
      if (getTotalIncomeSucceed) {
        return;
      }
      vm.info.totalIncome = {
        label: '累计收益(元)',
        total: '-',
        items: [{
            type: 'jh',
            name: '计划',
            amount: '-',
            percentage: 0,
            color: '#F5CF72'
          },
          {
            type: 'yys',
            name: '月月升',
            amount: '-',
            percentage: 0,
            color: '#9DC4EF'
          },
          {
            type: 'nny',
            name: '诺诺盈',
            amount: '-',
            percentage: 0,
            color: '#BBB8ED'
          }, {
            type: 'zz',
            name: '债转',
            amount: '-',
            percentage: 0,
            color: '#93EADD'
          }
        ],
        size: 150
      };
      AccApi.getTotalIncome().success(function(res) {
        if (res.succeed) {
          var data = res.data;
          if (data.sum == null) {
            vm.info.totalIncome.total = '稍后查看';
            return;
          }
          getTotalIncomeSucceed = true;

          vm.info.totalIncome = {
            label: '累计收益(元)',
            total: data.sum,
            items: [{
                type: 'jh',
                name: '计划',
                amount: $filter('number')(data.jh, 2) || '0.00',
                percentage: 100 * data.jh / data.sum || 0,
                color: '#F5CF72'
              },
              {
                type: 'yys',
                name: '月月升',
                amount: $filter('number')(data.yys, 2) || '0.00',
                percentage: 100 * data.yys / data.sum || 0,
                color: '#9DC4EF'
              },
              {
                type: 'nny',
                name: '诺诺盈',
                amount: $filter('number')(data.nny, 2) || '0.00',
                percentage: 100 * data.nny / data.sum || 0,
                color: '#BBB8ED'
              }, {
                type: 'zz',
                name: '债转',
                amount: $filter('number')(data.zz, 2) || '0.00',
                percentage: 100 * data.zz / data.sum || 0,
                color: '#93EADD'
              }
            ],
            size: 150
          };
        }
      })
    }

    function toggle(index) {
      vm.showDetail = !vm.showDetail;
      vm.info.lastIncome.items.forEach(function(_item) {
        _item.hide = !_item.hide;
      });
      vm.info.lastIncome.items[index].hide = false;

      type = vm.info.lastIncome.items[index].type;

      if (vm.showDetail) {
        getRecordDetails();
      } else {
        vm.info.lastIncomeDetail = [];
      }
    }

    function getRecordDetails() {
      vm.info.lastIncomeDetail = [];
      AccApi.getLastIncomeDetail({
        bizType: type
      }).success(function(res) {
        if (res.succeed) {
          angular.merge(vm.info.lastIncomeDetail, res.data);
        }
      });
    }

    function showTip() {
      $ionicModal.fromTemplateUrl('app/earnings/info.html', {
        scope: modalScope,
        animation: 'slide-in-up'
      }).then(function(_modal) {
        modal = _modal;
        _modal.show();
      });
    }
    modalScope.close = function() {
      modal && modal.remove();
    }

  }
})();
