(function() {
  'use strict';

  angular
    .module('nonoApp')
    .service('MktApi', MktApi);

  /** @ngInject */
  function MktApi($http, $log, APISERVER) {
    // 镑客大使收益
    this.getEnvoyRewardInfo = function(obj) {
      return $http({
        method: 'get',
        url: APISERVER.FESERVER + '/mkt/BankAmbFee',
        params: {
          pi: obj.pageIndex,
          ps: obj.pageSize
        }
      });
    };

    $log.debug('MktApi end');

  }
})();
