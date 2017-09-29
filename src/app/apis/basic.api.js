(function() {
  'use strict';

  angular
    .module('nonoApp')
    .service('BasicApi', BasicApi);

  /** @ngInject */
  function BasicApi($http, $log, APISERVER, user) {

    // 首页接口
    this.getHomeData = function() {
      return $http({
        method: 'POST',
        url: APISERVER.MSAPI + '/dataBase/getHomePage',
        headers: { 'version': "5.4.0" },
        data: {
          version: '5.4.0',
          terminal: 4,
          sessionId: user.sessionId
        }
      });
    };

    this.getAppCoupon = function() {
      return base('/user/getAppCoupon', {
        sessionId: user.sessionId
      });
    };

    // 镑客大使首页累计收益
    this.getEnvoyInfo = function() {
      return base('/licai/prolocutorSettlement', {
        sessionId: user.sessionId
      });
    };

    // 活动页列表
    this.getActivity = function() {
      return base('/banners/loadBanners', {
        position: 'nonoappactivity_new'
      });
    };

    //投资-产品列表
    // this.getProductIndexList = function(obj) {
    //   return base('/licai/getProductIndexList', {
    //     sessionId: user.sessionId,
    //     productType: obj.productType,
    //     pageSize: obj.pageSize,
    //     pageNo: obj.pageNo,
    //     min_expect: obj.min_expect,
    //     max_expect: obj.max_expect,
    //     type: obj.type
    //   }, {
    //     silence: obj.pageNo
    //   });
    // }

    //计划类-产品详情-产品信息
    this.getFinanceProductInfo = function(obj) {
      return base('/licai/getFinanceProductInfo', {
        sessionId: user.sessionId,
        fid: obj.fid,
        scope: obj.scope
      });
    };

    //计划类-产品详情-产品详情
    this.getFinanceProductDetails = function(obj) {
      return base('/licai/getFinanceProductDetails', {
        sessionId: user.sessionId,
        pro_id: obj.proId,
        scope: obj.scope
      });
    };

    // 计划类-产品详情-借款信息
    this.getPlanBorrows = function(obj) {
      return base('/licai/getPlanBorrows', {
        fp_id: obj.id,
        scope: obj.scope,
        page_num: obj.pageIndex,
        page_size: obj.itemsPerPage
      }, {
        silence: obj.pageIndex
      });
    };

    // 借款人信息
    this.getBorrowerInfo = function(obj) {
      return base('/licai/getBorrowerInfo', {
        bo_id: obj.bo_id,
        user_id: obj.user_id
      });
    };

    //计划类－产品详情－投资记录
    this.getPlanInvestRecords = function(obj) {
      return base('/licai/planInvestRecords', {
        fid: obj.id,
        pageNo: obj.pageIndex,
        pageSize: obj.itemsPerPage
      }, {
        silence: obj.pageIndex
      });
    };

    //三重保障接口
    this.multipleProtectPlan = function() {
      return base('/app/multipleProtectPlan', {

      });
    };
    // 是否可以购买产品
    this.canBuyFinancePlan = function(obj) {
      return base('/licai/canBuyFinancePLan', {
        sessionId: user.sessionId,
        fpId: obj.id
      });
    };

    //诺诺盈-产品详情
    this.getProductDetail = function(obj) {
      return base('/directInvestment/getProductDetail', {
        sessionId: user.sessionId,
        id: obj.proId
      });
    };

    this.getDirectProductInfo = function(obj) {
      return base('/directInvestment/directProductInfo', {
        bid: obj.bid
      });
    };

    this.getBorrower = function(obj) {
      return base('/directInvestment/getBorrower', {
        id: obj.id
      });
    };

    //债转-产品详情
    this.getDebtDetail = function(obj) {
      return base('/debt/getDebtDetail', {
        id: obj.id
      });
    };

    this.getDebtBorrowDetail = function(obj) {
      return base('/debt/getDebtBorrowDetail', {
        id: obj.id
      });
    };

    this.getDebtBuyLogs = function(obj) {
      return base('/debt/getDebtBuyLogs', {
        id: obj.id,
        pageSize: obj.itemsPerPage,
        pageNo: obj.pageNo,
        type: obj.type
      }, {
        silence: obj.itemsPerPage
      });
    };

    this.getDebtRepayLogs = function(obj) {
      return base('/debt/getDebtRepayLogs', {
        id: obj.id,
        pageSize: obj.itemsPerPage,
        pageNo: obj.pageNo
      }, {
        silence: obj.itemsPerPage
      });
    };

    // 债转-产品详情-债转详情
    this.getBidRecord = function(obj) {
      return base('/directInvestment/getBidRecord', {
        id: obj.id,
        pageNo: obj.pageIndex,
        pageSize: obj.itemsPerPage
      }, {
        silence: obj.pageIndex
      });
    };

    // 回款计划
    this.getRepayPlanForMonth = function(obj) {
      return base('/repayment/repaymentPlanForMonth', {
        start_month: obj.data,
        sessionId: user.sessionId
      });
    };

    this.getRepayListInfo = function(obj) {
      return base('/repayment/repaymentPlanDetails', {
        pageNum: obj.pageIndex,
        pageSize: obj.pageSize,
        sessionId: user.sessionId
      });
    };

    // bbs同步登陆
    this.goBBSLogin = function() {
      return base('/user/getUserBBSLoginAddress', {
        sessionId: user.sessionId
      });
    };

    // 发现页-红点接口
    this.getDiscoveryInfo = function() {
      return base('/app/discoveryPrompt', {
        sessionId: user.sessionId
      });
    }

    this.clearDiscoveryFlag = function(obj) {
      return base('/app/readDiscovery', {
        sessionId: user.sessionId,
        position: obj.position,
        discovery_token: obj.discovery_token
      });
    }



    // 投资记录-债转类
    this.getDebtInvest = function(obj) {
      return $http.post(APISERVER.MSAPI + '/debt/getDebtInvest', {
        sessionId: user.sessionId,
        pageNo: obj.pageIndex,
        pageSize: obj.pageSize
      }, {
        silence: obj.pageIndex
      });
    };






    // 投资记录-月月升-退出
    this.quitPlan = function(obj) {
      return base('/stagePlan/quitPlan', {
        vaId: obj.id,
        sessionId: user.sessionId
      });
    };



    // 以下删除待定
    // 投资记录-诺诺盈协议
    this.getNxyProtol = function(obj) {
      return base('/directInvestment/directInvtAgreement', {
        sessionId: user.sessionId,
        boId: obj.id
      });
    };
    // 债转协议 待删
    this.getDebtProtol = function(obj) {
      return base('/debt/debtTransferAgreement', {
        dblId: obj.id,
        sessionId: user.sessionId
      });
    };
    // 计划类协议
    this.getFinancePlan = function(obj) {
      return base('/user/getFinancePlan', {
        fpid: obj.id
      });
    };

    // 商城详情页待定-删除
    this.getMallProductDetail = function(obj) {
      return base('/activityvip/getBangDetailText', {
        cb_id: obj.id
      });
    };

    function base(path, data, config) {
      return $http.post(APISERVER.MSAPI + path, data, config);
    }

    $log.debug('UserApi end');

  }
})();
