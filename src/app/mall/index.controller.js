(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('MallController', MallController);

  /** @ngInject */
  function MallController($state, $scope, $interval, SystemApi, UserApi, user, utils, localStorageService, $rootScope) {
    var vm = this;

    vm.date = false;
    vm.info = {};
    vm.product = [{
      title: '会员专区',
      productLists: []
    }, {
      title: '券码兑换',
      productLists: []
    }, {
      title: '抽奖专区',
      productLists: []
    }];

    vm.vips = [];
    vm.tabs = [];

    vm.topTens = [];
    // vm.bannerList = [];
    vm.nonoCoins = [];
    vm.coupons = [];
    vm.lottys = [];

    vm.goNoData = goNoData;
    vm.selectVip = selectVip;
    vm.tapSelect = tapSelect;
    // vm.bannerSelect = bannerSelect;
    vm.goDetailList = goDetailList;
    vm.goDetail = goDetail;

    init();

    function init() {
      vm.info.number = user.level || 0;
      vm.nonoCoins = user.coin;
      
      $rootScope.$on('getUserLevel.succeed', function() {
        vm.info.number = user.level || 0;
      });
      $rootScope.$on('getUserCoin.succeed', function() {
        vm.nonoCoins = user.coin;
      });
      SystemApi.getsignIn().success(function(res) { //签到
        if (+res.flag === 1) {
          vm.date = true;
          return;
        }
        vm.date = false;
      });

      SystemApi.getNonoStoreIndex().success(function(res) {
        if (+res.flag === 1) {
          var data = res.data;
          vm.topTens = data.exchangeTopTen; //会员滚动信息
          // vm.bannerList = data.storeBanner; //banner

          vm.product[0].productLists = data.nonoCoin; //会员商城
          vm.product[1].productLists = data.coupon; //券码兑换
          vm.product[2].productLists = data.lotty; //抽奖产品
        }
      });

      selectVip(vm.info.number);
    }

    function selectVip(index) {
      vm.info.number = index;
      SystemApi.getVip().then(function(res) {
        vm.vips = res.data; //获取并设置会员信息name icon level；
        angular.forEach(vm.vips, function(vip) {
          vip.blueIcon = true; //设置vip-icon                        
        });
        var vip = vm.vips[vm.info.number];
        vip.blueIcon = false;
      });

      SystemApi.getLevel().then(function(res) {
        vm.tabs = res.data; //获取level-icon name icon level detail；
        if (vm.info.number > 3 || vm.info.number < 0) {
          vm.info.number = 0;
        }
        angular.forEach(vm.tabs, function(tab) {
          var levelArr = tab.level;
          var len = levelArr.length;
          tab.grayIcon = true;
          for (var i = 0; i < len; i++) {
            if (vm.info.number == levelArr[i]) {
              tab.grayIcon = false;
              return;
            }
          }
        });
      });
    }

    function tapSelect() {
      var level = user.level;
      $state.go('mall:level',{"number":level});
    }

    // function bannerSelect(index) {
    //   $state.go('external', {
    //     name: '麦子金服财富',
    //     link: vm.bannerList[index].link
    //   });
    // }

    function goNoData() {
      utils.alert({
        'title': '提示',
        'cssClass': 'new-popup-container',
        'content': '<p><img src="../assets/images/mall/success-mark@2x.png" alt="" />签到获得<b>5</b>诺币</p>',
        'okText': '确定'
      });
      vm.date = true;
    }

    function goDetailList(index) {
      var typeId = index;
      localStorageService.set('typeId', typeId);
      $state.go('mall:product:list');
    }

    function goDetail(cd_id) {
      var cd_Id = cd_id;
      localStorageService.set('cd_Id', cd_Id);
      $state.go('mall:exchange');
    }

  }
})();
