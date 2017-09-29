(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('MyDebtController', myDebtController);

  /** @ngInject */
  function myDebtController($scope, $rootScope, $ionicSlideBoxDelegate, $log, localStorageService, InvtApi, $state, utils, toastr) {
    var vm = this,
      slider, investPageIndex = 1,
      borPageIndex = 1,
      itemsPerPage = 10;
    vm.borLoadMore = borLoad;
    vm.loadMore = load;
    vm.goTo = goTo;
    vm.downs = downs;
    vm.goBack = goBack;
    vm.accounts = accounts;
    vm.doRefresh = init;
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
      investPageIndex = 1;
      borPageIndex = 1;
      vm.borInvestedUsers = [];
      vm.investedUsers = [];
      vm.borHasMoreData = false;
      load();
      borLoad();
    }

    function borLoad() {
      InvtApi.getmyDebtDebtList({
        pageNo: borPageIndex,
        itemsPerPage: itemsPerPage
      }).success(function(res) {
        if (res.succeed) {
          vm.data = res.data;
          res.data.list && res.data.list.forEach(function(_item) {
            vm.borInvestedUsers.push(_item);
          });
          vm.borHasMoreData = (res.data.list && res.data.list.length) === itemsPerPage;
        }
      }).finally(function() {
        $rootScope.$broadcast('scroll.refreshComplete');
        $rootScope.$broadcast('scroll.infiniteScrollComplete');
      });

      borPageIndex++;
    }

    function load() {
      InvtApi.getmyDebtTransferList({
        pageNo: investPageIndex,
        itemsPerPage: itemsPerPage
      }).success(function(res) {
        if (res.succeed) {
          res.data.list && res.data.list.forEach(function(_item) {
            _item.createTime = _item.createTime && _item.createTime.slice(0, 10)
            vm.investedUsers.push(_item);
          });

          vm.hasMoreData = (res.data.list && res.data.list.length) === itemsPerPage;
        }
      }).finally(function() {
        $rootScope.$broadcast('scroll.refreshComplete');
        $rootScope.$broadcast('scroll.infiniteScrollComplete');
      });

      investPageIndex++;
    }

    function goBack(index) {
      if (+vm.data.stopFlag == 1 || +vm.borInvestedUsers[index].transferFlag == 0 || +vm.borInvestedUsers[index].transferFlag == 2 || +vm.borInvestedUsers[index].transferFlag == 4) {
        return;
      }
      if (+vm.borInvestedUsers[index].type == 1) {
        $state.go('myDebt:detail', { id: vm.borInvestedUsers[index].deaId, type: 0 });
      } else {
        localStorageService.set('debtPick', {
          vaid: vm.borInvestedUsers[index].vaId,
          title: vm.borInvestedUsers[index].title
        });
        $state.go('myDebt:pick', { id: vm.borInvestedUsers[index].vaId });
      }
    }

    function goTo(index, $event) {
      if (+vm.data.stopFlag == 1) {
        utils.alert({
          'title': '提示',
          'cssClass': '',
          'content': vm.data.stopMessage,
          'okText': '确定'
        });
        $event.stopPropagation();
      } else if (+vm.borInvestedUsers[index].transferFlag == 0 || +vm.borInvestedUsers[index].transferFlag == 2 || +vm.borInvestedUsers[index].transferFlag == 4) {
        var msg = vm.borInvestedUsers[index].message;
        utils.alert({
          'title': '提示',
          'cssClass': '',
          'content': msg,
          'okText': '确定'
        });
        $event.stopPropagation();
      } else {
        if (+vm.borInvestedUsers[index].type == 1) {
          $state.go('myDebt:detail', { id: vm.borInvestedUsers[index].deaId, type: 0 });
        } else {
          localStorageService.set('debtPick', {
            vaid: vm.borInvestedUsers[index].vaId,
            title: vm.borInvestedUsers[index].title
          });
          $state.go('myDebt:pick', { id: vm.borInvestedUsers[index].vaId });
        }
      }
    }

    function accounts(index) {
      // if (!vm.investedUsers[index].showDetail) {
      //   // return;
      // }
      var id = null;
      var type = null;
      if (vm.investedUsers[index].productType == 9) {
        id = vm.investedUsers[index].dsId
        type = 1;
      } else {
        id = vm.investedUsers[index].dbId;
        type = 2;
      }
      $state.go('myDebt:accounts', { id: id, type: type });
    }

    function getsoldOut(index) {

      var type = +vm.investedUsers[index].productType , id;
      if (type == 9) {
        id = vm.investedUsers[index].dsId; //债权
      } else {
        id = vm.investedUsers[index].dbId; //债转包
      }

      InvtApi.getsoldOut({
        id: id,
        productType: type
      }).success(function(res) {
        if (res.succeed) {
          init();
          utils.alert({
            title: ' ',
            cssClass: '',
            content: '<p class="ioc-success"></p><span>下架成功</span>',
            okText: '确定',
            onOk:function() {
              investPageIndex = 1;
              load();
            }

          });
        } else {
          toastr.info(res.errorMessage);
        }
      })
    }

    function downs(index, $event) {
      var amount = vm.investedUsers[index].numSaled;
      utils.confirm({
        title: ' ',
        cssClass: 'confirms',
        content: '<p>你该笔债转截止到现在, 已转出<span class="assertive">' + amount + '元。</span>下架后将终止转让，确定要下架吗？</p>',
        okText: '确认下架',
        onOk: function() {
          getsoldOut(index);
        }
      })
      $event.stopPropagation();
    }

  }
})();
