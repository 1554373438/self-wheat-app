(function() {
  'use strict';

  angular
    .module('nonoApp')
    .service('TrdApi', TrdApi);

  /** @ngInject */
  function TrdApi($http, $log, APISERVER) {

    //充值申请（发送短信验证码）
    this.rechargeApply = function(obj) {
      return base('/trd/rechargeApply', {
        amount: obj.amount
      });
    };



    // 提现信息查询
    this.getWithdrawInfo = function() {
      return $http.get(APISERVER.FESERVER + '/trd/withdraw', {
        systemId: 0
      });
    };

    //申请提现提交接口
    this.withdrawApply = function(obj) {
      return base('/trd/withdrawApply', {
        amount: obj.amount,
        lineNo: obj.lineNo,
        isNonFee: obj.isNonFee,
        surl: obj.surl,
        purl: obj.purl,
        needRedis: obj.needRedis || false,
        systemId: 0

      });
    };

    // 审核后的提现申请
    // this.withdrawCheckSubmit = function(obj) {
    //   return base('/trd/withdrawIsztambul', {
    //     transNo: obj.transNo,
    //     transRecordNo: obj.transRecordNo
    //   });
    // };

    // 冻结后的继续交易接口
    this.freezeTrdSubmit = function (obj) {
      return base('/trd/unfreeze', {
        type:obj.type,
        transNo: obj.transNo,
        transRecordNo: obj.transRecordNo,
        needRedis: true
      });
    };




    //生成购买交易单并支付
    this.purchase = function(obj) {
      return $http({
        method: 'POST',
        url: APISERVER.FESERVER + '/trd/createTransOrderAndPurchasePayment',
        data: {
          transAmount: +obj.transAmount,
          productType: obj.productType,
          productId: +obj.productId,
          productName: obj.productName,
          productYield: obj.productYield,
          couponList: obj.couponList,
          surl: obj.surl,
          furl: obj.furl,
          purl: obj.purl,
          needRedis: obj.needRedis || false,
          systemId: 0
      },
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      transformRequest: function(data) {
          return angular.toJson(data);
        }
      })
    };

    function base(path, data, config) {
      delete $http.defaults.headers.common['X-Requested-With'];
      return $http.post(APISERVER.FESERVER + path, data, config);
    }

    $log.debug('TrdApi end');

  }
})();
