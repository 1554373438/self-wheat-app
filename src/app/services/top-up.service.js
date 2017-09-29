(function() {
  'use strict';

  angular
    .module('nonoApp')
    .service('TopUpService', TopUpService);
  /** @ngInject */
  function TopUpService($ionicModal, $rootScope, $timeout, $state, OrderService, CouponService, UserService, PayApi, utils, toastr, md5, user, $log, AccApi, TrdApi, $ionicHistory, localStorageService) {
    var self = this,
      order = {},
      modals = [],
      options, mScope = $rootScope.$new(true);

    mScope.data = {
      needPay: 0,
      countdown: 60,
      smSCode: ''
    };
    mScope.fn = {};
    mScope.fn.close = closeModal;
    mScope.fn.back = goBack;
    mScope.fn.showPage = showPage;
    mScope.fn.infoPrompt = infoPrompt;
    mScope.fn.rechargeApply = rechargeApply;
    mScope.fn.topUp = topUp;
    mScope.fn.isAuth = user.isAuth; //是否绑卡
    mScope.fn.hasEBank = user.hasEBank; //是否开户
  
    self.showPage = showPage;

    self.showPayModal = function() {
      order = OrderService.getOrder();
      mScope.data.accountNo = order.eBank.idNum;
      AccApi.getBankCard({
        isLimit: 1
      }).success(function(res) {
        if (res.succeed) {
          mScope.data.bankCard = res.data;
          mScope.data.bankCard.singleLimit = isCurrency(mScope.data.bankCard.singleLimit);
          mScope.data.bankCard.dayLimit = isCurrency(mScope.data.bankCard.dayLimit);
          mScope.data.bankCard.monthLimit = isCurrency(mScope.data.bankCard.monthLimit);
          initModal('app/components/top-up/topup.detail.modal.html', 'slide-in-up');
          mScope.data.needPay = order.price;
        }
      });

    }

    function isCurrency(currency) {
      return currency == '' ? '无限额' : +currency >= 10000 ? (+currency / 10000) + '万' : +currency
    }

    function infoPrompt(index) {
      var realName = order.eBank.realName;
      var accountNo = order.eBank.accountNo;
      var prompt = [
        { 'title': '手机转账', 'content': '<div class="text-left"><p>目前手机银行转账大部分免费，建议使用手机银行进行转账充值;</p><p>手机银行转账需首先需在网上或银行网点开通绑卡银行的手机银行功能，并下载该银行客户端。</p><p>银行客户端大部分的转账流程为：</p><p>手机银行主菜单里的服务功能中点击“转账汇款”或“转账”按钮---选择银行账号转账（部分银行）---进入转账页面---输入收款人姓名，收款人账号，收款银行及转账金额，获取短信验证码----完成转账充值。</p></div>' },
        { 'title': '支付宝转账', 'content': '<div class="text-left"><p>自2016年10月12日起，支付宝对个人用户超出免费额度的提现收取0.1%的服务费，个人用户每人累计享有2万元基础免费提现额度。</p><p>第一步：收款账号（徽商银行电子交易账号）'+ accountNo +'，进入支付宝页面;</p><p>第二步：点击转账---转账到银行卡--输入姓名、徽商银行电子交易账户账号、选择“徽商银行”、输入转账金额，完成转账操作（付款方式可选择账户余额或银行储蓄卡，余额宝不支持转账到本人银行卡服务）。</p></div>',onOk:function(){
         window.location.href="alipay://"
        } },
        { 'title': '网银转账', 'content': '<p>网银转账只能在电脑端操作</p>' },
        { 'title': '柜面转账', 'content': '<div class="text-left"><p>银行柜台转账需填写信息</p><p>收款人:' + realName + '</p><p>收款账号（徽商银行电子交易账号）:</p><p>' + accountNo + '</p><p>收款开户行：徽商银行股份有限公司合肥花园街支行</p></div>' }
      ]
      utils.alert(prompt[index]);
    }


    function startCountdown() {
      mScope.data.countdown = 60;
      var fn = function() {
        if (mScope.data.countdown) {
          mScope.data.countdown--;
          $timeout(fn, 1000);
        }
      };
      fn();
    }

    function rechargeApply(isShow, animation) {
      TrdApi.rechargeApply({
        amount: order.price
      }).success(function(res) {
        if (!res.succeed) {
          toastr.info(res.errorMessage);
          return;
        }
        mScope.fn.topup = res.data;
        if (!isShow) {
          initModal('app/components/top-up/topup.step3.modal.html', animation);
        }
        startCountdown();
      });
    }

    mScope.$watch('data.smSCode', function(v) {
      if (v != undefined && v != '' && v.length == 6) {
        topUp(v);
      }
    }, true);

    function topUp(t) {
      PayApi.rechargeConfirm({
        orderNo: mScope.fn.topup.orderNo,
        transNo: mScope.fn.topup.transNo,
        smsCode: t,
        bankCardShortNo: mScope.fn.topup.bankCardShortNo,
        token: mScope.fn.topup.token
      }).success(function(res) {
        if (!res.succeed) {
          toastr.info(res.errorMessage);
          return;
        }
        toastr.info(res.errorMessage);
        closeModal();
        localStorageService.set('needPay',0);
        $ionicHistory.goBack();
      });
    }

    function showPage(name, animation) {
      if(!user.isAuth && name =='cgpwd') {
        closeModal();
        return;
      }
      switch (name) {
        case 'cgpwd':
          rechargeApply();
          break;
        case 'other':
          initModal('app/components/top-up/topup.step4.modal.html', animation);
          break;
      }
    }

    function goBack() {
      var curModal = modals.pop(curModal);
      curModal && curModal.remove();
    }

    function initModal(templateUrl, animation) {
      $ionicModal.fromTemplateUrl(templateUrl, {
        scope: mScope,
        animation: animation || 'slide-in-left'
      }).then(function(_modal) {
        modals.push(_modal);
        _modal.show();
        $timeout(function() {
          _modal.modalEl.classList.remove('slide-in-left');
        }, 500)


      });
    }

    function closeModal() {
      var len = modals.length;
      for (var i = len - 1; i >= 0; i--) {
        var _modal = modals[i];
        _modal.remove();
        modals.pop(_modal);
      }
      mScope.data = {
        needPay: 0,
        countdown: 60
      };
      // call on error
      options && options.onCancel && options.onCancel();
    }

  }
})();
