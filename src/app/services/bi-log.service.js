(function() {
  'use strict';

  angular
    .module('nonoApp')
    .service('BILog', BILog);

  /** @ngInject */
  function BILog(BridgeService, $log) {
    var enterTime, lastEnterTime;

    this.enter = function() {
      // `$stateChangeSucess` would be called before `$ionicView.beforeLeave`
      lastEnterTime = enterTime || Date.now();
      enterTime = Date.now();
    };

    // page_name, page_info
    this.leave = function(obj) {
      var base = getBasicInfo();

      log(base, obj);
    };

    // page_name, page_module, title, page_info
    this.click = function(obj) {
      var base = getBasicInfo(true);

      log(base, obj);
    };

    function log(base, info) {
      angular.merge(base, info);
      $log.debug('BILog', base);

      BridgeService.send({
        type: 'BILog',
        data: base
      });
    }

    function getBasicInfo(isClick) {
      var now = Date.now();

      var obj = {
        // 'log_id': '',
        'log_time': now,
        'start_time': isClick ? now : lastEnterTime,
        'end_time': now,
        'action_type': isClick ? 'click_event' : 'view_event'
      };

      return obj;
    }
  }
})();
