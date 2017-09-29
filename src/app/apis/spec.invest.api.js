(function () {
  'use strict';

  angular
    .module('nonoApp')
    .service('SpecInvestApi', SpecInvestApi);

  /** @ngInject */
  function SpecInvestApi($http, $log, APISERVER, user) {
    
    //特色投资地址
    this.getDeliverInfo = function() {
      return $http.post(APISERVER.MSAPI + '/user/getDeliverInfo', {
        sessionId: user.sessionId
      });
    }

     // 特色投资 
    this.getSpecInvestInfo = function(obj) {
      return base('/licai/getCharacterInvest', {
        pager: obj.pageIndex,
        pagesize: obj.itemsPerPage
      }, {
        silence: obj.pageIndex
      });
    };

    this.getSpecInvestDetailInfo = function(obj) {
      return base('/licai/getCharacterInvestDetail', {
        productName: obj.productName
      });
    };
    // 特色投资及协议里用到
    this.getFinancePlan = function(obj) {
      return base('/user/getFinancePlan', {
        fpid: obj.id
      });
    };

    function base(path, data, config) {
      return $http.post(APISERVER.MSAPI + path, data, config);
    }
   
    $log.debug('SpecInvestApi end');

  }
})();
