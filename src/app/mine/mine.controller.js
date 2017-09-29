(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('MineController', MineController);

  /** @ngInject */
  function MineController($state, AccApi, CommonApi, InvtApi, PayApi, $rootScope, $scope, $location, utils, user, UserService, EbankService, toastr, $base64, $window, localStorageService) {
    var vm = this;
    vm.user = user;
    vm.user.account = {};
    vm.showAccount = true;
    vm.hasUnreadMsg = false;
    vm.invtDetail = [{
      name: '计划',
      route: '',
      amount: 0,
      desc: '省心省事 到期还款'
    }, {
      name: '月月升',
      route: '',
      amount: 0,
      desc: '每月增息 退出灵活'
    }, {
      name: '诺诺盈',
      route: '',
      amount: 0,
      desc: '新标直投 每月回款'
    }, {
      name: '债转',
      route: '',
      amount: 0,
      desc: '买卖随心 转让随意'
    }];
    vm.welfare = {
      2: {
        name: '现金券',
        flag: 0
      },
      3: {
        name: '加息券',
        flag: 0
      },
      4: {
        name: '特权本金',
        flag: 0
      },
      'nb': {
        name: '我的诺币',
        flag: 0
      },
      5: {
        name: '现金红包',
        flag: 0
      },
    };

    vm.goPage = goPage;
    vm.toggleShow = function() {
      vm.showAccount = !vm.showAccount;
    }
    vm.setNoticeRead = setNoticeRead;
    // vm.clearWelfareRedPoints = clearWelfareRedPoints;


    init();


    function init() {
      localStorageService.set('needPay', 0);
      vm.user.account = UserService.getAccountInfo();
      // reload data for every entrance
      $scope.$on("$ionicView.beforeEnter", function() {
        UserService.updateAssetsInfo();
        getAssetsList();
        getNoticeUnread();
        getWelfareRedPoints();

      });
      $rootScope.$on('updateAssetsInfo.complete', function() {
        vm.user.account = UserService.getAccountInfo();
      });
      $rootScope.$on('getUserLevel.succeed', function() {
        vm.user.level = user.level;
      });
    }

    function getAssetsList() {
      InvtApi.getAssetsDetails().success(function(res) {
        if (res.succeed) {
          var data = res.data;
          vm.invtDetail[0].amount = data.jh;
          vm.invtDetail[1].amount = data.yys;
          vm.invtDetail[2].amount = data.nny;
          vm.invtDetail[3].amount = data.zz;
        }
      });
    }

    function getNoticeUnread() {
      CommonApi.getNoticeUnread().success(function(res) {
        if (res.succeed && res.data.total) {
          vm.hasUnreadMsg = true;
        }
      })
    }

    function setNoticeRead() {
      $state.go('msg');
      if (vm.hasUnreadMsg) {
        CommonApi.setNoticeRead({ids:[], isAll: 1}).success(function(res) {
          if (res.succeed) {
            $log.info('设置已读');
          }
        });
      }
    }

    function goPage(page, index) {
      switch (page) {
        case 'level':
          $state.go('mall:level', { number: vm.user.level });
          break;
        case 'topup':
          goTopup();
          break;
        case 'withdraw':
          goWithdraw();
          break;
        case 'record':
          $state.go('records:list', { type: index });
          break;
        case 'cust':
          goCust();
          break;
        case 'welfare':
          goWelfare(index);
          break;
      }
    }

    // 去充值
    function goTopup() {
      _czc.push(['_trackEvent', '微站-我的-充值', '点击', '充值']);
      if (!user.hasEBank) {
        EbankService.showPopup('充值');
        return;
      }
      localStorageService.set("needPay", null);
      $state.go('topup');
    }

    // 去提现
    function goWithdraw() {
      _czc.push(['_trackEvent', '微站-我的-提现', '点击', '提现']);
      if (!user.hasEBank) {
        EbankService.showPopup('提现');
      } else if (!user.isAuth) {
        utils.confirm({
          title: '提示',
          content: '您暂未绑定提现银行卡，如您不添加新银行卡将无法提取徽商银行电子账户余额',
          cssClass: 'captcha-pop-1',
          onOk: function() {
            EbankService.goPage('entrance');
          }
        });
      } else if (!user.hasPayPwd) {
        utils.confirm({
          title: '温馨提示',
          content: '<p>麦子金服财富已接入徽商存管，如需提现，请先设置交易密码。</p>',
          cssClass: 'text-left',
          okText: '确定',
          okType: 'button-positive button-clear',
          cancelText: '取消',
          cancelType: '',
          onOk: function() {
            EbankService.goPage('pwd/set.html');
          }
        });
      } else {
        PayApi.getWithdrawStatus().success(function(res) {
          if (!res.succeed) {
            toastr.info(res.errorMessage);
            return;
          }
          if (res.data) {
            /* 0--可申请提现进入提现页面（无审核或审核拒绝）；1--审核中；2--审核通过（直接进入冻结列表页面）*/
            if (res.data.status == 1) {
              utils.alert({
                title: '提示',
                subTitle: res.data.reason
              });
              return;
            }
            if (res.data.status == 2) {
              $state.go('freeze');
              return;
            }
            $state.go('withdraw');
          }
        });
      }
    }

    // 我的福利 红点
    function getWelfareRedPoints() {
      AccApi.getRedPoints({ types: '2,3,4,5' }).success(function(res) {
        if (res.succeed) {
          var data = res.data;
          data.forEach(function(item) {
            var key = item['type'];
            vm.welfare[key]['flag'] = item.flag;
            vm.welfare[key]['token'] = item.token;
          });
        }
      });
    }

    // 消除红点
    function goWelfare(type) {
    
      var routeIndex = 0;
      if (type == 'nb') {
        routeIndex = 3;
      } else if (type == 5) {
        routeIndex = 4;
      } else {
        routeIndex = type - 2;
      }
      $state.go('welfare', { index: routeIndex });
    }


    // 客服链接
    function goCust() {
      if (user.mobile) {
        var sign = 'NN0MZ0KF0CRM01|' + user.mobile;
      } else {
        var sign = 'NN0MZ0KF0CRM01|'
      }

      var pwd = $base64.encode(sign);
      var link = 'http://apicrm.maizijf.com:8088/mobilecust?mzpwd=' + pwd;
      $window.location.href = link;
    }

  }
})();
