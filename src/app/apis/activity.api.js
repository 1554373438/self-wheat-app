(function() {
  'use strict';

  angular
    .module('nonoApp')
    .service('ActivityApi', ActivityApi);

  /** @ngInject */
  function ActivityApi($http, $log, APISERVER) {
    // 镑客大使-用户最新原始红包
    this.getCashPacket = function() {
      return $http.get(APISERVER.FESERVER+'/activity/nono-envoy/cashPacket');
    };

    // 镑客大使-红包领取记录
    this.receiveRecords = function() {
      return $http.get(APISERVER.FESERVER+'/activity/nono-envoy/receiveRecords');
    };

    // 418投资成功红包信息
    this.invtSuccessInvoke = function(obj) {
      return $http({
        method: 'get',
        url: APISERVER.FESERVER + '/activity/nono-envoy/invtSuccessInvoke',
        params: {
          amount: obj.amount,
          scope: obj.scope
        }
      });
    };

    // 我的任务
    this.getTaskInfo = function() {
      return $http.get(APISERVER.FESERVER + '/activity/nono-mission/tasks');
    };


    $log.debug('ActivityApi end');

  }
})();
