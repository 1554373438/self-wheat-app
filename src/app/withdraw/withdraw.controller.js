(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('WithdrawController', WithdrawController);

  /** @ngInject */
  function WithdrawController($scope, TrdApi, APISERVER, localStorageService, EbankService, user, toastr, utils, $location, CLIENT_VERSION) {
    var vm = this,
      submitSwitch = false;
    // lineObj = {};

    vm.submit = submit;
    vm.showPop = showPop;
    vm.toggleFee = toggleFee;
    vm.info = {};


    $scope.$on('$ionicView.beforeEnter', init);

    function init() {
      vm.getUserLevel = user.level;
      vm.useFree = false;
      TrdApi.getWithdrawInfo().success(function(res) {
        if (!res.succeed) {
          toastr.info(res.errorMessage);
          return;
        }
        vm.info = res.data;
        vm.info.bankTail = vm.info.bankCardNo && vm.info.bankCardNo.slice(-4);

      })
    }

    function toggleFee() {
      vm.useFree = !vm.useFree;
      if (!vm.info.amount) {//如果一开始先点击了使用免费次数则需要return
        vm.info.fee = 0;
        vm.info.arrivalAmount = 0;
        return;
      }
      if (vm.useFree) {
        vm.info.arrivalAmount = vm.info.amount || 0;
        vm.info.fee = 0;
      } else {
        getFee(vm.info.amount);
      }
    }

    var reg = /^([1-9][0-9]*)+(.[0-9]{1,2})?$/;
    $scope.$watch(function() {
      return vm.info.amount;
    }, function(val, old) {

      if (!val) {
        vm.info.amount = null;
        vm.info.fee = 0;//必须加在这里初始化因为当用户删掉金额后要显示0
        vm.info.arrivalAmount = 0;
        return;
      }

      if (val != old) {
        if (!reg.test(val)) {
          val = String(val);
          // if(!val) {
          //   vm.info.amount = null;
          //   vm.info.fee = 0;
          //   vm.info.arrivalAmount = 0;
          // }
          vm.info.amount = Number(val.substr(0, (''+val).indexOf('.') + 3));
        }
        if (val > vm.info.nonoAvlBalance) {
          vm.info.amount = vm.info.nonoAvlBalance;
        }

        if (!vm.info.isNonFee || (vm.getUserLevel > 0 && !vm.useFree && vm.info.isNonFee)) { //没有免费次数了或者有次数但是没有点击使用免费次数
          getFee(+val);
        } else if (vm.useFree && vm.getUserLevel > 0 && vm.info.isNonFee) { //有免费次数并且点击了使用
          vm.info.arrivalAmount = vm.info.amount || 0;
          vm.info.fee = 0;
        }



      }
    }, true);


    // 计算提现手续费
    function getFee(amount) { //体现金额
      if (amount > 0 && amount < 20000) {
        vm.info.fee = 2;
      } else if (20000 <= amount && amount <= 50000) {
        vm.info.fee = 3;
      } else {
        var num_fee = Math.floor(amount / 50000); //计算提现金额可以拆分为几个50000
        var remainder = amount - num_fee * 50000; //计算余额：用提现金额除以50000
        var a_fee = num_fee * 3;
        var re_fee = 0;
        if (0 < remainder && remainder < 20000) {
          re_fee = 2;
        } else if (remainder >= 20000) {
          re_fee = 3;
        }
        vm.info.fee = a_fee + re_fee;
      }
      vm.info.arrivalAmount = vm.info.amount - vm.info.fee;
      if (vm.info.arrivalAmount < 0) {
        vm.info.arrivalAmount = 0;
      }
    }

    function submit() {
      _czc.push(['_trackEvent', '微站－提现', '点击', '确认提现']);
      if (!vm.info.amount || isNaN(vm.info.amount)) {
        utils.alert({
          title: '提示',
          subTitle: '请输入有效提现金额'
        });
        return;
      }
      if (vm.info.amount > vm.info.nonoAvlBalance) {
        utils.alert({
          title: '提示',
          subTitle: '输入金额大于账户可用余额，请修改您的提现金额！'
        });
        return;
      }
      if (vm.info.amount < 3) {
        utils.alert({
          title: '提示',
          subTitle: '平台最低提现金额为3元，请修改您的提现金额！'
        });
        return;
      }
      // if(vm.info.amount > vm.info.singleLimit){
      //   utils.alert({
      //     title: '提示',
      //     subTitle: '单笔最高'+vm.info.singleLimit
      //   });
      //   return;
      // }
      // if(vm.info.amount > vm.info.dayLimit){
      //   utils.alert({
      //     title: '提示',
      //     subTitle: '单日最高'+vm.info.singleLimit
      //   });
      //   return;
      // }
      if (vm.info.amount > vm.info.largeAmount && !vm.info.cnapsCode) {
        utils.alert({
          title: '提示',
          subTitle: '大额提现，请查询并输入绑定银行卡的电子联行号！'
        });
        return;
      }


      function getContent() {
        var info = vm.info;
        return '<p class="ti-confirm"><span>审批金额：' + info.amount + '元</span><br><span>手续费：' + info.fee + '元</span><br><span>实际到账金额： ' + info.arrivalAmount + '元</span></p>' +
          '<p class="ti-confirm"> 提醒：为保障用户账户安全，如您未在存管行完成交易，账户余额将被暂时冻结，直到您完成该笔提现。</p>';
      }
      var urlCallback = encodeURIComponent(APISERVER.HOST + '/nono-app/#/mine');
      var curPage  = encodeURIComponent($location.absUrl());

      if(!CLIENT_VERSION) {
        var surl = APISERVER.HOST + '/hscg/withdraw/success.html?urlCallBack=' + urlCallback;
        var purl = APISERVER.HOST + '/hscg/pwd/reset.html?sessionId=' + user.sessionId + '&terminal=3&urlCallBack='+curPage;
      } else {
        var surl = APISERVER.HOST + '/hscg/withdraw/success.html';
        var purl = APISERVER.HOST + '/hscg/pwd/reset.html?sessionId=' + user.sessionId + '&terminal=3';
      }

      var obj = {
        amount: vm.info.amount,
        lineNo: vm.info.cnapsCode,
        isNonFee: vm.useFree ? 1 : 0,
        surl: surl,
        purl: purl,
        needRedis: false
      };
      utils.confirm({
        title: '确认提现',
        content: getContent(),
        cssClass: 'widthdraw-confirm',
        onOk: function() {
          if (submitSwitch) return;
          if (!submitSwitch) {
            submitSwitch = true;
            confirmAjax(obj);
          }
        }
      });
    }

    function confirmAjax(obj) {
      TrdApi.withdrawApply(obj).success(function(res) {
        submitSwitch = false;
        if (!res.succeed) {
          utils.alert({
            title: '提示',
            subTitle: res.errorMessage
          });
          return;
        }
        var data = res.data;
        if (data) {
          if (data.status !== 1) {
            utils.alert({
              title: '提示',
              subTitle: data.desc
            });
            return;
          }
          EbankService.formPOST(data.targetUrl, data.formData);
        }
      }).error(function() {
        submitSwitch = false;
      });

    }

    function showPop() {
      utils.alert({
        title: '什么是电子联行号',
        subTitle: '<p class="text-center"  style="line-height:18px;">银行联行号就是一个地区银行的唯一识别标志。用于人民银行所组织的大额支付系统／小额支付系统／城市商业银行银行汇票系统／全国支票影像系统(含一些城市的同城票据自动清分系统)等跨区域支付结算业务。由12位组成：3位银行代码+4位城市代码+4位银行编号+1位校验位。</p>',
        cssClass: 'captcha-pop-1'
      });
    }

    // function seeFee() {
    //   $state.go('withdraw:fee');
    //   // utils.alert({
    //   //   subTitle: '<p class="text-center">2万元以下： 2元／笔<br/>2万(含)－5万： 3元／笔<br/>5万(以上)：系统自动拆分</p>',
    //   //   title: '手续费说明',
    //   //   cssClass: 'captcha-pop-1'
    //   // });
    //
    // }
  }

})();
