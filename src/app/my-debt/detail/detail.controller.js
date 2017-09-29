(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('DetailController', DetailController);

  /** @ngInject */
  function DetailController($rootScope, localStorageService, toastr, utils, $state, $stateParams, InvtApi, $timeout) {
    var vm = this;
    vm.obj = {
      reason:'',
      discount:'',
      submit:submit,
      isFlag:false,
      discountBlur:discountBlur,
      type:$stateParams.type,
      pick:localStorageService.get('pick'),
      debtPick:localStorageService.get('debtPick'),
      info:{}
    }

    if (vm.obj.type == 0) {
      getTransferDetail();
    } else {
      init();
    }

    function getTransferDetail() {
      InvtApi.getTransferDetail({
        id: $stateParams.id
      }).success(function(res) {
        if (res.succeed) {
          vm.obj.info = res.data;
        }
      })
    }

    function trim(str) {　　
      return str.replace(/(^\s*)|(\s*$)/g, "");　　
    }

    function discountBlur() {
      if (vm.obj.discount == '' || vm.obj.discount == null || vm.obj.discount.leng == 0) {
        vm.obj.isFlag = false;
        toastr.info('折扣范围不可为空');
        return;
      }

      if (!/^\d+$/.test(vm.obj.discount)) {
        vm.obj.isFlag = false;
        toastr.info('请输入90～100的整数');
        return;
      }

      if (+vm.obj.discount < 90 || +vm.obj.discount > 100) {
        vm.obj.isFlag = false;
        utils.alert({
          'title': '提示',
          'cssClass': '',
          'content': '折扣范围90～100',
          'okText': '确定'
        });
        vm.obj.discount = '';
        return;
      }
      vm.obj.isFlag = true;

      /**
       * 受让人历史年化收益率 = 购买人未收利息 + (原始本金 * (1 - 转让折扣 / 100))
       * 转让总价 = 原始本金 * 转让折扣
       * 受让人预期收益 = 购买人预期收益 / 购买金额(出售金额) / 剩余期限（月） * 12 * 100%
       * 转让手续费 = 出售金额 * 0.01
       * @param 受让人历史年化收益率 : anAnnual
       * @param 转让总价 : amount
       * @param 受让人预期收益 : earnings
       * @param 转让手续费 poundage
       * @param 类型 : type 0 单笔 1批量
       */
      if (vm.obj.type == 0) {
        vm.earnings = +vm.obj.info.remainInterest + (+vm.obj.info.remainPrincipal * (1 - +vm.obj.discount / 100));
        vm.amount = +vm.obj.info.remainPrincipal * (+vm.obj.discount / 100);
        vm.anAnnual = +vm.earnings / +vm.amount / +vm.obj.info.remainExpect * 12 * 100;
        vm.poundage = +vm.amount * 0.01;
      } else {
        var sum = 0;
        var arr = [];
        var temp = 0;
        for (var i = 0; i < vm.obj.pick.picKlist.length; i++) {
          sum = sum + (+vm.obj.pick.picKlist[i].unPaidFee + (+vm.obj.pick.picKlist[i].unPaidPrice * (1 - +vm.obj.discount / 100)));
          temp = (+vm.obj.pick.picKlist[i].unPaidFee + (+vm.obj.pick.picKlist[i].unPaidPrice * (1 - +vm.obj.discount / 100)));
          arr.push(temp / (+vm.obj.pick.picKlist[i].unPaidPrice * (+vm.obj.discount / 100)) / +vm.obj.pick.picKlist[i].remainExpect * 12 * 100);
        }
        vm.earnings = sum;
        vm.amount = +vm.obj.pick.pickSum * (+vm.obj.discount / 100);
        vm.min = Math.min.apply(null, arr);
        vm.max = Math.max.apply(null, arr);
        vm.poundage = +vm.amount * 0.01;
      }

    }

    function init() {
      var arr = [];
      for (var i = 0; i < vm.obj.pick.picKlist.length; i++) {
        arr.push(+vm.obj.pick.picKlist[i].unPaidFee / +vm.obj.pick.picKlist[i].unPaidPrice / +vm.obj.pick.picKlist[i].remainExpect * 12 * 100);
      }
      vm.rateMinShow = Math.min.apply(null, arr).toFixed(2);
      vm.rateMaxShow = Math.max.apply(null, arr).toFixed(2);
    }

    function submit() {
      if (trim(vm.obj.reason).length == 0) {
        utils.alert({
          'title': '提示',
          'cssClass': '',
          'content': '债转理由不可为空',
          'okText': '确定'
        });
        return;
      }
      if (trim(vm.obj.reason).length > 10) {
        toastr.info('不可超过10个字');
        vm.obj.reason = '';
        return;
      }
      if (trim(vm.obj.reason).length > 10) {
        toastr.info('不可超过10个字');
        vm.obj.reason = '';
        return;
      }
      if (vm.obj.discount == '' || vm.obj.discount == null || vm.obj.discount.leng == 0) {
        toastr.info('折扣范围不可为空');
        return;
      }

      if (!/^\d+$/.test(vm.obj.discount)) {
        toastr.info('请输入90～100的整数');
        return;
      }

      if (+vm.obj.discount < 90 || +vm.obj.discount > 100) {
        utils.alert({
          'title': '提示',
          'cssClass': '',
          'content': '折扣范围90～100',
          'okText': '确定'
        });
        vm.obj.discount = '';
        return;
      }
      $timeout(function() {
        utils.alert({
          'title': '请确认转让金额',
          'cssClass': 'mydebt-prompt',
          'content': '<p class="space-between"><span>转让总价格</span><span class="brown">' + (vm.amount).toFixed(2) + '元</span></p><p class="space-between"><span>转让手续费</span><span class="brown">' + (vm.poundage).toFixed(2) + '元</span></p>',
          'okText': '确定',
          onOk: function() {
            if (+vm.obj.type == 0) {
              InvtApi.upShelfForOneDebtSale({
                deaId: $stateParams.id,
                title: vm.obj.reason,
                tr: vm.obj.discount
              }).success(function(res) {
                if (res.succeed) {
                  toastr.info(res.errorMessage);
                  $state.go('myDebt:list');
                } else {
                  toastr.info(res.errorMessage);
                }
              });
            } else {
              InvtApi.upBatchDebtSale({
                deaIds: vm.obj.pick.deaIds,
                vaId: vm.obj.debtPick.vaid,
                title: vm.obj.reason,
                tr: vm.obj.discount
              }).success(function(res) {
                if (res.succeed) {
                  toastr.info(res.errorMessage);
                  $state.go('myDebt:list');
                } else {
                  toastr.info(res.errorMessage);
                }
              })
            }
          }
        });
      }, 1);

    }

  }
})();
