(function() {
  'use strict';

  angular
    .module('nonoApp')
    .service('AccApi', AccApi);

  /** @ngInject */
  function AccApi($http, $log, APISERVER) {

    //查询用户银行卡
    this.getBankCard = function(obj) {
      return $http({
        method: 'get',
        url: APISERVER.FESERVER + '/acc/bankCard',
        params: {
          isLimit: obj.isLimit
        }
      });
    };

    //查询电子账户信息
    this.getEbankInfo = function(obj) {
      return $http({
        method: 'get',
        url: APISERVER.FESERVER + '/acc/eBank',
        params: {
          userInfo: obj && obj.userInfo || 1
        }
      });
    };

    //查询福利券
    this.getCouponList = function(obj) {
      return $http({
        method: 'get',
        url: APISERVER.FESERVER + '/acc/coupon',
        params: {
          productId: obj.id,
          productType: obj.productType,
          couponType: 0
        }
      });
    };

    // 查询个人中心福利券
    this.getPageCoupon = function(obj) {
      return $http({
        method: 'get',
        url: APISERVER.FESERVER + '/acc/pageCoupon',
        params: {
          couponType: obj.couponType || 0,
          userCouponType: obj.userCouponType,
          isChooseOverdue: obj.isChooseOverdue || 0,
          isChooseUsed: obj.isChooseUsed || 0,
          pageInfo: {
            pageSize: obj.pageSize,
            currPageNo: obj.currPageNo
          }
        }
      });
    };

    //查询账户余额
    this.getBalance = function() {
      return $http({
        method: 'get',
        url: APISERVER.FESERVER + '/acc/balance',
        params: {
          isDetail: 1
        }
      });
    };

    // 昨日收益
    this.getLastIncome = function(obj) {
      return $http({
        method: 'get',
        url: APISERVER.FESERVER + '/account/last-income',
        params: {
          showCategory: obj.showCategory
        }
      });
    };
    // 昨日收益详情
    this.getLastIncomeDetail = function(obj) {
      return $http({
        method: 'get',
        url: APISERVER.FESERVER + '/account/last-income/detail',
        params: {
          bizType: obj.bizType
        },
        silence: true
      });
    };

    // 累计收益
    this.getTotalIncome = function() {
      return $http({
        method: 'get',
        url: APISERVER.FESERVER + '/account/earnings/categories'
      });
    };


    // 用户状态
    this.getInvestStatus = function() {
      return $http({
        method: 'get',
        url: APISERVER.FESERVER + '/user/investStatus'
      })
    }

    // 批量获取红点
    this.getRedPoints = function(obj) {
      return $http({
        method: 'get',
        url: APISERVER.FESERVER + '/account/red-point/multi/' + obj.types
      });
    }
    // 获取红点
    this.getRedPoint = function(obj) {
      return $http({
        method: 'get',
        url: APISERVER.FESERVER + '/account/red-point/' + obj.type
      });
    }


    this.clearRedPoints = function(obj) {
      return $http({
        method: 'post',
        url: APISERVER.FESERVER + '/account/red-point/set/'+obj.type,
        data: {
          token: obj.token
        }
      });
    }

    $log.debug('AccApi end');

  }
})();
