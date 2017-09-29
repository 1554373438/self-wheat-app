(function () {
  'use strict';

  angular
    .module('nonoApp')
    .service('WelfareApi', WelfareApi);

  /** @ngInject */
  function WelfareApi($http, $log, APISERVER, user) {
    // 现金券、加息券
    this.getWelfares =  function(obj) {
      return base('/licai/getWelFares', {
        type: obj.type, // coupon, itereset
        sessionId: user.sessionId,
        pageNumber: obj.pageIndex,
        pageSize: obj.itemsPerPage
      }, {
        silence: obj.pageIndex
      });
    };
   
    // 特权本金
    this.getExperienceCashList = function(obj) {
      return $http({
        method: 'get',
        url: APISERVER.FESERVER + '/activity/nono-envoy/experienceCash',
        params: {
          pageNo: obj.pageNo,
          pageSize: obj.pageSize
        }
      });
    };

    // 现金红包
    this.getRedPackets = function() {
      return base('/redPackets/getRedPacketLog40', {
        sessionId: user.sessionId,
        terminal: 4
      });
    };


    // 诺币记录
    this.coinLog = function(obj) {
      return base('/activityvip/getCoinLogList', {
        sessionId: user.sessionId,
        pageNo: obj.pageIndex,
        pageSize: obj.itemsPerPage
      }, {
        silence: obj.pageIndex
      });
    };

    function base(path, data, config) {
      return $http.post(APISERVER.MSAPI + path, data, config);
    }
   
    $log.debug('WelfareApi end');

  }
})();
