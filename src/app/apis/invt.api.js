(function() {
  'use strict';

  angular
    .module('nonoApp')
    .service('InvtApi', InvtApi);

  /** @ngInject */
  function InvtApi($http, $log, APISERVER) {


    //首页接口
    this.getHomeDataAppMobile = function() {
      return $http({
        method: 'get',
        url: APISERVER.FESERVER + '/home-page/nono-app'
      });
    };

    //我的债权
    this.getmyDebtDebtList = function(obj) {
      return $http.get(APISERVER.FESERVER + '/invt/debtList', {
        params: {
          type: 0,
          pi: obj.pageNo,
          ps: obj.itemsPerPage
        }
      });
    };

    this.getmyDebtTransferList = function(obj) {
      return $http.get(APISERVER.FESERVER + '/invt/myDebtTransferRecords', {
        params: {
          to: 0,
          os: 0,
          pi: obj.pageNo,
          ps: obj.itemsPerPage
        }
      });
    };

    this.getmyDebtTransferDetail = function(obj) {
      return $http.get(APISERVER.FESERVER + '/invt/debtSaleTransDetails', {
        params: {
          type: obj.type,
          debtId: obj.id
        }
      });
    };

    this.getsoldOut = function(obj) {
      return $http.get(APISERVER.FESERVER + '/prod/prdOffShelf', {
        params: {
          productId: obj.id,
          productType: obj.productType
        }
      });
    };

    this.getTransferDetail = function(obj) {
      return $http.get(APISERVER.FESERVER + '/invt/transferDetail', {
        params: {
          deaId: obj.id
        }
      });
    };

    this.getSaleDebtBatchList = function(obj) {
      return $http.get(APISERVER.FESERVER + '/invt/transferableDebts', { params: { vaId: obj.id } });
    };

    //单笔上架
    this.upShelfForOneDebtSale = function(obj) {
      return $http.get(APISERVER.FESERVER + '/prod/upShelfForOneDebtSale', {
        params: {
          deaId: obj.deaId,
          title: obj.title,
          tr: obj.tr
        }
      });
    };

    //批量上架
    this.upBatchDebtSale = function(obj) {
      return $http.get(APISERVER.FESERVER + '/prod/upBatchDebtSale', {
        params: {
          deaIds: obj.deaIds,
          vaId: obj.vaId,
          title: obj.title,
          tr: obj.tr
        }
      });
    };
    // 计划类投资记录列表
    this.getPlanecordList = function(obj) {
      return $http({
        method: 'get',
        url: APISERVER.FESERVER + '/invt/vaInvestRecord',
        params: {
          pi: obj.pageIndex,
          ps: obj.pageSize,
          pt: obj.pt
        }
      });
    };
    // 计划类投资记录二级列表
    this.getPlanSecondList = function(obj) {
      return $http({
        method: 'get',
        url: APISERVER.FESERVER + '/invt/vfInvestRecord',
        params: {
          fpId: obj.fpId,
          pt: obj.pt,
          transId: obj.transId,
          type: obj.type
        }
      });
    };

    // 投资记录-诺诺盈-收款明细
    this.getAcceptRecord = function(obj) {
      return $http.get(APISERVER.FESERVER + '/investment/receipts/' + obj.boId+'/'+obj.seriNo);
    };

    //全部转出记录列表
    this.getAllTransferList = function(obj) {
      return $http.get(APISERVER.FESERVER + '/investment/transfer', {
        params: {
          pageNo: obj.pageNo,
          pageSize: obj.pageSize
        }

      })
    };

    //投资记录单笔转让；
    this.getSingleTransferList = function(obj) {
      return $http.get(APISERVER.FESERVER + '/investment/transfer/' + obj.isVip + '/' + obj.boId + '/'+ obj.seriNo+'?', {
        params: {
          pageNo: obj.pageNo,
          pageSize: obj.pageSize
        }
      })
    };

    // 诺诺盈投资记录列表
    this.getNnyRecordList = function(obj) {
      return $http({
        method: 'get',
        url: APISERVER.FESERVER + '/invt/nonoInvestRecord',
        params: {
          pi: obj.pageIndex,
          ps: obj.pageSize,
          version: obj.ver
        }
      });
    };

    // 诺诺盈投资记录二级列表
    this.getNnyTimeList = function(obj) {
      return $http({
        method: 'get',
        url: APISERVER.FESERVER + '/invt/nonoTrdRecord/' + obj.boId
      });
    };

    // 债转类投资记录列表
    // this.getDebtInvest = function(obj) {
    //   return $http({
    //     method: 'get',
    //     url: APISERVER.FESERVER + '/invt/userDebtBuyLog',
    //     params: {
    //       pi: obj.pageIndex,
    //       ps: obj.pageSize,
    //       status: 0
    //     }
    //   });
    // };
    this.getDebtInvest = function(obj) {
      return $http({
        method: 'get',
        url: APISERVER.FESERVER + '/investment/debtRecord',
        params: {
          pi: obj.pageIndex,
          ps: obj.pageSize
        }
      });
    };


    // 投资记录-债权列表
    this.getUserDebtDetails = function(obj) {
      return $http({
        method: 'get',
        url: APISERVER.FESERVER + '/invt/userDebtDetails',
        params: {
          vaId: obj.vaId,
          pi: obj.pageIndex,
          ps: obj.pageSize
        }
      });
    };

    // 投资记录-月月升的阶梯时间和收益
    this.ladderRevenue = function(obj) {
      return $http({
        method: 'get',
        url: APISERVER.FESERVER + '/prod/ladderRevenue',
        params: {
          pId: obj.pId,
          price: obj.price
        }
      });
    };

    // 查询月月升12个月的预期收益率
    this.getRateAll = function(obj) {
      return $http({
        method: 'get',
        url: APISERVER.FESERVER + '/prod/rateAll/'+obj.id
      });
    }

    // 投资记录-投资进度
    this.getInvtProgress = function(obj) {
      return $http({
        method: 'get',
        url: APISERVER.FESERVER + '/investment/progress/' + obj.type + '/' + obj.bId + '/' + obj.seriNo
      });
    }

    // 新手指引
    this.getXinkeForMain = function(obj) {
      return $http({
        method: 'get',
        url: APISERVER.FESERVER + '/activity/nono-anniversary/getXinkeForMain'
      });
    };


    // 产品列表-计划类
    this.getJhList = function(obj) {
      return $http({
        method: 'get',
        url: APISERVER.FESERVER + '/nono/product/list/1',
        params: {
          platformType: 1
        }
      });
    };
    // 产品列表-月月升
    this.getYysList = function(obj) {
      return $http({
        method: 'get',
        url: APISERVER.FESERVER + '/nono/product/list/4'
      });
    };

    // 产品列表-诺诺盈
    this.getNnyList = function(obj) {
      return $http({
        method: 'get',
        url: APISERVER.FESERVER + '/nono/product/list/2',
        params: {
          pageSize: obj.pageSize || 10,
          pageNo: obj.pageNo,
          minExpect: obj.minExpect,
          maxExpect: obj.maxExpect
        }
      });
    };

    // 产品列表-诺诺盈
    this.getDebtList = function(obj) {
      return $http({
        method: 'get',
        url: APISERVER.FESERVER + '/nono/product/list/3',
        params: {
          pageSize: obj.pageSize || 10,
          pageNo: obj.pageNo,
          minExpect: obj.minExpect,
          maxExpect: obj.maxExpect
        }
      });
    };


    // 在投资产明细
    this.getAssetsDetails = function(obj) {
      return $http({
        method: 'get',
        url: APISERVER.FESERVER + '/investment/assets/categories',
        params: {
          showFrozen: obj && obj.showFrozen
        }
      });
    }


    $log.debug('InvtApi end');

  }
})();
